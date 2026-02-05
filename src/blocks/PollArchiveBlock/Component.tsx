import React from 'react'
import type { Poll } from '@/payload-types'
import PollPieCard from '@/components/PollPieCard'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface PollArchiveBlockProps {
  selectedPolls?: (Poll | number)[]
  [key: string]: any
}

export const PollArchiveBlock = async (props: PollArchiveBlockProps) => {
  const { selectedPolls } = props

  if (!selectedPolls || selectedPolls.length === 0) {
    return <div className="text-muted text-center py-8">No polls selected.</div>
  }

  const payload = await getPayload({ config: configPromise })

  const pollIds = selectedPolls.map((poll) =>
    typeof poll === 'object' && poll !== null ? poll.id : poll
  )

  const polls = await Promise.all(
    pollIds.map(async (id) => {
      try {
        const poll = await payload.findByID({
          collection: 'polls',
          id,
          depth: 0,
        })
        return poll
      } catch (error) {
        console.error(`Error fetching poll ${id}:`, error)
        return null
      }
    })
  )

  const validPolls = polls.filter((poll): poll is Poll => poll !== null)

  if (validPolls.length === 0) {
    return <div className="text-muted text-center py-8">No polls available.</div>
  }

  const allPieCharts = validPolls.flatMap((poll: Poll) => {
    if (!poll.slug || !poll.statistics?.pieCharts) {
      return []
    }

    return poll.statistics.pieCharts
      .filter((pieChart) => !pieChart.hide && pieChart.id && pieChart.label) // Filter out charts without id or label
      .map((pieChart) => ({
        pieChart: {
          id: pieChart.id!,
          data: pieChart.data?.map(d => ({
            name: d.name,
            value: d.value,
            color: d.color || undefined,
          })),
          hide: pieChart.hide || undefined,
        },
        slug: poll.slug as string,
        label: pieChart.label!,
      }))
  })

  if (allPieCharts.length === 0) {
    return <div className="text-muted text-center py-8">No pie charts available in selected polls.</div>
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pb-4 pt-2">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {allPieCharts.map(({ pieChart, slug, label }) => (
          <PollPieCard
            key={pieChart.id}
            chart={pieChart}
            slug={slug}
            title={label}
          />
        ))}
      </div>
    </section>
  )
}
