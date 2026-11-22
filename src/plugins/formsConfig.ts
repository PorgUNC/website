import { fields, formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { Programs } from '@/blocks/Form/Programs/config'
import { Year } from '@/blocks/Form/Year/config'
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import user from '@/collections/Users/access/user'
import nobody from '@/collections/Users/access/nobody'
import executive from '@/collections/Users/access/executive'
import { generateTotpSecret } from '@/lib/totp'

export const formsConfig = formBuilderPlugin({
  fields: {
    radio: {
      ...fields.radio,
      fields: [
        ...(fields.radio && 'fields' in fields.radio
          ? fields.radio.fields.map((field) => {
              if ('name' in field && field.name === 'radio') {
                return {
                  ...field,
                }
              }
              return field
            })
          : []),
        {
          name: 'otherOption',
          type: 'checkbox',
          label: 'Allow a custom response',
          defaultValue: false,
        },
        {
          name: 'randomChoiceOrder',
          type: 'checkbox',
          label: 'Randomize Choice Order',
          defaultValue: false,
        },
      ],
    },
    payment: false,
    email: false,
    programs: Programs,
    year: Year,
    message: {
      ...fields.message,
      fields: [
        ...(fields.message && 'fields' in fields.message
          ? fields.message.fields.map((field) => {
              if ('name' in field && field.name === 'message') {
                return {
                  ...field,
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                        BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                      ]
                    },
                  }),
                }
              }
              return field
            })
          : []),
      ],
    },
    select: {
      ...fields.select,
      fields: [
        ...(fields.select && 'fields' in fields.select
          ? fields.select.fields.map((field) => {
              if ('name' in field && field.name === 'select') {
                return {
                  ...field,
                }
              }
              return field
            })
          : []),
        {
          name: 'allowMultiple',
          type: 'checkbox',
          label: 'Allow Multiple Selections',
          defaultValue: false,
        },
        {
          name: 'allowSearching',
          type: 'checkbox',
          label: 'Allow Searching Options',
          defaultValue: false,
        },
        {
          name: 'randomChoiceOrder',
          type: 'checkbox',
          label: 'Randomize Choice Order',
          defaultValue: false,
        },
      ],
    },
  },
  formSubmissionOverrides: {
    access: {
      read: user,
      update: nobody,
      create: nobody,
      delete: executive,
    },
    admin: {
      group: 'Forms',
    },
  },
  formOverrides: {
    access: {
      read: user,
      update: executive,
      create: executive,
      delete: executive,
    },
    admin: {
      group: 'Forms',
      defaultColumns: ['title', 'id'],
      components: {
        edit: {
          beforeDocumentControls: [
            '/components/ExportFormSubmissions/ExportButton.tsx#ExportFormSubmissionsButton',
          ],
        },
      },
    },
    fields: ({ defaultFields }) => {
      return [
        {
          name: 'isPoll',
          type: 'checkbox',
          label: 'Is Poll',
          defaultValue: true,
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Allow Responses',
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => {
              return Boolean(siblingData.isPoll)
            },
          },
        },
        {
          name: 'validDuration',
          type: 'number',
          label: 'Valid Duration (minutes)',
          defaultValue: 5,
          admin: {
            condition: (_, siblingData) => {
              return Boolean(siblingData.isPoll)
            },
          },
        },
        {
          name: 'authKey',
          type: 'text',
          label: 'OTP Key',
          admin: {
            condition: (_, siblingData) => {
              return Boolean(siblingData.isPoll)
            },
            readOnly: true,
          },
        },
        {
          name: 'tokens',
          type: 'array',
          fields: [
            {
              name: 'formToken',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            condition: (_, siblingData) => {
              return Boolean(siblingData.isPoll)
            },
            readOnly: true,
            collapsed: true,
            hidden: true,
          },
        },
        ...defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              defaultValue: () => ({
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Your response has been recorded.',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'root',
                  version: 1,
                },
              }),
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                  ]
                },
              }),
            } as typeof field
          }
          if ('name' in field && field.name === 'submitButtonLabel') {
            return {
              ...field,
              defaultValue: 'Submit',
            } as typeof field
          }
          return field
        }),
      ]
    },
    hooks: {
      beforeChange: [
        async ({ data }) => {
          if (data.isPoll && !data.authKey) {
            data.authKey = generateTotpSecret()
          }
        },
      ],
    },
  },
})
