"""Replace em dashes (—) and en dashes (–) with regular hyphens (-) across
content files (app/, components/, content/). Keeps build-generated files alone."""
import sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(r"e:\Claude Code\Challenge\alex-rysin-website")
DIRS = [ROOT / "app", ROOT / "components", ROOT / "content"]
EXTS = {".ts", ".tsx"}

total_files = 0
total_repl = 0

for base in DIRS:
    for p in base.rglob("*"):
        if p.is_file() and p.suffix in EXTS:
            text = p.read_text(encoding="utf-8")
            n_em = text.count("\u2014")
            n_en = text.count("\u2013")
            if n_em + n_en == 0:
                continue
            new_text = text.replace("\u2014", "-").replace("\u2013", "-")
            p.write_text(new_text, encoding="utf-8")
            total_files += 1
            total_repl += n_em + n_en
            print(f"  {p.relative_to(ROOT)}: -{n_em} em, -{n_en} en")

print(f"\n{total_files} file(s), {total_repl} replacement(s)")
