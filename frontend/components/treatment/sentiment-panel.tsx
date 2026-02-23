"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { TreatmentData } from "@/lib/treatment-data"

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
}) {
  if (!active || !payload?.[0]) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">
        {payload[0].name}:{" "}
        <span className="font-mono font-medium text-foreground">
          {payload[0].value}%
        </span>
      </p>
    </div>
  )
}

export function SentimentPanel({ data }: { data: TreatmentData }) {
  const pieData = [
    { name: "Positive", value: data.sentiment.positive, fill: "oklch(0.70 0.17 165)" },
    { name: "Neutral", value: data.sentiment.neutral, fill: "oklch(0.65 0.14 250)" },
    { name: "Negative", value: data.sentiment.negative, fill: "oklch(0.65 0.20 25)" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Sentiment Analysis</CardTitle>
        <CardDescription>
          Positive vs negative ratios and emotional signals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              Sentiment Breakdown
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Signals */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">
              Emotional Signals
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sentiment.emotions} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fill: "oklch(0.5 0.02 240)", fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={80}
                    tick={{ fill: "oklch(0.5 0.02 240)", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    name="Intensity"
                    fill="oklch(0.75 0.18 195)"
                    radius={[0, 6, 6, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
