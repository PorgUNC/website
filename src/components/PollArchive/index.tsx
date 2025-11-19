import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PollPieCard from '@/components/PollPieCard'
import type { Poll } from '@/payload-types'

export interface PollArchiveProps {
  numberOfPolls: number
}

const PollArchive = async ({ numberOfPolls }: PollArchiveProps) => {
  const payload = await getPayload({ config: configPromise })

  const featuredGlobal = await payload.findGlobal({
    slug: 'featured-poll',
    depth: 1,
  })

  const featuredPollId =
    featuredGlobal?.poll && typeof featuredGlobal.poll === 'object'
      ? featuredGlobal.poll.id
      : featuredGlobal?.poll

  const { docs: polls } = await payload.find({
    collection: 'polls',
    sort: '-createdAt',
    where: featuredPollId ? { id: { not_in: [featuredPollId] } } : {},
    limit: numberOfPolls,
    depth: 2,
  })

  if (!polls || polls.length === 0) {
    return <div className="text-muted text-center py-8">No polls available.</div>
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Polls</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll: Poll) => (
          <PollPieCard key={poll.id} doc={poll} chartNum={0} />
        ))}
      </div>
    </section>
  )
}

export default PollArchive
