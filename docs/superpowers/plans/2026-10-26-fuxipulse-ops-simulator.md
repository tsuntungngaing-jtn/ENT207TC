# FuxiPulse Homestay Operations Simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an offline Windows-installable FuxiPulse that runs a CityRail-mapped homestay ops loop: sandbox → pricing dispatch (human approve) → daily report, on bundled mock data.

**Architecture:** Extend the existing Vite/React app with a pure-TS simulation engine, `SimContext`, three new routes (`/sim`, `/dispatch`, `/daily`), then wrap the built `dist` in Electron + NSIS. No backend; fixtures ship inside the installer. Use `HashRouter` so `file://` packaging works.

**Tech Stack:** Vite 7, React 19, TypeScript, Tailwind 4, React Router 7 (HashRouter), Vitest, Electron, electron-builder (NSIS).

**Spec:** `docs/superpowers/specs/2026-10-26-fuxipulse-ops-simulator-design.md`

## Global Constraints

- No server / real OTA APIs / online map tiles — bundled fixtures only, offline-capable.
- Do not delete existing Dashboard / Weak Season / Strategy / OTA / Knowledge / Feedback pages.
- Keep navy `#0B1F3A` / teal `#0D9488` visual language; Plus Jakarta Sans already in app.
- Demo property remains Cloud Mist Homestay, 12 rooms, Tengchong.
- Windows NSIS x64 installer is the mentor artifact; localhost screenshots are not the primary deliverable.
- Human approval required before draft prices become `committedPricing`; advance-day may run anytime but applies committed prices only.
- Vite `base` must be `'./'` for packaged assets.
- Prefer small focused files under `src/sim/` and `src/pages/`.

## File structure (create / modify)

| Path | Responsibility |
|------|----------------|
| `src/sim/types.ts` | Sim domain types |
| `src/sim/fixtures/*.json` + `tengchong.map.geojson` | Dead data |
| `src/sim/loadFixtures.ts` | Import/parse fixtures into typed objects |
| `src/sim/engine.ts` | Pure `previewDay` / `runDay` / `runDays` |
| `src/sim/engine.test.ts` | Vitest unit tests |
| `src/sim/SimContext.tsx` | React state: assumptions, drafts, committed, logs, KPIs |
| `src/sim/map/project.ts` | Lon/lat → SVG viewBox helpers |
| `src/components/sim/SandboxMap.tsx` | SVG GeoJSON + layers |
| `src/components/sim/KpiRail.tsx` | Control-center KPI strip |
| `src/components/sim/RateCalendar.tsx` | 14-day rate table |
| `src/pages/SimSandboxPage.tsx` | `/sim` |
| `src/pages/SimDispatchPage.tsx` | `/dispatch` |
| `src/pages/SimDailyPage.tsx` | `/daily` |
| `src/App.tsx` | Register routes |
| `src/components/layout/Sidebar.tsx` | Simulator nav group |
| `src/main.tsx` | `HashRouter` + `SimProvider` |
| `src/context/AppState.tsx` | Optional: on strategy approve, enqueue dispatch hint |
| `vite.config.ts` | `base: './'`, vitest config |
| `package.json` | scripts + electron deps |
| `electron/main.cjs` | Load local `dist/index.html` |
| `electron/preload.cjs` | Minimal bridge (optional empty) |
| `electron-builder.yml` | NSIS config |
| `vitest.config.ts` | Test runner (or inline in vite) |

---

### Task 1: Vitest + simulation types + fixtures + `runDay` engine (TDD)

**Files:**
- Create: `vitest.config.ts`
- Create: `src/sim/types.ts`
- Create: `src/sim/fixtures/property.json`
- Create: `src/sim/fixtures/calendar-baseline.json`
- Create: `src/sim/fixtures/competitors.json`
- Create: `src/sim/fixtures/channels.json`
- Create: `src/sim/fixtures/tengchong.map.geojson`
- Create: `src/sim/loadFixtures.ts`
- Create: `src/sim/engine.ts`
- Create: `src/sim/engine.test.ts`
- Modify: `package.json` (add vitest, scripts)
- Modify: `vite.config.ts` (resolve JSON; keep plugins; prepare for `base`)

**Interfaces:**
- Consumes: none
- Produces:
  - `loadFixtures(): SimFixtures`
  - `previewDay(input: SimDayInput): DayKpis`
  - `runDay(state: SimState, dayIndex: number): { state: SimState; log: DailyLog }`
  - `runDays(state: SimState, n: number): { state: SimState; logs: DailyLog[] }`
  - Types: `SimFixtures`, `SimAssumptions`, `CommittedPricing`, `DayKpis`, `DailyLog`, `SimState`, `SimDayInput`

