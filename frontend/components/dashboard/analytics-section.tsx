"use client"

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const volumeData = [
  { month: "Jan", discussions: 18200, positive: 12400, negative: 5800 },
  { month: "Feb", discussions: 22500, positive: 15800, negative: 6700 },
  { month: "Mar", discussions: 25800, positive: 18200, negative: 7600 },
  { month: "Apr", discussions: 29100, positive: 20500, negative: 8600 },
  { month: "May", discussions: 34600, positive: 24800, negative: 9800 },
  { month: "Jun", discussions: 31200, positive: 22400, negative: 8800 },
  { month: "Jul", discussions: 38400, positive: 28200, negative: 10200 },
  { month: "Aug", discussions: 42100, positive: 31500, negative: 10600 },
  { month: "Sep", discussions: 39800, positive: 29600, negative: 10200 },
  { month: "Oct", discussions: 45200, positive: 34100, negative: 11100 },
  { month: "Nov", discussions: 48900, positive: 37200, negative: 11700 },
  { month: "Dec", discussions: 52400, positive: 40100, negative: 12300 },
]

const sentimentData = [
  { category: "Very Positive", value: 28, fill: "oklch(0.70 0.17 165)" },
  { category: "Positive", value: 35, fill: "oklch(0.75 0.18 195)" },
  { category: "Neutral", value: 18, fill: "oklch(0.65 0.14 250)" },
  { category: "Negative", value: 13, fill: "oklch(0.78 0.14 80)" },
  { category: "Very Negative", value: 6, fill: "oklch(0.65 0.20 25)" },
]

const heatmapData = [
  { effect: "Nausea", mild: 45, moderate: 30, severe: 15, critical: 5 },
  { effect: "Fatigue", mild: 35, moderate: 40, severe: 18, critical: 3 },
  { effect: "Pain", mild: 25, moderate: 35, severe: 25, critical: 8 },
  { effect: "Dizziness", mild: 50, moderate: 25, severe: 10, critical: 2 },
  { effect: "Insomnia", mild: 40, moderate: 30, severe: 12, critical: 4 },
  { effect: "Anxiety", mild: 30, moderate: 35, severe: 20, critical: 6 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="text-xs text-muted-foreground">
          <span style={{ color: item.color }}>{item.name}</span>:{" "}
          <span className="font-mono font-medium text-foreground">
            {item.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  )
}

export function AnalyticsSection() {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Analytics Visualization
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Deep analysis of treatment discussion patterns and outcomes
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Discussion Volume Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Discussion Volume Trends</CardTitle>
              <CardDescription>
                Monthly patient discussion activity across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="oklch(0.75 0.18 195)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="oklch(0.75 0.18 195)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="oklch(0.65 0.20 25)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="oklch(0.65 0.20 25)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/40"
                    />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: "oklch(0.5 0.02 240)" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "oklch(0.5 0.02 240)" }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      name="Positive"
                      stroke="oklch(0.75 0.18 195)"
                      fill="url(#posGrad)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      name="Negative"
                      stroke="oklch(0.65 0.20 25)"
                      fill="url(#negGrad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
              <CardDescription>
                Overall patient sentiment breakdown across treatments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/40"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "oklch(0.5 0.02 240)", fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={100}
                      tick={{ fill: "oklch(0.5 0.02 240)", fontSize: 12 }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                    />
                    <Bar dataKey="value" name="Percentage" radius={[0, 6, 6, 0]}>
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Side-Effect Severity Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Side-Effect Severity Heatmap</CardTitle>
              <CardDescription>
                Distribution of side effects by severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="pb-3 text-left font-medium text-muted-foreground">
                        Effect
                      </th>
                      <th className="pb-3 text-center font-medium text-muted-foreground">
                        Mild
                      </th>
                      <th className="pb-3 text-center font-medium text-muted-foreground">
                        Moderate
                      </th>
                      <th className="pb-3 text-center font-medium text-muted-foreground">
                        Severe
                      </th>
                      <th className="pb-3 text-center font-medium text-muted-foreground">
                        Critical
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row) => (
                      <tr key={row.effect} className="border-b border-border/30">
                        <td className="py-2.5 font-medium text-foreground">
                          {row.effect}
                        </td>
                        {(["mild", "moderate", "severe", "critical"] as const).map(
                          (severity) => {
                            const val = row[severity]
                            const maxVal = 50
                            const intensity = val / maxVal
                            const colors: Record<string, string> = {
                              mild: `oklch(0.70 0.17 165 / ${0.2 + intensity * 0.6})`,
                              moderate: `oklch(0.78 0.14 80 / ${0.2 + intensity * 0.6})`,
                              severe: `oklch(0.65 0.20 25 / ${0.2 + intensity * 0.6})`,
                              critical: `oklch(0.55 0.22 25 / ${0.3 + intensity * 0.7})`,
                            }
                            return (
                              <td key={severity} className="py-2.5 text-center">
                                <span
                                  className="inline-flex h-9 w-14 items-center justify-center rounded-md text-xs font-mono font-semibold text-foreground"
                                  style={{ backgroundColor: colors[severity] }}
                                >
                                  {val}%
                                </span>
                              </td>
                            )
                          }
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
