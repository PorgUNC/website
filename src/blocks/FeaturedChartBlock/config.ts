import {Block} from 'payload'
import { updateFeaturedChartGlobal } from '@/blocks/FeaturedChartBlock/hooks/updateFeaturedChartGlobal'

export const FeaturedChartBlock: Block = {
  slug: 'featuredchart',
  labels: {
    singular: 'Featured Chart',
    plural: 'Featured Charts'
  },
  fields: [
    {
      type: 'relationship',
      name: 'featuredpoll',
      label: "Featured Polls",
      relationTo: 'polls',
      required: false,
      filterOptions: { _status: { equals: 'published' } },
      hooks: {
        afterChange: [updateFeaturedChartGlobal],
      },
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      label: 'Full Width (ignore layout constraints)',
      admin: {
        description: 'Enable to let this block span the full page width.',
        hidden: true,
      },
      defaultValue: true,
    },
  ]
}