- [ ] **Step 1: Add Vitest dependency and config**

```bash
npm install -D vitest
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

In `package.json` scripts add: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 2: Write failing engine test**

Create `src/sim/types.ts` with at least:

```ts
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
```

Create `src/sim/engine.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test — expect FAIL**

```bash
npm test
```

Expected: FAIL (module not found / functions undefined).

- [ ] **Step 4: Add fixtures**

`src/sim/fixtures/property.json`:

```json
{
  "name": "Cloud Mist Homestay",
  "location": "Tengchong, Yunnan",
  "rooms": 12,
  "personsPerRoom": 2.1,
  "baselineLos": 1.8,
  "roomTypes": [
    { "id": "std", "name": "Standard", "count": 6, "baseAdr": 298 },
    { "id": "dlx", "name": "Deluxe", "count": 4, "baseAdr": 368 },
    { "id": "ste", "name": "Suite", "count": 2, "baseAdr": 488 }
  ]
}
```

`src/sim/fixtures/channels.json`:

```json
[
  { "id": "ctrip", "name": "Ctrip", "weight": 0.45 },
  { "id": "meituan", "name": "Meituan", "weight": 0.3 },
  { "id": "direct", "name": "Direct", "weight": 0.25 }
]
```

`src/sim/fixtures/competitors.json` — at least 3 points near Tengchong (lng ~98.49, lat ~25.02) with weekday/weekend ADR around 280–420.

`src/sim/fixtures/calendar-baseline.json` — array of 28 days: `dayIndex` 0..27, `label` like `Day 1`, `demandIndex` 0.55–1.1 (weekdays lower), `seasonFactor` ~0.85, `eventFactor` 1.0 (bump 1–2 days to 1.25), `weatherFactor` 0.9–1.05, `isWeekend` true for index % 7 in {5,6}.

`src/sim/fixtures/tengchong.map.geojson` — FeatureCollection with 2–3 Polygon regions (simplified rectangles around Tengchong) plus Point features for property and competitors (properties: `{ kind: "property"|"competitor", id, name }`). Coordinates WGS84.

- [ ] **Step 5: Implement `loadFixtures` and `engine`**

`loadFixtures.ts` — static imports of JSON / GeoJSON (map file can be loaded but engine tests need only the four JSON fixtures; export map separately as `mapGeoJson`).

`engine.ts` formulas (implement exactly this shape):

```ts
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

export function previewDay(input: SimDayInput): DayKpis {
  const { fixtures, assumptions, committed, dayIndex } = input
  const cal = fixtures.calendar[dayIndex]
  const rooms = Math.min(assumptions.sellableRooms, fixtures.property.rooms)
  let adr = committed.dailyAdr[dayIndex] ?? fixtures.property.roomTypes[0].baseAdr
  adr = adr * (1 - committed.globalDiscountPct / 100)
  if (cal.isWeekend && committed.weekendProtect) adr = Math.max(adr, competitorAvg(fixtures, dayIndex) * 0.98)
  if (!cal.isWeekend && committed.weekdayPackage) adr = adr * 0.92
  adr = Math.max(adr, committed.priceFloor)

  const Dd =
    cal.demandIndex * cal.seasonFactor * cal.eventFactor * cal.weatherFactor * assumptions.promoCorridor
  const Pd = adr / competitorAvg(fixtures, dayIndex)
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

  return { occPct: Math.round(occPct * 10) / 10, occupiedRooms, guestsInHouse, avgLos: Math.round(avgLos * 100) / 100, adr: Math.round(adr), revpar, revenue, riskScore }
}
```

`runDay`: compute KPIs for `state.dayCursor`; build `DailyLog` with `arrivals ≈ occupiedRooms * 0.55`, `departures ≈ occupiedRooms * 0.45`, split `channelRevenue` by normalized weights, `alerts` when `occPct < 50` or `Pd > 1.12`; append log; `dayCursor += 1`; update `liveKpis`.

`runDays`: loop `n` times calling `runDay` (stop if `dayCursor >= calendar.length`).

