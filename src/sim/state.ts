import { previewDay } from './engine'
import { loadFixtures } from './loadFixtures'
import type { CommittedPricing, SimAssumptions, SimState } from './types'

export const SIM_COMMITTED_STORAGE_KEY = 'fuxipulse.sim.committed.v1'

export function weightedBaseAdr(
  roomTypes: { count: number; baseAdr: number }[],
): number {
  const rooms = roomTypes.reduce((s, r) => s + r.count, 0)
  if (rooms <= 0) return 0
  const sum = roomTypes.reduce((s, r) => s + r.count * r.baseAdr, 0)
  return Math.round(sum / rooms)
}

export function defaultAssumptions(fixtures = loadFixtures()): SimAssumptions {
  return {
    sellableRooms: fixtures.property.rooms,
    promoCorridor: 1,
    channelWeights: Object.fromEntries(fixtures.channels.map((c) => [c.id, c.weight])),
  }
}

export function defaultCommitted(fixtures = loadFixtures()): CommittedPricing {
  const adr = weightedBaseAdr(fixtures.property.roomTypes)
  return {
    globalDiscountPct: 0,
    weekdayPackage: false,
    weekendProtect: false,
    priceFloor: 180,
    dailyAdr: Array.from({ length: fixtures.calendar.length }, () => adr),
  }
}

export function createInitialState(fixtures = loadFixtures()): SimState {
  const assumptions = defaultAssumptions(fixtures)
  const committed = defaultCommitted(fixtures)
  return {
    fixtures,
    assumptions,
    committed,
    dayCursor: 0,
    dailyLogs: [],
    liveKpis: previewDay({ fixtures, assumptions, committed, dayIndex: 0 }),
  }
}

export function pricingEqual(a: CommittedPricing, b: CommittedPricing): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function loadPersistedCommitted(): CommittedPricing | null {
  try {
    const raw = localStorage.getItem(SIM_COMMITTED_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CommittedPricing
    if (
      typeof parsed?.globalDiscountPct !== 'number' ||
      typeof parsed?.priceFloor !== 'number' ||
      !Array.isArray(parsed?.dailyAdr)
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function persistCommitted(committed: CommittedPricing): void {
  try {
    localStorage.setItem(SIM_COMMITTED_STORAGE_KEY, JSON.stringify(committed))
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearPersistedCommitted(): void {
  try {
    localStorage.removeItem(SIM_COMMITTED_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
