import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'


export const PlotlyBlock: Block = {
  slug: 'plotlyBlock',
  fields: [
    {
      type: 'collapsible',
      label: 'JSON',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'data',
          type: 'json',
        },
      ],
    },
    {
      type: 'richText',
      name: 'caption',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
          ]
        },
      }),
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      label: 'Full Width (ignore layout constraints)',
      admin: {
        description: 'Enable to let this block span the full page width.',
        hidden: true,
      },
      defaultValue: false,
    },
  ],
}
