import React from 'react'
import PlotlyChart from '@/components/PlotlyChart'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import { hasText } from '@payloadcms/richtext-lexical/shared'

interface PlotlyBlockProps {
  data: any
  caption: DefaultTypedEditorState
}

export const PlotlyBlock = ({ data, caption }: PlotlyBlockProps) => {
  return <div>
    <PlotlyChart chart={data} />
    {hasText(caption) && <RichText data={caption} enableGutter={false} enableProse={true} textSize="base" />}
  </div>
}
