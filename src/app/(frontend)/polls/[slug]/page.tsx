import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Post } from '@/payload-types'

import { PollHero } from '@/heros/PollHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import PollMaterials from '@/components/PollMaterials'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const polls = await payload.find({
    collection: 'polls',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = polls.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Poll({params: paramsPromise}: Args) {
  const {isEnabled: draft} = await draftMode()
  const {slug = ''} = await paramsPromise
  const url = '/polls/' + slug
  const poll: RequiredDataFromCollectionSlug<'polls'> | null = await queryPostBySlug({slug})

  if (!poll) return <PayloadRedirects url={url}/>

  const {layout, relatedPolls} = poll

  return (
    <article className="pb-16">
      <PageClient/>

      <PayloadRedirects disableNotFound url={url}/>
      {draft && <LivePreviewListener/>}

      <PollHero post={poll as Post}/>

      <div className="w-full px-4 sm:px-6 lg:px-0 max-w-[48rem] mx-auto flex flex-col gap-2">
        <div className={"mt-4"}>
          <PollMaterials sidebar={poll.sidebar} />
        </div>
        <RenderBlocks blocks={layout} constraint={"post"}/>



        {relatedPolls && relatedPolls.length > 0 && (
          <RelatedPosts
            className="mt-12 w-full"
            docs={relatedPolls.filter((p) => typeof p === 'object')}
          />
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const poll = await queryPostBySlug({ slug })

  return generateMeta({ doc: poll })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'polls',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
