export type AgentStageId =
  | 'detection'
  | 'predict'
  | 'research'
  | 'strategy'
  | 'approval'
  | 'action'
  | 'outcome'
  | 'feedback'

export type ApprovalStatus = 'pending' | 'approved' | 'modified' | 'rejected'

export interface PropertyOverview {
  name: string
  location: string
  rooms: number
  occupancy: number
  occupancyTrend: number
  revenueTrend: number
  satisfaction: number
  adr: number
}

export interface RiskFactor {
  id: string
  category: 'Demand' | 'Market'
  label: string
  direction: 'up' | 'down' | 'neutral'
  detail: string
  value: string
}

export interface AgentStage {
  id: AgentStageId
  title: string
  short: string
  purpose: string
  dataSources: string[]
  reasoning: string[]
  insights: string[]
  status: 'complete' | 'active' | 'pending'
}

export interface DemandPoint {
  day: string
  predicted: number
  historical: number
  revenue: number
}

export interface DiagnosisCause {
  id: number
  title: string
  evidence: string
  confidence: number
  sources: string[]
}

export interface ResearchFinding {
  title: string
  evidence: string[]
  confidence: number
  implication: string
}

export interface StrategyRecommendation {
  id: string
  title: string
  explanation: string
  impact: string
  confidence: number
  risk: string
  alternative: string
  status: ApprovalStatus
}

export interface FeedbackMetric {
  label: string
  before: number
  after: number
  unit: string
}
