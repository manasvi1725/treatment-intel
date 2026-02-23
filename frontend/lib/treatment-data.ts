export interface TreatmentData {
  name: string
  slug: string
  summary: string
  procedure: string
  recommended: string
  stats: {
    sentimentScore: number
    recoveryTime: string
    sideEffectSeverity: string
    discussionVolume: string
  }
  sideEffects: Array<{
    name: string
    frequency: number
    severity: number
  }>
  sentiment: {
    positive: number
    neutral: number
    negative: number
    emotions: Array<{ label: string; value: number }>
  }
  recovery: Array<{
    stage: string
    duration: string
    description: string
    completion: number
  }>
  combinations: Array<{
    therapy: string
    coUsage: number
    effectiveness: number
  }>
  sources: Array<{
    name: string
    type: string
    discussions: number
    url: string
  }>
}

const defaultTreatment: TreatmentData = {
  name: "Chemotherapy",
  slug: "chemotherapy",
  summary:
    "Chemotherapy is a type of cancer treatment that uses drugs to destroy cancer cells. It works by stopping or slowing the growth of cancer cells, which grow and divide quickly. Chemotherapy can be used alone or in combination with other treatments like surgery, radiation, or immunotherapy.",
  procedure:
    "Administered intravenously (IV), orally, or through injection. Treatment cycles typically run 2-6 months with rest periods between sessions to allow the body to recover. Protocols vary based on cancer type and stage.",
  recommended:
    "Recommended for various types of cancer including breast, lung, colorectal, and lymphomas. Often used when cancer has spread or as adjuvant therapy after surgery to reduce recurrence risk.",
  stats: {
    sentimentScore: 62,
    recoveryTime: "3-6 months",
    sideEffectSeverity: "High",
    discussionVolume: "128K",
  },
  sideEffects: [
    { name: "Nausea", frequency: 78, severity: 72 },
    { name: "Fatigue", frequency: 89, severity: 68 },
    { name: "Hair Loss", frequency: 65, severity: 55 },
    { name: "Appetite Loss", frequency: 72, severity: 48 },
    { name: "Neuropathy", frequency: 45, severity: 78 },
    { name: "Mouth Sores", frequency: 38, severity: 62 },
    { name: "Cognitive Issues", frequency: 42, severity: 58 },
    { name: "Immune Weakness", frequency: 82, severity: 85 },
  ],
  sentiment: {
    positive: 38,
    neutral: 24,
    negative: 38,
    emotions: [
      { label: "Hope", value: 42 },
      { label: "Anxiety", value: 68 },
      { label: "Gratitude", value: 35 },
      { label: "Fear", value: 55 },
      { label: "Resilience", value: 48 },
      { label: "Frustration", value: 52 },
    ],
  },
  recovery: [
    {
      stage: "Active Treatment",
      duration: "2-6 months",
      description: "Undergoing chemo cycles with periodic rest periods",
      completion: 100,
    },
    {
      stage: "Immediate Recovery",
      duration: "2-4 weeks",
      description: "Acute side effects peak and begin resolving",
      completion: 85,
    },
    {
      stage: "Short-term Recovery",
      duration: "1-3 months",
      description: "Energy returning, blood counts normalizing",
      completion: 65,
    },
    {
      stage: "Long-term Recovery",
      duration: "6-12 months",
      description: "Full immune system and cognitive recovery",
      completion: 40,
    },
  ],
  combinations: [
    { therapy: "Immunotherapy", coUsage: 42, effectiveness: 78 },
    { therapy: "Radiation", coUsage: 38, effectiveness: 72 },
    { therapy: "Surgery", coUsage: 55, effectiveness: 82 },
    { therapy: "Hormone Therapy", coUsage: 22, effectiveness: 68 },
    { therapy: "Targeted Therapy", coUsage: 28, effectiveness: 75 },
  ],
  sources: [
    {
      name: "Cancer Support Community",
      type: "Forum",
      discussions: 45200,
      url: "#",
    },
    {
      name: "Reddit r/cancer",
      type: "Social Media",
      discussions: 38400,
      url: "#",
    },
    {
      name: "HealthUnlocked",
      type: "Forum",
      discussions: 22100,
      url: "#",
    },
    {
      name: "Patient Blogs Network",
      type: "Blog",
      discussions: 15800,
      url: "#",
    },
    {
      name: "Inspire.com",
      type: "Forum",
      discussions: 12400,
      url: "#",
    },
  ],
}

export function getTreatmentData(slug: string): TreatmentData {
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return {
    ...defaultTreatment,
    name,
    slug,
    summary: defaultTreatment.summary.replace(/Chemotherapy/g, name),
    stats: {
      ...defaultTreatment.stats,
      sentimentScore: 40 + Math.floor(Math.random() * 50),
      discussionVolume: `${Math.floor(20 + Math.random() * 130)}K`,
    },
  }
}