- [ ] **Step 6: Run tests — expect PASS**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts package.json package-lock.json src/sim vite.config.ts
git commit -m "feat(sim): add fixtures and pure runDay engine with tests"
```

---

### Task 2: `SimContext` provider (state + preview + advance + reset + localStorage)

**Files:**
- Create: `src/sim/SimContext.tsx`
- Modify: `src/main.tsx`
- Create: `src/sim/SimContext.test.ts` (optional light test of `createInitialState` helper — prefer exporting `createInitialState` from `SimContext.tsx` or `src/sim/state.ts`)

**Interfaces:**
- Consumes: `loadFixtures`, `previewDay`, `runDay`, `runDays`, types from Task 1
- Produces: `SimProvider`, `useSim()` with:
  - `state: SimState`
  - `draftPricing: CommittedPricing`
  - `setAssumptions(partial)`
  - `setDraftPricing(partial)`
  - `approveDraft()` — copies draft → committed; refreshes `liveKpis` via preview
  - `rejectDraft()` — resets draft to committed
  - `advanceDays(n: number)` — uses committed only; if `draftPricing` deeply ≠ committed, set `notice` string
  - `resetScenario()`
  - `notice: string | null` / `clearNotice()`
  - `enqueuePricingHint(hint: { source: string; discountPct: number })` — merges into draft (for Strategy bridge)

- [ ] **Step 1: Implement `createInitialState` and provider**

Defaults: `promoCorridor: 1`, `sellableRooms: property.rooms`, channel weights from fixtures, `dailyAdr` from weighted room-type base ADR for each calendar day, `priceFloor: 180`, discounts off.

Persist key `fuxipulse.sim.committed.v1` — on mount, if present, parse and apply to `committed` + `draftPricing`.

- [ ] **Step 2: Wire provider in `main.tsx` inside `AppStateProvider`**

```tsx
import { HashRouter } from 'react-router-dom'
import { SimProvider } from './sim/SimContext'
// ...
<HashRouter>
  <AppStateProvider>
    <SimProvider>
      <App />
    </SimProvider>
  </AppStateProvider>
</HashRouter>
```

Switch from `BrowserRouter` to `HashRouter` in this task (required for Electron later).

- [ ] **Step 3: Manual smoke**

```bash
npm run dev
```

Open app; confirm existing pages still load under hash URLs (`/#/`, `/#/strategy`).

- [ ] **Step 4: Commit**

```bash
git add src/sim/SimContext.tsx src/main.tsx
git commit -m "feat(sim): add SimContext with approve/advance/reset"
```

---

### Task 3: Sandbox page + SVG map + layer toggles

**Files:**
- Create: `src/sim/map/project.ts`
- Create: `src/components/sim/SandboxMap.tsx`
- Create: `src/components/sim/KpiRail.tsx`
- Create: `src/pages/SimSandboxPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/layout/Sidebar.tsx`

**Interfaces:**
- Consumes: `useSim()`, `mapGeoJson` from fixtures
- Produces: routes `/sim`; sidebar Simulator group

- [ ] **Step 1: Projection helpers**

```ts
// project.ts
export function boundsOf(coords: number[][][]): { minLng: number; maxLng: number; minLat: number; maxLat: number }
export function project(lng: number, lat: number, b: ReturnType<typeof boundsOf>, width: number, height: number): { x: number; y: number }
```

Simple linear map; flip Y for SVG.

- [ ] **Step 2: `SandboxMap`**

- Render polygons as `<path>`
- Points as circles (property teal, competitors slate)
- Optional heat: for each grid Point/Polygon with `properties.heat`, opacity ∝ `heat * promoCorridor`
- Props: `geojson`, `showHeat`, `showCompetitors`, `showOd`, `promoCorridor`
- OD sketch: draw 2–3 `<line>` from competitor/region centroids toward property when `showOd`

- [ ] **Step 3: `SimSandboxPage`**

- `TopBar` title `Operations Sandbox` subtitle `Homestay demand · supply · advance clock`
- Layer checkboxes; sliders for `promoCorridor` (0.6–1.5), `sellableRooms` (1–12), channel weight sliders
- Buttons: Advance 1 day / Advance 7 days / Reset scenario
- Show `notice` banner if set
- Embed `KpiRail` with `state.liveKpis`
- Season tag from current calendar day factors

- [ ] **Step 4: Sidebar + routes**

Sidebar: after brand block, render two groups — **Simulator** (badge text `Sim`) with links Sandbox `/sim`, Dispatch `/dispatch`, Daily `/daily`; then existing **Operations** links unchanged. Subtitle under FuxiPulse: `Ops Simulator` (replace or dual-line `AI Operations`).

