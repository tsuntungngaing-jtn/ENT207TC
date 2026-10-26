# Digital Prototype Report — Draft 1

| Field | Detail |
|-------|--------|
| **Project title** | FuxiPulse |
| **Team / group code** | Group10086 (ENT10086) |
| **Team members** | Morong.Yang; Yixuan Huang; Yi.Liu; Haoming Zeng; **Guanyu Han (Team Leader / 组长)**; Xiuling Wen; Juntong.Fan |
| **Team formed** | 8 September 2026 · Project assigned · Proposal submitted |
| **Industry partner** | Tengchong Xinling Fuxi Tower Hotel Management Co., Ltd. (腾冲心灵福禧楼酒店管理有限公司); industry contact “三丁” / Sanding team |
| **Module** | ENT207TC Digital Startup Lab |
| **Draft** | Digital Prototype Report Draft 1 |
| **Submission** | Week 4 Submission |
| **Institution** | XJTLU Entrepreneur College |
| **Clickable prototype (Pixso)** | https://pixso.net/app/design/np0Pd6gaAjO2V_lvodWLOw?page-id=0%3A1 |
| **Figma export** | `week3/exports/FuxiPulse.fig` (also in `evidence/wechat-2026-09-10/`) |
| **Visily export** | `week3/exports/visily-to-figma.vis` |
| **Local interactive build** | `npm run dev` → http://127.0.0.1:5173 |
| **Evidence pack** | `evidence/wechat-2026-09-10/` |
| **Version** | Draft 1 (foundation for the final Digital Prototype Report) |
| **Date** | October 2026 |

---

## 1. Problem Identification

### 1.1 Problem Statement

**Professional homestay operations staff working for a B2B homestay management company in Tengchong / Yunnan experience costly, late, and experience-dependent pricing and OTA decisions when weak / shoulder-season demand shifts, because market signals, competitor prices, and occupancy data are fragmented — causing empty rooms, ranking pressure, and revenue shortfall before coordinated action is taken.**

| Element | Specifics |
|---------|-----------|
| Real user group | Ops managers, OTA operators, property managers / frontline ops at a professional homestay ops company |
| Clear pain point | High-frequency decisions (esp. pricing & OTA action) still rely on individual experience + scattered data |
| Measurable impact | Occupancy / booking pace / listing rank / near-term revenue gap (demo framing in §1.3) |

**Source alignment**

- Team problem framing: *The problem.docx*; *Guanyu_Problem_Users.docx*  
- Partner meeting (20 Sep 2026): industry expert emphasised talent shortage, experience-dependent pricing (market price × competitor price × occupancy), and OTA-centric guest acquisition  

The core gap is **not** “no data exists.” Operators already touch OTA calendars, competitor listings, and property status. What they lack is a **timely, connected** way to detect weak-season risk, diagnose causes, decide explainable pricing / promotion tactics, and act across channels — with **human confirmation**.

### 1.2 Who Has This Problem?

**Target users (refined after partner alignment)**

After the 20 September requirements meeting and team analysis (*Guanyu_Problem_Users.docx*), we distinguish:

| Role | Who | Meaning |
|------|-----|---------|
| **Project partner** | Tengchong Xinling Fuxi Tower Hotel Management Co., Ltd. | Provides real scenarios, industry experience, potential test access |
| **Product user (primary)** | Homestay ops staff, OTA operators, property managers, ops managers inside that company | People who will open the app daily |
| **Problem owner / service object** | Homestay owners / investors whose properties the company manages | Feel empty rooms and revenue loss; buy ops services |
| **End beneficiaries** | Owners, ops company, guests | Better decisions and stay experience |

**When it happens**

- Weak / shoulder season and other demand soft patches  
- When booking pace and search interest soften **before** calendars look fully empty  
- When pricing must react to market benchmarks, competitors, and own occupancy at once  

**How frequently**

- Recurring each seasonal cycle; pricing and OTA checks are high-frequency ops work  
- Partner context: company has operated ~20 owned properties historically and touched ~100+ managed / franchised properties over ~10 years (meeting minutes — company background, not our sample size)

**Demo property in the prototype**

- **Cloud Mist Homestay** — 12 rooms, Tengchong, Yunnan (illustrative property inside the partner geography)

