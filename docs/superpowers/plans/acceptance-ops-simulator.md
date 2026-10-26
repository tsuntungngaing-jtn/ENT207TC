# FuxiPulse Ops Simulator — Acceptance Checklist

Mirrors [design spec §8](../specs/2026-10-26-fuxipulse-ops-simulator-design.md#8-acceptance-criteria).

**Installer:** `release/FuxiPulse Setup 1.0.0.exe` (build with `npm run dist:win`).

Run offline where noted — disconnect network or use airplane mode after install.

---

## Checklist

- [ ] **1. Offline install & launch** — Install from `release/FuxiPulse Setup 1.0.0.exe`; launch from Start Menu; app opens with no network.

- [ ] **2. Three-stage closed loop** — Reach all simulator stages without crash:
  - Sandbox (`/#/sim`)
  - Dispatch (`/#/dispatch`)
  - Daily (`/#/daily`)

- [ ] **3. Approve → advance → daily KPIs** — On Dispatch: change rates → **Approve** → on Sandbox **Advance 7 days** → Daily shows OCC, guests in-house, LOS, and revenue movement.

- [ ] **4. Unapproved drafts ignored** — Change rates on Dispatch but do **not** Approve → Advance day → engine uses last committed prices only; UI shows a notice (draft not applied).

- [ ] **5. Reset baseline** — Use Reset → fixture baseline restored (calendar, pricing, logs).

- [ ] **6. Legacy routes** — Open existing pages without crash, e.g. `/#/` (dashboard), `/#/weak-season`, `/#/strategy`.

- [ ] **7. Primary artifact** — Mentor demo uses the **Windows installer**, not localhost screenshots (screenshots only as report figures).

---

## Quick smoke path (suggested order)

1. Install `release/FuxiPulse Setup 1.0.0.exe` → launch offline.
2. `/#/sim` → adjust a supply control → Advance 1 day.
3. `/#/dispatch` → set discount → **Approve**.
4. `/#/sim` → **Advance 7 days**.
5. `/#/daily` → confirm logs and KPI cards updated.
6. `/#/` → dashboard still loads.
7. Reset → baseline restored.
