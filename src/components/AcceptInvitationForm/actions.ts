'use server';

import {getPayload} from 'payload';
import configPromise from '@payload-config';

type AcceptInviteParams = {
  token: string;
  fullName: string;
  password: string;
};

export async function acceptInvite({
                                     token,
                                     fullName,
                                     password,
                                   }: AcceptInviteParams) {
  const payload = await getPayload({ config: configPromise });

  const inviteResults = await payload.find({
    collection: 'invitations',
    where: { token: { equals: token } },
  });

  if (inviteResults.totalDocs === 0) {
    return { error: 'Invalid or expired invitation' };
  }

  const invite = inviteResults.docs[0];

  const user = await payload.create({
    collection: "users", draft: true,
    data: {
      email: invite.email,
      name: fullName,
      password: password,
    }
  });

  await payload.delete({
    collection: 'invitations',
    id: invite.id,
  });

  return { success: true, user };
}
