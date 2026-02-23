console.log("MOCK DATA FUNCTION USED")
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
