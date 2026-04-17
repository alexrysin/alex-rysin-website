"""Show specific FB post blocks by index number."""
import sys, io
from bs4 import BeautifulSoup
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

src = Path(r"e:\Claude Code\Challenge\alex-rysin-website\your_posts__check_ins__photos_and_videos_1.html")
soup = BeautifulSoup(src.read_text(encoding="utf-8"), "html.parser")
blocks = soup.find_all("div", class_="_a6-p")

def strip_md(t):
    lines = t.split("\n"); out = []; skip = True
    for ln in lines:
        s = ln.strip()
        if skip and (s.startswith("You tagged") or s.startswith("You were")
                     or s.startswith("Updated ") or s.startswith("Click for")
                     or s.startswith("http") or s.startswith("Place:")
                     or s.startswith("Address:") or s.startswith("From ")
                     or not s):
            continue
        skip = False
        out.append(ln)
    return "\n".join(out).strip()

want = [80, 217, 220, 260, 264, 828, 830, 977, 1264, 1323, 164]
for i in want:
    if i >= len(blocks):
        continue
    text = strip_md(blocks[i].get_text("\n", strip=True))
    print(f"\n{'='*80}\n[block {i}] len={len(text)}")
    print(text[:1500])
    print("..." if len(text) > 1500 else "")