### 1.3 Why Does This Problem Matter?

| Impact type | Evidence / reasoning |
|-------------|----------------------|
| **Financial cost** | Soft occupancy + wrong or late price moves compound over days/weeks |
| **Time / efficiency** | Staff must manually stitch OTA apps, competitor checks, and occupancy |
| **Talent / knowledge risk** | Partner states professional pricing know-how is scarce; knowledge sits with individuals (*会议纪要* 20 Sep) |
| **Channel risk** | Guest acquisition is heavily OTA-dependent; pace/rank slips hurt conversion |
| **Scale limit** | Manual, experience-led ops does not scale as managed property count grows (*Guanyu_Problem_Users*) |
| **Market opportunity** | B2B ops companies serving many owners need reusable decision support, not one-off gut feel |

**Validation evidence used in Draft 1 (practical, not a literature review)**

1. **Partner / expert meeting — 20 Sep 2026, 16:00–17:20**  
   - Sources: `evidence/wechat-2026-09-10/2026-09-20_AI民宿管家项目需求对齐与进度沟通_会议纪要.docx` + transcript doc  
   - Participants context: ENT10086 team; industry sharer “三丁”; EEH coordination  
   - Confirmed themes: talent & knowledge gap; pricing via market / competitor / occupancy; OTA as main acquisition channel; ~23 ops needs previously listed; some items paused (PMS-heavy tasks; review reply because platforms already offer AI)  
   - **Verbal industry judgements** (e.g. “~90% OTA acquisition”, “half the industry exits in 5 years”, “&lt;5 people nationwide can explain pricing logic”) are recorded as **unverified oral claims** — not treated as proven statistics in this draft  

2. **Team problem / user docs**  
   - `Guanyu_Problem_Users.docx` — overall ops cost/efficiency/scale problem; users refined to professional ops company staff  
   - `The problem.docx` — weak-season insight gap; FuxiPulse as decision-support platform; partner meeting questions on data availability  

3. **UX / weekly process evidence**  
   - Han Guanyu W3 record: meeting narrowed broad “AI butler” toward pricing MVP with human confirmation  
   - Yi Liu W3: OTA-agent concept; Visily–Figma–Pixso prep  
   - Haoming Zeng W3: Visily → Figma → Pixso asset transfer for core screens  

4. **Prototype demo metrics (illustrative mock data only)**  
   - Occupancy ~43%; risk score **78/100**; weekday softness framing; shortfall on the order of **¥18.6k / two weeks** if no action  
   - These **frame** the decision UI; they are **not** finished field validation  

5. **Still open for later drafts**  
   - Confirmed data fields / authorisation for Tengchong ~27 properties / ~10 test properties (mentioned in minutes, not yet locked)  
   - Formal interview quote log with n= and dates beyond the 20 Sep meeting  

---

## 2. Current Solutions and Their Limitations

| Existing approach | What happens today | Why insufficient |
|-------------------|--------------------|------------------|
| **Manual OTA merchant apps** | Check Ctrip / Meituan / Fliggy separately | Fragmented; no single risk + diagnosis + action loop |
| **Experience-based pricing** | Staff combine market feel, neighbour prices, occupancy mentally | Hard to repeat; scarce specialist knowledge (partner view) |
| **Spreadsheets / chat notes** | Track rates or tasks offline | Not live; weak root-cause explanation |
| **Platform AI (e.g. review reply)** | Some OTA features already automate narrow tasks | Does not cover weak-season diagnose → approve → multi-channel act |
| **Hotel-grade RMS / full auto repricing** | Enterprise tools / long-term “quant trading” vision | Too heavy for semester MVP; interfaces/PMS not available yet; auto price-write is not our Week-4 claim |
| **Broad “AI butler” wish-list (~23 needs)** | Order entry, room-status sync, WeChat guest contact, etc. | Many items blocked on PMS/API; partner + team agreed to **narrow scope** |

**Scope decision for this course:** keep a **human-confirmed decision-support loop** (detect → diagnose → recommend → approve → OTA visibility), not a claim of full automatic OTA price rewriting.

---

## 3. Target User Definition

### 3.1 Problem Owner vs Product User

They are **related but not identical**:

