import {Block} from 'payload'

export const PollArchiveBlock: Block = {
  slug: 'pollarchive',
  interfaceName: 'PollArchiveBlock',
  labels: {
    singular: 'Poll Archive',
    plural: 'Poll Archives'
  },
  fields: [
    {
      name: 'selectedPolls',
      type: 'relationship',
      relationTo: 'polls',
      hasMany: true,
      required: true,
      label: 'Select Polls',
      admin: {
        description: 'Choose which polls to display. All pie charts from selected polls will be shown (except those marked as hidden).',
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
