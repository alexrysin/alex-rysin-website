"""List all Facebook posts from export with first-line preview and char length."""
import sys, io, re
from pathlib import Path
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

src = Path(r"e:\Claude Code\Challenge\alex-rysin-website\your_posts__check_ins__photos_and_videos_1.html")
html = src.read_text(encoding="utf-8")

soup = BeautifulSoup(html, "html.parser")
blocks = soup.find_all("div", class_="_a6-p")
print(f"found {len(blocks)} post content blocks", file=sys.stderr)

# Slugs already used (first ~40 chars of each)
used_starts = [
    "אייל ורעות, בני 38",
    "אנשים רבים, בוודאי אנשים שכבר",
    '"תשמע, אני מבין בשוק ההון',
    "זהו פוסט ברוח החג",
    "לפני מספר שבועות העליתי טור",
    "לפני זמן מה פורסמה בקבוצה",
    "ביום שישי בשבוע שעבר",
    "אשתף סיפור נחמד",
    "לעתים קרובות כאשר אני בונה",
    '"שבעה הרגלים של אנשים',
]

skip_exact = {"Mobile uploads", "Photos", "Cover Photos", "Timeline photos",
              "Profile Pictures"}

def is_post(text):
    lines = [l for l in text.split("\n") if l.strip()]
    if not lines:
        return False
    if lines[0].strip() in skip_exact:
        return False
    # Must have at least 30% Hebrew chars in first 500 chars
    sample = text[:500]
    heb = sum(1 for ch in sample if "\u0590" <= ch <= "\u05FF")
    if heb / max(1, len(sample)) < 0.3:
        return False
    return True

def strip_metadata(text):
    """Strip 'You tagged ...' and similar metadata from start."""
    lines = text.split("\n")
    out = []
    skipping = True
    for ln in lines:
        s = ln.strip()
        if skipping and (s.startswith("You tagged") or s.startswith("You were")
                         or s.startswith("Updated ") or not s):
            continue
        skipping = False
        out.append(ln)
    return "\n".join(out).strip()

candidates = []
seen_openers = set()
for i, b in enumerate(blocks):
    raw = b.get_text("\n", strip=True)
    text = strip_metadata(raw)
    if len(text) < 700:
        continue
    if any(u in text for u in used_starts):
        continue
    if not is_post(text):
        continue
    opener = text[:60]
    if opener in seen_openers:
        continue
    seen_openers.add(opener)
    candidates.append((i, text))

print(f"candidates: {len(candidates)}\n")

for idx, (i, text) in enumerate(candidates):
    lines = [l for l in text.split("\n") if l.strip()]
    chars = len(text)
    mins = max(1, chars // 1200)
    print(f"\n[#{idx+1}] block {i} | {chars} chars | ~{mins} min")
    for ln in lines[:3]:
        print(f"  {ln[:180]}")