import { Block } from 'payload'

export const FeaturedChartBlock: Block = {
  slug: 'featuredchart',
  dbName: 'homeftChrt',
  labels: {
    singular: 'Featured Chart',
    plural: 'Featured Charts',
  },
  fields: [
    {
      name: 'chart',
      type: 'relationship',
      relationTo: 'graphs',
      required: true,
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      admin: {
        description: 'Enable to let this block span the full page width.',
        hidden: true,
      },
      defaultValue: true,
    },
  ],
}
