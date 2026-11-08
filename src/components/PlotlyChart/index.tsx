'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/providers/Theme'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface PlotlyChartProps {
  chart: any
}

export default function PlotlyChart({ chart }: PlotlyChartProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  if (!chart) return <div>Loading chart...</div>

  const isNarrow = containerWidth > 0 && containerWidth < 600
  const isPieChart = chart.data?.some((trace: any) => trace.type === 'pie')
  const narrowFontSize = (size: number | undefined, max: number, fallback: number) =>
    isNarrow ? Math.min(size ?? fallback, max) : size
  const wrapTitle = (title: any) => {
    if (!isNarrow || typeof title?.text !== 'string' || title.text.includes('<')) return title

    const charactersPerLine = Math.max(18, Math.floor(containerWidth / 10))
    const lines: string[] = []
    let line = ''

    for (const word of title.text.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word
      if (line && candidate.length > charactersPerLine) {
        lines.push(line)
        line = word
      } else {
        line = candidate
      }
    }

    if (line) lines.push(line)
    return { ...title, text: lines.join('<br>') }
  }
  const textColor = theme === 'dark' ? '#f5f5f5' : '#222222'
  const gridColor = theme === 'dark' ? '#555555' : '#dddddd'
  const colorTitle = (title: any) => {
    if (typeof title !== 'object' || title === null) return title

    return {
      ...wrapTitle(title),
      font: {
        ...title.font,
        color: textColor,
        size: narrowFontSize(title.font?.size, 16, 18),
      },
      ...(title === chart.layout?.xaxis?.title && {
        standoff: Math.max(title.standoff ?? 0, 28),
      }),
    }
  }
  const legendTitle = chart.layout?.legend?.title
  const coloredLegendTitle =
    typeof legendTitle === 'string'
      ? { text: legendTitle, font: { color: textColor } }
      : {
          ...legendTitle,
          font: {
            ...legendTitle?.font,
            color: textColor,
          },
        }

  const layout = {
    ...chart.layout,
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    shapes: chart.layout?.shapes?.map((shape: any) => {
      const isPaperBackground =
        shape.type === 'rect' &&
        shape.xref === 'paper' &&
        shape.yref === 'paper' &&
        shape.x0 === 0 &&
        shape.x1 === 1 &&
        shape.y0 === 0 &&
        shape.y1 === 1

      return isPaperBackground && theme === 'dark'
        ? {
            ...shape,
            fillcolor: 'rgba(0,0,0,0)',
            line: { ...shape.line, color: gridColor },
          }
        : shape
    }),
    font: {
      ...chart.layout?.font,
      color: textColor,
      size: narrowFontSize(chart.layout?.font?.size, 14, 16),
    },
    title: colorTitle(chart.layout?.title),
    xaxis: {
      ...chart.layout?.xaxis,
      color: textColor,
      gridcolor: gridColor,
      automargin: true,
      tickfont: {
        ...chart.layout?.xaxis?.tickfont,
        color: textColor,
        size: narrowFontSize(chart.layout?.xaxis?.tickfont?.size, 11, 12),
      },
      title: colorTitle(chart.layout?.xaxis?.title),
    },
    yaxis: {
      ...chart.layout?.yaxis,
      color: textColor,
      gridcolor: gridColor,
      tickfont: { ...chart.layout?.yaxis?.tickfont, color: textColor },
      title: colorTitle(chart.layout?.yaxis?.title),
    },
    ...(isNarrow && {
      margin: {
        ...chart.layout?.margin,
        ...(isPieChart && { l: 0, r: 0 }),
        b: Math.max(chart.layout?.margin?.b ?? 0, 150),
      },
      xaxis: {
        ...chart.layout?.xaxis,
        color: textColor,
        gridcolor: gridColor,
        automargin: true,
        tickfont: {
          ...chart.layout?.xaxis?.tickfont,
          color: textColor,
          size: narrowFontSize(chart.layout?.xaxis?.tickfont?.size, 11, 12),
        },
        tickangle: chart.layout?.xaxis?.tickangle ?? -35,
        title: colorTitle(chart.layout?.xaxis?.title),
      },
    }),
    legend: {
      ...chart.layout?.legend,
      bgcolor: 'rgba(0,0,0,0)',
      borderwidth: 0,
      font: { ...chart.layout?.legend?.font, color: textColor },
      title: coloredLegendTitle,
      ...(isNarrow && {
        orientation: 'h',
        x: isPieChart ? 0.5 : 0,
        xanchor: isPieChart ? 'center' : 'left',
        y: -0.3,
        yanchor: 'top',
      }),
    },
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', minWidth: 0, height: `${chart.layout?.height ?? 450}px` }}
    >
      <Plot
        key={theme ?? 'light'}
        data={chart.data}
        layout={layout}
        config={{
          responsive: true,
          displaylogo: false,
          showSendToCloud: false,
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
