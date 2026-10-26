import type {
  AgentStage,
  DemandPoint,
  DiagnosisCause,
  FeedbackMetric,
  PropertyOverview,
  ResearchFinding,
  RiskFactor,
  StrategyRecommendation,
} from '../types'

export const property: PropertyOverview = {
  name: 'Cloud Mist Homestay',
  location: 'Tengchong, Yunnan',
  rooms: 12,
  occupancy: 43,
  occupancyTrend: -18,
  revenueTrend: -12,
  satisfaction: 4.7,
  adr: 328,
}

export const riskScore = 78

export const riskFactors: RiskFactor[] = [
  {
    id: 'd1',
    category: 'Demand',
    label: 'Booking pace',
    direction: 'down',
    detail: 'Forward bookings 22% below last year',
    value: '−22%',
  },
  {
    id: 'd2',
    category: 'Demand',
    label: 'Search interest',
    direction: 'down',
    detail: 'OTA search volume softening for Tengchong',
    value: '−15%',
  },
  {
    id: 'd3',
    category: 'Demand',
    label: 'Weekday demand',
    direction: 'down',
    detail: 'Mon–Thu occupancy trailing weekend by 31 pts',
    value: '−31 pts',
  },
  {
    id: 'm1',
    category: 'Market',
    label: 'Competitor pricing',
    direction: 'down',
    detail: 'Nearby listings cut weekday ADR by 6–9%',
    value: '−8%',
  },
  {
    id: 'm2',
    category: 'Market',
    label: 'Local tourism trend',
    direction: 'down',
    detail: 'Scenic-area foot traffic cooling after Golden Week',
    value: 'Soft',
  },
  {
    id: 'm3',
    category: 'Market',
    label: 'Weather impact',
    direction: 'neutral',
    detail: 'Light rain expected Tue–Thu; weekends clear',
    value: 'Mixed',
  },
]

export const occupancySpark = [
  { week: 'W1', value: 68 },
  { week: 'W2', value: 61 },
  { week: 'W3', value: 55 },
  { week: 'W4', value: 49 },
  { week: 'W5', value: 46 },
  { week: 'W6', value: 43 },
]

export const revenueSpark = [
  { week: 'W1', value: 48200 },
  { week: 'W2', value: 44100 },
  { week: 'W3', value: 39800 },
  { week: 'W4', value: 36200 },
  { week: 'W5', value: 34100 },
  { week: 'W6', value: 31800 },
]

