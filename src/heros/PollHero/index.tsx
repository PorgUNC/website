import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Poll } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import {ShareButton} from '@/components/ShareButton'
import {getServerSideURL} from '@/utilities/getURL'
import {hasText} from '@payloadcms/richtext-lexical/shared'
import RichText from '@/components/RichText'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'



export const PollHero: React.FC<{
  post: Poll
}> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title, slug, subtitle } = post
  const siteUrl = getServerSideURL() || 'https://www.porgunc.com'
  const postUrl = siteUrl + '/polls/' + slug
  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div

    >
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] pb-4"> {/* removed text that made it permawhite*/}
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category
                const titleToUse = categoryTitle || 'Untitled category'
                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <h1 className="mb-3 text-3xl md:text-5xl lg:text-5xl max-w-3xl">{title}</h1>
          {hasText(subtitle) && (
            <RichText
              className="text-2xl font-utopiasubhead [&_a]:text-gray-600 [&_a]:underline [&_a]:hover:text-gray-900 [&_p]:text-gray-600 dark:[&_a]:text-white dark:[&_a]:hover:text-blue-500 dark:[&_p]:text-white mb-3 max-w-3xl mx-px"
              data={subtitle as DefaultTypedEditorState}
              enableGutter={false}
            />
          )}
          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>
                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div>
                <time dateTime={publishedAt}>Published: {formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="container lg:grid lg:grid-cols-[1fr_48rem_1fr]">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2 flex flex-col gap-2">
          <ShareButton url={postUrl} title={title} />
        </div>
      </div>
    </div>
  )
}
