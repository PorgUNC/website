import { CollectionConfig } from 'payload'

// import { authenticated } from '../../access/authenticated'
import {User} from '@/payload-types'
import { protectRoles } from '@/collections/Users/hooks/protectRoles'
import { checkRole } from '@/collections/Users/access/checkRole'
import admin from '@/collections/Users/access/admin'
import user from '@/collections/Users/access/user'


export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: admin,
    read: user,
    update: ({ req: { user } }) => {
      if (checkRole(['admin'], user as User)) {
        return true;
      }
      return {
        id: { equals: user?.id }
      };
    },
    delete: admin,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    group: 'Users'
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      options: [
        {label: 'Admin', value: 'admin'},
        {label: 'User', value: 'user'},
      ],
      required: true,
      hooks: {
        beforeChange: [protectRoles]
      },
      access: {
        update: ({ req: { user } }) => {
          const u = user as User;
          return checkRole(['admin'], u) || u?.id === 1;
        }
      },
    },
  ],
  timestamps: true,
}
