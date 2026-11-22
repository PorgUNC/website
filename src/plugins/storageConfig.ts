import { s3Storage } from '@payloadcms/storage-s3'

export const storageConfig = s3Storage({
  alwaysInsertFields: true,
  enabled:
    (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_PREVIEW !== 'true') ||
    process.env.FORCEPLUGINS === 'true',
  // enabled: true,
  collections: {
    media: true,
    files: true,
    avatars: true,
  },
  bucket: process.env.S3_BUCKET || '',
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    region: 'auto',
    endpoint: process.env.S3_ENDPOINT || '',
  },
})
