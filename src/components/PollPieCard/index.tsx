'use client';

import Link from "next/link";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import { Poll } from '@/payload-types'

interface PieSlice {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export type CardPollData = Pick<Poll, 'slug' | 'title' | 'statistics'>

interface PollPieCardProps {
  doc?: CardPollData;
  chartNum?: number;
}

export default function PollPieCard({ doc, chartNum = 0 }: PollPieCardProps) {
  const pieChart = doc?.statistics?.pieCharts?.[chartNum];
  if (!pieChart) return null;

  const DEFAULT_COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
    "#8dd1e1",
    "#d88884",
  ];

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    const offset = 8;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const newCx = cx + cos * offset;
    const newCy = cy + sin * offset;

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
    );
  };
  if (!pieChart || !pieChart.data?.length) return null;
  return (
    <Link href={`/polls/${doc.slug}`} className="block">
      <div className="aspect-square w-full border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-neutral-900 flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-center flex-shrink-0">
          {doc.title}
        </h2>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
              data={pieChart.data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              activeShape={renderActiveShape}
              paddingAngle={1}
            >
              {pieChart.data.map((slice, i) => (
                <Cell
                  key={i}
                  fill={slice.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>


              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Link>
  );
}
