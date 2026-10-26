import { describe, expect, it } from 'vitest'
import { createInitialState, defaultCommitted, weightedBaseAdr } from './state'
import { loadFixtures } from './loadFixtures'

describe('createInitialState', () => {
  it('uses fixture rooms, promoCorridor 1, weighted ADR, and priceFloor 180', () => {
    const fixtures = loadFixtures()
    const state = createInitialState(fixtures)
    const adr = weightedBaseAdr(fixtures.property.roomTypes)

    expect(state.assumptions.sellableRooms).toBe(fixtures.property.rooms)
    expect(state.assumptions.promoCorridor).toBe(1)
    expect(state.assumptions.channelWeights.ctrip).toBe(0.45)
    expect(state.committed.priceFloor).toBe(180)
    expect(state.committed.globalDiscountPct).toBe(0)
    expect(state.committed.weekdayPackage).toBe(false)
    expect(state.committed.weekendProtect).toBe(false)
    expect(state.committed.dailyAdr).toHaveLength(fixtures.calendar.length)
    expect(state.committed.dailyAdr.every((v) => v === adr)).toBe(true)
    expect(state.dayCursor).toBe(0)
    expect(state.dailyLogs).toHaveLength(0)
    expect(state.liveKpis.occPct).toBeGreaterThanOrEqual(0)
  })

  it('defaultCommitted matches createInitialState.committed', () => {
    const fixtures = loadFixtures()
    expect(defaultCommitted(fixtures)).toEqual(createInitialState(fixtures).committed)
  })
})
