import type { GlobalConfig } from 'payload'

export const FeaturedPoll: GlobalConfig = {
  slug: 'featured-poll',
  label: {
    singular: 'Featured Poll',
    plural: 'Featured Polls',
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls',
      required: false,
      admin: {
        description: 'Select the poll to feature.',
      },
      filterOptions: { _status: { equals: 'published' } },
    },
  ],
}
