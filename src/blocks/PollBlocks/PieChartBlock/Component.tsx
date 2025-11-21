'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts'

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

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx, cy, midAngle, innerRadius, outerRadius,
    startAngle, endAngle, fill,
  } = props

  const offset = 8

  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)

  const newCx = cx + cos * offset
  const newCy = cy + sin * offset

  return (
    <Sector
      cx={newCx}
      cy={newCy}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      fill={fill}
    />
  )
}

const PieChartBlock: React.FC<PieChartBlockProps> = ({
                                                       showLegend = true,
                                                       pieChart,
                                                     }) => {
  if (!pieChart?.data) return null

  const chartLabel = pieChart.label || 'Pie Chart'

  return (
    <div className="w-full min-h-[350px]">
      <h3 className="text-center text-lg font-semibold mb-4">
        {chartLabel}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieChart.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            activeShape={renderActiveShape}
            paddingAngle={1}
          >
            {pieChart.data.map((slice, i) => (
              <Cell
                key={i}
                fill={slice.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChartBlock
