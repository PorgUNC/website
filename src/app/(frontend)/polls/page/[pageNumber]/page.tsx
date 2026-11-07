import type { Metadata } from 'next'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

// Define posts per page
const POSTS_PER_PAGE = 6

type Args = {
  params: Promise<{
    pageNumber?: string // optional
  }>
}

export default async function PollsPage({ params: paramsPromise }: Args) {
  const { pageNumber: pageNumberFromParams } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Default to page 1 if undefined
  const sanitizedPageNumber = Number(pageNumberFromParams ?? '1')
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  // Fetch posts (no category filtering)
  const pollsResult = await payload.find({
    collection: 'polls',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page: sanitizedPageNumber,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  if (!pollsResult.docs.length && sanitizedPageNumber > 1) notFound()

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>All Polls</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="polls"
          currentPage={pollsResult.page}
          limit={POSTS_PER_PAGE}
          totalDocs={pollsResult.totalDocs}
        />
      </div>

      <CollectionArchive docs={pollsResult.docs} relationTo="polls" />

      <div className="container">
        {pollsResult?.page && pollsResult?.totalPages > 1 && (
          <Pagination
            page={pollsResult.page}
            totalPages={pollsResult.totalPages}
            basePath="/polls/page"
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Polls — Page ${pageNumber ?? '1'}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const polls = await payload.find({
    collection: 'polls',
    limit: POSTS_PER_PAGE,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const totalPages = Math.ceil((polls.totalDocs || 0) / POSTS_PER_PAGE)
  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
