import { describe, expect, it } from 'vitest'
import { previewDay, runDay, runDays } from './engine'
import { loadFixtures } from './loadFixtures'
import type { CommittedPricing, SimAssumptions } from './types'

function baseCommitted(days: number, adr: number): CommittedPricing {
  return {
    globalDiscountPct: 0,
    weekdayPackage: false,
    weekendProtect: false,
    priceFloor: 180,
    dailyAdr: Array.from({ length: days }, () => adr),
  }
}

describe('runDay', () => {
  it('returns higher occ when promoCorridor rises and price stays competitive', () => {
    const fixtures = loadFixtures()
    const assumptionsLow: SimAssumptions = {
      sellableRooms: fixtures.property.rooms,
      promoCorridor: 0.8,
      channelWeights: Object.fromEntries(fixtures.channels.map((c) => [c.id, c.weight])),
    }
    const assumptionsHigh = { ...assumptionsLow, promoCorridor: 1.3 }
    const committed = baseCommitted(fixtures.calendar.length, 300)
    const low = previewDay({ fixtures, assumptions: assumptionsLow, committed, dayIndex: 0 })
    const high = previewDay({ fixtures, assumptions: assumptionsHigh, committed, dayIndex: 0 })
    expect(high.occPct).toBeGreaterThan(low.occPct)
  })

  it('clamps occ between 0 and 100', () => {
    const fixtures = loadFixtures()
    const assumptions: SimAssumptions = {
      sellableRooms: fixtures.property.rooms,
      promoCorridor: 5,
      channelWeights: Object.fromEntries(fixtures.channels.map((c) => [c.id, c.weight])),
    }
    const committed = baseCommitted(fixtures.calendar.length, 100)
    const kpis = previewDay({ fixtures, assumptions, committed, dayIndex: 0 })
    expect(kpis.occPct).toBeGreaterThanOrEqual(0)
    expect(kpis.occPct).toBeLessThanOrEqual(100)
  })

  it('runDays appends n logs and advances cursor', () => {
    const fixtures = loadFixtures()
    const assumptions: SimAssumptions = {
      sellableRooms: fixtures.property.rooms,
      promoCorridor: 1,
      channelWeights: Object.fromEntries(fixtures.channels.map((c) => [c.id, c.weight])),
    }
    const committed = baseCommitted(fixtures.calendar.length, 320)
    let state = {
      fixtures,
      assumptions,
      committed,
      dayCursor: 0,
      dailyLogs: [] as ReturnType<typeof runDay>['log'][],
      liveKpis: previewDay({ fixtures, assumptions, committed, dayIndex: 0 }),
    }
    const result = runDays(state, 7)
    expect(result.logs).toHaveLength(7)
    expect(result.state.dayCursor).toBe(7)
    expect(result.state.dailyLogs).toHaveLength(7)
  })
})
