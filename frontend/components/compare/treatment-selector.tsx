"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TreatmentSelectorProps {
  availableTreatments: string[]
  selectedTreatments: string[]
  onAddTreatment: (slug: string) => void
  onRemoveTreatment: (slug: string) => void
}

export function TreatmentSelector({
  availableTreatments,
  selectedTreatments,
  onAddTreatment,
  onRemoveTreatment,
}: TreatmentSelectorProps) {
  const unselectedTreatments = availableTreatments.filter(
    (t) => !selectedTreatments.includes(t)
  )

  const formatName = (slug: string) =>
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">
          Select Treatments to Compare
        </label>
        <div className="flex gap-3">
          <Select onValueChange={onAddTreatment} value="">
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Add a treatment..." />
            </SelectTrigger>
            <SelectContent>
              {unselectedTreatments.map((treatment) => (
                <SelectItem key={treatment} value={treatment}>
                  {formatName(treatment)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTreatments.length >= 4 && (
            <div className="flex items-center text-xs text-muted-foreground">
              Max 4 treatments
            </div>
          )}
        </div>
      </div>

      {selectedTreatments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTreatments.map((slug) => (
            <div
              key={slug}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5"
            >
              <span className="text-sm font-medium text-foreground">
                {formatName(slug)}
              </span>
              <button
                onClick={() => onRemoveTreatment(slug)}
                className="rounded hover:bg-primary/20"
                aria-label={`Remove ${formatName(slug)}`}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
