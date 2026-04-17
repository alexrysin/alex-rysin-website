import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

with open(r"e:\Claude Code\Challenge\alex-rysin-website\content\posts.ts",
          "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx in [65, 76, 87, 98, 109, 120, 131]:
    line = lines[idx - 1]
    slug = "?"
    for j in range(idx - 1, max(idx - 10, -1), -1):
        if "slug:" in lines[j]:
            slug = lines[j].strip().split('"')[1]
            break
    print(f"--- line {idx} ({slug}), len={len(line)} ---")
    # Pure-asterisk dividers: \n + 3+ * + \n (literal \n as 2-char)
    for m in re.finditer(r"\\n\*{3,}\\n", line):
        print(f"  DIVIDER @ {m.start()}: {m.group()!r}")
    # *** followed by something other than *  (potential disclaimer)
    for m in re.finditer(r"\\n\*{3}[^*\\]", line):
        print(f"  NON-DIV *** @ {m.start()}: {line[m.start():m.start()+35]!r}")