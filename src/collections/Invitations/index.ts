import type { CollectionConfig } from 'payload'
import crypto from 'crypto'
import admin from '@/collections/Users/access/admin'
import nobody from '@/collections/Users/access/nobody'
import { getServerSideURL } from '@/utilities/getURL'

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  admin: { group: 'Users' },
  access: {
    create: admin,
    delete: admin,
    read: admin,
    update: nobody,
  },
  auth: false,
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'token', type: 'text', admin: { hidden: true } },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.token = crypto.randomBytes(32).toString('hex')
      },
    ],
    afterChange: [
      async ({ req, doc }) => {
        const inviteUrl = `${getServerSideURL()}/accept-invite?token=${doc.token}`
        await req.payload.sendEmail({
          to: doc.email,
          subject: 'You have been invited to PorgUNC!',
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You're Invited to PorgUNC!</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
          <tr>
          <td align="center" style="padding: 40px 20px;">
          <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with logo -->
          <tr>
          <td align="center" style="padding: 40px 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
          <img src="https://porgunc.com/logo.svg" alt="PorgUNC Logo" style="width: 75px; height: 75px; margin-bottom: 20px;">
          <img src="https://porgunc.com/logo_tagline.svg" alt="PorgUNC" style="max-width: 550px; height: auto;">
          </td>
          </tr>

          <!-- Content -->
          <tr>
          <td style="padding: 40px 40px 30px;">
          <h1 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #1a1a1a; text-align: center;">
          You're Invited! 🎉
          </h1>
          <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a; text-align: center;">
          You've been invited to join <strong>PorgUNC</strong>, UNC's premiere polling organization.
          </p>
          <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a; text-align: center;">
          Click the button below to accept your invitation and create your account.
          </p>

          <!-- CTA Button -->
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
          <td align="center" style="padding: 0;">
          <a href="${inviteUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
          Accept Invitation
          </a>
          </td>
          </tr>
          </table>

          <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.5; color: #7a7a7a; text-align: center;">
          If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="margin: 10px 0 0; font-size: 13px; line-height: 1.5; color: #667eea; text-align: center; word-break: break-all;">
          ${inviteUrl}
          </p>
          </td>
          </tr>

          <!-- Footer -->
          <tr>
          <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #7a7a7a; text-align: center;">
          This invitation was sent to <strong>${doc.email}</strong>
          </p>
          <p style="margin: 10px 0 0; font-size: 13px; line-height: 1.5; color: #7a7a7a; text-align: center;">
          If you weren't expecting this invitation, you can safely ignore this email.
          </p>
          </td>
          </tr>
          </table>
          </td>
          </tr>
          </table>
          </body>
          </html>
          `,
          text: `You're Invited to PorgUNC!

          You've been invited to join PorgUNC, UNC's premier polling organization.

          To accept your invitation and create your account, visit this link:
          ${inviteUrl}

          This invitation was sent to ${doc.email}

          If you weren't expecting this invitation, you can safely ignore this email.

          ---
          PorgUNC Team`,
        })
      },
    ],
  },
}
