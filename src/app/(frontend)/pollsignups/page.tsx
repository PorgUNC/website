import PollSignupGrid from '@/components/PollSignupGrid'

export default async function PollSignupPage({ searchParams }: { searchParams: Promise<{ uuid: string }> }) {
  const { uuid } = await searchParams
  if (!uuid) {
    return <div>Missing poll UUID.</div>
  }
  return (
    <div className={'mb-36'}>
      <PollSignupGrid uuid={uuid} />
    </div>
  )
}