export const agentStages: AgentStage[] = [
  {
    id: 'detection',
    title: 'Weak Season Detection',
    short: 'Detect',
    purpose:
      'Continuously monitor booking pace, search demand, and occupancy signals to flag weak-season risk early.',
    dataSources: ['OTA booking pace', 'Search interest index', 'Calendar occupancy', 'YoY baselines'],
    reasoning: [
      'Booking pace dipped below the 30-day rolling threshold for 5 consecutive days.',
      'Weekday occupancy gap vs historical average crossed the 20% alert line.',
      'Risk composite scored 78/100 — elevated weak-season probability.',
    ],
    insights: [
      'Weak season onset confirmed for the next 10–14 days.',
      'Primary pressure is weekday demand, not weekend collapse.',
    ],
    status: 'complete',
  },
  {
    id: 'predict',
    title: 'Predict & Diagnose',
    short: 'Predict',
    purpose:
      'Forecast near-term demand and isolate root causes behind occupancy and revenue gaps.',
    dataSources: ['Historical occupancy', 'ADR series', 'Competitor rates', 'Weather + event calendars'],
    reasoning: [
      '14-day demand model projects occupancy near 41–48%.',
      'Decomposition attributes ~60% of the gap to weekday tourism softness.',
      'Price gap vs competitors explains part of OTA conversion drop.',
    ],
    insights: [
      'Weekday occupancy −24% vs historical average.',
      'Expected revenue shortfall ≈ ¥18.6k over the next two weeks if no action.',
    ],
    status: 'active',
  },
  {
    id: 'research',
    title: 'Research Agent',
    short: 'Research',
    purpose:
      'Gather external context — tourism, weather, events, OTA market, and industry playbooks — to ground recommendations.',
    dataSources: [
      'Local tourism bureau signals',
      'Weather forecast',
      'Event calendars',
      'OTA ranking & rate scrapes',
      'Hospitality knowledge base',
    ],
    reasoning: [
      'Cross-checked Tengchong weekday footfall with weather and event density.',
      'Competitor packages emphasize weekend escapes; weekday offers are thin.',
      'Industry patterns favor midweek packages over blanket ADR cuts.',
    ],
    insights: [
      'Tengchong weekday demand expected to weaken next week (82% confidence).',
      'Focus weekday promotion rather than reducing weekend prices.',
    ],
    status: 'pending',
  },
  {
    id: 'strategy',
    title: 'Strategy Agent',
    short: 'Strategy',
    purpose:
      'Translate diagnosis and research into ranked, explainable operational strategies with impact and risk.',
    dataSources: ['Diagnosis outputs', 'Research findings', 'Property constraints', 'Margin model'],
    reasoning: [
      'Simulated −8% weekday price → +10% occupancy with ADR trade-off.',
      '3-night autumn package preserves weekend ADR while lifting midweek stays.',
      'Human approval required before any OTA price push.',
    ],
    insights: [
      'Top recommendation: launch weekday autumn package.',
      'Alternative: selective −8% weekday rate adjustment.',
    ],
    status: 'pending',
  },
  {
    id: 'approval',
    title: 'Human Approval',
    short: 'Approve',
    purpose:
      'Keep operators in control. Review AI reasoning, edit parameters, approve or reject before execution.',
    dataSources: ['Strategy proposals', 'Operator overrides', 'Property SOPs'],
    reasoning: [
      'No automatic price change without human confirmation.',
      'Approval panel surfaces confidence, risks, and editable fields.',
    ],
    insights: ['Awaiting operator decision on weekday autumn package.'],
    status: 'pending',
  },
  {
    id: 'action',
    title: 'Action',
    short: 'Action',
    purpose: 'Push approved tactics to OTAs, direct booking pages, and guest messaging channels.',
    dataSources: ['Approved strategy', 'OTA APIs', 'CRM / messaging'],
    reasoning: [
      'On approval, sync rates and packages to Ctrip, Meituan, and direct site.',
      'Trigger WeChat guest outreach for midweek offers.',
    ],
    insights: ['Actions queued pending approval.'],
    status: 'pending',
  },
  {
    id: 'outcome',
    title: 'Outcome',
    short: 'Outcome',
    purpose: 'Measure post-action occupancy, revenue, and conversion against the pre-action baseline.',
    dataSources: ['Live occupancy', 'Booking conversions', 'ADR / RevPAR'],
    reasoning: [
      'Track daily delta vs forecast-without-action baseline.',
      'Flag underperformance within 72 hours for re-planning.',
    ],
    insights: ['Baseline locked: occupancy 43%, ADR ¥328.'],
    status: 'pending',
  },
  {
    id: 'feedback',
    title: 'Feedback Loop',
    short: 'Learn',
    purpose:
      'Feed outcomes back into models so next weak-season cycles improve automatically.',
    dataSources: ['Outcome metrics', 'Operator ratings', 'Strategy effectiveness tags'],
    reasoning: [
      'Successful tactics raise prior weights for similar demand regimes.',
      'Rejected or underperforming tactics are down-weighted.',
    ],
    insights: ['Feedback channel ready once actions complete.'],
    status: 'pending',
  },
]

export const demandForecast: DemandPoint[] = [
  { day: 'Mon', predicted: 38, historical: 52, revenue: 4200 },
  { day: 'Tue', predicted: 36, historical: 50, revenue: 3900 },
  { day: 'Wed', predicted: 40, historical: 54, revenue: 4500 },
  { day: 'Thu', predicted: 42, historical: 55, revenue: 4800 },
  { day: 'Fri', predicted: 58, historical: 62, revenue: 7200 },
  { day: 'Sat', predicted: 78, historical: 82, revenue: 11200 },
  { day: 'Sun', predicted: 72, historical: 76, revenue: 9800 },
  { day: 'Mon+', predicted: 37, historical: 51, revenue: 4100 },
  { day: 'Tue+', predicted: 35, historical: 49, revenue: 3800 },
  { day: 'Wed+', predicted: 39, historical: 53, revenue: 4400 },
  { day: 'Thu+', predicted: 41, historical: 54, revenue: 4700 },
  { day: 'Fri+', predicted: 56, historical: 61, revenue: 7000 },
  { day: 'Sat+', predicted: 76, historical: 80, revenue: 10800 },
  { day: 'Sun+', predicted: 70, historical: 74, revenue: 9500 },
]

export const diagnosisCauses: DiagnosisCause[] = [
  {
    id: 1,
    title: 'Lower weekday tourism demand',
    evidence:
      'Scenic ticket sales and hotel search volume for Mon–Thu are 18–24% below the same weeks last year.',
    confidence: 88,
    sources: ['Tourism footfall index', 'OTA search interest', 'Historical booking pattern'],
  },
  {
    id: 2,
    title: 'Price gap compared with competitors',
    evidence:
      'Your weekday ADR is ¥28–45 above the peer median within 1.5 km while amenities are comparable.',
    confidence: 76,
    sources: ['Competitor rate board', 'Listing feature parity', 'Conversion funnel'],
  },
  {
    id: 3,
    title: 'Reduced OTA conversion rate',
    evidence:
      'Listing CTR steady, but booking conversion fell from 3.1% to 2.2% on weekdays.',
    confidence: 71,
    sources: ['OTA analytics', 'Review velocity', 'Photo ranking'],
  },
]

