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
} from "recharts"

import { TreatmentData } from "@/lib/treatment-data"

interface SideEffectsComparisonChartProps {
  treatments: TreatmentData[]
}

export function SideEffectsComparisonChart({
  treatments,
}: SideEffectsComparisonChartProps) {

  if (!treatments || treatments.length === 0) return null

  // collect all side effects
const allEffects = treatments.flatMap((t) =>
  t.sideEffects.map((se) => se.name.trim().toLowerCase())
)

// unique effects
const uniqueEffects = [...new Set(allEffects)]

// take top 8
const effectsToShow = uniqueEffects.slice(0, 8)
  // Build chart dataset
  const chartData = effectsToShow.map((effectName) => {

    const row: Record<string, string | number> = {
      name: effectName,
    }

    treatments.forEach((treatment) => {
      const effect = treatment.sideEffects.find(
        (se) => se.name?.toLowerCase().trim() === effectName.toLowerCase().trim()
      )

    row[treatment.slug] = effect?.frequency ?? 0    
    })

    return row
  })

  const colors = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b"]
  console.log("CHART DATA:", chartData)
console.log("TREATMENTS:", treatments)

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
          />

          <YAxis />

          <Tooltip />

          <Legend />

          {treatments.map((treatment, idx) => (
            <Bar
              key={treatment.slug}
              dataKey={treatment.name}
              fill={colors[idx % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}