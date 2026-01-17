import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { PdfBlock } from '@/blocks/PdfBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePoll } from './hooks/revalidatePoll'
import { slugField } from '@/fields/slug'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { RichTextBlock } from '@/blocks/RichTextBlock/config'
import { FormBlock } from '@/blocks/Form/config'
import { LineChartBlock } from '@/blocks/PollBlocks/LineChartBlock/config'
import { PieChartBlock } from '@/blocks/PollBlocks/PieChartBlock/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Polls: CollectionConfig<'polls'> = {
  slug: 'polls',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'polls',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'polls',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              admin: {
                initCollapsed: true,
              },
              blocks: [
                Banner,
                Code,
                MediaBlock,
                CallToAction,
                Content,
                RichTextBlock,
                FormBlock,
                PdfBlock,
                LineChartBlock,
                PieChartBlock,
              ],
            },
          ],
        },
        {
          label: 'Statistics',

          fields: [
            {
              name: 'statistics',
              type: 'group',
              fields: [
                {
                  name: 'pieCharts',
                  type: 'array',
                  labels: {
                    singular: 'Pie Chart',
                    plural: 'Pie Charts',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                    },
                    {
                      name: 'hide',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                    {
                      name: 'data',
                      type: 'array',
                      labels: {
                        singular: 'Slice',
                        plural: 'Slices',
                      },
                      fields: [
                        { name: 'name', type: 'text', required: true },
                        { name: 'value', type: 'number', required: true },
                        { name: 'color', type: 'text' },
                      ],
                    },
                  ],
                },
                {
                  name: 'lineCharts',
                  type: 'array',
                  labels: {
                    singular: 'Line Chart',
                    plural: 'Line Charts',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                    },
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
                          name: 'data',
                          type: 'array',
                          labels: {
                            singular: 'Point',
                            plural: 'Points',
                          },
                          fields: [
                            {
                              name: 'x',
                              type: 'text',
                              required: true,
                            },
                            {
                              name: 'y',
                              type: 'number',
                              required: true,
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
              ],
            },
          ],
        },
        {
          label: 'Files',
          fields: [
            {
              name: 'files',
              type: 'array',
              labels: {
                singular: 'File',
                plural: 'Files',
              },
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'files',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'file', value: 'file' },
                    { label: 'file-code', value: 'file-code' },
                    { label: 'file-text', value: 'file-text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'relatedPolls',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => ({
                id: { not_in: [id] },
              }),
              hasMany: true,
              relationTo: 'polls',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text' },
        {
          name: 'jobTitle',
          type: 'text',
          required: false,
          admin: {
            description: 'Job Title',
          },
        },
        {
          name: 'authorPage',
          type: 'number',
          required: false,
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePoll],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
