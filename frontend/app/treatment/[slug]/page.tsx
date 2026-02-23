"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { TreatmentSummary } from "@/components/treatment/treatment-summary"
import { TreatmentKeyStats } from "@/components/treatment/treatment-key-stats"
import { SideEffectsChart } from "@/components/treatment/side-effects-chart"
import { SentimentPanel } from "@/components/treatment/sentiment-panel"
import { RecoveryTimeline } from "@/components/treatment/recovery-timeline"
import { CombinationTherapies } from "@/components/treatment/combination-therapies"
import { SourceTraceability } from "@/components/treatment/source-traceability"
import { getTreatmentData } from "@/lib/treatment-data"

export default function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const data = getTreatmentData(slug)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              {data.name}
            </h1>
            <Badge className="bg-primary/10 text-primary border-0">
              Deep Dive
            </Badge>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Comprehensive treatment intelligence aggregated from{" "}
            {data.stats.discussionVolume} patient discussions across forums,
            blogs, and social media.
          </p>
        </div>

        {/* Sequential intelligence blocks */}
        <div className="flex flex-col gap-6">
          {/* Block 1 - Summary */}
          <TreatmentSummary data={data} />

          {/* Block 2 - Key Stats */}
          <TreatmentKeyStats data={data} />

          {/* Block 3 - Side Effects */}
          <SideEffectsChart data={data} />

          {/* Block 4 - Sentiment */}
          <SentimentPanel data={data} />

          {/* Block 5 - Recovery + Block 6 - Combinations */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RecoveryTimeline data={data} />
            <CombinationTherapies data={data} />
          </div>

          {/* Block 7 - Sources */}
          <SourceTraceability data={data} />
        </div>
      </main>

      <footer className="mt-12 border-t border-border/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground lg:px-6">
          Treatment Intelligence Engine. AI-powered patient discussion analytics platform.
        </div>
      </footer>
    </div>
  )
}
