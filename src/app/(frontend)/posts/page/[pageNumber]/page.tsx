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

export default async function PostsPage({ params: paramsPromise }: Args) {
  const { pageNumber: pageNumberFromParams } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Default to page 1 if undefined
  const sanitizedPageNumber = Number(pageNumberFromParams ?? '1')
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  // Fetch posts (no category filtering)
  const postsResult = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page: sanitizedPageNumber,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  if (!postsResult.docs.length && sanitizedPageNumber > 1) notFound()

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>All Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={postsResult.page}
          limit={POSTS_PER_PAGE}
          totalDocs={postsResult.totalDocs}
        />
      </div>

      <CollectionArchive docs={postsResult.docs} relationTo="posts" />

      <div className="container">
        {postsResult?.page && postsResult?.totalPages > 1 && (
          <Pagination
            page={postsResult.page}
            totalPages={postsResult.totalPages}
            basePath="/posts/page"
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Posts — Page ${pageNumber ?? '1'}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    limit: POSTS_PER_PAGE,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const totalPages = Math.ceil((posts.totalDocs || 0) / POSTS_PER_PAGE)
  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
