"""Convert Digital Prototype Report Draft 1 Markdown to Word (.docx)."""

from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(r"e:\ENT207TC")
MD = ROOT / "docs" / "reports" / "Digital-Prototype-Report-Draft1.md"
OUT = ROOT / "docs" / "reports" / "Digital-Prototype-Report-Draft1.docx"
SHOTS = ROOT / "docs" / "screenshots"
JOURNEY = SHOTS / "journey"

NAVY = RGBColor(0x0B, 0x1F, 0x3A)
TEAL = RGBColor(0x0D, 0x94, 0x88)
SLATE = RGBColor(0x33, 0x41, 0x55)


def set_run_font(run, size=11, bold=False, italic=False, color=SLATE, name="Calibri"):
    run.bold = bold
    run.italic = italic
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.name = name
    r = run._element
    rPr = r.get_or_add_rPr()
    rFonts = rPr.get_or_add_rFonts()
    rFonts.set(qn("w:eastAsia"), "微软雅黑")


def add_mixed_paragraph(doc, text, style=None, size=11, space_after=6):
    p = doc.add_paragraph(style=style) if style else doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
    # split **bold** and `code`
    parts = re.split(r"(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)", text)
    for part in parts:
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            run = p.add_run(part[2:-2])
            set_run_font(run, size=size, bold=True, color=NAVY)
        elif part.startswith("`") and part.endswith("`"):
            run = p.add_run(part[1:-1])
            set_run_font(run, size=size - 1, color=TEAL, name="Consolas")
        elif part.startswith("*") and part.endswith("*") and not part.startswith("**"):
            run = p.add_run(part[1:-1])
            set_run_font(run, size=size, italic=True)
        else:
            run = p.add_run(part)
            set_run_font(run, size=size)
    return p


def add_heading(doc, text, level=1):
    p = doc.add_heading(level=level)
    p.clear()
    run = p.add_run(text)
    if level == 1:
        set_run_font(run, size=16, bold=True, color=NAVY)
    elif level == 2:
        set_run_font(run, size=13, bold=True, color=TEAL)
    else:
        set_run_font(run, size=12, bold=True, color=NAVY)
    p.paragraph_format.space_before = Pt(14 if level == 1 else 10)
    p.paragraph_format.space_after = Pt(6)
    return p


def add_table(doc, rows: list[list[str]]):
    if not rows:
        return
    table = doc.add_table(rows=len(rows), cols=len(rows[0]))
    table.style = "Table Grid"
    for i, row in enumerate(rows):
        for j, cell_text in enumerate(row):
            cell = table.rows[i].cells[j]
            cell.text = ""
            p = cell.paragraphs[0]
            # strip markdown bold for cells, keep plain
            clean = re.sub(r"\*\*([^*]+)\*\*", r"\1", cell_text)
            clean = re.sub(r"`([^`]+)`", r"\1", clean)
            run = p.add_run(clean)
            set_run_font(run, size=9, bold=(i == 0), color=NAVY if i == 0 else SLATE)
    doc.add_paragraph()


def parse_table(lines: list[str], start: int) -> tuple[list[list[str]], int]:
    rows = []
    i = start
    while i < len(lines) and lines[i].strip().startswith("|"):
        line = lines[i].strip()
        if re.match(r"^\|[\s\-:|]+\|$", line):
            i += 1
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(cells)
        i += 1
    return rows, i


def add_image_if_exists(doc, path: Path, caption: str, width=5.8):
    if not path.exists():
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(str(path), width=Inches(width))
    cap = doc.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = cap.add_run(caption)
    set_run_font(r, size=9, italic=True, color=RGBColor(0x64, 0x74, 0x8B))


def build_cover(doc: Document):
    for _ in range(2):
        doc.add_paragraph()
    t = doc.add_paragraph()
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = t.add_run("FuxiPulse")
    set_run_font(r, size=28, bold=True, color=NAVY)

    s = doc.add_paragraph()
    s.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = s.add_run("Digital Prototype Report — Draft 1")
    set_run_font(r, size=16, bold=True, color=TEAL)

    meta = [
        "ENT207TC Digital Startup Lab",
        "XJTLU Entrepreneur College",
        "Week 4 Submission",
        "Team: Group10086",
        "October 2026",
    ]
    for line in meta:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(line)
        set_run_font(r, size=12, color=SLATE)

    doc.add_paragraph()
    members = (
        "Members: Morong.Yang · Yixuan Huang · Yi.Liu · Haoming Zeng · "
        "Guanyu Han (Team Leader) · Xiuling Wen · Juntong.Fan"
    )
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(members)
    set_run_font(r, size=10, color=SLATE)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(
        "Pixso prototype: https://pixso.net/app/design/np0Pd6gaAjO2V_lvodWLOw?page-id=0%3A1"
    )
    set_run_font(r, size=9, color=TEAL)

    doc.add_page_break()


