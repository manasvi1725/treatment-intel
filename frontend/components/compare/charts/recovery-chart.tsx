"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { TreatmentData } from "@/lib/treatment-data"

interface RecoveryComparisonChartProps {
  treatments: TreatmentData[]
}

export function RecoveryComparisonChart({
  treatments,
}: RecoveryComparisonChartProps) {

  if (!treatments || treatments.length === 0) return null

  // Use stages from first treatment safely
  const stages = treatments.find(t => t.recovery?.length)?.recovery ?? []

  const chartData = stages.map((stage: any, stageIdx: number) => {

    const row: Record<string, string | number> = {
      name: stage.stage ?? `Stage ${stageIdx + 1}`,
    }

    treatments.forEach((treatment) => {

      const recoveryStages = treatment.recovery ?? []

      const recoveryStage = recoveryStages[stageIdx]

      row[treatment.name] = recoveryStage?.completion ?? null

    })

    return row
  })

  const colors = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b"]

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(229, 231, 235, 0.1)"
          />

          <XAxis
            dataKey="name"
            stroke="rgba(229, 231, 235, 0.5)"
            style={{ fontSize: "12px" }}
          />

          <YAxis
            domain={[0, 100]}
            stroke="rgba(229, 231, 235, 0.5)"
            label={{ value: "Recovery %", angle: -90, position: "insideLeft" }}
          />

          <Tooltip
            formatter={(value: number) => `${value}%`}
          />

          <Legend />

          {treatments.map((treatment, idx) => (
            <Line
              key={`${treatment.name}-${idx}`}
              type="monotone"
              dataKey={treatment.name}
              stroke={colors[idx % colors.length]}
              connectNulls
              strokeWidth={2.5}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          ))}

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}