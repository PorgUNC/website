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
    }
  ]
}
