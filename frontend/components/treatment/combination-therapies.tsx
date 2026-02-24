"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import type { TreatmentData } from "@/lib/treatment-data"
import { se } from "date-fns/locale"

export function CombinationTherapies({ data }: { data: TreatmentData }) {
  const [search, setSearch] = useState("")

const lookup =
  data?.combinations?.combinationLookup ?? {}

const searchKey = search.toLowerCase().trim()

const matches =
  searchKey.length === 0
    ? []
    : Object.entries(lookup).filter(([key]) =>
        key.toLowerCase().includes(searchKey)
      )
console.log("COMBINATIONS:", data.combinations)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combination Therapies</CardTitle>
        <CardDescription>
          Co-treatment intelligence showing usage patterns and effectiveness
        </CardDescription>
      </CardHeader>

      <CardContent>

        {/* 📊 CHART (unchanged) */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.combinations.topCombinations}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />

              <XAxis dataKey="therapy" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />

              <Tooltip />
              <Legend />

              <Bar
                dataKey="coUsage"
                name="Co-Usage Rate"
                fill="oklch(0.75 0.18 195)"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="effectiveness"
                name="Reported Effectiveness"
                fill="oklch(0.70 0.17 165)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🔎 SEARCH BELOW CHART */}
        <div className="mt-6 space-y-3">

          <Input
            placeholder="Search combination therapy…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
  <div className="rounded-lg border border-border p-4 text-sm space-y-3">

    {matches.length > 0 ? (
      matches.map(([name, val]) => (
        <div key={name} className="border-b pb-2 last:border-0">

          <p className="font-medium text-foreground">
            {name}
          </p>

          <p className="text-muted-foreground">
            Co-Usage Rate:
            <span className="font-medium text-foreground">
              {" "}{val.coUsage}%
            </span>
          </p>

          <p className="text-muted-foreground">
            Reported Effectiveness:
            <span className="font-medium text-foreground">
              {" "}{val.effectiveness}%
            </span>
          </p>

        </div>
      ))
    ) : (
      <p className="text-muted-foreground">
        No combination data available for this therapy.
      </p>
    )}

  </div>
)}
        </div>
      </CardContent>
    </Card>
  )
}