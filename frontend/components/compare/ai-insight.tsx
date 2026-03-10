"use client"

import { TreatmentData } from "@/lib/treatment-data"
import { Lightbulb } from "lucide-react"

interface AIInsightProps {
  treatments: TreatmentData[]
}

export function AIInsight({ treatments }: AIInsightProps) {
  const generateInsight = () => {
    if (treatments.length < 2) return ""

    // Find treatment with highest success rate
    const successRates = treatments.map((t) => ({
      name: t.name,
      rate: 60 + Math.floor(((t.sentiment?.positive ?? 0) / 100) * 40),
    }))

    const highestSuccess = successRates.reduce((a, b) =>
      a.rate > b.rate ? a : b
    )

    // Find treatment with most side effects
    const sideEffectCounts = treatments.map((t) => ({
      name: t.name,
      count: t.sideEffects.length,
      avgSeverity:
        t.sideEffects.reduce((sum, se) => sum + se.severity, 0) /
        t.sideEffects.length,
    }))

    const mostSideEffects = sideEffectCounts.reduce((a, b) =>
      a.count > b.count ? a : b
    )

    // Find treatment with best sentiment
    const sentiments = treatments.map((t) => ({
      name: t.name,
      positivity: t.sentiment.positive,
    }))

    const bestSentiment = sentiments.reduce((a, b) =>
      a.positivity > b.positivity ? a : b
    )

    return `${highestSuccess.name} shows the highest potential success rate while ${mostSideEffects.name} reports more frequent side effects. ${bestSentiment.name} demonstrates the most positive patient sentiment in discussions.`
  }

  return (
    <div className="flex gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6">
      <div className="flex-shrink-0">
        <Lightbulb className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="mb-2 font-semibold text-foreground">AI Insight</h3>
        <p className="text-sm text-muted-foreground">{generateInsight()}</p>
      </div>
    </div>
  )
}
