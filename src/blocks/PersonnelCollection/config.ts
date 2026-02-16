import type {Block} from 'payload'

export const PersonnelCollectionBlock: Block = {
  slug: 'personnelCollection',
  interfaceName: 'PersonnelCollection',
  fields: [
    {
      name: 'personnel',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select users to display in this personnel collection',
      },
    },
  ],
}
