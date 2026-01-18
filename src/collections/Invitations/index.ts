import type {CollectionConfig} from 'payload'
import crypto from 'crypto';
import admin from "@/collections/Users/access/admin";
import {nobody} from "@/collections/Users/access/nobody";
import {getServerSideURL} from "@/utilities/getURL";

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  admin: {group: 'Users'},
  access: {
    create: admin,
    delete: admin,
    read: admin,
    update: nobody
  },
  auth: false,
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'token', type: 'text', admin:{hidden:true}},
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.token = crypto.randomBytes(32).toString('hex');
      }
    ],
    afterChange: [
      async ({ req, doc }) => {
        await req.payload.sendEmail({
          to: doc.email,
          subject: 'You have been invited to PorgUNC!',
          html: `<a href="${getServerSideURL()}/accept-invite?token=${doc.token}">
                  Click to join
                 </a>`
        })
      }
    ]
  }
};
