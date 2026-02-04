import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => {
      return { slug: slug as string }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({params: paramsPromise}: Args) {
  const {isEnabled: draft} = await draftMode()
  const {slug = ''} = await paramsPromise
  const url = '/posts/' + slug
  const post: RequiredDataFromCollectionSlug<'posts'> | null = await queryPostBySlug({slug})

  if (!post) return <PayloadRedirects url={url}/>

  const {layout, relatedPosts} = post

  return (
    <article className="pb-16">
      <PageClient/>

      <PayloadRedirects disableNotFound url={url}/>
      {draft && <LivePreviewListener/>}

      <PostHero post={post as Post}/>

      <div className="w-full px-4 sm:px-6 lg:px-0 max-w-[48rem] mx-auto flex flex-col gap-6">

        <RenderBlocks blocks={layout} constraint={"post"}/>

        {relatedPosts && relatedPosts.length > 0 && (
          <RelatedPosts
            className="mt-12 w-full"
            docs={relatedPosts.filter((p) => typeof p === 'object')}
          />
        )}
      </div>
    </article>

  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
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
