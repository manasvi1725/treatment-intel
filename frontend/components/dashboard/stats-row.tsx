"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquareText, Pill, AlertTriangle, Clock } from "lucide-react"

const stats = [
  {
    icon: MessageSquareText,
    value: 2_847_000,
    label: "Discussions Analyzed",
    suffix: "+",
    color: "text-chart-1",
  },
  {
    icon: Pill,
    value: 12_400,
    label: "Treatments Indexed",
    suffix: "+",
    color: "text-chart-2",
  },
  {
    icon: AlertTriangle,
    value: 48_700,
    label: "Side Effects Mapped",
    suffix: "+",
    color: "text-chart-4",
  },
  {
    icon: Clock,
    value: 6_200,
    label: "Recovery Timelines Modeled",
    suffix: "+",
    color: "text-chart-3",
  },
]

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

function AnimatedValue({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    const duration = 1500
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [isVisible, value])

  return (
    <div ref={ref} className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
      {formatNumber(display)}
      {suffix}
    </div>
  )
}

export function StatsRow() {
  return (
    <section className="relative -mt-2 pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass group relative rounded-xl p-5 transition-all hover:neon-glow"
            >
              <div className="mb-3 flex items-center gap-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <AnimatedValue value={stat.value} suffix={stat.suffix} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
