import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import React, { cache } from 'react'
import PageClient from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Graph({params: paramsPromise}: Args) {
  const {slug = ''} = await paramsPromise
  const url = '/graphs/' + slug

  return (
    <article className="pb-16">
      <PageClient/>
      <PayloadRedirects disableNotFound url={url}/>
    </article>
  )
}


