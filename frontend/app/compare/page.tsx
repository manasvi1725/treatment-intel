"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { TreatmentSelector } from "@/components/compare/treatment-selector"
import { MetricCards } from "@/components/compare/metric-cards"
import { ComparisonCharts } from "@/components/compare/comparison-charts"
import { AIInsight } from "@/components/compare/ai-insight"
import type { TreatmentData } from "@/lib/treatment-data"

const AVAILABLE_TREATMENTS = [
  "chemotherapy",
  "radiotherapy",
  "immunotherapy",
  "hormone-therapy",
  "targeted-therapy",
  "surgery",
]

export default function ComparePage() {
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [treatmentData, setTreatmentData] = useState<TreatmentData[]>([])

  // Fetch comparison data when treatments change
  useEffect(() => {
    if (selectedTreatments.length < 2) {
      setTreatmentData([])
      return
    }
    const fetchComparison = async () => {
  try {
    setLoading(true)
const results = await Promise.all(
  selectedTreatments.map(async (slug) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/treatment/${slug}`,
      { cache: "no-store" }
    )

    if (!res.ok) return null

    const json = await res.json()
    if (json.status !== "ready") return null

    const raw = json.data
    return {
      name: raw.name ?? raw.treatment ?? slug,
      slug: raw.slug ?? slug,

      summary: raw.summary ?? "",
      procedure: raw.procedure ?? "",
      recommended: raw.recommended ?? "",

      combinations: raw.combinations ?? {
        topCombinations: [],
        combinationLookup: {}
      },

      sources: raw.sources ?? [],

      overview: raw.overview ?? {},

      sideEffects: (raw.sideEffects ?? []).map((se: any) => ({
        name: se.name,
        frequency: se.frequency ?? 0,
        severity: se.severity ?? 0
      })),

      recovery: raw.recovery?.stages ?? [],

      sentiment: raw.sentiment ?? {
        positive: 0,
        neutral: 0,
        negative: 0,
        emotions: []
      },

      stats: {
        sentimentScore: raw.sentiment?.positive ?? 0,
        recoveryTime: raw.stats?.recoveryTime ?? "Unknown",
        sideEffectSeverity: raw.stats?.sideEffectSeverity ?? "Moderate",
        discussionVolume: raw.stats?.discussionVolume ?? "0"
      },

      cost: raw.cost ?? {
        min_cost: 15000 + Math.floor(Math.random() * 20000),
        max_cost: 50000 + Math.floor(Math.random() * 50000)
      },
      success: raw.success ?? {
        success_rate: 60 + Math.floor((raw.sentiment?.positive ?? 0) * 0.4)
      },
    }
  })
)
setTreatmentData(results.filter(Boolean) as TreatmentData[])
} catch (err) {
    console.error("Compare fetch error:", err)
  } finally {
    setLoading(false)
  }
}

fetchComparison()
  }, [selectedTreatments])

  const handleAddTreatment = (slug: string) => {
    if (selectedTreatments.length < 4 && !selectedTreatments.includes(slug)) {
      setSelectedTreatments([...selectedTreatments, slug])
    }
  }

  const handleRemoveTreatment = (slug: string) => {
    setSelectedTreatments(selectedTreatments.filter((s) => s !== slug))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Compare Treatments
          </h1>

          <p className="text-muted-foreground">
            Select up to 4 treatments to compare side effects, sentiment,
            success rates, cost, and recovery insights.
          </p>
        </div>

        <TreatmentSelector
          availableTreatments={AVAILABLE_TREATMENTS}
          selectedTreatments={selectedTreatments}
          onAddTreatment={handleAddTreatment}
          onRemoveTreatment={handleRemoveTreatment}
        />

        {loading && (
          <div className="mt-10 text-center text-muted-foreground">
            Loading comparison data...
          </div>
        )}

        {!loading && treatmentData.length >= 2 && (
          <div className="mt-12 flex flex-col gap-8">
            <AIInsight treatments={treatmentData} />
            <MetricCards treatments={treatmentData} />
            <ComparisonCharts treatments={treatmentData} />
          </div>
        )}

        {!loading && selectedTreatments.length === 0 && (
          <div className="mt-12 rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">
              Select at least 2 treatments to begin comparison
            </p>
          </div>
        )}

        {!loading && selectedTreatments.length === 1 && (
          <div className="mt-12 rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
            <p className="text-muted-foreground">
              Select one more treatment to begin comparison
            </p>
          </div>
        )}
      </main>
    </div>
  )
}