- **Problem Owner:** Homestay owners / investors whose revenue drops in weak season  
- **Product User:** Professional ops / OTA / property managers inside the partner management company who make daily decisions for those properties  

FuxiPulse is designed for the **Product User**, delivering value that the Problem Owner feels as better occupancy / RevPAR outcomes.

### 3.2 Simple User Persona

| Category | Description |
|----------|-------------|
| **User group** | Professional homestay ops / OTA operator at a Tengchong-focused management company |
| **Age / background** | Working-age hospitality ops staff; OTA-fluent; limited formal revenue-management training [NEED TEAM INPUT: exact age band if required] |
| **Main goal** | Protect occupancy and revenue in weak / shoulder season with explainable tactics, without uncontrolled auto price changes |
| **Current frustration** | Must stitch market, competitor, and occupancy signals manually; decisions feel late and hard to justify |
| **Digital behaviour** | Daily OTA merchant apps + WeChat; open to web dashboard; low trust in black-box auto repricing |
| **Need from solution** | Early risk signal + clear “why” + ranked tactics + **Accept / Modify / Reject** + channel pulse |

**Working persona label:** “Tengchong Ops Lead” — manages OTA-dependent properties (demo: Cloud Mist Homestay, 12 rooms).

---

## 4. Solution Concept

### 4.1 One Sentence Solution

**We propose a digital application, FuxiPulse, that turns fragmented occupancy, market, and OTA signals into an AI-assisted detect → diagnose → research → approve → act → learn loop to help professional homestay operations staff solve late, experience-dependent weak-season pricing and channel decisions.**

### 4.2 How The Solution Works

```text
Open Dashboard (detect risk)
        ↓
Weak Season Analysis (forecast + diagnose)
        ↓
Research Agent (grounded context)                 [supporting]
        ↓
Strategy Center (ranked tactics + Approve / Modify / Reject)
        ↓
OTA Operations (channel pace / rank / sync after approval)
        ↓
Performance Feedback (before / after → next cycle) [supporting]
```

Aligned with partner + team MVP logic from the 20 Sep discussion:

**Data in → AI analysis → explainable recommendation → human confirmation → record outcome**  
(Auto PMS/OTA write is future work, not Draft 1 proof.)

| Step | User action | System processing | Benefit |
|------|-------------|-------------------|---------|
| 1 | Open property pulse | Risk score + pace / search factors | Early warning |
| 2 | Review diagnosis | ~14-day demand + root causes | Know *why* |
| 3 | Optional research | Sources · reasoning · findings | Trust / less black box |
| 4 | Approve / modify / reject | Ranked tactics with impact & risk | Human keeps control |
| 5 | Check OTA layer | Share / pace / rank across channels | Action path to distribution |
| 6 | Review feedback | Before/after metrics | Learning loop |

**Clickable prototype:** https://pixso.net/app/design/np0Pd6gaAjO2V_lvodWLOw?page-id=0%3A1

---

## 5. Chosen Features

Three **core** features for Draft 1 (module requirement). Supporting screens follow.

### Feature 1 — Weak Season Analysis (Predict & Diagnose)

| Field | Detail |
|-------|--------|
| **Name** | Weak Season Analysis |
| **User problem addressed** | Staff see soft calendars but not near-term demand path or root causes |
| **User interaction** | Open analysis → read prediction vs historical → review problem banner → inspect top causes |
| **System logic** | Combine occupancy / booking patterns with market signals → forecast → rank causes (weekday softness, events, competitive pricing, etc.) |
| **Why selected** | Matches partner pain of experience-only judgement; turns “rooms empty” into a targeted response |
| **Evidence** | `docs/screenshots/fuxipulse-02-predict-diagnose.png` |

### Feature 2 — Strategy Center (Human Approval)

| Field | Detail |
|-------|--------|
| **Name** | Strategy Center + Human Approval |
| **User problem addressed** | Even with a diagnosis, staff need ranked, explainable tactics they can trust enough to execute |
| **User interaction** | Review featured recommendation → compare cards → **Approve / Modify / Reject** |
| **System logic** | Rank tactics (e.g. weekday package, selective rate adjust, visibility boost) with impact & risk; block go-live until human confirmation |
| **Why selected** | Meeting + UX work both insist on human confirmation for first MVP; protects margin and trust |
| **Evidence** | `docs/screenshots/fuxipulse-04-strategy-approval.png`; earlier mobile Pricing Accept/Modify/Ignore in `docs/screenshots/journey/03-pricing-mobile.png` |

