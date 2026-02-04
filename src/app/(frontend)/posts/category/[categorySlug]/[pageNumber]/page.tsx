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
    categorySlug: string
    pageNumber?: string // optional now
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { categorySlug, pageNumber: pageNumberFromParams } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Default to page 1 if undefined
  const sanitizedPageNumber = Number(pageNumberFromParams ?? '1')
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  // Get the category by slug
  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    limit: 1,
  })
  const categoryDoc = categoryResult.docs[0]
  if (!categoryDoc || !categoryDoc.slug) notFound()

  // Fetch posts within this category
  const postsResult = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page: sanitizedPageNumber,
    where: { categories: { in: [categoryDoc.id] } },
  })

  if (!postsResult.docs.length && sanitizedPageNumber > 1) notFound()

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{categoryDoc.title}</h1>
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
            basePath={`/posts/category/${categoryDoc.slug}`}
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { categorySlug, pageNumber } = await paramsPromise
  return {
    title: `Posts in ${categorySlug} — Page ${pageNumber ?? '1'}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({ collection: 'categories', limit: 100 })

  const pages: { categorySlug: string; pageNumber: string }[] = []

  for (const category of categories.docs) {
    if (!category.slug || typeof category.slug !== 'string') continue

    const posts = await payload.find({
      collection: 'posts',
      where: { categories: { in: [category.id] } },
      limit: POSTS_PER_PAGE,
    })

    const totalPages = Math.ceil((posts.totalDocs || 0) / POSTS_PER_PAGE)
    for (let i = 1; i <= totalPages; i++) {
      pages.push({
        categorySlug: category.slug as string,
        pageNumber: String(i),
      })
    }
  }

  return pages
}
