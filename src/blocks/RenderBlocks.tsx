import React, { Fragment } from 'react'

import type { Page, Poll, Post } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PdfBlock } from '@/blocks/PdfBlock/Component'
import { RichTextBlock } from '@/blocks/RichTextBlock/Component'
import LineChartBlock from '@/blocks/LineChartBlock/Component'
import PieChartBlock from '@/blocks/PieChartBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  pdfBlock: PdfBlock,
  richText: RichTextBlock,
  lineChart: LineChartBlock,
  pieChart: PieChartBlock,
}

type BlockType = Page['layout'][0] | Post['layout'][0] | Poll['layout'][0]


export const RenderBlocks = <T extends BlockType>({blocks}: { blocks: T[] }) => {
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) return null

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block as { blockType?: keyof typeof blockComponents }

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
