// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { FeaturedPoll } from './globals/FeaturedPoll'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Files } from '@/collections/Files'
import { Polls } from '@/collections/Polls'
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
// import nodemailer from 'nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'

import { Invitations } from './collections/Invitations'
import { Avatars } from './collections/Avatars'
import { SiteHeader } from './globals/SiteHeader/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  ...(process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_PREVIEW !== 'true' && {
    email: resendAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS ?? '',
        defaultFromName: process.env.SMTP_FROM_NAME ?? '',
          apiKey: process.env.RESEND_API_KEY || '',
    }),
  }),
  admin: {
    timezones: {
      supportedTimezones: [
        { label: 'New York', value: 'America/New_York' },
      ],
      defaultTimezone: 'America/New_York',
    },
    components: {
      graphics: {
        Logo: '/components/Logo/Logo.tsx#LogoTagline',
        Icon: '/components/Logo/Logo.tsx#Logo',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [Pages, Polls, Posts, Media, Files, Categories, Users, Invitations, Avatars],
  cors: [getServerSideURL()].filter(Boolean),
                           globals: [Footer, FeaturedPoll, SiteHeader],
                           plugins: [
                             ...plugins,
                             // storage-adapter-placeholder
                           ],
                           secret: process.env.PAYLOAD_SECRET,
                           sharp,
                           typescript: {
                             outputFile: path.resolve(dirname, 'payload-types.ts'),
                           },
                           jobs: {
                             access: {
                               run: ({ req }: { req: PayloadRequest }): boolean => {
                                 // Allow logged in users to execute this endpoint (default)
                                 if (req.user) return true

                                   // If there is no logged in user, then check
                                   // for the Vercel Cron secret to be present as an
                                   // Authorization header:
                                   const authHeader = req.headers.get('authorization')
                                   return authHeader === `Bearer ${process.env.CRON_SECRET}`
                               },
                             },
                             tasks: [],
                           },
})
