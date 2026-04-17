"""One-shot: fix typos + remove Facebook duplicate from milkodet-mumhim post."""
import sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

path = r"e:\Claude Code\Challenge\alex-rysin-website\content\posts.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# --- Step 1: typo fixes (affect both copies; still cheaper than tracking positions) ---
fixes = [
    ("מסוכנתצ", "מסוכנת"),
    ("אם המשקיע המצליח בהיסטוריה יכול להודות",
     "אם המשקיע המצליח ביותר בהיסטוריה יכול להודות"),
    ("4️⃣אתה אף פעם לא ראה", "4️⃣ אתה אף פעם לא רואה"),
]
for old, new in fixes:
    count_before = content.count(old)
    content = content.replace(old, new)
    print(f"replaced '{old[:30]}...' x{count_before}")

# --- Step 2: remove appended title + divider + duplicate body ---
# Unique end-of-first-copy marker: space before appended title
marker = " המלכודת המסוכנת ביותר בקבלת החלטות כלכליות (ולמה דווקא ה'מומחים' נופלים בה)\\n***\\n"
idx = content.find(marker)
if idx == -1:
    print("ERROR: divider marker not found")
    sys.exit(1)

# End of duplicate: second occurrence of `שתפו בתגובות 👇"` (closes the JS string)
after = idx + len(marker)
end_tail = 'שתפו בתגובות 👇"'
end_pos = content.find(end_tail, after)
if end_pos == -1:
    print("ERROR: end-of-duplicate marker not found")
    sys.exit(1)

# Keep everything up to and including the final `👇` (idx = space before appended title)
# Resume from the closing `"` (at end_pos + len('שתפו בתגובות 👇'))
resume = end_pos + len("שתפו בתגובות 👇")

new_content = content[:idx] + content[resume:]

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"done. removed {len(content) - len(new_content)} bytes (dedup)")