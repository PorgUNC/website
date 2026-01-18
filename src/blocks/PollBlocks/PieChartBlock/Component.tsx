'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'billboard.js/dist/billboard.css'
import bb, {pie} from "billboard.js";

type PieSlice = {
  name: string
  value: number
  color?: string
}

export type PieChartData = {
  label?: string
  data: PieSlice[]
}

export type PieChartBlockProps = {
  chartIndex: number
  showLegend?: boolean
  pieChart?: PieChartData | null
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

const PieChartBlock: React.FC<PieChartBlockProps> = ({ showLegend = true, pieChart }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!chartRef.current || !isClient || !pieChart?.data?.length) return

    // Dynamically import billboard.js only on client side
    const loadChart = async () => {

      chartInstance.current?.destroy()

      if (!pieChart.data) return

      /**
       * Convert slices → billboard.js columns
       */
      const columns: [string, number][] = pieChart.data.map((slice) => [slice.name, slice.value])

      /**
       * Colors
       */
      const colors: Record<string, string> = {}
      pieChart.data.forEach((slice, i) => {
        colors[slice.name] = slice.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
      })

      chartInstance.current = bb.generate({
        bindto: chartRef.current,
        data: {
          columns,
          type: pie(),
          colors,
        },
        pie: {
          label: {
            show: true,
            format: (_value: number, ratio: number, _id: string) => `${Math.round(ratio * 100)}%`,
            threshold: 0.05, // Only show label if slice is at least 5% to avoid clutter
          },
        },
        legend: {
          show: showLegend,
          position: 'bottom',
        },
        tooltip: {
          format: {
            value: (value: number) => value.toString(),
          },
        },
        padding: {
          top: 20,
          bottom: showLegend ? 20 : 10,
          left: 20,
          right: 20,
        },
      })
    }

    loadChart()

    return () => {
      chartInstance.current?.destroy()
      chartInstance.current = null
    }
  }, [pieChart, showLegend, isClient])

  if (!pieChart?.data?.length) return null

  return (
    <div className="w-full min-h-[350px]">
      <h3 className="text-center text-lg font-semibold mb-4">{pieChart.label || 'Pie Chart'}</h3>

      <div className="w-full h-[300px]">
        <div ref={chartRef} className="w-full h-full" />
      </div>
    </div>
  )
}

export default PieChartBlock
