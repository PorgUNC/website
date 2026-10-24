import type { CollectionConfig } from 'payload'
import { revalidatePoll } from '@/collections/Graphs/hooks/revalidatePoll'
import admin from '@/collections/Users/access/admin'


export const Graphs: CollectionConfig = {
  dbName: 'graphsCol',
  slug: 'graphs',
  admin: { group: 'Stats', useAsTitle: 'name' },
  access: {
    create: admin,
    delete: admin,
    read: () => true,
    update: admin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'chart',
      label: false,
      type: 'group',
      fields: [
        {
          name: 'series',
          type: 'array',
          labels: {
            singular: 'Series',
            plural: 'Series',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'points',
              type: 'array',
              admin: {
                description: 'Percentages should be entered as whole numbers (e.g. 50 for 50%)',
              },
              labels: {
                singular: 'Point',
                plural: 'Points',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'year',
                      type: 'number',
                      admin: {
                        width: '33.33%',
                      },
                      required: true,
                    },
                    {
                      name: 'month',
                      type: 'number',
                      admin: {
                        width: '33.33%',
                      },
                      required: true,
                    },
                    {
                      name: 'day',
                      type: 'number',
                      admin: {
                        width: '33.33%',
                      },
                      required: true,
                    },
                  ],
                },
                {
                  name: 'y',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'error',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'report',
                  type: 'relationship',
                  relationTo: 'polls',
                  required: false,
                },
              ],
            },
            {
              name: 'color',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'windows',
      type: 'array',
      labels: {
        singular: 'Polling Window',
        plural: 'Polling Windows',
      },
      fields: [
        {
          type: 'group',
          name: 'start-date',
          label: 'Start Date',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                  },
                  required: true,
                },
                {
                  name: 'month',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                  },
                  required: true,
                },
                {
                  name: 'day',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                  },
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'end-date',
          type: 'group',
          label: 'End Date',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                  },
                  required: true,
                },
                {
                  name: 'month',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                  },
                  required: true,
                },
                {
                  name: 'day',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                  },
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'events',
      type: 'array',
      labels: {
        singular: 'Event',
        plural: 'Events',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'year',
              type: 'number',
              admin: {
                width: '33.33%',
              },
              required: true,
            },
            {
              name: 'month',
              type: 'number',
              admin: {
                width: '33.33%',
              },
              required: true,
            },
            {
              name: 'day',
              type: 'number',
              admin: {
                width: '33.33%',
              },
              required: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePoll],
  },
}
