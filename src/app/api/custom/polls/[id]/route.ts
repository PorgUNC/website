import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const pollId = Number(id)

  if (!Number.isInteger(pollId)) {
    return NextResponse.json({ error: 'Invalid poll id' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'polls',
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: { id: { equals: pollId } },
  })
  const poll = result.docs[0]

  if (!poll?.slug) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  return NextResponse.json({ slug: poll.slug })
}
