"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

import { TreatmentData } from "@/lib/treatment-data"

interface CostComparisonChartProps {
  treatments: TreatmentData[]
}

export function CostComparisonChart({
  treatments,
}: CostComparisonChartProps) {

  const colors = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b"]

  const chartData = treatments.map((t) => {

    const min = t.cost?.min_cost ?? 0
    const max = t.cost?.max_cost ?? 0

    return {
      name: t.name,
      minCost: min,
      range: max - min,
      realMin: min,
      realMax: max
    }
  })

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis
            tickFormatter={(v) => `$${v.toLocaleString()}`}
          />

          <Tooltip
            formatter={(value:any, name:any, props:any) => {

              const { realMin, realMax } = props.payload

              return [
                `Min: $${realMin.toLocaleString()} — Max: $${realMax.toLocaleString()}`,
                "Cost Range"
              ]
            }}
          />

          {/* invisible offset */}
          <Bar dataKey="minCost" stackId="a" fill="transparent" />

          {/* visible range */}
          <Bar dataKey="range" stackId="a">

            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}

          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}