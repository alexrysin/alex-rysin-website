"""Extract 5 new FB posts from export, clean up, dedupe title-repeat tail."""
import sys, io, re
from pathlib import Path
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

src = Path(r"e:\Claude Code\Challenge\alex-rysin-website\your_posts__check_ins__photos_and_videos_1.html")
soup = BeautifulSoup(src.read_text(encoding="utf-8"), "html.parser")
blocks = soup.find_all("div", class_="_a6-p")

targets = [61, 84, 93, 95, 132]

def clean(text):
    """Strip FB metadata + dedupe title/divider tail."""
    lines = text.split("\n")
    out = []
    skipping = True
    for ln in lines:
        s = ln.strip()
        if skipping:
            if (s.startswith("You tagged") or s.startswith("You were")
                or s.startswith("Updated ") or s.startswith("Click for")
                or s.startswith("http") or s.startswith("Place:")
                or s.startswith("Address:") or s.startswith("From ")
                or s in ("Mobile uploads", "Photos", "Cover Photos",
                         "Timeline photos", "Profile Pictures")
                or not s):
                continue
            skipping = False
        out.append(ln)
    text = "\n".join(out).strip()
    # Strip FB @[id:num:name] tags → keep just the name
    text = re.sub(r"@\[[0-9]+:[0-9]+:([^\]]+)\]", r"\1", text)
    # Cut duplicate tail: title appears twice separated by ****
    # Find second occurrence of the divider line
    divider_matches = list(re.finditer(r"\n\*{3,}\n", text))
    if len(divider_matches) >= 2:
        # Cut before the repeated title that precedes 2nd divider
        second = divider_matches[1]
        # Find start of line that is repeat of first title
        before = text[:second.start()]
        # Find last newline before the repeat start; title is the line just before second divider
        # Easier: title is the very first line of the post
        first_title = text.split("\n")[0].strip()
        repeat_idx = text.rfind("\n" + first_title + "\n")
        if repeat_idx > 500:
            text = text[:repeat_idx].rstrip()
    # Collapse 3+ newlines → 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text

for idx in targets:
    raw = blocks[idx].get_text("\n", strip=True)
    text = clean(raw)
    print(f"\n{'='*80}\n[block {idx}] len={len(text)}")
    print(text)
    print(f"{'='*80}\n")