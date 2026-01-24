import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Poll } from '@/payload-types'

export const revalidatePoll: CollectionAfterChangeHook<Poll> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/polls/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('polls-sitemap')

      payload.logger.info(`Revalidating main page for changed post.`)
      revalidatePath('/')
      revalidateTag('pages-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/polls/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('polls-sitemap')

      payload.logger.info(`Revalidating main page for changed post.`)
      revalidatePath('/')
      revalidateTag('pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Poll> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/polls/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('polls-sitemap')

    revalidatePath('/')
    revalidateTag('pages-sitemap')
  }

  return doc
}
