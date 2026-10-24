'use client'
import bb, { regions, grid, areaLineRange } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import { Link } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
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
  label: string
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

interface FeaturedChartBlockProps {
  windows?: Window[] | null
  events?: Event[] | null
  chart?: Chart | null
}

const formatShortDate = ({year, month, day}: WindowStart | WindowEnd) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))

export const FeaturedChartBlock = ({chart, windows, events}: FeaturedChartBlockProps) => {
  if (!chart) return null

  const chartRef = useRef<HTMLDivElement>(null)
  const showLegend = false

  useEffect(() => {
    if (!chartRef.current) return
    const series = chart.series ?? []
    const points = series[0]?.points ?? []
    const dates = points.map(({year, month, day}) =>
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    )
    const ranges = series.map(({points: seriesPoints}) =>
      (seriesPoints ?? []).map(({y, error}) => {
        return [y + error, y, Math.max(0, y - error)]
      }),
    )
    const sourceUrls = series.map(({points: seriesPoints}) =>
      (seriesPoints ?? []).map(({report}) =>
        report && typeof report === 'object'
          ? `${getClientSideURL()}/polls/${report.slug}`
          : undefined,
      ),
    )
    const columns = series.map(({name}, index) => [name, ...(ranges[index] ?? [])])
    const colors = Object.fromEntries(
      series.filter(({color}) => color).map(({name, color}) => [name, color as string]),
    )

    const renderChart = bb.generate({
      bindto: chartRef.current,
      ...grid(),
      ...regions(),

      data: {
        x: 'date',
        columns: [
          ['date', ...dates],
          ...columns,
        ],
        colors,
        onclick(d) {
          const sourceUrl = sourceUrls[d.id ? series.findIndex(({name}) => name === d.id) : 0]?.[d.index ?? 0]
          if (sourceUrl && typeof window !== 'undefined') {
            window.open(sourceUrl, '_blank', 'noopener,noreferrer')
          }
        },
        types: {
          ...Object.fromEntries(series.map(({name}) => [name, areaLineRange()])),
        },
      },

      point: {
        r: 5,
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
          const seriesIndex = series.findIndex(({name}) => name === point.id)
          const sourceUrl = sourceUrls[seriesIndex]?.[index]
          const [, mid] = ranges[seriesIndex]?.[index] ?? [0, 0, 0]

          return `
                        <table class="bb-tooltip">
                            <tbody>
                                <tr>
                                    <th colspan="2">
                                        ${sourceUrl ? `<a class="source-link" href="${sourceUrl}" target="_blank" rel="noreferrer" aria-label="Open data source" title="Open data source" style="color:#fff !important">` : ''}
                                            ${renderToStaticMarkup(<Link size={14} color="#fff" aria-hidden="true" />).replace('<svg', '<svg style="color:#fff !important;stroke:#fff !important"')}
                                        ${sourceUrl ? '</a>' : ''}
                                        ${defaultTitleFormat(point.x)}
                                    </th>
                                </tr>
                                <tr>
                                    <td class="name"><span style="background-color:${color(point)}"></span>${point.id}</td>
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
              max: 8,
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
          },
        },
      },
      grid: {
        x: {
          lines: (events ?? []).map(({text, year, month, day}) => ({
            value: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            text,
            position: 'end' as const,
            class: 'featured-chart-event',
          })),
        },
      },
      regions: (windows ?? []).map(({'start-date': start, 'end-date': end}) => ({
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
        <h2 className="mb-4 mt-4 text-2xl font-semibold text-center">{chart.label}</h2>
        <div ref={chartRef}></div>
      </div>
    </>
  )
}