export const researchSources = [
  { name: 'Tourism trends', status: 'synced', detail: 'Tengchong visitor index · updated 2h ago' },
  { name: 'Weather forecast', status: 'synced', detail: '7-day ECMWF · light rain midweek' },
  { name: 'Local events', status: 'synced', detail: 'No major weekday festivals next week' },
  { name: 'OTA market changes', status: 'synced', detail: 'Peer ADR −6~9% weekday' },
  { name: 'Industry knowledge', status: 'synced', detail: 'Weak-season package playbooks' },
]

export const researchReasoning = [
  'Compared current booking curve with autumn baselines for Tengchong hot-spring homestays.',
  'Weather model shows Tue–Thu drizzle — historically correlates with −12% walk-in and same-day bookings.',
  'Event calendar is empty midweek; weekend hot-spring demand remains resilient.',
  'OTA peers are discounting weekdays aggressively; weekend rates largely unchanged.',
  'Knowledge base favors length-of-stay packages over across-the-board ADR cuts in shoulder season.',
]

export const researchFinding: ResearchFinding = {
  title: 'Tengchong weekday demand is expected to weaken next week.',
  evidence: [
    'Historical booking pattern for post–Golden Week shoulder season',
    'Weather forecast: light rain Tue–Thu',
    'Local tourism activity softer on weekdays',
  ],
  confidence: 82,
  implication: 'Focus on weekday promotion instead of reducing weekend prices.',
}

export const initialStrategies: StrategyRecommendation[] = [
  {
    id: 's1',
    title: 'Launch weekday autumn package',
    explanation:
      'Bundle 3 nights (Sun–Wed or Mon–Thu) with hot-spring credits and late checkout to lift midweek stays without touching weekend ADR.',
    impact: 'Occupancy +12% · RevPAR +7%',
    confidence: 76,
    risk: 'Package margin slightly lower if hot-spring credits are over-redeemed',
    alternative: '2-night midweek flash deal limited to direct booking',
    status: 'pending',
  },
  {
    id: 's2',
    title: 'Adjust weekday price by −8%',
    explanation:
      'Align Mon–Thu ADR closer to peer median to recover OTA conversion while holding Fri–Sun rates.',
    impact: 'Occupancy +10%',
    confidence: 72,
    risk: 'Lower ADR · risk of weekend price anchoring if not fenced',
    alternative: 'Create a 3-night package instead',
    status: 'pending',
  },
  {
    id: 's3',
    title: 'Boost OTA ranking content',
    explanation:
      'Refresh hero photos, add weekday lifestyle tags, and reply to recent reviews within 4 hours to lift conversion.',
    impact: 'Conversion +0.4–0.6 pts',
    confidence: 68,
    risk: 'Slower impact; needs 5–7 days to show in ranking',
    alternative: 'Sponsored placement for midweek dates only',
    status: 'pending',
  },
]

export const feedbackMetrics: FeedbackMetric[] = [
  { label: 'Occupancy', before: 43, after: 57, unit: '%' },
  { label: 'Weekday ADR', before: 328, after: 312, unit: '¥' },
  { label: 'RevPAR', before: 141, after: 178, unit: '¥' },
  { label: 'OTA conversion', before: 2.2, after: 2.9, unit: '%' },
]

export const knowledgeArticles = [
  {
    title: 'Shoulder-season pricing fences',
    tag: 'Pricing',
    summary: 'How to discount weekdays without eroding weekend willingness to pay.',
  },
  {
    title: 'Hot-spring package design',
    tag: 'Product',
    summary: 'Length-of-stay bundles that convert leisure travelers in Yunnan.',
  },
  {
    title: 'OTA conversion recovery checklist',
    tag: 'Distribution',
    summary: 'Photo, review, and ranking levers when CTR is stable but bookings fall.',
  },
  {
    title: 'Weather-aware demand playbooks',
    tag: 'Demand',
    summary: 'Operational responses when midweek rain coincides with soft tourism.',
  },
]

export const otaChannels = [
  { name: 'Ctrip', share: 42, pace: -18, rank: 14 },
  { name: 'Meituan', share: 27, pace: -12, rank: 9 },
  { name: 'Fliggy', share: 18, pace: -9, rank: 21 },
  { name: 'Direct / WeChat', share: 13, pace: -4, rank: 1 },
]