`App.tsx` add:

```tsx
<Route path="sim" element={<SimSandboxPage />} />
```

(Dispatch/Daily can be temporary placeholders returning `null` or “Coming in Task 4/5” only if needed — prefer stub panels with title to keep nav working.)

- [ ] **Step 5: Manual check**

```bash
npm run dev
```

`/#/sim`: toggle layers, move promo slider → KPI rail numbers change (preview via assumptions updating `liveKpis` through `previewDay` on current cursor). Advance 1 day → `dayCursor` increments.

- [ ] **Step 6: Commit**

```bash
git add src/sim/map src/components/sim src/pages/SimSandboxPage.tsx src/App.tsx src/components/layout/Sidebar.tsx
git commit -m "feat(sim): add operations sandbox map and advance controls"
```

---

### Task 4: Pricing dispatch desk

**Files:**
- Create: `src/components/sim/RateCalendar.tsx`
- Create: `src/pages/SimDispatchPage.tsx`
- Modify: `src/App.tsx` (wire real page)

**Interfaces:**
- Consumes: `useSim()` draft/committed/approve/reject
- Produces: `/dispatch` full UI

- [ ] **Step 1: `RateCalendar`**

Table of next 14 days from `dayCursor`: columns Label | Baseline ADR | Draft ADR (editable number input) | Competitor avg | Preview OCC%.

Editing a cell updates `draftPricing.dailyAdr[dayIndex]`.

- [ ] **Step 2: Knobs + approval**

Knobs bound to draft: global discount %, weekday package toggle, weekend protect toggle, price floor.

Actions: Approve → `approveDraft()` + persist localStorage; Modify keeps editing; Reject → `rejectDraft()`.

Show status pill: `Draft dirty` vs `Synced` by deep-compare draft/committed.

Right rail: `KpiRail` using `previewDay` with **draft** for preview numbers; caption “Preview (uncommitted)”.

Guard: if any draft ADR < priceFloor, disable Approve and show inline error.

- [ ] **Step 3: Manual check**

Lower weekday ADR in draft → preview OCC rises; Advance from sandbox without Approve → notice; Approve then Advance → logs use new prices.

- [ ] **Step 4: Commit**

```bash
git add src/components/sim/RateCalendar.tsx src/pages/SimDispatchPage.tsx src/App.tsx
git commit -m "feat(sim): add pricing dispatch with human approval"
```

---

### Task 5: Operations daily report

**Files:**
- Create: `src/pages/SimDailyPage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `state.dailyLogs`
- Produces: `/daily`

- [ ] **Step 1: Build daily page**

- If `dailyLogs.length === 0`: empty state “Advance the clock from Sandbox after approving rates.”
- Else list cards newest-last or newest-first (pick newest-first): date label, arrivals, in-house (`guestsInHouse`), departures, avg LOS, revenue, OCC
- Rankings from latest log: channel revenue TOP; room-type contribution approximate by splitting occupied rooms by room type counts
- Alerts list from latest log
- Button: Reset scenario (calls `resetScenario`)

- [ ] **Step 2: Closed-loop manual test**

Sandbox promo → Dispatch discount Approve → Advance 7 → Daily shows 7 cards with moving revenue.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SimDailyPage.tsx src/App.tsx
git commit -m "feat(sim): add operations daily report from simulation logs"
```

---

### Task 6: Strategy → dispatch pricing hint bridge

**Files:**
- Modify: `src/context/AppState.tsx`
- Modify: `src/pages/StrategyPage.tsx` (or bridge inside `setStrategyStatus`)
- Modify: `src/sim/SimContext.tsx` if `enqueuePricingHint` needs tweak

**Interfaces:**
- Consumes: `enqueuePricingHint`, existing `setStrategyStatus`
- Produces: Approving strategy `s1` applies draft `globalDiscountPct: 8` (weekday package narrative) and navigates or toasts “Queued in Dispatch”

- [ ] **Step 1: On `setStrategyStatus('s1', 'approved')` or primary Approve, call `enqueuePricingHint({ source: 'strategy:s1', discountPct: 8 })` and set `weekdayPackage: true` on draft**

Implement by nesting a small effect hook component `StrategySimBridge` inside providers in `main.tsx` that watches `primaryApproval` / strategies — avoids circular imports.

- [ ] **Step 2: Manual check**

Strategy Approve → open Dispatch → draft shows 8% discount + weekday package dirty → user still must Approve in Dispatch before commit.

