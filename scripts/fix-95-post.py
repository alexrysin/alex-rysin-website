"""One-shot: remove Facebook duplicate + appended title from 95-percent-mehakim post."""
import sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

path = r"e:\Claude Code\Challenge\alex-rysin-website\content\posts.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Unique marker: end of legit body + appended title + divider
marker = "? 95% מהאנשים מחכים לרגע הנכון. זו בדיוק הטעות.\\n***\\n"
idx = content.find(marker)
if idx == -1:
    print("ERROR: divider marker not found")
    sys.exit(1)

# Find end of duplicate copy: the second occurrence of `למרות החשש?"` after marker
after = idx + len(marker)
end_tail = 'למרות החשש?"'
end_pos = content.find(end_tail, after)
if end_pos == -1:
    print("ERROR: end-of-duplicate marker not found")
    sys.exit(1)

# Keep everything up to and including the first "?" (idx is the "?" char)
# Skip appended title + divider + entire duplicate body
# Resume from the closing `"` of the JS string (at end_pos + len('למרות החשש?'))
resume = end_pos + len("למרות החשש?")

new_content = content[: idx + 1] + content[resume:]

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

bytes_removed = len(content) - len(new_content)
print(f"done. removed {bytes_removed} bytes")