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
import type { TreatmentData } from "@/lib/treatment-data"

interface PageProps {
  params: { slug: string }
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  let response

  try {
    const res = await fetch(
  `https://treatment-intel-1.onrender.com/treatment/${slug}`,  //`http://127.0.0.1:5000/treatment/${slug}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
      }
    )

    if (!res.ok) {
      return (
        <div className="p-10 text-center text-muted-foreground">
          Generating treatment intelligence for <b>{slug}</b>… ⏳
        </div>
      )
    }

    response = await res.json()

  } catch (err) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Connecting to intelligence engine… ⏳
      </div>
    )
  }

  const raw = response.data
const data: TreatmentData = {
  name: raw.treatment,
  slug: raw.treatment,

  summary:
  typeof raw.overview?.summary === "string"
    ? raw.overview.summary
    : raw.overview?.summary?.description ?? "",

procedure:
  typeof raw.overview?.procedure === "string"
    ? raw.overview.procedure
    : raw.overview?.procedure?.description ?? "",

recommended:
  typeof raw.overview?.recommendedFor === "string"
    ? raw.overview.recommendedFor
    : raw.overview?.recommendedFor?.description ?? "",
  stats: {
    sentimentScore: raw.sentiment?.positive ?? 0,
    recoveryTime: "Varies",
    sideEffectSeverity: "Moderate",
    discussionVolume: String(
      raw.sources?.reduce(
        (acc: number, s: any) => acc + (s.discussions || 0),
        0
      ) || 0
    ),
  },

  sideEffects: raw.sideEffects ?? [],

  sentiment: raw.sentiment ?? {
    positive: 0,
    neutral: 0,
    negative: 0,
    emotions: [],
  },

  recovery: raw.recovery?.stages ?? [],

  combinations: {
  topCombinations:
    raw.combinations?.topCombinations?.map((c: any) => ({
      therapy: c.name,
      coUsage: c.coUsage,
      effectiveness: c.effectiveness,
    })) ?? [],

  combinationLookup:
    raw.combinations?.combinationLookup ?? {},
},

  sources: raw.sources ?? [],
}
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
            {data.stats.discussionVolume} patient discussions.
          </p>
        </div>

        {/* Blocks */}
        <div className="flex flex-col gap-6">
          <TreatmentSummary data={data} />
          <TreatmentKeyStats data={data} />
          <SideEffectsChart data={data} />
          <SentimentPanel data={data} />

          <div className="grid gap-6 lg:grid-cols-2">
            <RecoveryTimeline data={data} />
            <CombinationTherapies data={data} />
          </div>

          <SourceTraceability data={data} />
        </div>

      </main>
    </div>
  )
}