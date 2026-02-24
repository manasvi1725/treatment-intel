"use client"

import { Globe, MessageCircle, BookOpen, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { TreatmentData } from "@/lib/treatment-data"

const typeIcons: Record<string, typeof Globe> = {
  Forum: MessageCircle,
  "Social Media": Globe,
  Blog: BookOpen,
}

export function SourceTraceability({ data }: { data: TreatmentData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Source Traceability</CardTitle>
        <CardDescription>
          Forums, blogs, and discussion references powering this intelligence
        </CardDescription>
      </CardHeader>

      {/* ✅ SCROLL ADDED HERE */}
      <CardContent className="max-h-[320px] overflow-y-auto pr-2">
        <div className="flex flex-col gap-3">
          {data.sources.map((source) => {
  const Icon = typeIcons[source.type] || Globe

  return (
    <a
      key={source.name}
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/30 px-4 py-3 transition-all hover:border-primary/30 hover:bg-secondary/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {source.name}
            </span>

            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>

          <span className="text-xs text-muted-foreground">
            {source.discussions.toLocaleString()} discussions
          </span>
        </div>
      </div>

      <Badge variant="secondary" className="text-xs">
        {source.type}
      </Badge>
    </a>
  )
})}
        </div>
      </CardContent>
    </Card>
  )
}