'use client'
import bb, { regions, grid, line, areaLineRange } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import React, { useEffect, useRef } from 'react'
import { Poll } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'

interface Point {
  day: number
  month: number
  year: number
  y: number
  error: number
  report?: number | null | Poll
}

interface Series {
  name: string
  color: string
  points: Point[]
}

interface Chart {
  series: Series[]
}

interface WindowStart {
  month: number
  day: number
  year: number
}

interface WindowEnd {
  month: number
  day: number
  year: number
}

interface Window {
  'start-date': WindowStart
  'end-date': WindowEnd
}

interface Event {
  text: string
  month: number
  day: number
  year: number
}

interface FeaturedChart{
  id: number
  name: string
  windows?: Window[] | null
  events?: Event[] | null
  chart?: Chart | null
}

interface FeaturedChartBlockProps {
  data: FeaturedChart
}

const formatShortDate = ({ year, month, day }: WindowStart | WindowEnd) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))

export const FeaturedChart = ({ data: { chart, events, windows, name, id }}: FeaturedChartBlockProps) => {
  if (!chart) return null

  const chartRef = useRef<HTMLDivElement>(null)
  const showLegend = false

  useEffect(() => {
    if (!chartRef.current) return
    const series = chart.series ?? []
    const points = series[0]?.points ?? []
    const dates = points.map(
      ({ year, month, day }) =>
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    )
    const ranges = series.map(({ points: seriesPoints }) =>
      (seriesPoints ?? []).map(({ y, error }) => {
        return [y + error, y, Math.max(0, y - error)]
      }),
    )
    const sourceUrls = series.map(({ points: seriesPoints }) =>
      (seriesPoints ?? []).map(({ report }) =>
        report && typeof report === 'object'
          ? `${getClientSideURL()}/polls/${report.slug}`
          : undefined,
      ),
    )
    const columns = series.map(({ name }, index) => [name, ...(ranges[index] ?? [])])
    const colors = Object.fromEntries(
      series.filter(({ color }) => color).map(({ name, color }) => [name, color as string]),
    )

    // areaLineRange uses Billboard's line internals for its center line.
    line()
    const renderChart = bb.generate({
      bindto: chartRef.current,
      ...grid(),
      ...regions(),

      data: {
        x: 'date',
        columns: [['date', ...dates], ...columns],
        colors,
        types: {
          ...Object.fromEntries(series.map(({ name }) => [name, areaLineRange()])),
        },
      },

      point: {
        r: 3,
      },
      padding: {
        right: 24,
      },
      legend: {
        show: showLegend,
      },
      tooltip: {
        contents(data, defaultTitleFormat, defaultValueFormat, color) {
          const point = data[0]
          const index = point.index ?? 0
          const seriesIndex = series.findIndex(({ name }) => name === point.id)
          const sourceUrl = sourceUrls[seriesIndex]?.[index]
          const [, mid] = ranges[seriesIndex]?.[index] ?? [0, 0, 0]

          return `
                        <table class="bb-tooltip">
                            <tbody>
                                <tr>
                                    <td>
                                        ${defaultTitleFormat(point.x)}
                                    </td>
                                    <td class="value">${defaultValueFormat(mid, undefined, point.id)}</td>
                                </tr>
                            </tbody>
                        </table>`
        },
      },

      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%b %d',
            // rotate: 45,
            // multiline: false,
            culling: {
              max: 5,
            },
          },
          // height: 60,
        },
        y: {
          min: 0,
          max: 100,
          padding: { top: 0, bottom: 0 },
          tick: {
            format: (d: number) => `${d}%`,
            values: [25, 50, 75, 100],
          },
        },
      },
      grid: {
        x: {
          lines: (events ?? []).map(({ text, year, month, day }) => ({
            value: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            text,
            position: 'end' as const,
            class: 'featured-chart-event',
          })),
        },
      },
      regions: (windows ?? []).map(({ 'start-date': start, 'end-date': end }) => ({
        axis: 'x' as const,
        start: `${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')}`,
        end: `${end.year}-${String(end.month).padStart(2, '0')}-${String(end.day).padStart(2, '0')}`,
        class: 'polling-window',
        label: {
          // text: `Polling: ${formatShortDate(start)} - ${formatShortDate(end)}`,
          color: 'hsl(var(--muted-foreground))',
        },
      })),
    })
    return () => renderChart.destroy()
  }, [chart, windows, events])
  return (
    <>
      <style>{`
                .featured-chart .bb-circle {
                    cursor: pointer;
                    stroke: #fff;
                    stroke-width: 2px;
                }
                .featured-chart .featured-chart-event text {
                    fill: hsl(var(--foreground)) !important;
                    font-weight: 600;
                }
                .featured-chart .bb-xgrid-line.featured-chart-event line {
                    stroke: hsl(var(--foreground)) !important;
                    stroke-width: 1.5px;
                    opacity: 0.8;
                }
                [data-theme='dark'] .featured-chart .featured-chart-event text {
                    fill: hsl(var(--foreground)) !important;
                }
                .source-link {
                    display: inline-flex;
                    align-items: center;
                    margin-right: 4px;
                    text-decoration: none;
                    vertical-align: middle;
                    position: relative;
                    top: -2px;
                }

                .source-link svg * {
                    stroke: #fff !important;
                    color: #fff !important;
                    fill: none !important;
                }
                .source-link:hover {
                    text-decoration: underline;
                }
            `}</style>
      <div className="featured-chart max-w-7xl mx-auto">
        <h2 className="mb-4 mt-4 text-2xl font-semibold text-center">{name}</h2>
        <div ref={chartRef}></div>
      </div>
    </>
  )
}
