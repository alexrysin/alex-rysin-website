"""Optimize blog images: resize max 1600px, convert to JPG q=85, delete PNGs."""
import sys, io, os
from pathlib import Path
from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(r"e:\Claude Code\Challenge\alex-rysin-website")
BLOG_DIR = ROOT / "public" / "assets" / "blog"
POSTS_TS = ROOT / "content" / "posts.ts"

MAX_SIDE = 1600
QUALITY = 85

before_total = 0
after_total = 0

for img_path in sorted(BLOG_DIR.glob("*.png")) + sorted(BLOG_DIR.glob("*.jpg")):
    orig_size = img_path.stat().st_size
    before_total += orig_size

    img = Image.open(img_path)
    # Convert RGBA → RGB (JPG doesn't support alpha — flatten onto white)
    if img.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Resize so largest side <= MAX_SIDE
    w, h = img.size
    if max(w, h) > MAX_SIDE:
        if w >= h:
            new_w = MAX_SIDE
            new_h = round(h * MAX_SIDE / w)
        else:
            new_h = MAX_SIDE
            new_w = round(w * MAX_SIDE / h)
        img = img.resize((new_w, new_h), Image.LANCZOS)

    # Save as JPG (same slug name, .jpg extension)
    slug = img_path.stem
    out_path = BLOG_DIR / f"{slug}.jpg"
    tmp_path = BLOG_DIR / f"{slug}.tmp.jpg"
    img.save(tmp_path, format="JPEG", quality=QUALITY,
             optimize=True, progressive=True)

    # Atomic swap: write tmp → replace original
    if img_path.suffix.lower() == ".png":
        img_path.unlink()  # remove the PNG
    tmp_path.replace(out_path)

    new_size = out_path.stat().st_size
    after_total += new_size
    pct = 100 * (1 - new_size / orig_size)
    print(f"  {slug}: {orig_size//1024}KB → {new_size//1024}KB  "
          f"({img.size[0]}x{img.size[1]}, -{pct:.0f}%)")

# Update posts.ts paths: .png → .jpg
content = POSTS_TS.read_text(encoding="utf-8")
new_content, n = content, 0
import re
for m in re.findall(r'"/assets/blog/([^"]+)\.png"', content):
    new_content = new_content.replace(f'"/assets/blog/{m}.png"',
                                      f'"/assets/blog/{m}.jpg"')
    n += 1
if new_content != content:
    POSTS_TS.write_text(new_content, encoding="utf-8")
print(f"\nupdated {n} path(s) in posts.ts")

print(f"\ntotal: {before_total//1024}KB → {after_total//1024}KB  "
      f"(-{100*(1-after_total/before_total):.0f}%)")
