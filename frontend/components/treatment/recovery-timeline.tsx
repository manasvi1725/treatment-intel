"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { TreatmentData } from "@/lib/treatment-data"

export function RecoveryTimeline({ data }: { data: TreatmentData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Timeline</CardTitle>
        <CardDescription>
          Stage-based recovery visualization from patient-reported data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col gap-6">
          {data.recovery.map((stage, idx) => (
            <div key={stage.stage} className="relative flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                {stage.completion === 100 ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-chart-2" />
                ) : (
                  <Circle className="h-6 w-6 shrink-0 text-primary" />
                )}
                {idx < data.recovery.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-border" />
                )}
              </div>

              {/* Stage content */}
              <div className="flex-1 pb-2">
                <div className="mb-1 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    {stage.stage}
                  </h4>
                  <span className="text-xs font-medium text-primary font-mono">
                    {stage.duration}
                  </span>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">
                  {stage.description}
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={stage.completion} className="h-2 flex-1" />
                  <span className="text-xs font-medium text-muted-foreground font-mono">
                    {stage.completion}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
