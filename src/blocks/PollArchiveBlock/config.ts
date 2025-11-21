import {Block} from 'payload'

export const PollArchiveBlock: Block = {
  slug: 'pollarchive',
  labels: {
    singular: 'Poll Archive',
    plural: 'Poll Archives'
  },
  fields: [
    {
      type: 'number',
      name: 'number',
      label: 'Number of Polls to show',
      defaultValue: 1,
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
