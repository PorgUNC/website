import type { CollectionConfig } from 'payload'
import crypto from 'crypto'
import { fieldAdmin } from '@/collections/Users/access/admin'
import admin from '@/collections/Users/access/admin'
import { getClientSideURL } from '@/utilities/getURL'

export const PollTimes: CollectionConfig = {
  slug: 'polltimes',
  admin: {
    group: 'Users',
    preview: (doc, { req }) => {
      return `${getClientSideURL()}/pollsignups?uuid=${doc.uuid}`
    },
    // components: {
    //   edit: {
    //     PreviewButton: {
    //         path: '@/components/PollPreviewButton',
    //         exportName: 'PollPreviewButton',
    //     }
    //   }
    // }
  },
  labels: {
    singular: 'Poll Time',
    plural: 'Poll Times',
  },
  access: {
    create: admin,
    delete: admin,
    read: () => true,
    update: admin,
  },
  auth: false,
  fields: [
    {
      name: 'uuid',
      type: 'text',
      admin: {
        readOnly: true,
      },
      access: {
        read: fieldAdmin,
        update: () => false,
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'additionalInfo',
      type: 'text',
    },
    {
      name: 'execTimes',
      type: 'array',
      dbName: 'execTimes',
      fields: [
        {
          name: 'people',
          type: 'group',
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
            {
              name: 'times',
              type: 'array',
              fields: [
                {
                  name: 'timeanddate',
                  type: 'date',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                      timeIntervals: 15,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'regularTimes',
      dbName: 'regularTimes',
      type: 'array',
      fields: [
        {
          name: 'people',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                description: 'Set automatically for signed-in participants.',
                readOnly: true,
              },
            },
            {
              name: 'times',
              type: 'array',
              fields: [
                {
                  name: 'timeanddate',
                  type: 'date',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                      timeIntervals: 15,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.uuid) {
          data.uuid = crypto.randomUUID()
        }
      },
    ],
  },
}
