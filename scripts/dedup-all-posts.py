"""Generic: for every post body containing \\n***\\n, keep only the copy AFTER
the divider (Facebook export always duplicates cleanly after ***). The pre-***
copy carries the appended title and sometimes a stray leading space; the
post-*** copy is the canonical body. Strip any leading \\n from it."""
import re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

path = r"e:\Claude Code\Challenge\alex-rysin-website\content\posts.ts"

with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

fixed = 0
total_saved = 0
for i, line in enumerate(lines):
    if not line.lstrip().startswith('body: "'):
        continue
    m = re.match(r'^(\s*body: ")(.*)(",\s*)$', line)
    if not m:
        continue
    prefix, body, suffix = m.group(1), m.group(2), m.group(3)
    m2 = re.search(r"\\n\*{3,}\\n", body)
    if not m2:
        continue
    new_body = body[m2.end():]
    while new_body.startswith("\\n"):
        new_body = new_body[2:]
    before = len(line)
    lines[i] = prefix + new_body + suffix
    saved = before - len(lines[i])
    total_saved += saved
    fixed += 1
    # find slug (2 lines up)
    slug_line = next((lines[j] for j in range(i - 1, max(i - 10, -1), -1)
                      if "slug:" in lines[j]), "unknown")
    slug = slug_line.strip().split('"')[1] if '"' in slug_line else "?"
    print(f"  [{slug}] -{saved} bytes")

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"\ndedup done. posts fixed: {fixed}, total saved: {total_saved} bytes")