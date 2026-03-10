"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { TreatmentData } from "@/lib/treatment-data"

interface KnowledgeGraphProps {
  treatments: TreatmentData[]
}

export default function KnowledgeGraph({ treatments }: KnowledgeGraphProps) {

  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {

    if (!svgRef.current) return

    console.log("KG DATA:", treatments)

    const width = 900
    const height = 420

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const nodes: any[] = []
    const links: any[] = []

    treatments.forEach((treatment: any) => {

      const tName = treatment.name || treatment.slug

      nodes.push({
        id: tName,
        type: "treatment"
      })

      // --- STEP 1 & 2: find knowledgeNodes safely
      const kg =
        treatment.knowledgeNodes ||
        treatment.overview?.knowledgeNodes ||
        treatment.data?.knowledgeNodes ||
        {}

      // --- STEP 3: categories
      const categories = [
        { key: "side_effects", type: "sideEffect" },
        { key: "outcomes", type: "outcome" },
        { key: "targets", type: "target" }
      ]

      categories.forEach(cat => {

        const arr = kg?.[cat.key] ?? []

        arr.slice(0, 10).forEach((item: any) => {

          const nodeId = item.name.toLowerCase()

          nodes.push({
            id: nodeId,
            type: cat.type,
            value: item.value
          })

          links.push({
            source: tName,
            target: nodeId
          })

        })

      })

    })

    // --- STEP 4: remove duplicates
    const uniqueNodes = Array.from(
      new Map(nodes.map(n => [n.id, n])).values()
    )

    const simulation = d3.forceSimulation(uniqueNodes as any)
      .force(
        "link",
        d3.forceLink(links)
          .id((d: any) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))

    const link = svg
      .append("g")
      .attr("stroke", "#bbb")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 1.5)

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(uniqueNodes)
      .enter()
      .append("circle")
      .attr("r", d => d.type === "treatment" ? 18 : 10)
      .attr("fill", d => {

        if (d.type === "treatment") return "#3b82f6"
        if (d.type === "sideEffect") return "#ec4899"
        if (d.type === "outcome") return "#10b981"
        if (d.type === "target") return "#f59e0b"

        return "#999"
      })

    // -------- Hover Tooltip --------

    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#111")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)

    node
      .on("mouseover", (event, d: any) => {

        tooltip
          .style("opacity", 1)
          .html(d.id)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")

      })
      .on("mousemove", (event) => {

        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")

      })
      .on("mouseout", () => {

        tooltip.style("opacity", 0)

      })

    node.call(
      d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
    )

    simulation.on("tick", () => {

      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)

    })

  }, [treatments])

  return (
    <div className="w-full h-[420px]">
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  )
}