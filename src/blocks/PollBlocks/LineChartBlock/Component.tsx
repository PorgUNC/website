'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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
  if (!lineChart || !lineChart.series?.length) {
    return (
      <div className="text-red-500 text-sm">
        Line chart data is missing or the index is invalid.
      </div>
    )
  }

  const mergedData: Array<Record<string, any>> = []

  lineChart.series.forEach((series) => {
    series.data.forEach((point, idx) => {
      if (!mergedData[idx]) mergedData[idx] = { x: point.x }
      mergedData[idx][series.name] = point.y
    })
  })

  return (
    <div className="w-full h-96 my-6">
      {lineChart.label && (
        <h3 className="text-lg font-semibold text-center mb-2">{lineChart.label}</h3>
      )}

      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />

          <Tooltip
            labelStyle={{ color: 'black' }}
          />

          {showLegend && <Legend />}

          {lineChart.series.map((series, i) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.name}
              stroke={series.color || defaultColors[i % defaultColors.length]}
              dot={showDots}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}

export default LineChartBlock
