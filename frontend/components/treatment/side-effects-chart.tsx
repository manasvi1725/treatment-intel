"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { TreatmentData } from "@/lib/treatment-data"

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span style={{ color: item.color }}>{item.name}</span>:{" "}
          <span className="font-mono font-medium text-foreground">
            {item.value}%
          </span>
        </p>
      ))}
    </div>
  )
}

export function SideEffectsChart({ data }: { data: TreatmentData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Side Effects Intelligence</CardTitle>
        <CardDescription>
          Frequency and severity of reported side effects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.sideEffects} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/40"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "oklch(0.5 0.02 240)", fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: "oklch(0.5 0.02 240)", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="frequency"
                name="Frequency"
                fill="oklch(0.75 0.18 195)"
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
              <Bar
                dataKey="severity"
                name="Severity"
                fill="oklch(0.65 0.20 25)"
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
