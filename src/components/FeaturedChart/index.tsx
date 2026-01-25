'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Poll } from '@/payload-types'
import 'billboard.js/dist/billboard.css'
import bb, {line} from "billboard.js";
import { Link as LinkIcon} from 'lucide-react'

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
  const [isVisible, setIsVisible] = useState(false)

  const lineChart = doc?.statistics?.lineCharts?.[chartNum]

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!chartRef.current || !isClient) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px', // Start loading 100px before element is visible
        threshold: 0.1,
      }
    )

    observer.observe(chartRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isClient])

  useEffect(() => {
    if (!chartRef.current || !lineChart?.series || !isClient || !isVisible) return

    // Dynamically import billboard.js only on client side
    const loadChart = async () => {

      chartInstance.current?.destroy()

      if (!lineChart?.series) return

      const categories = lineChart.series[0]?.data?.map((point) => point.x) ?? []

      const columns: [string, ...number[]][] = lineChart.series.map(
        (series) => [series.name, ...(series.data?.map((p) => p.y) ?? [])] as [string, ...number[]],
      )
      const emptyColumns: [string, ...number[]][] = lineChart.series.map(
        (series) => [series.name, ...(series.data?.map(() => 0) ?? [])] as [string, ...number[]],
      )

      const colors: Record<string, string> = {}
      lineChart.series.forEach((series, i) => {
        colors[series.name] = series.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
      })

      // Detect if mobile screen
      const isMobile = window.innerWidth < 640

      // Initialize chart with 0 values for animation
      chartInstance.current = bb.generate({
        bindto: chartRef.current,
        data: {
          columns: emptyColumns,
          colors,
          type: line(),
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
            height: isMobile ? 110 : 40,
          },
        },
        legend: {
          show: true,
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
          bottom: isMobile ? 70 : undefined,
        },
        transition: {
          duration: 1000,
        },
      })

      // Load actual data with animation
      setTimeout(() => {
        chartInstance.current?.load({
          columns,
        })
      }, 100)
    }

    loadChart()

    return () => {
      chartInstance.current?.destroy()
      chartInstance.current = null
    }
  }, [lineChart, isClient, isVisible])

  if (!lineChart || !lineChart.series?.length) {
    return <p>Hi there. It doesn&apos;t exist.</p>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
      <div className="w-full flex flex-col border rounded-4xl p-4 shadow-sm hover:shadow-md transition">
        <Link href={`/polls/${doc?.slug}`} className={"group inline-flex items-center justify-center gap-2 mb-4 text-current no-underline"}>
          <h2 className="text-2xl font-semibold inline-block hover:underline m-0">{doc?.statistics?.lineCharts?.[chartNum].label}</h2>
          <LinkIcon className="w-5 h-5 text-current opacity-80" />
        </Link>
        <div ref={chartRef} />
      </div>
    </div>
  )
}
