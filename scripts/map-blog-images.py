"""Copy Hebrew-named PNG images from assets/ to public/assets/blog/<slug>.png,
then update image paths in content/posts.ts."""
import sys, io, shutil, re
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(r"e:\Claude Code\Challenge\alex-rysin-website")
SRC = ROOT / "assets"
DST = ROOT / "public" / "assets" / "blog"
POSTS_TS = ROOT / "content" / "posts.ts"

# Hebrew file → slug
mapping = {
    "לגור בתל אביב, לקנות בבת ים.png":             "tel-aviv-bat-yam",
    "95% מהאנשים.png":                              "95-percent-mehakim",
    "המלכודת המסוכנת ביותר בקבלת החלטות כלכליות.png": "milkodet-mumhim",
    "אסטרטגיית דירה חליפית על הנייר.png":          "dira-hilufit-al-hanayar",
    "תחזירו כפול ממה שלקחתם.png":                   "tachziru-kaful",
    "חיים של בינוניות כלכלית .png":                  "beinoniyot-kalkalit",
    "החופש לעבוד.png":                               "hofesh-laavod",
    "כמה עולה חופש כלכלי.png":                       "kama-ole-hofesh",
    "המחיר האמיתי של עצות פיננסיות כלליות.png":     "hochmat-hahamonim",
    "5 החרטות הגדולות בחיים.png":                    "5-haratot",
}

# 1) Copy
for src_name, slug in mapping.items():
    src = SRC / src_name
    if not src.exists():
        print(f"MISSING: {src_name}")
        continue
    dst = DST / f"{slug}.png"
    shutil.copyfile(src, dst)
    print(f"  [ok] {slug}.png  ({src.stat().st_size:,} bytes)")

# 2) Update posts.ts — replace .jpg with .png for each slug
content = POSTS_TS.read_text(encoding="utf-8")
changes = 0
for slug in mapping.values():
    old = f'image: "/assets/blog/{slug}.jpg",'
    new = f'image: "/assets/blog/{slug}.png",'
    if old in content:
        content = content.replace(old, new)
        changes += 1
        print(f"  [ts] {slug}: jpg -> png")
    else:
        print(f"  [?]  {slug}: no .jpg reference found")
POSTS_TS.write_text(content, encoding="utf-8")
print(f"\n{changes} path(s) updated in posts.ts")

# 3) Delete old .jpg files that have a .png replacement
for slug in mapping.values():
    old_jpg = DST / f"{slug}.jpg"
    if old_jpg.exists():
        old_jpg.unlink()
        print(f"  [rm] {slug}.jpg")
