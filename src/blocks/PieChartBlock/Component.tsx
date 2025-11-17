'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

const PieChartBlock: React.FC<PieChartBlockProps> = ({
                                                       showLegend = true,
                                                       pieChart,
                                                     }) => {
  if (!pieChart?.data) return null

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={pieChart.data as any} // <-- compatible with ChartDataInput[]
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
          >
            {pieChart.data.map((slice, i) => (
              <Cell key={i} fill={slice.color || '#8884d8'} />
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
