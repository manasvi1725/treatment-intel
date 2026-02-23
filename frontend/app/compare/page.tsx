"use client"

import { GitCompareArrows } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 lg:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <GitCompareArrows className="h-8 w-8 text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Treatment Comparison
            </h1>
            <p className="max-w-md text-muted-foreground">
              Compare treatment intelligence side-by-side. Select two or more
              treatments to analyze differences in sentiment, side effects,
              recovery timelines, and more.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            Coming Soon
          </Badge>
        </div>
      </main>
    </div>
  )
}
