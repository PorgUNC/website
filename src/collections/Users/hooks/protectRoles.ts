import type { FieldHook } from 'payload'
import type { User } from '@/payload-types'

export const protectRoles: FieldHook<{ id: string } & User> = ({ req, data }) => {
  const zitadelRoles = req.context.zitadelOAuthRoles
  if (Array.isArray(zitadelRoles)) {
    const roles = zitadelRoles.filter(
      (role): role is 'admin' | 'research' | 'executive' => role === 'admin' || role === 'research' || role === 'executive',
    )
    return [...new Set(roles)]
  }

  const isAdmin = req.user?.roles?.includes('admin')

  if (!isAdmin && req.user?.id !== 1) {
    return []
  }

  return [...new Set(data?.roles || [])]
}