- [ ] **Step 3: Commit**

```bash
git add src/context/AppState.tsx src/pages/StrategyPage.tsx src/sim/SimContext.tsx src/main.tsx
git commit -m "feat(sim): bridge strategy approval into dispatch draft hints"
```

---

### Task 7: Electron shell + NSIS Windows installer

**Files:**
- Modify: `vite.config.ts` — set `base: './'`
- Create: `electron/main.cjs`
- Create: `electron/preload.cjs`
- Create: `electron-builder.yml`
- Modify: `package.json` — main, scripts, build config, devDependencies `electron`, `electron-builder`, `concurrently`, `wait-on` (or `cross-env`)
- Modify: `.gitignore` — `release/`, `dist-electron/` if needed

**Interfaces:**
- Consumes: Vite `dist/`
- Produces: `release/FuxiPulse Setup *.exe`

- [ ] **Step 1: Set Vite base**

```ts
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
```

Confirm `npm run build` and `npm run preview` still work with hash routes.

- [ ] **Step 2: Electron main**

`electron/main.cjs`:

```js
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1120,
    minHeight: 720,
    backgroundColor: '#0B1F3A',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

`preload.cjs`: empty bridge or `contextBridge.exposeInMainWorld('fuxiDesktop', { version: '1.0.0' })`.

- [ ] **Step 3: package.json scripts**

```json
{
  "main": "electron/main.cjs",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "electron:dev": "concurrently -k \"vite\" \"wait-on http://127.0.0.1:5173 && cross-env VITE_DEV_SERVER_URL=http://127.0.0.1:5173 electron .\"",
    "dist:win": "npm run build && electron-builder --win nsis"
  }
}
```

`electron-builder.yml`:

```yaml
appId: com.ent207tc.fuxipulse
productName: FuxiPulse
directories:
  output: release
files:
  - dist/**/*
  - electron/**/*
  - package.json
win:
  target:
    - target: nsis
      arch: [x64]
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
```

Install deps:

```bash
npm install -D electron electron-builder concurrently wait-on cross-env
```

- [ ] **Step 4: Build installer**

```bash
npm run dist:win
```

Expected: `release/FuxiPulse Setup <version>.exe` (version from `package.json`).

- [ ] **Step 5: Offline acceptance (manual)**

1. Disconnect network (or firewall).
2. Install `.exe`, launch from Start Menu.
3. Open Sandbox → Dispatch (set discount, Approve) → Advance 7 → Daily shows logs.
4. Confirm legacy `/#/` Dashboard still opens.
5. Reset restores baseline.

- [ ] **Step 6: Commit**

```bash
git add vite.config.ts electron electron-builder.yml package.json package-lock.json .gitignore
git commit -m "feat(desktop): package FuxiPulse as offline Windows NSIS installer"
```

Do not commit large `release/*.exe` binaries unless the team explicitly wants them in git; prefer CI artifact or USB handoff. Add `release/` to `.gitignore`.

---

### Task 8: README + acceptance checklist doc

**Files:**
- Modify: `README.md`
- Create: `docs/superpowers/plans/acceptance-ops-simulator.md` (short checklist mirroring spec §8)

- [ ] **Step 1: Document how to run**

README sections: Web `npm run dev`; Tests `npm test`; Desktop `npm run electron:dev`; Installer `npm run dist:win`; note offline + hash routes.

- [ ] **Step 2: Commit**

```bash
git add README.md docs/superpowers/plans/acceptance-ops-simulator.md
git commit -m "docs: document ops simulator run and Windows install flow"
```

---

## Spec coverage self-check

| Spec requirement | Task |
|------------------|------|
| Sandbox / dispatch / daily routes | 3, 4, 5 |
| CityRail module mapping UX | 3–5 |
| Fixtures + pure engine rules | 1 |
| Approve before commit; advance uses committed | 2, 4 |
| Keep legacy pages | 3 (nav), 7 (smoke) |
| Offline Windows NSIS | 7 |
| Strategy may enqueue dispatch | 6 |
| Unit tests for `runDay` | 1 |
| `base: './'`, HashRouter | 2, 7 |
| Acceptance checklist | 7 step 5, 8 |

## Placeholder / consistency notes

- Elasticity and risk weights are fixed in Task 1 code blocks — UI must not invent a second formula.
- `CommittedPricing.dailyAdr` length always equals `calendar.length`.
- Router is **HashRouter** everywhere after Task 2.