### Feature 3 — OTA Operations

| Field | Detail |
|-------|--------|
| **Name** | OTA Operations |
| **User problem addressed** | Strategy that never hits channels does not stop losses; multi-OTA monitoring is manual |
| **User interaction** | Inspect channel share / booking pace / listing rank → monitor post-approval sync language |
| **System logic** | Surface distribution pulse; attach approved actions to channels; keep human confirmation before sync claims |
| **Why selected** | Partner stresses OTA as primary acquisition surface; closes detect→act loop |
| **Evidence** | `docs/screenshots/fuxipulse-06-ota.png` |

### Supporting features

| Feature | Role |
|---------|------|
| Operations Dashboard | Detection entry + risk score + pipeline |
| Research Agent | Explainable external / market context |
| Knowledge Base | Reusable ops / pricing / OTA playbooks |
| Performance Feedback | Before/after learning loop |

---

## 6. Prototype Development Journey Evidence

This section shows **iteration**, with files recovered from the team WeChat file transfer (Sep–Oct 2026).

| Step | Artefact (path) | What changed | Why / feedback |
|------|-----------------|--------------|----------------|
| **1. Initial notes / research** | `The problem.docx`; `Guanyu_Problem_Users.docx`; `Guanyu_Theapp_wewill_bulid.docx` | From broad “AI homestay butler” → ops cost/efficiency/scale + weak-season decision support | Partner is a **B2B ops company**; users refined to professional ops staff, not only owner-operators |
| **2. Partner alignment meeting** | `2026-09-20_…会议纪要.docx` + transcript | Pricing inputs clarified (market / competitor / occupancy); auto-write de-scoped for MVP; OTA diagnosis retained as frame | EEH + industry expert: semester needs a runnable demo, not a full PMS-integrated product in 8 weeks |
| **3. Hand / low-fi mobile UX** | `UX_Design_Mobile_Low_Fidelity_Wireframes-English.zip` → `docs/screenshots/journey/` (`01-today` … `04-market`); `Homestay-UX-Design-ZH.docx` | Four mobile pages: **Today / Operations / Pricing / Market**; Pricing already had Accept · Modify · Ignore | Han Guanyu UX v1 (20 Sep): prove task focus + human decision control on phone |
| **4. Visily wireframes** | `week3/exports/visily-to-figma.vis`; `week3/visily-input/*.png` | Converted / cleaned digital screens for desktop ops loop | Course Week 3 workflow; denser dashboard needs more space than phone |
| **5. Figma refinement** | `week3/exports/FuxiPulse.fig` | Frame alignment, hierarchy, consistent shell | Haoming Zeng W3: Visily → Figma transfer; layer fixes |
| **6. Pixso interactive prototype** | https://pixso.net/app/design/np0Pd6gaAjO2V_lvodWLOw?page-id=0%3A1 | Click-through for Checkpoint / Draft 1 demo | Mentor can walk detect → diagnose → approve → OTA without a finished backend |

**Architecture shift (documented learning):** mobile low-fi was useful for task hierarchy; after the pricing/OTA focus solidified, the team moved toward a **desktop dashboard** for multi-metric comparison (Han Guanyu W3 judgement — not yet user-tested).

**Demo path:** Dashboard → Weak Season → Research → Strategy (Approve) → OTA → Feedback  

**Still images:** `docs/screenshots/fuxipulse-01` … `07` plus journey mobiles above.

---

## 7. Digital Prototype Overview

### 7.1 Prototype Purpose

Users can: see weak-season risk; inspect forecast/diagnosis; review research context; approve/modify/reject strategies; inspect OTA channel pulse; open knowledge and feedback screens.  
This proves **problem → solution → features → interaction**, not production OTA API write access.

### 7.2 Main Screens

