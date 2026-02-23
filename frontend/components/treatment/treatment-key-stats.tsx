"use client"

import { Heart, Clock, AlertTriangle, MessageSquareText } from "lucide-react"
import type { TreatmentData } from "@/lib/treatment-data"

export function TreatmentKeyStats({ data }: { data: TreatmentData }) {
  const stats = [
    {
      icon: Heart,
      label: "Sentiment Score",
      value: `${data.stats.sentimentScore}%`,
      description: "Based on patient discussions",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      ring:
        data.stats.sentimentScore > 70
          ? "ring-chart-2/30"
          : data.stats.sentimentScore > 50
            ? "ring-chart-4/30"
            : "ring-chart-5/30",
    },
    {
      icon: Clock,
      label: "Recovery Time",
      value: data.stats.recoveryTime,
      description: "Average reported duration",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      ring: "ring-chart-2/30",
    },
    {
      icon: AlertTriangle,
      label: "Side-Effect Severity",
      value: data.stats.sideEffectSeverity,
      description: "Overall severity rating",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      ring: "ring-chart-4/30",
    },
    {
      icon: MessageSquareText,
      label: "Discussion Volume",
      value: data.stats.discussionVolume,
      description: "Total discussions analyzed",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      ring: "ring-chart-3/30",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 dark:hover:neon-glow"
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <div className="mb-1 text-2xl font-bold text-foreground font-mono">
            {stat.value}
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            {stat.label}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground/70">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  )
}
