"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp, BarChart3, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const height = 48
  const width = 120
  const step = width / (data.length - 1)

  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(
        `/treatment/${searchQuery.trim().toLowerCase().replace(/\s+/g, "-")}`
      )
    }
  }

  return (
    <section className="relative overflow-hidden pb-8 pt-12 lg:pt-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary"
              >
                <Zap className="h-3 w-3" />
                AI-Powered Analytics
              </Badge>
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
              Treatment Intelligence Engine
            </h1>
            <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Transforming Patient Voices into Structured Treatment
              Intelligence. We aggregate public patient discussions from forums,
              blogs, and social media into actionable treatment insights.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative mt-2 max-w-lg">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search treatments, diseases, or therapies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-13 rounded-xl border-border/60 bg-card pl-12 pr-4 text-base shadow-sm transition-shadow focus:shadow-md focus:neon-glow"
              />
            </form>

            <div className="flex flex-wrap gap-2">
              {["Chemotherapy", "IVF", "Knee Replacement", "Immunotherapy"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() =>
                      router.push(
                        `/treatment/${term.toLowerCase().replace(/\s+/g, "-")}`
                      )
                    }
                    className="rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right side - Preview Panel */}
          <div className="relative hidden lg:block">
            <div className="glass rounded-2xl p-6 neon-glow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Live Intelligence Feed
                </h3>
                <Badge variant="secondary" className="text-xs bg-chart-2/10 text-chart-2 border-0">
                  Real-time
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/40 bg-background/60 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-chart-1" />
                    <span className="text-xs text-muted-foreground">
                      Discussion Trend
                    </span>
                  </div>
                  <MiniChart
                    data={[20, 35, 28, 45, 52, 48, 60, 72, 68, 85]}
                    color="oklch(0.75 0.18 195)"
                  />
                </div>

                <div className="rounded-xl border border-border/40 bg-background/60 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-chart-2" />
                    <span className="text-xs text-muted-foreground">
                      Sentiment Score
                    </span>
                  </div>
                  <MiniChart
                    data={[55, 62, 58, 70, 65, 72, 78, 75, 82, 80]}
                    color="oklch(0.70 0.17 165)"
                  />
                </div>

                <div className="col-span-2 rounded-xl border border-border/40 bg-background/60 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Top Signals Today
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        label: "Immunotherapy + Keytruda",
                        change: "+23%",
                        positive: true,
                      },
                      {
                        label: "IVF Side Effects",
                        change: "+18%",
                        positive: false,
                      },
                      {
                        label: "Recovery: Hip Replacement",
                        change: "+12%",
                        positive: true,
                      },
                    ].map((signal) => (
                      <div
                        key={signal.label}
                        className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2"
                      >
                        <span className="text-xs text-foreground">
                          {signal.label}
                        </span>
                        <span
                          className={`text-xs font-medium ${signal.positive ? "text-chart-2" : "text-chart-5"}`}
                        >
                          {signal.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
