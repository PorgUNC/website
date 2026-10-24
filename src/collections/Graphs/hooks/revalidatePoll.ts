import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Poll } from '@/payload-types'

export const revalidatePoll: CollectionAfterChangeHook<Poll> = ({
  doc,
    req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/')
    revalidateTag('pages-sitemap', 'max')
  }
  return doc
}
