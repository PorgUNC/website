'use client'
import bb, { regions, grid, line, areaLineRange } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import React, { useEffect, useRef, useState } from 'react'
import type { Poll } from '@/payload-types'
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

interface FeaturedChart {
  id: number
  name: string
  windows?: Window[] | null
  events?: Event[] | null
  chart?: Chart | null
}

interface FeaturedChartBlockProps {
  data: FeaturedChart
}

interface PopupPosition {
  left: number
  top: number
}

const pointDate = ({ year, month, day }: Point) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const formatShortDate = ({ year, month, day }: WindowStart | WindowEnd) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))

const defaultSeriesColor = '#2563eb'

const reportLinks = (
  points: { name: string; color: string; point: Point }[],
  onNumericReport: (id: number) => void,
) => {
  const reports = new Map<string, { href?: string; id?: number; colors: string[] }>()

  points.forEach(({ color, point }) => {
    const report = point.report
    if (typeof report === 'number') {
      const key = `id:${report}`
      const entry = reports.get(key) ?? { id: report, colors: [] }
      if (!entry.colors.includes(color || defaultSeriesColor))
        entry.colors.push(color || defaultSeriesColor)
      reports.set(key, entry)
    } else if (typeof report === 'object' && report?.slug) {
      const key = `slug:${report.slug}`
      const entry = reports.get(key) ?? {
        href: `${getClientSideURL()}/polls/${report.slug}`,
        colors: [],
      }
      if (!entry.colors.includes(color || defaultSeriesColor))
        entry.colors.push(color || defaultSeriesColor)
      reports.set(key, entry)
    }
  })

  return [...reports.entries()].map(([key, report]) => (
    <a
      key={key}
      className="flex items-center gap-2 text-primary hover:underline"
      href={report.href}
      onClick={(event) => {
        if (report.id === undefined) return
        event.preventDefault()
        onNumericReport(report.id)
      }}
    >
      <span className="flex shrink-0 -space-x-1">
        {report.colors.map((color) => (
          <span
            key={color}
            className="h-2.5 w-2.5 rounded-full border border-background"
            style={{ backgroundColor: color }}
          />
        ))}
      </span>
      View Report
    </a>
  ))
}

const PointPopup = ({
  date,
  points,
  position,
  onClose,
}: {
  date: string
  points: { name: string; color: string; point: Point }[]
  position: PopupPosition
  onClose: () => void
}) => {
  const handleNumericReport = async (id: number) => {
    const response = await fetch(`/api/custom/polls/${id}`)
    if (!response.ok) return
    const { slug } = (await response.json()) as { slug: string }
    window.location.assign(`${getClientSideURL()}/polls/${slug}`)
  }

  return (
    <div
      className="absolute z-10 w-[min(18rem,calc(100%-1rem))] rounded-lg border border-border bg-background p-4 text-left shadow-lg"
      style={{ left: position.left, top: position.top }}
      role="dialog"
      aria-label={`Points for ${date}`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="font-semibold">{date}</h3>
        <button
          type="button"
          className="text-xl leading-none text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close point details"
        >
          &times;
        </button>
      </div>
      <div className="space-y-3">
        {points.map(({ name, color, point }) => (
          <div key={`${name}-${pointDate(point)}`} className="text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 font-medium">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color || defaultSeriesColor }}
                />
                {name}
              </span>
              <span>{point.y}%</span>
            </div>
            <div className="text-muted-foreground">±{point.error}%</div>
          </div>
        ))}
        {reportLinks(points, handleNumericReport)}
      </div>
    </div>
  )
}

