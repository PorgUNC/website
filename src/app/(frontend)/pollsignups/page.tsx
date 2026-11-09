import PollSignupGrid from '@/components/PollSignupGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PORG Polling Signups',
  description: 'Sign up for a polling time.',
  openGraph: {
    title: 'PORG Polling Signups',
    description: 'Sign up for a polling time.',
    images: ['/metabanner.png']
  }
}


export default async function PollSignupPage({ searchParams }: { searchParams: Promise<{ uuid: string, name: string }> }) {
  const { uuid, name } = await searchParams
  if (!uuid) {
    return <div>Missing poll UUID.</div>
  }
  return (
    <div className={'mb-36'}>
      <PollSignupGrid uuid={uuid} givenName={name} />
    </div>
  )
}
