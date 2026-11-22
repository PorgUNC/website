import { searchPlugin } from '@payloadcms/plugin-search'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { searchFields } from '@/search/fieldOverrides'

export const searchConfig = searchPlugin({
  collections: ['polls', 'posts'],

  beforeSync: beforeSyncWithSearch,
  searchOverrides: {
    admin: {
      group: 'Meta',
    },
    fields: ({ defaultFields }) => {
      return [...defaultFields, ...searchFields]
    },
  },
})
