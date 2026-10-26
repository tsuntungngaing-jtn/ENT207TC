"""Generate Checkpoint 1 Mentor presentation script PDF (English)."""

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = Path(__file__).resolve().parent / "Checkpoint1-Mentor-Presentation-Script.pdf"

NAVY = HexColor("#0B1F3A")
TEAL = HexColor("#0D9488")
SLATE = HexColor("#334155")
LIGHT = HexColor("#F1F5F9")
LINE = HexColor("#CBD5E1")


def styles():
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            textColor=NAVY,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            textColor=SLATE,
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=NAVY,
            spaceBefore=14,
            spaceAfter=8,
            borderPadding=3,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=15,
            textColor=TEAL,
            spaceBefore=10,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=SLATE,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        ),
        "script": ParagraphStyle(
            "script",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9.5,
            leading=13.5,
            textColor=HexColor("#1E293B"),
            alignment=TA_LEFT,
            leftIndent=8,
            rightIndent=4,
            spaceAfter=8,
            borderPadding=4,
        ),
        "note": ParagraphStyle(
            "note",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11.5,
            textColor=HexColor("#64748B"),
            spaceAfter=6,
        ),
        "table_h": ParagraphStyle(
            "table_h",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=white,
        ),
        "table_c": ParagraphStyle(
            "table_c",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
            textColor=SLATE,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=HexColor("#94A3B8"),
            alignment=TA_CENTER,
        ),
    }


def script_block(s, text):
    return Paragraph(f'“{text}”', s["script"])


