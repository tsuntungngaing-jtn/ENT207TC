export interface PropertyFixture {
  name: string
  location: string
  rooms: number
  roomTypes: { id: string; name: string; count: number; baseAdr: number }[]
  personsPerRoom: number
  baselineLos: number
}

export interface CalendarDayFixture {
  dayIndex: number
  label: string
  demandIndex: number
  seasonFactor: number
  eventFactor: number
  weatherFactor: number
  isWeekend: boolean
}

export interface CompetitorFixture {
  id: string
  name: string
  lng: number
  lat: number
  weekdayAdr: number
  weekendAdr: number
}

export interface ChannelFixture {
  id: string
  name: string
  weight: number
}

export interface SimAssumptions {
  sellableRooms: number
  promoCorridor: number
  channelWeights: Record<string, number>
}

export interface CommittedPricing {
  globalDiscountPct: number
  weekdayPackage: boolean
  weekendProtect: boolean
  priceFloor: number
  dailyAdr: number[]
}

export interface DayKpis {
  occPct: number
  occupiedRooms: number
  guestsInHouse: number
  avgLos: number
  adr: number
  revpar: number
  revenue: number
  riskScore: number
}

export interface DailyLog extends DayKpis {
  dayIndex: number
  label: string
  arrivals: number
  departures: number
  channelRevenue: Record<string, number>
  alerts: string[]
}

export interface SimFixtures {
  property: PropertyFixture
  calendar: CalendarDayFixture[]
  competitors: CompetitorFixture[]
  channels: ChannelFixture[]
}

export interface SimState {
  fixtures: SimFixtures
  assumptions: SimAssumptions
  committed: CommittedPricing
  dayCursor: number
  dailyLogs: DailyLog[]
  liveKpis: DayKpis
}

export interface SimDayInput {
  fixtures: SimFixtures
  assumptions: SimAssumptions
  committed: CommittedPricing
  dayIndex: number
}
