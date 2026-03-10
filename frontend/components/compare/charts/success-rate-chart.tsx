"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

import { TreatmentData } from "@/lib/treatment-data"

interface SuccessRateChartProps {
  treatments: TreatmentData[]
}

export function SuccessRateChart({ treatments }: SuccessRateChartProps) {

  const chartData = treatments.map((treatment) => ({
    name: treatment.name,
    "Success Rate": treatment.success?.success_rate ?? 0,
  }))

  const colors = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b"]

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis domain={[0, 100]} />

          <Tooltip formatter={(value) => `${value}%`} />

          <Bar dataKey="Success Rate" radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}