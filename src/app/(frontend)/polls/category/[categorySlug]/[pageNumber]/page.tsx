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

// Define polls per page
const POLLS_PER_PAGE = 6

type Args = {
  params: Promise<{
    categorySlug: string
    pageNumber?: string // optional
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

  // Fetch polls within this category
  const pollsResult = await payload.find({
    collection: 'polls',
    depth: 1,
    limit: POLLS_PER_PAGE,
    page: sanitizedPageNumber,
    where: { categories: { in: [categoryDoc.id] } },
  })

  if (!pollsResult.docs.length && sanitizedPageNumber > 1) notFound()

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
          collection="polls"
          currentPage={pollsResult.page}
          limit={POLLS_PER_PAGE}
          totalDocs={pollsResult.totalDocs}
        />
      </div>

      <CollectionArchive docs={pollsResult.docs} relationTo="polls" />

      <div className="container">
        {pollsResult.totalPages > 1 && pollsResult.page && (
          <Pagination
            page={pollsResult.page}
            totalPages={pollsResult.totalPages}
            basePath={`/polls/category/${categoryDoc.slug}`}
          />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { categorySlug, pageNumber } = await paramsPromise
  return {
    title: `Polls in ${categorySlug} — Page ${pageNumber ?? '1'}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({ collection: 'categories', limit: 100 })

  const pages: { categorySlug: string; pageNumber: string }[] = []

  for (const category of categories.docs) {
    if (!category.slug || typeof category.slug !== 'string') continue

    const polls = await payload.find({
      collection: 'polls',
      where: { categories: { in: [category.id] } },
      limit: POLLS_PER_PAGE,
    })

    const totalPages = Math.ceil((polls.totalDocs || 0) / POLLS_PER_PAGE)
    for (let i = 1; i <= totalPages; i++) {
      pages.push({
        categorySlug: category.slug as string,
        pageNumber: String(i),
      })
    }
  }

  return pages
}
