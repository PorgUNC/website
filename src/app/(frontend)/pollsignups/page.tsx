import { PollSignupGrid } from '@/components/PollSignup/PollSignupGrid'

export default async function PollSignupPage({ searchParams }: { searchParams: Promise<{ uuid: string }> }) {
  const { uuid } = await searchParams
  if (!uuid) {
    return <div>Missing poll UUID.</div>
  }
  return <PollSignupGrid uuid={uuid} />
}