def convert():
    text = MD.read_text(encoding="utf-8")
    lines = text.splitlines()

    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.85)
    section.bottom_margin = Inches(0.85)
    section.left_margin = Inches(0.95)
    section.right_margin = Inches(0.95)

    build_cover(doc)

    i = 0
    in_code = False
    code_buf: list[str] = []
    skip_first_h1 = True
    figures_inserted = False
    journey_inserted = False

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            if in_code:
                p = doc.add_paragraph()
                p.paragraph_format.left_indent = Inches(0.2)
                run = p.add_run("\n".join(code_buf))
                set_run_font(run, size=9, name="Consolas", color=NAVY)
                code_buf = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_buf.append(line)
            i += 1
            continue

        if stripped == "---" or not stripped:
            i += 1
            continue

        if stripped.startswith("# "):
            if skip_first_h1:
                skip_first_h1 = False
                i += 1
                continue
            add_heading(doc, stripped[2:].strip(), 1)
            i += 1
            continue

        if stripped.startswith("## "):
            title = stripped[3:].strip()
            add_heading(doc, title, 1)
            # insert figure block after section 5 / 6 / 7 headings
            if title.startswith("5. Chosen Features") and not figures_inserted:
                figures_inserted = True
            if title.startswith("6. Prototype") and not journey_inserted:
                pass
            i += 1
            continue

        if stripped.startswith("### "):
            add_heading(doc, stripped[4:].strip(), 2)
            i += 1
            # after feature evidence headings, optionally add images later
            continue

        if stripped.startswith("|"):
            rows, i = parse_table(lines, i)
            # Skip cover meta table duplication — already on cover; keep it as Project Info
            if rows and rows[0] and rows[0][0].lower() in {"field", "element", "role", "impact type", "existing approach", "category", "step", "name", "feature", "screen", "next", "#", "requirement", "file", "artefact (path)", "stage"}:
                add_table(doc, rows)
            else:
                add_table(doc, rows)
            continue

        if stripped.startswith("- "):
            add_mixed_paragraph(doc, "• " + stripped[2:], size=11)
            i += 1
            continue

        if re.match(r"^\d+\.\s", stripped):
            add_mixed_paragraph(doc, stripped, size=11)
            i += 1
            continue

        if stripped.startswith("*") and stripped.endswith("*") and not stripped.startswith("**"):
            p = add_mixed_paragraph(doc, stripped, size=10)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            i += 1
            continue

        add_mixed_paragraph(doc, stripped, size=11)
        i += 1

        # After section 5 content marker — insert prototype screens once we hit section 6
        if stripped.startswith("## 6.") or False:
            pass

    # Insert prototype evidence figures before appendices-style end: after "Main Screens" content
    # Find a good place: add a dedicated figures section before Appendix A if not already dense
    add_heading(doc, "Prototype Screen Evidence (selected)", 1)
    add_mixed_paragraph(
        doc,
        "The following stills support the three core features and the design journey. "
        "The live clickable prototype is linked on the cover page.",
        size=10,
    )
    add_image_if_exists(
        doc,
        SHOTS / "fuxipulse-02-predict-diagnose.png",
        "Figure A. Weak Season Analysis (core feature 1)",
        width=5.9,
    )
    add_image_if_exists(
        doc,
        SHOTS / "fuxipulse-04-strategy-approval.png",
        "Figure B. Strategy Center + Human Approval (core feature 2)",
        width=5.9,
    )
    add_image_if_exists(
        doc,
        SHOTS / "fuxipulse-06-ota.png",
        "Figure C. OTA Operations (core feature 3)",
        width=5.9,
    )
    add_image_if_exists(
        doc,
        SHOTS / "fuxipulse-01-dashboard.png",
        "Figure D. Operations Dashboard (supporting entry screen)",
        width=5.9,
    )

    add_heading(doc, "Design Journey — Mobile Low-Fidelity", 1)
    add_mixed_paragraph(
        doc,
        "Early mobile UX (Today / Operations / Pricing / Market) before desktop dashboard pivot.",
        size=10,
    )
    for name, cap in [
        ("01-today-mobile.png", "Figure E. Mobile Today"),
        ("02-operations-mobile.png", "Figure F. Mobile Operations"),
        ("03-pricing-mobile.png", "Figure G. Mobile Pricing (Accept / Modify / Ignore)"),
        ("04-market-mobile.png", "Figure H. Mobile Market"),
    ]:
        add_image_if_exists(doc, JOURNEY / name, cap, width=2.4)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(OUT))
    print(OUT)
    print("size_kb", round(OUT.stat().st_size / 1024, 1))


if __name__ == "__main__":
    convert()