def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(18 * mm, 12 * mm, A4[0] - 18 * mm, 12 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(HexColor("#94A3B8"))
    canvas.drawString(18 * mm, 7 * mm, "ENT207TC · FuxiPulse · Checkpoint 1")
    canvas.drawRightString(A4[0] - 18 * mm, 7 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build():
    s = styles()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=18 * mm,
        title="FuxiPulse Checkpoint 1 — Mentor Presentation Script",
        author="FuxiPulse Team · ENT207TC",
    )
    story = []

    # Cover
    story.append(Spacer(1, 28 * mm))
    story.append(Paragraph("FuxiPulse", s["cover_title"]))
    story.append(
        Paragraph(
            "Checkpoint 1 Decision Gate<br/>Mentor Presentation Script &amp; Q&amp;A",
            s["cover_sub"],
        )
    )
    story.append(Spacer(1, 6 * mm))
    story.append(
        Paragraph(
            "ENT207TC Digital Startup Lab · Week 4<br/>"
            "MVP v0.1 Clickable Prototype<br/>"
            "Product: AI decision-support for homestay weak-season operations",
            s["cover_sub"],
        )
    )
    story.append(Spacer(1, 10 * mm))
    story.append(
        Paragraph(
            "<b>How to use this document</b><br/>"
            "Speak the italic quoted lines aloud. Bracketed [placeholders] should be "
            "replaced with your real interview quotes, peer feedback, or research sources "
            "before the meeting. Target length: <b>8–10 minutes</b> + Q&amp;A.",
            s["note"],
        )
    )
    story.append(PageBreak())

    # Opening
    story.append(Paragraph("0. Opening  (~30 seconds)", s["h1"]))
    story.append(
        script_block(
            s,
            "Hello — we are the FuxiPulse team. Today we are not claiming a finished product. "
            "We are asking for a clear decision: Is this problem worth continuing? Is the "
            "solution concept clear? Is the prototype realistic enough to start building? "
            "I will cover four parts — problem, validation evidence, solution concept, and "
            "a live clickable demo — and end with an explicit continue / revise / pivot ask.",
        )
    )

    # Problem
    story.append(Paragraph("1. The Problem  (~1.5 minutes)", s["h1"]))
    story.append(Paragraph("Who experiences it", s["h2"]))
    story.append(
        script_block(
            s,
            "The primary users are independent and small-chain homestay operators and property "
            "managers in tourist destinations. They rely heavily on OTAs such as Ctrip, Meituan, "
            "and Fliggy; they usually have little or no dedicated revenue-ops staff; and they "
            "must make pricing and promotion decisions under time pressure in the weak or "
            "shoulder season. Our demo property is Cloud Mist Homestay — a 12-room property "
            "in Tengchong, Yunnan — standing in for a typical OTA-dependent independent "
            "homestay, not a large hotel chain with a full revenue team.",
        )
    )
    story.append(Paragraph("What exactly happens", s["h2"]))
    story.append(
        script_block(
            s,
            "In weak or shoulder season, occupancy and revenue drop sharply. Booking pace often "
            "softens early, but owners usually notice too late — after empty rooms and slipping "
            "channel ranks have already compounded. The core gap is not a lack of data. Operators "
            "already have OTA calendars, guest messages, and competitor listings. What they lack "
            "is a timely, connected way to: see weak-season risk early; diagnose why demand is "
            "falling; decide what to do on pricing and promotions; and act across OTA channels "
            "before losses widen.",
        )
    )
    story.append(Paragraph("Why it matters", s["h2"]))
    story.append(
        script_block(
            s,
            "In weak season, small delays are expensive. When forward bookings fall and weekday "
            "demand softens, competitors can cut rates, listing ranks slip, and conversion drops "
            "across channels. Without early diagnosis and coordinated OTA action, revenue "
            "shortfalls stack up over days and weeks. This is not “another pretty dashboard” — "
            "it is a real operational timing and decision problem.",
        )
    )

    # Validation
    story.append(Paragraph("2. Problem Validation  (~2 minutes)", s["h1"]))
    story.append(
        Paragraph(
            "This is the heart of the decision gate: evidence that the problem is not imagined.",
            s["note"],
        )
    )
    story.append(Paragraph("Evidence A — Industry / structural observation", s["h2"]))
    story.append(
        script_block(
            s,
            "Independent homestays depend on OTAs for discovery and bookings. Seasonality in "
            "tourist destinations is well known. Operators juggle multiple apps for calendars, "
            "prices, and ranks, without a revenue team to synthesise signals into one decision "
            "path. That friction is structural, not hypothetical.",
        )
    )
    story.append(Paragraph("Evidence B — Tool / workflow gap", s["h2"]))
    story.append(
        script_block(
            s,
            "Existing channel back-ends show “rooms are empty today,” but they rarely answer in "
            "one place: Is this weekday softness, a price gap, or conversion drop? Should we "
            "push a package or cut rates? How do we sync the decision across channels? The pain "
            "is not “need more charts” — it is a missing detect-to-action loop.",
        )
    )
    story.append(Paragraph("Evidence C — Conversations / peer feedback / research", s["h2"]))
    story.append(
        script_block(
            s,
            "Replace with your real evidence before presenting: [peer Green/Yellow/Red outcome]; "
            "[quotes from X operators or hospitality contacts — e.g. “we adjust prices by gut "
            "feel in weak season,” “we hesitate to cut rates across every channel,” “weekdays "
            "are harder than weekends”]; [1–2 secondary sources on Yunnan/Tengchong seasonality "
            "or small-lodging revenue management].",
        )
    )
    story.append(Paragraph("Honest boundary (say this — it builds trust)", s["h2"]))
    story.append(
        script_block(
            s,
            "Numbers in the prototype — for example occupancy around 43%, risk score 78/100, "
            "roughly ¥18.6k shortfall over two weeks if no action — are illustrative mock data "
            "for Cloud Mist Homestay. They frame the decision problem; they are not finished "
            "field validation. Our next step is to strengthen interviews, seasonality sources, "
            "and to separate validated claims from demo metrics. Today we ask whether the "
            "problem direction is sound enough to continue validating and building — not "
            "whether every KPI is already proven.",
        )
    )

    # Solution
    story.append(Paragraph("3. Solution Concept  (~1 minute)", s["h1"]))
    story.append(
        script_block(
            s,
            "One-line concept: Our solution will help independent and small-chain homestay "
            "operators solve late, fragmented weak-season decision-making by turning scattered "
            "OTA and demand signals into an AI-assisted detect → diagnose → research → approve → "
            "act → learn operations loop.",
        )
    )
    story.append(
        script_block(
            s,
            "FuxiPulse is an AI operations decision-support dashboard. It does not replace the "
            "operator. It compresses scattered signals so a small team can detect risk, "
            "understand causes, choose a tactic, push approved actions to OTAs, and learn from "
            "results. Design principle: no automatic price change without human confirmation. "
            "AI proposes; humans decide — because owners carry the margin risk.",
        )
    )

    # Demo
    story.append(Paragraph("4. Clickable Prototype Demo — MVP v0.1  (~3–4 minutes)", s["h1"]))
    story.append(
        Paragraph(
            "Core journey to click live: <b>Dashboard → Weak Season → Research → Strategy "
            "(Approve) → OTA → Feedback</b>",
            s["body"],
        )
    )
    story.append(Paragraph("① Operations Dashboard", s["h2"]))
    story.append(
        script_block(
            s,
            "This is the entry point. One glance answers: Are we in trouble? You see property "
            "pulse — occupancy, ADR, trends — a composite risk score, and agent pipeline status. "
            "Operators should not need five OTA apps just to feel the risk.",
        )
    )
    story.append(Paragraph("② Weak Season Analysis (Predict &amp; Diagnose)", s["h2"]))
    story.append(
        script_block(
            s,
            "Knowing occupancy is low is not enough. Here we show a near-term ~14-day demand "
            "view and root-cause diagnosis — for example weekday tourism softness, price gap "
            "versus competitors, or falling OTA conversion. The goal is a targeted response: "
            "do not cut weekend rates when the real gap is midweek demand.",
        )
    )
    story.append(Paragraph("③ Research Agent", s["h2"]))
    story.append(
        script_block(
            s,
            "Small teams lack time for desk research in a weak-season crunch. This screen "
            "surfaces sources, a short reasoning chain, and findings from tourism signals, "
            "weather, events, OTA market context, and hospitality playbooks — so recommendations "
            "are explainable, not a black box.",
        )
    )
    story.append(Paragraph("④ Strategy Center + Human Approval", s["h2"]))
    story.append(
        script_block(
            s,
            "This is the decision heart. The system ranks tactics — for example a weekday autumn "
            "package, a selective weekday rate adjustment, or content/ranking boost — with "
            "expected impact and risk. The operator can Approve, Modify, or Reject. Control "
            "stays with the human.",
        )
    )
    story.append(Paragraph("⑤ OTA Operations", s["h2"]))
    story.append(
        script_block(
            s,
            "Diagnosis without execution does not stop losses. After approval, actions move to "
            "the channel layer: monitor share, booking pace, and listing rank, and sync approved "
            "pricing or package actions across OTAs.",
        )
    )
    story.append(Paragraph("⑥ Knowledge Base + Performance Feedback (brief)", s["h2"]))
    story.append(
        script_block(
            s,
            "Knowledge holds reusable playbooks across pricing, product, distribution, and "
            "demand. Feedback compares before/after metrics and feeds outcomes into the next "
            "cycle — so FuxiPulse becomes an evolving ops system, not a one-shot report. "
            "MVP scope note: v0.1 prioritises this core path and seven screens; full live OTA "
            "APIs, complex permissions, and multi-property scale are later iterations — not "
            "what this checkpoint must prove.",
        )
    )

    # Close
    story.append(Paragraph("5. Close — Ask for the Decision  (~1 minute)", s["h1"]))
    story.append(
        script_block(
            s,
            "To summarise three things: First, the problem is meaningful — OTA-dependent small "
            "homestays react late in weak season, and losses compound. Second, the solution is "
            "clear and buildable — an AI-assisted ops loop with human approval, scoped for this "
            "semester. Third, the prototype is clickable — from risk detection through approval "
            "to channel action, with features chosen for a reason.",
        )
    )
    story.append(
        script_block(
            s,
            "The decision we request today: Should this team continue developing FuxiPulse? "
            "If Continue — we will strengthen real-user validation and push the prototype toward "
            "buildable core features. If Revise — please tell us which user, scenario, or feature "
            "to narrow. If Pivot — we would rather discover that in Week 4 than in Week 9. "
            "Thank you — we welcome your questions.",
        )
    )

    story.append(PageBreak())

    # Q&A
    story.append(Paragraph("Q&amp;A — Anticipated Mentor Questions", s["h1"]))
    story.append(
        Paragraph(
            "Use these as short spoken answers. Keep each reply under ~45 seconds unless the "
            "mentor digs deeper.",
            s["note"],
        )
    )

    qa = [
        (
            "Q1. How is this different from a hotel RMS / revenue management system?",
            "We target independent and small-chain homestays without a dedicated revenue team. "
            "The product emphasises explainable research, human approval, and an OTA execution "
            "loop — not fully automated enterprise pricing for large hotels.",
        ),
        (
            "Q2. Is your validation strong enough to continue?",
            "Directional evidence exists: structural OTA dependence, the detect-to-action gap, "
            "and [peer / interview / research evidence you insert]. Quantitative KPIs in the "
            "UI are still demo metrics. We treat that honestly and plan interviews plus "
            "seasonality sources next. Continuity should be judged on problem quality and "
            "buildable scope, not finished field stats.",
        ),
        (
            "Q3. Why insist on human-in-the-loop?",
            "Pricing and promotions directly affect margin and channel reputation. Owners carry "
            "the risk, so they need final control. It also improves trust and makes the product "
            "credible for real operators and for classroom demonstration.",
        ),
        (
            "Q4. Can you realistically build this in one semester?",
            "Yes for a focused MVP. v0.1 already walks the core journey. Next we prioritise "
            "detect → diagnose → strategy approval → feedback. OTA sync can start as mocked or "
            "semi-manual, then deepen. Supporting screens stay lightweight until the core loop "
            "is solid.",
        ),
        (
            "Q5. Who is the first paying user, and what is the wedge?",
            "First wedge: independent OTA-dependent homestays in seasonal destinations (demo: "
            "Tengchong-style properties). Pain wedge: early weak-season risk + one approved "
            "tactic (e.g. weekday package) rather than a full hotel suite on day one.",
        ),
        (
            "Q6. What if AI recommendations are wrong?",
            "That is why we separate Research (sources + reasoning) from Strategy (ranked "
            "options) and require Approve / Modify / Reject. Wrong suggestions should be "
            "visible and stoppable. Feedback then improves the next cycle.",
        ),
        (
            "Q7. Why seven features — isn’t that too broad for Week 4?",
            "Seven screens map one-to-one to one closed loop. The demo path is still one "
            "journey. Knowledge and Feedback can be shown briefly; the decision gate is the "
            "approve-then-act spine, not feature completeness.",
        ),
        (
            "Q8. What would make you pivot?",
            "Clear signals that operators do not feel late diagnosis as painful; that they "
            "refuse any AI-assisted pricing help; or that the buildable scope collapses into "
            "a static report with no action loop. We would rather pivot early than polish a "
            "weak project into Week 9.",
        ),
        (
            "Q9. Show me the user journey in one sentence.",
            "Open Dashboard → see elevated risk → diagnose weekday softness → review research → "
            "approve a weekday autumn package → push to OTAs → check whether occupancy and "
            "RevPAR moved.",
        ),
        (
            "Q10. What do you need from me as Mentor today?",
            "A clear gate decision — Continue, Revise, or Pivot — plus the sharpest risk you "
            "see in our problem framing, validation gaps, or MVP scope so we know what to fix "
            "before we invest the next weeks of build time.",
        ),
    ]

    for q, a in qa:
        block = [
            Paragraph(q, s["h2"]),
            Paragraph(f"<b>A:</b> {a}", s["body"]),
        ]
        story.append(KeepTogether(block))

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Quick-reference Q&amp;A table", s["h1"]))

    header = [
        Paragraph("Topic", s["table_h"]),
        Paragraph("Short answer", s["table_h"]),
    ]
    rows = [
        header,
        [
            Paragraph("vs hotel RMS", s["table_c"]),
            Paragraph(
                "Small OTA-dependent homestays; explainable + human approve + OTA act",
                s["table_c"],
            ),
        ],
        [
            Paragraph("Validation level", s["table_c"]),
            Paragraph(
                "Direction yes; UI KPIs are mock — interviews/sources next",
                s["table_c"],
            ),
        ],
        [
            Paragraph("Human-in-loop", s["table_c"]),
            Paragraph("Owners own margin risk; AI proposes, humans decide", s["table_c"]),
        ],
        [
            Paragraph("Semester fit", s["table_c"]),
            Paragraph("Core loop first; OTA can start mocked / semi-manual", s["table_c"]),
        ],
        [
            Paragraph("Ask today", s["table_c"]),
            Paragraph("Continue / Revise / Pivot + sharpest risk to fix", s["table_c"]),
        ],
    ]
    table = Table(rows, colWidths=[38 * mm, 134 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.4, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(table)

    story.append(Spacer(1, 8 * mm))
    story.append(
        Paragraph(
            "End of document · Replace bracketed validation placeholders before Mentor meeting · "
            "Demo URL / local: <font face='Courier'>npm run dev</font> → http://127.0.0.1:5173",
            s["note"],
        )
    )

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    print(OUT)


if __name__ == "__main__":
    build()
