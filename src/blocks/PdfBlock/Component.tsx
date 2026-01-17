import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
// import type { Media } from '@payload-types'
import type { PdfBlock as PdfBlockProps, Media } from '@/payload-types'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

type Props = PdfBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  disableInnerContainer?: boolean
}

export const PdfBlock: React.FC<Props> = async ({
  pdf: pdfProp,
  caption,
  className,
  captionClassName,
  enableGutter = true,
  disableInnerContainer,
}) => {
  if (!pdfProp) return null

  let pdf: Media | null = null

  // If pdfProp is an object with url, use it. Otherwise, fetch the document
  if (typeof pdfProp === 'object' && 'url' in pdfProp) {
    pdf = pdfProp as Media
  } else {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'media',
      where: { id: { equals: String(pdfProp) } },
      limit: 1,
    })
    pdf = (docs[0] as Media | undefined) ?? null
  }

  if (!pdf) return null

  return (
    <div
    // className={cn(
    //   '',
    //   {
    //     // container: enableGutter,
    //   },
    //   className
    // )}
    >
      {/* Embedded PDF */}
      <div className="w-full aspect-3/4 border border-border rounded-lg overflow-hidden">
        <iframe
          src={pdf.url ?? undefined} // <-- ensure it's string | undefined
          title={pdf.filename ?? 'PDF'}
          className="w-full h-full"
          // frameBorder="0"
        />
      </div>

      {/* Caption */}
      {caption && (
        <div
          className={cn(
            'mt-4',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
