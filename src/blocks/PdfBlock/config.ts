import type { Block } from 'payload'

export const PdfBlock: Block = {
  slug: 'pdfBlock',
  interfaceName: 'PdfBlock',
  labels: {
    singular: 'PDF Block',
    plural: 'PDF Blocks',
  },
  fields: [
    {
      name: 'pdf',
      label: 'PDF',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'richText',
      required: false,
    },
  ],
}
