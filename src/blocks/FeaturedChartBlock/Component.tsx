import React from 'react'
import { Poll } from '@/payload-types'
import FeaturedChart from '@/components/FeaturedChart'
import { getPayload } from 'payload'
import configPromise from '@payload-config'


export interface FeaturedChartBlockProps {
  featuredpoll: Poll
}

export const FeaturedChartBlock = async ({
                                           featuredpoll,
                                         }: FeaturedChartBlockProps) => {

  if (!featuredpoll) return null

  const id =
    typeof featuredpoll === 'object'
      ? featuredpoll.id
      : featuredpoll

  const payload = await getPayload({ config: configPromise })
  const poll = await payload.findByID({
    collection: 'polls',
    id,
    depth: 3,
  })

  return <FeaturedChart chartNum={0} doc={poll} />
}
