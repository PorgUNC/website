// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { fields } from '@payloadcms/plugin-form-builder'
import { generateTotpSecret } from '@/lib/totp/generateTotpSecret'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { s3Storage } from '@payloadcms/storage-s3'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { authenticated } from '@/access/authenticated'
import { Programs } from '@/blocks/Form/Programs/config'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? doc.title : 'PorgUNC'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'polls'],
    overrides: {
      admin: {
        group: 'Meta'
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      radio: true,
      payment: false,
      email: false,
      programs: Programs,
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
                        BlocksFeature({blocks: [Banner, Code, MediaBlock]}),
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
        ],
      },
    },
    formSubmissionOverrides: {
      access: {
        read: authenticated,
        update: authenticated,
        create: authenticated,
        delete: authenticated,
      },
      admin: {
        group: 'Forms'
      },
    },
    formOverrides: {
      access: {
        read: authenticated,
        update: authenticated,
        create: authenticated,
        delete: authenticated,
      },
      admin: {
        group: 'Forms',
        defaultColumns: ["title", "id"]
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
                      BlocksFeature({blocks: [Banner, Code, MediaBlock]}),
                    ]
                  },
                }),
              } as typeof field
            }
            if ('name' in field && field.name === 'submitButtonLabel') {
              return {
                ...field,
                defaultValue: 'Submit'
              } as typeof field
            }
            return field
          }),
        ]
      },
      hooks: {
        beforeChange: [
          async ({ data }) => {
            if (data.isPoll && !data.authKey){data.authKey = generateTotpSecret()}
          },
        ],
      },
    },
  }),
  searchPlugin({
    collections: ['polls'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        group: 'Meta'
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // payloadCloudPlugin(),
  s3Storage({
    enabled: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_PREVIEW !== 'true',
    // enabled: true,
    collections: {
      media: true,
      files: true,
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: 'auto',
      endpoint: process.env.S3_ENDPOINT || '',
    },
  }),
]
