'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'billboard.js/dist/billboard.css'
import bb, {line} from "billboard.js";

export interface LinePoint {
  x: string
  y: number
}

export interface LineSeries {
  name: string
  data: LinePoint[]
  color?: string
}

export interface LineChartData {
  label?: string
  series?: LineSeries[]
}

export interface LineChartBlockProps {
  chartIndex: number
  showLegend?: boolean
  showDots?: boolean
  lineChart?: LineChartData
  blockType: 'lineChart'
  id: string
}

const defaultColors = [
  '#8884d8',
  '#82ca9d',
  '#ff7300',
  '#0088fe',
  '#ff0000',
  '#00c49f',
  '#ffbb28',
  '#a4de6c',
]

const LineChartBlock: React.FC<LineChartBlockProps> = ({
  lineChart,
  showLegend = true,
  showDots = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

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
    if (!chartRef.current || !isClient || !lineChart?.series?.length || !isVisible) return

    // Dynamically import billboard.js only on client side
    const loadChart = async () => {
      chartInstance.current?.destroy()

      if (!lineChart?.series) return

      /**
       * X-axis categories (from first series)
       */
      const categories = lineChart.series[0]?.data.map((p) => p.x) ?? []

      /**
       * Series → columns
       */
      const columns: [string, ...number[]][] = lineChart.series.map(
        (series) => [series.name, ...series.data.map((p) => p.y)] as [string, ...number[]],
      )
      const emptyColumns: [string, ...number[]][] = lineChart.series.map(
        (series) => [series.name, ...series.data.map(() => 0)] as [string, ...number[]],
      )

      /**
       * Colors
       */
      const colors: Record<string, string> = {}
      lineChart.series.forEach((series, i) => {
        colors[series.name] = series.color ?? defaultColors[i % defaultColors.length]
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
            height: isMobile ? 60 : 40,
          },
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
          show: showDots,
          r: showDots ? 5 : 0,
          focus: {
            expand: {
              enabled: true,
              r: 7,
            },
          },
        },
        legend: {
          show: showLegend,
          position: 'bottom',
        },
        tooltip: {
          grouped: true,
        },
        padding: {
          left: isMobile ? 30 : undefined,
          right: isMobile ? 10 : undefined,
          bottom: isMobile ? 20 : undefined,
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
  }, [lineChart, showLegend, showDots, isClient, isVisible])

  if (!lineChart || !lineChart.series?.length) {
    return (
      <div className="text-red-500 text-sm">
        Line chart data is missing or the index is invalid.
      </div>
    )
  }

  return (
    <div className="w-full h-96 my-6">
      {lineChart.label && (
        <h3 className="text-lg font-semibold text-center mb-2">{lineChart.label}</h3>
      )}

      <div ref={chartRef} className="w-full h-full" />
    </div>
  )
}

export default LineChartBlock
