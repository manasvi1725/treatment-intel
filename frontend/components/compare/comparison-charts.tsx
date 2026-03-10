"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SideEffectsComparisonChart } from "./charts/side-effects-chart"
import { SentimentComparisonChart } from "./charts/sentiment-chart"
import { SuccessRateChart } from "./charts/success-rate-chart"
import { CostComparisonChart } from "./charts/cost-chart"
import { RecoveryComparisonChart } from "./charts/recovery-chart"
import { TreatmentData } from "@/lib/treatment-data"
import KnowledgeGraph from "./charts/knowledge-graph"

interface ComparisonChartsProps {
  treatments: TreatmentData[]
}

export function ComparisonCharts({ treatments }: ComparisonChartsProps) {
  const [activeTab, setActiveTab] = useState("side-effects")

  if (!treatments || treatments.length < 2) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-bold text-foreground">
          Detailed Comparison
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-6">
            <TabsTrigger value="side-effects" className="text-xs">
              Side Effects
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="text-xs">
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="success" className="text-xs">
              Success Rate
            </TabsTrigger>
            <TabsTrigger value="cost" className="text-xs">
              Cost
            </TabsTrigger>
            <TabsTrigger value="recovery" className="text-xs">
              Recovery
            </TabsTrigger>
            <TabsTrigger value="knowledge-graph" className="text-xs">
              Knowledge Graph
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="side-effects" className="mt-0">
              <SideEffectsComparisonChart treatments={treatments} />
            </TabsContent>

            <TabsContent value="sentiment" className="mt-0">
              <SentimentComparisonChart treatments={treatments} />
            </TabsContent>

            <TabsContent value="success" className="mt-0">
              <SuccessRateChart treatments={treatments} />
            </TabsContent>

            <TabsContent value="cost" className="mt-0">
              <CostComparisonChart treatments={treatments} />
            </TabsContent>

            <TabsContent value="recovery" className="mt-0">
              <RecoveryComparisonChart treatments={treatments} />
            </TabsContent>

            <TabsContent value="knowledge-graph" className="mt-0">
              <KnowledgeGraph treatments={treatments} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}