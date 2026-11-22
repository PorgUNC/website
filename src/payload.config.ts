import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { FeaturedPoll } from './globals/FeaturedPoll'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Files } from '@/collections/Files'
import { Polls } from '@/collections/Polls'
import { resendAdapter } from '@payloadcms/email-resend'

import { Avatars } from './collections/Avatars'
import { SiteHeader } from './globals/SiteHeader/config'
import { Graphs } from '@/collections/Graphs'
import { PollTimes } from '@/collections/PollTimes'
import { MetaImage } from '@/globals/MetaImage'
import { authConfig } from '@/plugins/authConfig'
import { formsConfig } from '@/plugins/formsConfig'
import { nestedDocsConfig } from '@/plugins/nestedDocsConfig'
import { redirectsConfig } from '@/plugins/redirectsConfig'
import { searchConfig } from '@/plugins/searchConfig'
import { seoConfig } from '@/plugins/seoConfig'
import { storageConfig } from '@/plugins/storageConfig'

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
    dashboard: {
      widgets: [
        {
          slug: 'main-dash',
          Component: '@/components/DashboardWidget',
          minWidth: 'full',
          maxWidth: 'full',
        },
        {
          slug: 'poll-signup-grid',
          Component: '@/components/PollSignupDashboardWidget',
          minWidth: 'full',
          maxWidth: 'full',
        },
      ],
      defaultLayout: () => {
        return [
          { widgetSlug: 'main-dash', width: 'full' },
          { widgetSlug: 'poll-signup-grid', width: 'full' },
        ]
      },
    },
    timezones: {
      supportedTimezones: [{ label: 'New York', value: 'America/New_York' }],
      defaultTimezone: 'America/New_York',
    },
    components: {
      beforeNavLinks: [
        '@/components/AdminDashButton#BackToDash',
        '@/components/AdminDashButton#BackToHome',
      ],
      beforeLogin: ['@/components/LoginButton'],
      graphics: {
        Logo: '/components/Logo/AdminLogo.tsx#Logo',
        Icon: '/components/Logo/Logo.tsx#Logo',
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // beforeDashboard: ['@/components/DashboardWidget'],
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
  collections: [
    Pages,
    Polls,
    Posts,
    Media,
    Files,
    Categories,
    Users,
    Avatars,
    Graphs,
    PollTimes,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Footer, FeaturedPoll, SiteHeader, MetaImage],
  plugins: [
    storageConfig,
    searchConfig,
    formsConfig,
    seoConfig,
    nestedDocsConfig,
    redirectsConfig,
    authConfig,
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
