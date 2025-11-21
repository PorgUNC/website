import React from 'react'
import type {RichTextBlock as RichTextBlockProps} from '@/payload-types'
import RichText from '@/components/RichText'
import {DefaultTypedEditorState} from '@payloadcms/richtext-lexical'

export const RichTextBlock: React.FC<RichTextBlockProps> = ({richText}) => {
  if (richText === undefined) {
    return null
  }
  if (!richText) {
    return null
  }

  return (
    <div className="">
      {/*  sm:px-6  */}

      <RichText data={richText as DefaultTypedEditorState} enableGutter={false}/>
    </div>

  )
}

