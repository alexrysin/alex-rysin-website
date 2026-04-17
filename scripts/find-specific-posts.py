"""Find specific FB posts by title fragments."""
import sys, io
from bs4 import BeautifulSoup
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

src = Path(r"e:\Claude Code\Challenge\alex-rysin-website\your_posts__check_ins__photos_and_videos_1.html")
soup = BeautifulSoup(src.read_text(encoding="utf-8"), "html.parser")
blocks = soup.find_all("div", class_="_a6-p")

queries = [
    "תחזירו כפול ממה שלקחתם",
    "אנשים עשירים חושבים על כסף בצורה שונה",
    "חוכמת ההמונים",
    "5 החרטות הגדולות",
    "דירה חליפית על הנייר",
]

for q in queries:
    print(f"\n{'='*80}\nQUERY: {q}")
    matches = []
    for i, b in enumerate(blocks):
        text = b.get_text("\n", strip=True)
        if q in text:
            matches.append((i, text))
    if not matches:
        print("  NOT FOUND")
        continue
    # pick the longest match (usually the full post, others are previews)
    matches.sort(key=lambda x: -len(x[1]))
    i, text = matches[0]
    print(f"  block {i} | {len(text)} chars | {len(matches)} match(es)")
    print(f"  --- first 500 chars ---")
    print(text[:500])