| Screen | Purpose |
|--------|---------|
| 1. Operations Dashboard | Early risk visibility; property pulse; agent pipeline |
| 2. Weak Season Analysis | ~14-day forecast + problem detection + top causes |
| 3. Research Agent | Sources · reasoning · findings |
| 4. Strategy Center | Ranked tactics + human approval |
| 5. OTA Operations | Channel share, pace, rank; post-approval sync framing |
| 6. Knowledge Base | Shared playbooks / operating memory |
| 7. Performance Feedback | Before/after into next cycle |

**Connections:** sidebar navigation; primary story path **Dashboard → Weak Season → (Research) → Strategy → OTA → (Feedback)**.

---

## 8. Future Development Direction

After Draft 1 (do **not** claim these as finished):

| Next | Notes |
|------|-------|
| Build core loop in code | Detect → diagnose → strategy approval → feedback (Vite/React repo) |
| Validation | Lock data fields with partner; run structured ops-user tests (plan ≥10 related users — *Guanyu_Theapp*) |
| Technology | FastAPI / Postgres / agents discussed as later stack options; current prototype evidence is Pixso + React UI |
| OTA / PMS | Prefer CSV/Excel or mocked import until interfaces/authorisation exist; **no auto price-write** as Week-4 success criterion |
| Deprioritise for now | Full 23-need butler, review-reply plugin, robot housekeeping, continuous auto repricing |

---

## Appendix A — Five Draft 1 Questions

| # | Question | Answer |
|---|----------|--------|
| 1 | What problem? | Late, fragmented, experience-dependent weak-season pricing & OTA decisions for professional homestay ops |
| 2 | Who / when? | Ops / OTA / property managers at partner company; weak/shoulder season when pace softens early |
| 3 | Who uses the solution? | Same professional ops users (owners are problem owners / beneficiaries) |
| 4 | How large / important? | Recurring seasonal + channel cost; partner reports large managed portfolio exposure; verbal macro stats marked unverified |
| 5 | How does the prototype solve it? | FuxiPulse clickable loop: detect → diagnose → approve → OTA visibility → learn |

---

## Appendix B — Draft 1 Checklist

| Requirement | Completed? |
|-------------|------------|
| Problem clearly defined | Yes |
| User identified | Yes (owner ≠ user clarified) |
| Evidence included | Yes — 20 Sep meeting + team docs + UX journey files |
| Solution explained | Yes |
| Three features justified | Yes |
| Prototype journey documented | Yes — mobile → Visily → Figma → Pixso with file paths |
| Cover fields complete | Yes — Group10086 + full 7-member roster |
| Current solutions & limitations | Yes |
| Future development honest | Yes |

---

## Appendix C — Remaining Team Inputs (short)

1. Any additional interview notes beyond 20 Sep (with permission to quote)  
2. Confirmation of which 3 features Mentor already approved in Checkpoint 1 (if different)  
3. Optional: 1–2 published sources if you want secondary research beyond partner testimony  

---

## Appendix D — Evidence Index

| File | Use in report |
|------|----------------|
| `evidence/wechat-2026-09-10/2026-09-20_…会议纪要.docx` | Partner validation |
| `evidence/wechat-2026-09-10/…转写结果.docx` | Meeting transcript |
| `evidence/wechat-2026-09-10/Guanyu_Problem_Users.docx` | Problem + user refinement |
| `evidence/wechat-2026-09-10/Guanyu_Theapp_wewill_bulid.docx` | Solution / data / test plan |
| `evidence/wechat-2026-09-10/The problem.docx` | Early English problem + FuxiPulse statement |
| `evidence/wechat-2026-09-10/韩冠宇+W3每周记录.docx` | UX journey + leadership + MVP narrowing |
| `evidence/wechat-2026-09-10/刘翌ENT207TC Week 3.docx` | OTA-agent thinking + tool workflow |
| `evidence/wechat-2026-09-10/W3 Weekly Record(1).docx` | Visily–Figma–Pixso transfer evidence |
| `week3/exports/FuxiPulse.fig` / `visily-to-figma.vis` | Design chain artefacts |
| `docs/screenshots/journey/*.png` | Mobile low-fi evidence |
| Pixso URL | Clickable MVP v0.1 |

---

*End of Digital Prototype Report Draft 1 — updated with WeChat evidence pack (Sep–Oct 2026).*
