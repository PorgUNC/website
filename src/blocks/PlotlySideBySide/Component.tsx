import PlotlyChart from '@/components/PlotlyChart'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import { hasText } from '@payloadcms/richtext-lexical/shared'

interface PlotlySideBySideProps {
  leftChart: any
  rightChart: any
  caption: DefaultTypedEditorState
}

export const PlotlySideBySideBlock = ({ leftChart, rightChart, caption }: PlotlySideBySideProps) => (
  <div>
    <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
      <div className="min-w-0">
        <PlotlyChart chart={leftChart} />
      </div>
      <div className="min-w-0">
        <PlotlyChart chart={rightChart} />
      </div>
    </div>
    {hasText(caption) && (
      <RichText data={caption} enableGutter={false} enableProse={true} textSize="base" />
    )}
  </div>
)
