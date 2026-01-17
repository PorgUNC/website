'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Poll } from '@/payload-types'
// @ts-ignore
import 'c3/c3.css'

export type CardPollData = Pick<Poll, 'slug' | 'title' | 'statistics'>

interface FeaturedChartProps {
  doc?: CardPollData
  chartNum?: number
}

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ff7300',
  '#0088fe',
  '#ff0000',
  '#00c49f',
  '#ffbb28',
  '#a4de6c',
]

export default function FeaturedChart({ doc, chartNum = 0 }: FeaturedChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  const lineChart = doc?.statistics?.lineCharts?.[chartNum]

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!chartRef.current || !lineChart?.series || !isClient) return

    // Dynamically import c3 only on client side
    const loadChart = async () => {
      const c3Module = await import('c3')
      const c3 = c3Module.default

      chartInstance.current?.destroy()

      if (!lineChart?.series) return

      const categories = lineChart.series[0]?.data?.map((point) => point.x) ?? []

      const columns: [string, ...number[]][] = lineChart.series.map(
        (series) => [series.name, ...(series.data?.map((p) => p.y) ?? [])] as [string, ...number[]],
      )

      const colors: Record<string, string> = {}
      lineChart.series.forEach((series, i) => {
        colors[series.name] = series.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
      })

      // Detect if mobile screen
      const isMobile = window.innerWidth < 640

      chartInstance.current = c3.generate({
        bindto: chartRef.current,
        data: {
          columns,
          colors,
        },
        axis: {
          x: {
            type: 'category',
            categories,
            tick: {
              rotate: isMobile ? 45 : 0,
              multiline: false,
              culling: {
                max: isMobile ? 6 : 10,
              },
            },
            height: isMobile ? 60 : 40,
          },
          y: {
            tick: {
              format: (d: number) => d.toString(),
            },
          },
        },
        legend: {
          position: 'bottom',
        },
        grid: {
          y: {
            show: true,
          },
          focus: {
            show: true,
          },
        },
        point: {
          r: 5,
          focus: {
            expand: {
              enabled: true,
              r: 7,
            },
          },
        },

        padding: {
          left: isMobile ? 30 : undefined,
          right: isMobile ? 10 : undefined,
          bottom: isMobile ? 20 : undefined,
        },
      })
    }

    loadChart()

    return () => {
      chartInstance.current?.destroy()
      chartInstance.current = null
    }
  }, [lineChart, isClient])

  if (!lineChart || !lineChart.series?.length) {
    return <p>Hi there. It doesn&apos;t exist.</p>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
      <div className="w-full flex flex-col border rounded-4xl p-4 shadow-sm hover:shadow-md transition">
        <Link href={`/polls/${doc?.slug}`}>
          <h2 className="text-xl font-semibold mb-4 text-center hover:underline">{doc?.title}</h2>
        </Link>

        <div ref={chartRef} />
      </div>
    </div>
  )
}
