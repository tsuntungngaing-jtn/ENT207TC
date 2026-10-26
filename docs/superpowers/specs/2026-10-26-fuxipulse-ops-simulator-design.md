# FuxiPulse Homestay Operations Simulator — Design Spec

| Field | Detail |
|-------|--------|
| **Product** | FuxiPulse (subtitle: Homestay Operations Simulator) |
| **Module** | ENT207TC Digital Startup Lab |
| **Inspiration** | CityRail desktop simulation UX (modules mapped, not pixel-cloned) |
| **Approach** | Upgrade existing Vite/React app + Electron/NSIS Windows installer |
| **Data** | Bundled mock fixtures only (no server) |
| **Date** | 2026-10-26 |
| **Status** | Ready for user review (self-reviewed) |

## 1. Problem & goal

Course deliverable must demonstrate a **runnable hotel/homestay operations simulation**, not a localhost-only screenshot story. Mentors should install a Windows `.exe`, open the app offline, and operate a closed loop: spatial demand sandbox → pricing dispatch with human approval → daily operations report.

CityRail is the interaction reference (edit assumptions → live KPIs → advance time → report). Domain is Tengchong homestay pricing/ops (partner: Fuxi Tower context; demo property Cloud Mist Homestay).

## 2. Non-goals (MVP)

- Real OTA/PMS APIs, login servers, cloud saves
- Online map tiles (would blank offline)
- Pixel-perfect CityRail clone or transit gameplay
- macOS/Linux installers, auto-update CDN
- Replacing or deleting existing Weak Season / Strategy / Knowledge pages

## 3. Architecture

```
Windows NSIS installer (electron-builder)
└── Electron shell (loads local dist only; no remote content URL)
    ├── FuxiPulse UI (Vite + React + TypeScript + Tailwind)
    │   ├── /sim      Operations sandbox
    │   ├── /dispatch Pricing dispatch desk
    │   ├── /daily    Operations daily report
    │   └── existing routes (dashboard, weak-season, strategy, …)
    ├── Simulation engine (pure TypeScript, no backend)
    └── Bundled fixtures (JSON / GeoJSON)
```

**Boundaries**

- Simulation rules run entirely in the client.
- Electron main process: open window + load packaged `dist`; optional `localStorage` for last committed prices.
- Existing Agent/Strategy approval UX remains; approved strategy items may enqueue into dispatch as pending pricing actions.

## 4. CityRail → FuxiPulse module map

| CityRail | FuxiPulse |
|----------|-----------|
| Line/station drawing | Supply layout: room inventory, channel weights, promo “corridors” |
| Population / function-zone layers | Demand heat, events/holidays, competitor ADR rings |
| OD desire lines | Guest-source / channel flow sketches |
| ATS dispatch | Pricing & ops dispatch + human confirm |
| Control-center KPIs | OCC, guests in-house, LOS, ADR, RevPAR, revenue, risk |
| Ops rankings / daily stats | Daily report: arrivals, stays, revenue, channel mix, alerts |

## 5. UI modules

### 5.1 Navigation

| Route | Stage | Role |
|-------|-------|------|
| `/sim` | Operations sandbox | Primary spatial stage; sim clock; advance 1d / 7d |
| `/dispatch` | Pricing dispatch | Calendar rates, knobs, Approve/Modify/Reject, live KPI preview |
| `/daily` | Operations daily | Day log cards, rankings, alerts, history of simulated days |
| `/`, `/weak-season`, `/strategy`, … | Existing | Diagnosis & narrative; strategy approve can feed dispatch queue |

Keep `/` as the default route. Add a sidebar group **Simulator** (`/sim`, `/dispatch`, `/daily`) with a clear “Sim” label so demos can start the loop in one click without removing the existing dashboard home.

### 5.2 Sandbox (`/sim`)

- Built-in simplified Tengchong vector map (GeoJSON), own property + competitor markers
- Layer toggles: demand heat, event intensity, competitor ADR, OD sketch lines
- Supply editors: sellable rooms by type, OTA channel weights, promo corridor strength → side panel “expected demand index”
- Top bar: simulation day index, season tag, Advance 1 day / 7 days

### 5.3 Dispatch (`/dispatch`)

- 14-day rate calendar: baseline, suggested, competitor average
- Knobs: global discount %, weekday package, weekend rate protect, price floor
- Human-in-the-loop: Approve / Modify / Reject (same spirit as Strategy page)
- Only **approved** changes commit into the engine; drafts preview only
- Right rail control center: OCC, in-house guests, avg LOS, ADR, RevPAR, revenue, risk