export const FeaturedChart = ({
  data: { chart, events, windows, name, id },
}: FeaturedChartBlockProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null)
  const showLegend = false
  const chartDates = chart
    ? [...new Set(chart.series?.flatMap(({ points }) => (points ?? []).map(pointDate)) ?? [])].sort()
    : []

  if (!chart) return null

  useEffect(() => {
    if (!chartRef.current) return
    const series = chart.series ?? []
    const dates = [...new Set(series.flatMap(({ points }) => (points ?? []).map(pointDate)))].sort()
    const pointsBySeries = series.map(
      ({ points: seriesPoints }) =>
        new Map((seriesPoints ?? []).map((point) => [pointDate(point), point])),
    )
    const ranges = pointsBySeries.map((pointMap) =>
      dates.map((date) => {
        const point = pointMap.get(date)
        return point ? [point.y + point.error, point.y, Math.max(0, point.y - point.error)] : null
      }),
    )
    const columns = series.map(({ name }, index) => [name, ...(ranges[index] ?? [])])
    const emptyColumns = series.map(({ name }) => [name, ...dates.map(() => [0, 0, 0])])
    const colors = Object.fromEntries(
      series.map(({ name, color }) => [name, color || defaultSeriesColor]),
    )

    line()
    const renderChart = bb.generate({
      bindto: chartRef.current,
      ...grid(),
      ...regions(),

      data: {
        x: 'date',
        columns: [['date', ...dates], ...emptyColumns],
        colors,
        types: {
          ...Object.fromEntries(series.map(({ name }) => [name, areaLineRange()])),
        },
      },
      onclick: (event: globalThis.Event) => {
        const mouseEvent = event as globalThis.MouseEvent
        const chartBounds = chartContainerRef.current?.getBoundingClientRect()
        if (!chartBounds) return

        const positions = Array.from(chartRef.current?.querySelectorAll('.bb-axis-x .tick') ?? [])
          .map((tick) => {
            const bounds = tick.getBoundingClientRect()
            return bounds.left + bounds.width / 2
          })
          .filter((position) => Number.isFinite(position))
        if (positions.length !== dates.length) return
        const index = positions.reduce(
          (nearest, position, positionIndex) =>
            Math.abs(position - mouseEvent.clientX) < Math.abs(positions[nearest] - mouseEvent.clientX)
              ? positionIndex
              : nearest,
          0,
        )
        const popupWidth = Math.min(288, chartBounds.width - 16)
        setSelectedDate(dates[index])
        setPopupPosition({
          left: Math.max(8, Math.min(chartBounds.width - popupWidth - 8, mouseEvent.clientX - chartBounds.left - popupWidth / 2)),
          top: mouseEvent.clientY - chartBounds.top + 12,
        })
      },
      transition: {
        duration: 1000,
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
          const values = data.map((item) => {
            const seriesIndex = series.findIndex(({ name }) => name === item.id)
            const report = pointsBySeries[seriesIndex]?.get(dates[item.index ?? index])?.report
            return {
              name: item.id,
              report: report && typeof report === 'object' ? report : null,
              value: ranges[seriesIndex]?.[item.index ?? index]?.[1] ?? 0,
            }
          })

          return `
                        <table class="bb-tooltip">
                            <tbody>
                                <tr>
                                    <td>
                                        ${defaultTitleFormat(point.x)}
                                    </td>
                                    <td class="value">${values
                                      .map(
                                        ({ name, value, report }) => `
                                      <div>
                                        <span>${name}: ${defaultValueFormat(value, undefined, name)}</span>
                                      </div>
                                    `,
                                      )
                                      .join('')}</td>
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
              max: dates.length,
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
    const loadTimer = window.setTimeout(() => {
      renderChart.load({ columns: [['date', ...dates], ...columns] })
    }, 100)

    return () => {
      window.clearTimeout(loadTimer)
      renderChart.destroy()
    }
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
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span>Click a point to view the related report.</span>
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {chart.series?.map(({ name: seriesName, color }) => (
              <span key={seriesName} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color || defaultSeriesColor }}
                />
                {seriesName}
              </span>
            ))}
            {!!windows?.length && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-primary/15 ring-1 ring-primary/20" />
                Polling period
              </span>
            )}
          </span>
        </div>
        <div
          ref={chartContainerRef}
          className="relative"
          style={{ minHeight: `${Math.max(320, chartDates.length * 56)}px` }}
        >
          <div ref={chartRef}></div>
          {selectedDate && popupPosition && (
            <PointPopup
              date={selectedDate}
              points={(() => {
                const series = chart.series ?? []
                return series.flatMap(({ name, color, points }) =>
                  (points ?? [])
                    .filter((point) => pointDate(point) === selectedDate)
                    .map((point) => ({ name, color, point })),
                )
              })()}
              position={popupPosition}
              onClose={() => {
                setSelectedDate(null)
                setPopupPosition(null)
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}
