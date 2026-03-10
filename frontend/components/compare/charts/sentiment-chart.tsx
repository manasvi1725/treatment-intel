"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { TreatmentData } from "@/lib/treatment-data"

interface SentimentComparisonChartProps {
  treatments: TreatmentData[]
}

export function SentimentComparisonChart({
  treatments,
}: SentimentComparisonChartProps) {
  const chartData = treatments.map((treatment) => ({
    name: treatment.name,
    Positive: treatment.sentiment.positive,
    Neutral: treatment.sentiment.neutral,
    Negative: treatment.sentiment.negative,
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Positive" stackId="a" fill="#10b981" />
          <Bar dataKey="Neutral" stackId="a" fill="#6b7280" />
          <Bar dataKey="Negative" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
