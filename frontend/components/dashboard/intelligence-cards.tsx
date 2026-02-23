"use client"

import { useEffect, useRef, useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  Pill,
  ShieldAlert,
  Timer,
  Flame,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const intelligenceData = [
  {
    title: "Most Discussed Treatments",
    icon: Flame,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    items: [
      { name: "Immunotherapy", value: "142K", trend: 12, up: true },
      { name: "Chemotherapy", value: "128K", trend: 3, up: false },
      { name: "Physical Therapy", value: "98K", trend: 8, up: true },
    ],
  },
  {
    title: "Highest Side-Effect Burden",
    icon: AlertTriangle,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    items: [
      { name: "Chemotherapy", value: "87%", trend: 2, up: true },
      { name: "Radiation Therapy", value: "72%", trend: 5, up: false },
      { name: "Corticosteroids", value: "68%", trend: 1, up: true },
    ],
  },
  {
    title: "Fastest Recovery Treatments",
    icon: Timer,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    items: [
      { name: "Arthroscopy", value: "2.1 wk", trend: 15, up: true },
      { name: "LASIK", value: "1.2 wk", trend: 3, up: true },
      { name: "Dental Implants", value: "3.4 wk", trend: 7, up: true },
    ],
  },
  {
    title: "Most Positive Sentiment",
    icon: Heart,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    items: [
      { name: "LASIK Surgery", value: "94%", trend: 5, up: true },
      { name: "IVF Success Stories", value: "89%", trend: 12, up: true },
      { name: "CBD Therapy", value: "86%", trend: 3, up: false },
    ],
  },
  {
    title: "Rising Combination Therapies",
    icon: Pill,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    items: [
      { name: "Immuno + Chemo", value: "+34%", trend: 34, up: true },
      { name: "PT + Acupuncture", value: "+21%", trend: 21, up: true },
      { name: "HRT + Counseling", value: "+18%", trend: 18, up: true },
    ],
  },
  {
    title: "Misinformation Risk Alerts",
    icon: ShieldAlert,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    items: [
      { name: "Ivermectin Claims", value: "High", trend: 45, up: true },
      { name: "Bleach Therapy", value: "Critical", trend: 12, up: true },
      { name: "Alkaline Cures", value: "Medium", trend: 8, up: false },
    ],
  },
]

function FadeInCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function IntelligenceCards() {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Global Intelligence Dashboard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time aggregated treatment signals from patient communities
            </p>
          </div>
          <Badge variant="outline" className="hidden gap-1.5 md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-chart-2" />
            Live
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {intelligenceData.map((card, idx) => (
            <FadeInCard key={card.title} delay={idx * 100}>
              <div className="group h-full rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg dark:hover:neon-glow">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {card.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {card.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2.5"
                    >
                      <span className="text-sm text-foreground">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground font-mono">
                          {item.value}
                        </span>
                        <div
                          className={`flex items-center gap-0.5 text-xs ${
                            item.up ? "text-chart-2" : "text-chart-5"
                          }`}
                        >
                          {item.up ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{item.trend}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInCard>
          ))}
        </div>
      </div>
    </section>
  )
}
