import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? doc.title : 'PorgUNC'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const seoConfig = seoPlugin({
  generateTitle,
  generateURL,
  generateImage: async ({ doc, req }) => {
    if (doc?.heroImage) {
      return doc.heroImage
    }
    const metaImage = await req.payload.findGlobal({ slug: 'meta-image' })
    if (metaImage) {
      return metaImage['meta-image']
    }
    return null
  },
})
