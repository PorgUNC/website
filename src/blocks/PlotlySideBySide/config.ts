import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const PlotlySideBySide: Block = {
  slug: 'plotlySideBySide',
  labels: {
    singular: 'Side-by-Side Plotly Charts',
    plural: 'Side-by-Side Plotly Charts',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Left Chart',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'leftChart',
          type: 'json',
          label: 'Left Chart',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Right Chart',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'rightChart',
          type: 'json',
          label: 'Right Chart',
          required: true,
        },
      ],
    },
    {
      type: 'richText',
      name: 'caption',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
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
