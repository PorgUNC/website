import { randomUUID } from 'node:crypto'
import { PayloadRequest } from 'payload'
import { OAuth2Plugin } from 'payload-oauth2'

// This is necessary because I'm not sure what exactly Zitadel accepts as picture mimes
const avatarFileExtensions: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const getMetadataString = (metadata: unknown, key: string): string | undefined => {
  let value: unknown
  if (Array.isArray(metadata)) {
    const entry = metadata.find(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'key' in item &&
        item.key === key &&
        'value' in item,
    )
    value = entry && typeof entry === 'object' ? entry.value : undefined
  } else if (typeof metadata === 'object' && metadata !== null && key in metadata) {
    value = (metadata as Record<string, unknown>)[key]
  }

  if (typeof value !== 'string' || value.length === 0) {
    return undefined
  }

  if (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    try {
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(value, 'base64'))
      if (decoded && Buffer.from(decoded, 'utf8').toString('base64') === value) {
        return decoded
      }
    } catch {
      // Metadata values that are not valid UTF-8 are treated as plain strings.
    }
  }

  return value
}

export const authConfig = OAuth2Plugin({
  enabled:
    typeof process.env.ZITADEL_CLIENT_ID === 'string' &&
    typeof process.env.ZITADEL_CLIENT_SECRET === 'string' &&
    typeof process.env.ZITADEL_TOKEN_ENDPOINT === 'string' &&
    typeof process.env.ZITADEL_AUTHORIZATION_URL === 'string' &&
    typeof process.env.ZITADEL_USERINFO_ENDPOINT === 'string',
  strategyName: 'zitadel',
  useEmailAsIdentity: false,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  clientId: process.env.ZITADEL_CLIENT_ID || '',
  clientSecret: process.env.ZITADEL_CLIENT_SECRET || '',
  authorizePath: '/oauth/zitadel',
  callbackPath: '/oauth/zitadel/callback',
  authCollection: 'users',
  subFieldName: 'sub',
  tokenEndpoint: process.env.ZITADEL_TOKEN_ENDPOINT || '',
  scopes: [
    'openid',
    'profile',
    'email',
    'offline_access',
    'urn:zitadel:iam:user:metadata',
    'urn:zitadel:iam:org:project:roles',
    'picture',
  ],
  providerAuthorizationUrl: process.env.ZITADEL_AUTHORIZATION_URL || '',
  getUserInfo: async (accessToken: string, req: PayloadRequest) => {
    const response = await fetch(process.env.ZITADEL_USERINFO_ENDPOINT || '', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Zitadel user-info request failed with status ${response.status}`)
    }

    const claims: unknown = await response.json()
    if (typeof claims !== 'object' || claims === null) {
      throw new Error('Zitadel user-info response was not a JSON object')
    }

    const user = claims as Record<string, unknown>
    const sub = typeof user.sub === 'string' ? user.sub : ''
    const roleClaim = user['urn:zitadel:iam:org:project:roles']
    const roleNames = Array.isArray(roleClaim)
      ? roleClaim.filter((role): role is string => typeof role === 'string')
      : typeof roleClaim === 'object' && roleClaim !== null
        ? Object.keys(roleClaim)
        : []
    const mappedRoles = new Set<'admin' | 'research' | 'executive'>()
    for (const role of roleNames) {
      switch (role.toLowerCase()) {
        case 'admin':
          mappedRoles.add('admin')
          break
        case 'research':
          mappedRoles.add('research')
          break
        case 'executive':
          mappedRoles.add('executive')
          break
      }
    }

    const name =
      (typeof user.name === 'string' && user.name) ||
      [user.given_name, user.family_name]
        .filter((part): part is string => typeof part === 'string' && part.length > 0)
        .join(' ') ||
      (typeof user.preferred_username === 'string' && user.preferred_username) ||
      sub

    if (!sub) {
      throw new Error('Zitadel user-info response is missing the sub claim')
    }

    const metadata = user['urn:zitadel:iam:user:metadata']
    const jobTitle = getMetadataString(metadata, 'title')
    const avatarUrl =
      typeof user.picture === 'string' && user.picture.length > 0 ? user.picture : undefined
    let avatarID: number | undefined

    if (avatarUrl) {
      const existingUser = await req.payload.find({
        collection: 'users',
        where: { sub: { equals: sub } },
        limit: 1,
        depth: 0,
        req,
      })
      const existingAvatarUrl = existingUser.docs[0]?.avatar_url

      if (avatarUrl !== existingAvatarUrl) {
        let parsedUrl: URL
        try {
          parsedUrl = new URL(avatarUrl)
        } catch {
          throw new Error('Zitadel profile picture URL is invalid')
        }

        const response = await fetch(parsedUrl, {
          redirect: 'error',
          signal: AbortSignal.timeout(10_000),
        })
        if (!response.ok) {
          throw new Error(`Profile picture download failed with status ${response.status}`)
        }

        const mimeType = response.headers
          .get('content-type')
          ?.split(';', 1)[0]
          .trim()
          .toLowerCase()
        const extension = mimeType ? avatarFileExtensions[mimeType] : undefined
        if (!mimeType || !extension) {
          throw new Error(`Unsupported profile picture type: ${mimeType || 'unknown'}`)
        }

        if (!response.body) {
          throw new Error('Profile picture response did not contain a body')
        }

        const reader = response.body.getReader()
        const chunks: Uint8Array[] = []
        let size = 0
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          size += value.byteLength
          chunks.push(value)
        }

        const data = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), size)
        const avatar = await req.payload.create({
          collection: 'avatars',
          data: { alt: `${name} avatar` },
          file: {
            data,
            mimetype: mimeType,
            name: `avatar-${randomUUID()}.${extension}`,
            size,
          },
          overrideAccess: true,
          req,
        })
        avatarID = avatar.id

        const oldAvatar = existingUser.docs[0]?.avatar
        req.context.zitadelOldAvatarID =
          typeof oldAvatar === 'object' && oldAvatar !== null
            ? oldAvatar.id
            : typeof oldAvatar === 'number'
              ? oldAvatar
              : undefined
      }
    }

    const roles = [...mappedRoles]
    req.context.zitadelOAuthRoles = roles

    return {
      sub,
      name,
      roles,
      ...(typeof user.email === 'string' && user.email.length > 0 ? { email: user.email } : {}),
      ...(avatarID !== undefined ? { avatar: avatarID, avatar_url: avatarUrl } : {}),
      ...(jobTitle ? { jobTitle } : {}),
    }
  },
  successRedirect: async (req: PayloadRequest, token?: string) => {
    // const oldAvatarID = req.context.zitadelOldAvatarID
    // if (typeof oldAvatarID === 'number') {
    //   await req.payload.delete({ collection: 'avatars', id: oldAvatarID, overrideAccess: true, req })
    // }
    return '/admin'
  },
  failureRedirect: (req, err) => {
    req.payload.logger.error(err)
    return '/admin/login'
  },
})
