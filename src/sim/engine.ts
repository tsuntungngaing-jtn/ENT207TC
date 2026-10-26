import type { DailyLog, DayKpis, SimDayInput, SimFixtures, SimState } from './types'
import type { SimAssumptions } from './types'

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

function competitorAvg(fixtures: SimFixtures, dayIndex: number): number {
  const day = fixtures.calendar[dayIndex]
  const vals = fixtures.competitors.map((c) => (day.isWeekend ? c.weekendAdr : c.weekdayAdr))
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function channelReach(assumptions: SimAssumptions, fixtures: SimFixtures): number {
  const sum = fixtures.channels.reduce((acc, ch) => {
    const w = assumptions.channelWeights[ch.id] ?? ch.weight
    return acc + w
  }, 0)
  return clamp(sum, 0.5, 1.4)
}

function pricePressure(
  fixtures: SimFixtures,
  committed: SimDayInput['committed'],
  dayIndex: number,
): { adr: number; Pd: number } {
  const cal = fixtures.calendar[dayIndex]
  let adr = committed.dailyAdr[dayIndex] ?? fixtures.property.roomTypes[0].baseAdr
  adr = adr * (1 - committed.globalDiscountPct / 100)
  if (cal.isWeekend && committed.weekendProtect) adr = Math.max(adr, competitorAvg(fixtures, dayIndex) * 0.98)
  if (!cal.isWeekend && committed.weekdayPackage) adr = adr * 0.92
  adr = Math.max(adr, committed.priceFloor)
  const Pd = adr / competitorAvg(fixtures, dayIndex)
  return { adr, Pd }
}

export function previewDay(input: SimDayInput): DayKpis {
  const { fixtures, assumptions, committed, dayIndex } = input
  const cal = fixtures.calendar[dayIndex]
  const rooms = Math.min(assumptions.sellableRooms, fixtures.property.rooms)
  const { adr, Pd } = pricePressure(fixtures, committed, dayIndex)

  const Dd =
    cal.demandIndex * cal.seasonFactor * cal.eventFactor * cal.weatherFactor * assumptions.promoCorridor
  const elasticity = clamp(1.25 - 0.45 * Pd, 0.45, 1.35)
  const occPct = clamp(100 * Dd * elasticity * channelReach(assumptions, fixtures), 0, 100)
  const occupiedRooms = Math.round((occPct / 100) * rooms)
  const guestsInHouse = Math.round(occupiedRooms * fixtures.property.personsPerRoom * 10) / 10
  const avgLos =
    fixtures.property.baselineLos * (!cal.isWeekend && committed.weekdayPackage ? 1.12 : 1)
  const revenue = Math.round(occupiedRooms * adr)
  const revpar = Math.round((revenue / fixtures.property.rooms) * 10) / 10
  const vacancyRisk = occPct < 50 ? 30 : occPct < 65 ? 15 : 0
  const priceGapRisk = Pd > 1.12 ? 25 : Pd > 1.05 ? 10 : 0
  const weekdayRisk = !cal.isWeekend && occPct < 55 ? 20 : 0
  const riskScore = clamp(vacancyRisk + priceGapRisk + weekdayRisk, 0, 100)

  return {
    occPct: Math.round(occPct * 10) / 10,
    occupiedRooms,
    guestsInHouse,
    avgLos: Math.round(avgLos * 100) / 100,
    adr: Math.round(adr),
    revpar,
    revenue,
    riskScore,
  }
}

function splitChannelRevenue(
  fixtures: SimFixtures,
  assumptions: SimAssumptions,
  revenue: number,
): Record<string, number> {
  const weights = fixtures.channels.map((ch) => ({
    id: ch.id,
    w: assumptions.channelWeights[ch.id] ?? ch.weight,
  }))
  const total = weights.reduce((acc, { w }) => acc + w, 0)
  const channelRevenue: Record<string, number> = {}
  let allocated = 0
  weights.forEach(({ id, w }, i) => {
    if (i === weights.length - 1) {
      channelRevenue[id] = revenue - allocated
    } else {
      const share = Math.round(revenue * (w / total))
      channelRevenue[id] = share
      allocated += share
    }
  })
  return channelRevenue
}

export function runDay(state: SimState): { state: SimState; log: DailyLog } {
  const { fixtures, assumptions, committed, dayCursor } = state
  const cal = fixtures.calendar[dayCursor]
  const kpis = previewDay({ fixtures, assumptions, committed, dayIndex: dayCursor })
  const { Pd } = pricePressure(fixtures, committed, dayCursor)

  const alerts: string[] = []
  if (kpis.occPct < 50) alerts.push('Vacancy risk: occupancy below 50%')
  if (Pd > 1.12) alerts.push('Price gap: ADR exceeds competitor average by >12%')

  const log: DailyLog = {
    ...kpis,
    dayIndex: dayCursor,
    label: cal.label,
    arrivals: Math.round(kpis.occupiedRooms * 0.55),
    departures: Math.round(kpis.occupiedRooms * 0.45),
    channelRevenue: splitChannelRevenue(fixtures, assumptions, kpis.revenue),
    alerts,
  }

  const nextCursor = dayCursor + 1
  const liveKpis =
    nextCursor < fixtures.calendar.length
      ? previewDay({ fixtures, assumptions, committed, dayIndex: nextCursor })
      : kpis

  return {
    state: {
      ...state,
      dayCursor: nextCursor,
      dailyLogs: [...state.dailyLogs, log],
      liveKpis,
    },
    log,
  }
}

export function runDays(state: SimState, n: number): { state: SimState; logs: DailyLog[] } {
  let current = state
  const logs: DailyLog[] = []
  for (let i = 0; i < n; i++) {
    if (current.dayCursor >= current.fixtures.calendar.length) break
    const result = runDay(current)
    current = result.state
    logs.push(result.log)
  }
  return { state: current, logs }
}