### 5.4 Daily report (`/daily`)

- Cards: arrivals, in-house, departures, average length of stay, room revenue, channel contribution
- Rankings: room-type contribution, channel TOP, alerts (vacancy risk, price gap)
- Replay prior simulated days from in-session `dailyLogs` (reset restores fixtures)

### 5.5 Visual

- Keep navy/teal SaaS shell; sandbox may use a darker console strip without a second brand system
- Emphasis: change a control → numbers move immediately

## 6. Data & simulation engine

### 6.1 Fixtures (packaged)

| Asset | Purpose |
|-------|---------|
| `fixtures/property.json` | Cloud Mist: 12 rooms, types, base ADR |
| `fixtures/calendar-baseline.json` | 28-day demand index, holidays, weather bands |
| `fixtures/competitors.json` | Points + weekday/weekend rates |
| `fixtures/tengchong.map.geojson` | Regions + heat grid for sandbox |
| `fixtures/channels.json` | OTA weights / illustrative commission |
| Existing `src/data/mock.ts` | Weak-season narrative continuity |

### 6.2 State flow

```
fixtures → SimContext
  sandbox edits → pendingAssumptions
  dispatch Approve → committedPricing
  runDay / runDays(n) → dailyLogs[] + liveKPIs
  → Daily page / control center / optional Dashboard KPI mirror
```

Reset rebuilds from fixtures. Optional `localStorage` remembers last committed pricing for offline demos.

### 6.3 Day rules (explainable, intentionally simple)

For each simulated day \(d\):

1. Demand index \(D_d\) = baseline × season/event × weather × promo-corridor strength  
2. Price pressure \(P_d\) = own ADR / competitor average (>1 = expensive)  
3. OCC ≈ clamp(\(D_d\) × priceElasticity(\(P_d\)) × channelReach, 0…100%)  
4. Guests in-house ≈ occupied rooms × persons-per-room (fixture constant, e.g. 2.1)  
5. Avg LOS = baseline LOS × (package uplift if weekday package active)  
6. Revenue = occupied rooms × ADR; RevPAR = revenue / total rooms  
7. Risk = vacancy + price-gap + weekday soft patch (aligns with existing risk story)

**Preview** on knob change (no log append). **Advance day** always allowed: it applies `committedPricing` only; unapproved drafts stay in preview and trigger a notice (see §6.4 and acceptance #4).

### 6.4 Guards

- Price below floor or inventory above total rooms: UI blocks; engine does not run  
- Unapproved drafts: advance-day uses committed prices only + toast  
- Missing map layer: empty-state copy, no white screen  

### 6.5 Tests

- Pure-function unit tests for `runDay` against fixed fixtures (OCC/revenue bands)  
- Manual acceptance: installed build, offline, full loop once  

## 7. Packaging (Windows)

- Electron loads **local** `dist` only (unlike CityRail desktop, which wraps `cityrailgame.com`)
- `vite` `base: './'` for packaged asset paths  
- `electron-builder` → **NSIS x64** installer  
- Scripts: `npm run dist:win` → `release/FuxiPulse Setup x.y.z.exe`  
- Dev: `npm run dev` (browser) + `npm run electron:dev` (shell)  
- Course MVP update model: ship a new installer (no update CDN)

## 8. Acceptance criteria

1. Install from `.exe`; launch from Start Menu; works **offline**  
2. Three stages reachable: sandbox / dispatch / daily, closed loop  
3. Change rates → Approve → advance 7 days → daily shows OCC, guests, LOS, revenue movement  
4. Advance without Approve does not apply draft prices (with notice)  
5. Reset restores fixture baseline  
6. Legacy routes still open without crash  
7. Primary mentor artifact is the **installer**, not localhost screenshots (screenshots only as report figures)

## 9. Implementation notes (for later plan)

- Extend current repo; do not fork a second app  
- Add `src/sim/` (engine + types + context) and `src/pages/Sim*.tsx` (or equivalent)  
- Keep existing Tailwind design tokens  
- Map rendering: lightweight SVG/Canvas over GeoJSON (e.g. simple path projection); avoid heavy online SDK  

## 10. Open decisions locked in brainstorming

| Decision | Choice |
|----------|--------|
| Product framing | Hotel/homestay ops simulator via CityRail module mapping |
| MVP scope | Full loop (sandbox + dispatch + daily) |
| Data | Dead/mock fixtures, no server |
| Delivery | Windows NSIS `.exe` installer |
| Tech approach | Upgrade FuxiPulse + Electron package |
