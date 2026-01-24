import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'UNC\'s premier polling student organization.',
  images: [
    {
      url: `${getServerSideURL()}/logo_mobile.svg`,
    },
  ],
  siteName: 'Public Opinion Research Group',
  title: 'Public Opinion Research Group',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
