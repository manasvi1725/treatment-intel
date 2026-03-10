"use client"

import { TreatmentData } from "@/lib/treatment-data"
import { Card } from "@/components/ui/card"

interface MetricCardsProps {
  treatments: TreatmentData[]
}

export function MetricCards({ treatments }: MetricCardsProps) {
  const calculateMetrics = (treatment: TreatmentData) => {

  const successRate =
    60 + Math.floor(((treatment.sentiment?.positive ?? 0) / 100) * 40)

  const avgSideEffectSeverity =
    treatment.sideEffects?.length
      ? treatment.sideEffects.reduce((sum, se) => sum + se.severity, 0) /
        treatment.sideEffects.length
      : 0

  const costMin = treatment.cost?.min_cost ?? 0
  const costMax = treatment.cost?.max_cost ?? 0

  return {
    successRate,
    avgSideEffectSeverity,
    costMin,
    costMax
  }
}
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {treatments.map((treatment, index) => {
          const metrics = calculateMetrics(treatment)

          return (
            <Card key={`${treatment.name}-${index}`} className="flex flex-col gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Treatment
              </p>
              <h3 className="text-lg font-bold text-foreground">
                {treatment.name}
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-accent">
                  {metrics.successRate}%
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Cost Range</p>
                <p className="text-sm font-semibold text-foreground">
                  ${(metrics.costMin / 1000).toFixed(0)}K - $
                  {(metrics.costMax / 1000).toFixed(0)}K
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Avg Side Effect Severity
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{
                        width: `${metrics.avgSideEffectSeverity}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {metrics.avgSideEffectSeverity}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
