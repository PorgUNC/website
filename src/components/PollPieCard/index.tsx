'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import 'billboard.js/dist/billboard.css'
import bb, {pie} from "billboard.js";

import { Poll } from '@/payload-types'

export type CardPollData = Pick<Poll, 'slug' | 'title' | 'statistics'>

interface PieChartData {
  name: string
  value: number
  color?: string
}

interface PieChart {
  id: string
  data?: PieChartData[]
  hide?: boolean
}

interface PollPieCardProps {
  chart: PieChart
  slug: string
  title: string
}

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#a4de6c',
  '#d0ed57',
  '#8dd1e1',
  '#d88884',
]

export default function PollPieCard({ chart, slug, title }: PollPieCardProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  const pieChart = chart

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!chartRef.current || !isClient) return

    // Dynamically import billboard.js only on client side
    const loadChart = async () => {
      chartInstance.current?.destroy()

      if (!pieChart.data) return

      const columns: [string, number][] = pieChart.data.map((slice: PieChartData) => [
        slice.name,
        slice.value,
      ])

      const colors: Record<string, string> = {}
      pieChart.data.forEach((slice: PieChartData, i: number) => {
        colors[slice.name] = slice.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
      })

      // Detect if mobile screen
      const isMobile = window.innerWidth < 640

      chartInstance.current = bb.generate({
        bindto: chartRef.current,
        data: {
          columns,
          type: pie(),
          colors,
        },
        pie: {
          label: {
            show: !isMobile, // Hide labels on mobile
            format: (_value: number, ratio: number, _id: string) =>
              `${Math.round(ratio * 100)}%`,
            threshold: 0.05,
          },
        },
        legend: {
          show: true,
          position: 'bottom',
        },
        tooltip: {
          format: {
            value: (value: number) => value.toString(),
          },
        },
        size: {
          height: isMobile ? 250 : undefined,
        },
      })
    }

    loadChart()

    return () => {
      chartInstance.current?.destroy()
      chartInstance.current = null
    }
  }, [pieChart, isClient])

  if (!pieChart || !pieChart.data?.length) return null

  return (
    <div className="aspect-square w-full border rounded-4xl p-4 shadow-sm hover:shadow-md transition flex flex-col">
      <h2 className="text-xl font-semibold mb-2 text-center">
        <Link className="hover:underline" href={`/polls/${slug}`}>
          {title}
        </Link>
      </h2>

      <div className="flex-1 min-h-0">
        <div ref={chartRef} className="w-full h-full" />
      </div>
    </div>
  )
}
