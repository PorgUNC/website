import type { GlobalConfig } from 'payload'

export const MetaImage: GlobalConfig = {
  slug: 'meta-image',
  label: {
    singular: 'Meta Image',
    plural: 'Meta Images',
  },
  fields: [
    {
      name: 'meta-image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Select the static media to feature for OpenGraph previews.',
      },
    },
  ],
}
