"use client"

import { FileText, Stethoscope, CalendarCheck } from "lucide-react"
import type { TreatmentData } from "@/lib/treatment-data"

export function TreatmentSummary({ data }: { data: TreatmentData }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Treatment Summary
      </h2>
      <div className="flex flex-col gap-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-chart-1/10">
            <FileText className="h-4.5 w-4.5 text-chart-1" />
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-foreground">
              What is {data.name}?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.summary}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-chart-2/10">
            <Stethoscope className="h-4.5 w-4.5 text-chart-2" />
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-foreground">
              Procedure Overview
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.procedure}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
            <CalendarCheck className="h-4.5 w-4.5 text-chart-3" />
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-foreground">
              When Recommended
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.recommended}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
