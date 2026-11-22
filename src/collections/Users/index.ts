import { CollectionConfig } from 'payload'

import admin from '@/collections/Users/access/admin'
import user from '@/collections/Users/access/user'
import nobody from '@/collections/Users/access/nobody'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: nobody,
    read: user,
    update: admin,
    delete: admin,
  },
  admin: {
    defaultColumns: ['name'],
    useAsTitle: 'name',
    group: 'Users',
  },
  auth: {
    disableLocalStrategy: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'sub',
      type: 'text',
      unique: true,
      saveToJWT: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'avatars',
      required: false,
      admin: {
        description: 'Profile picture uploaded from Zitadel',
      },
    },
    {
      name: 'avatar_url',
      type: 'text',
      required: false,
      admin: {
        description: 'Profile picture URL from Zitadel',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: false
    },
    {
      name: 'jobTitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Friendly title for position.',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Research', value: 'research' },
        { label: 'Executive', value: 'executive' }
      ],
      required: false,
    },
  ],
  timestamps: true,
}
