# FuxiPulse

AI-powered decision support dashboard for homestay weak-season operations. Includes a bundled **Homestay Operations Simulator** (sandbox → dispatch → daily) packaged as an offline Windows desktop app.

## Quick start

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173 (browser uses hash routes, e.g. `http://127.0.0.1:5173/#/sim`).

## Run & build

| Command | Purpose |
|---------|---------|
| `npm run dev` | **Web** — Vite dev server (browser) |
| `npm test` | **Tests** — Vitest unit tests (`src/sim/engine.test.ts`, etc.) |
| `npm run electron:dev` | **Desktop** — Electron shell + Vite dev server |
| `npm run dist:win` | **Installer** — production build + NSIS x64 Windows installer |

After `npm run dist:win`, the installer is written to:

```text
release/FuxiPulse Setup 1.0.0.exe
```

Hand this `.exe` to mentors for course demos; it is the primary deliverable artifact.

## Offline & routing

- The packaged Electron app loads **local** `dist/` assets only — no remote URLs required after install.
- Routing uses **HashRouter** (`#/` paths) so the app works from `file://` in Electron and from static hosting.
  - Examples: `/#/` (dashboard), `/#/sim`, `/#/dispatch`, `/#/daily`
- Disconnect the network (or use airplane mode) to verify offline behavior after installing from the `.exe`.

## Folder layout

| Path | Contents |
|------|----------|
| `src/` | React app (MVP prototype + simulator) |
| `src/sim/` | Simulation engine, fixtures, context |
| `electron/` | Electron main/preload for desktop shell |
| `docs/screenshots/` | Prototype screen stills |
| `docs/reports/` | Draft reports & Mentor script |
| `docs/scripts/` | Report/PDF helper scripts |
| `docs/superpowers/plans/` | Acceptance checklists & implementation plans |
| `week3/` | Design-journey notes + Visily inputs |
| `course-materials/` | Module handbook, CW brief, week slides |

## Pages

| Route | Screen |
|-------|--------|
| `/` | Operations Dashboard — property pulse, risk 78/100, agent pipeline |
| `/sim` | Operations sandbox — map layers, supply editors, advance 1d / 7d |
| `/dispatch` | Pricing dispatch — rate calendar, knobs, Approve / Modify / Reject |
| `/daily` | Operations daily report — KPI cards, rankings, alerts |
| `/weak-season` | Predict & Diagnose — 14-day forecast + root causes |
| `/research` | Research Agent — sources · reasoning · findings |
| `/strategy` | Strategy Center + Human Approval |
| `/ota` | OTA Operations |
| `/knowledge` | Knowledge Base |
| `/feedback` | Performance Feedback & learning loop |

Manual acceptance steps: [`docs/superpowers/plans/acceptance-ops-simulator.md`](docs/superpowers/plans/acceptance-ops-simulator.md).
