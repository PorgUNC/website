import {getPayload} from 'payload';
import configPromise from '@payload-config';
import AcceptInviteForm from "@/components/AcceptInvitationForm";

export default async function AcceptInvitePage({searchParams }: { searchParams: { token: string } }) {
  const payload = await getPayload({ config: configPromise });
  const { token } = await searchParams

  const inviteResults = await payload.find({
    collection: 'invitations',
    where: { token: { equals: token } },
  });

  if (inviteResults.totalDocs === 0) {
    return <div>Invalid or expired invitation.</div>;
  }

  const invite = inviteResults.docs[0];

  return (
    <div>
      <AcceptInviteForm email={invite.email} token={token} />
    </div>
  );
}
