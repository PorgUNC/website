'use client';

import Link from "next/link";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Poll } from '@/payload-types'

interface LinePoint {
  x: string;
  y: number;
}

interface LineSeries {
  name: string;
  data: LinePoint[];
  color?: string;
}

interface LineChartData {
  label?: string;
  series?: LineSeries[];
}

export type CardPollData = Pick<Poll, 'slug' | 'title' | 'statistics'>

interface FeaturedChartProps {
  doc?: CardPollData;
  chartNum?: number;
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
];

export default function FeaturedChart({ doc, chartNum = 0 }: FeaturedChartProps) {
  const lineChart = doc?.statistics?.lineCharts?.[chartNum];
  console.log(doc)
  if (!lineChart || !lineChart.series?.length) return (<div><p>Hi there. It doesn't exist.</p></div>);

  const mergedData: Array<Record<string, any>> = [];

  lineChart.series.forEach((series) => {
    series.data?.forEach((point, idx) => {
      if (!mergedData[idx]) mergedData[idx] = { x: point.x };
      mergedData[idx][series.name] = point.y;
    });
  });

  return (
    <Link
      href={`/polls/${doc.slug}`}
      className="block w-full max-w-7xl mx-auto px-4"
    >
      <div className="w-full border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-neutral-900 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-center flex-shrink-0">
          {doc.title}
        </h2>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />

              <Tooltip labelStyle={{ color: 'black' }} />
              <Legend />

              {lineChart.series.map((series, i) => (
                <Line
                  key={series.name}
                  type="monotone"
                  dataKey={series.name}
                  stroke={series.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  dot={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
}
