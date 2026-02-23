"use client"

import Link from "next/link"
import {
  Dna,
  Baby,
  Bone,
  HeartPulse,
  Sparkles,
  ArrowRight,
} from "lucide-react"

const categories = [
  {
    title: "Cancer Treatments",
    description:
      "Immunotherapy, chemotherapy, radiation insights from patient communities",
    icon: Dna,
    slug: "cancer-treatments",
    count: "4,200+",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Fertility Treatments",
    description:
      "IVF, IUI, egg freezing experiences and outcome intelligence",
    icon: Baby,
    slug: "ivf",
    count: "2,800+",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Orthopedic Procedures",
    description:
      "Joint replacements, arthroscopy, spinal surgery recovery data",
    icon: Bone,
    slug: "knee-replacement",
    count: "3,100+",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Chronic Disease Therapies",
    description:
      "Diabetes, autoimmune, cardiovascular treatment pattern analysis",
    icon: HeartPulse,
    slug: "chronic-disease",
    count: "5,600+",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    title: "Cosmetic Treatments",
    description:
      "LASIK, dermal fillers, rhinoplasty satisfaction and outcomes",
    icon: Sparkles,
    slug: "lasik",
    count: "1,900+",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
]

export function CategoryGrid() {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Explore by Category
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse treatment intelligence organized by medical specialty
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={`/treatment/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg dark:hover:neon-glow"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.bgColor}`}
                >
                  <cat.icon className={`h-5 w-5 ${cat.color}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground font-mono">
                  {cat.count} discussions
                </span>
              </div>

              <h3 className="mb-1.5 text-base font-semibold text-foreground">
                {cat.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {cat.description}
              </p>

              <div className="flex items-center gap-1.5 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
                Explore Intelligence
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
