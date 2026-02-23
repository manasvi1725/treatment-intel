"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/dashboard/hero-section"
import { StatsRow } from "@/components/dashboard/stats-row"
import { IntelligenceCards } from "@/components/dashboard/intelligence-cards"
import { AnalyticsSection } from "@/components/dashboard/analytics-section"
import { CategoryGrid } from "@/components/dashboard/category-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsRow />
        <IntelligenceCards />
        <AnalyticsSection />
        <CategoryGrid />
      </main>
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground lg:px-6">
          Treatment Intelligence Engine. AI-powered patient discussion analytics platform.
        </div>
      </footer>
    </div>
  )
}
