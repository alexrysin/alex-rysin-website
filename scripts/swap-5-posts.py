"""Replace 5 old posts with 5 new FB-extracted posts in content/posts.ts."""
import sys, io, re
from pathlib import Path
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(r"e:\Claude Code\Challenge\alex-rysin-website")
POSTS_TS = ROOT / "content" / "posts.ts"
FB_HTML = ROOT / "your_posts__check_ins__photos_and_videos_1.html"

soup = BeautifulSoup(FB_HTML.read_text(encoding="utf-8"), "html.parser")
blocks = soup.find_all("div", class_="_a6-p")

def extract_clean(block_idx):
    text = blocks[block_idx].get_text("\n", strip=True)
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
    text = re.sub(r"@\[[0-9]+:[0-9]+:([^\]]+)\]", r"\1", text)
    # dedupe: cut at repeated title
    first_title = text.split("\n")[0].strip()
    repeat_idx = text.rfind("\n" + first_title + "\n")
    if repeat_idx > 500:
        text = text[:repeat_idx].rstrip()
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text

def strip_title_and_divider(text, title):
    """Remove the leading title line + any '***' divider."""
    lines = text.split("\n")
    while lines and (lines[0].strip() == title.strip()
                     or re.fullmatch(r"\*{3,}", lines[0].strip())
                     or not lines[0].strip()):
        lines.pop(0)
    return "\n".join(lines).strip()

def escape_for_ts(s):
    """Serialize body string as a single-line TS double-quoted literal."""
    # Escape backslash and double-quote; then convert real newlines to \n
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    s = s.replace("\n", "\\n").replace("\r", "")
    return s

# --- Post 1: דירה חליפית (replaces hagada-kalkalit) ---
b132 = extract_clean(132)
title1 = "מהי אסטרטגיית דירה חליפית על הנייר ולמה היא מעניינת במיוחד בימים אלה?"
body1 = strip_title_and_divider(b132, "מהי אסטרטגיית דירה חליפית על הנייר ולמה היא מעניינת במיוחד בימים אלה? 🏗️📈")
# typo fixes
body1 = body1.replace("אסרטגיית", "אסטרטגיית").replace("אסרטגה", "אסטרטגיה")
body1 = body1.replace("למכור משנים הקרובות", "למכור בשנים הקרובות")

post1 = {
    "slug": "dira-hilufit-al-hanayar",
    "title": title1,
    "date": "2024-04-22",  # keep sort order of hagada-kalkalit
    "category": 'נדל"ן',
    "excerpt": "איך לרכוש דירה שנייה מבלי לשלם מס רכישה מלא ומס שבח — אסטרטגיית הדירה החליפית על הנייר, ולמה היא רלוונטית במיוחד היום.",
    "readMinutes": 4,
    "featured": False,
    "image": "/assets/blog/dira-hilufit-al-hanayar.jpg",
    "body": body1,
}

# --- Post 2: תחזירו כפול (replaces lehit-orer-kalkalit) ---
b61 = extract_clean(61)
title2 = "כן, תחזירו כפול ממה שלקחתם – ועדיין תרוויחו מזה בגדול"
body2 = strip_title_and_divider(b61, title2)
# normalize fancy quotes consistency (keep as-is, just smooth)

post2 = {
    "slug": "tachziru-kaful",
    "title": title2,
    "date": "2021-11-07",
    "category": 'נדל"ן',
    "excerpt": "משכנתא ל-30 שנים נראית מפחידה על הנייר — אבל מתחת למספרים מסתתרת אסטרטגיה שיוצרת צמיחה פיננסית משמעותית יותר מסגירה מהירה.",
    "readMinutes": 4,
    "featured": False,
    "image": "/assets/blog/tachziru-kaful.jpg",
    "body": body2,
}

# --- Post 3: החופש לעבוד (replaces mahu-hofesh-kalkali) ---
b93 = extract_clean(93)
# title has stray trailing quote in FB source — clean it
title3 = "החופש לעבוד: איך ביטחון כלכלי משנה את המשמעות של העבודה בחיינו"
# FB block first line is: 'החופש לעבוד: ... בחיינו" 💫' — match both forms
body3_lines = b93.split("\n")
body3_lines.pop(0)  # drop title line
# drop any divider
while body3_lines and (re.fullmatch(r"\*{3,}", body3_lines[0].strip())
                        or not body3_lines[0].strip()):
    body3_lines.pop(0)
body3 = "\n".join(body3_lines).strip()

post3 = {
    "slug": "hofesh-laavod",
    "title": title3,
    "date": "2021-08-25",
    "category": "תפיסת עולם",
    "excerpt": "ביטחון כלכלי לא נועד לעצור לעבוד — הוא נועד לאפשר לעבוד אחרת. על עבודה מבחירה, משמעות, ועל החופש האמיתי שמתחיל מוקדם יותר.",
    "readMinutes": 2,
    "featured": False,
    "image": "/assets/blog/hofesh-laavod.jpg",
    "body": body3,
}

# --- Post 4: חוכמת ההמונים (replaces 7-percent-tshua) ---
b84 = extract_clean(84)
title4 = 'המחיר האמיתי של עצות פיננסיות כלליות: איך "חוכמת ההמונים" יכולה לעלות לך 750,000 שקל'
body4_lines = b84.split("\n")
body4_lines.pop(0)
while body4_lines and (re.fullmatch(r"\*{3,}", body4_lines[0].strip())
                        or not body4_lines[0].strip()):
    body4_lines.pop(0)
body4 = "\n".join(body4_lines).strip()
# fix double-space typo
body4 = body4.replace("ציפור פיננסית  שאלה", "ציפור פיננסית שאלה")

post4 = {
    "slug": "hochmat-hahamonim",
    "title": title4,
    "date": "2021-03-07",
    "category": "קבלת החלטות",
    "excerpt": "עצה פיננסית שנראית הגיונית יכולה לעלות מאות אלפי שקלים. ניתוח מקרה קונקרטי של 1.3 מיליון — ומה קורה כשבוחנים את האלטרנטיבה.",
    "readMinutes": 3,
    "featured": False,
    "image": "/assets/blog/hochmat-hahamonim.jpg",
    "body": body4,
}

# --- Post 5: 5 החרטות (replaces 7-hergelim) ---
b95 = extract_clean(95)
title5 = "5 החרטות הגדולות בחיים – ואיך הן קשורות לכסף שלכם?"
body5_lines = b95.split("\n")
body5_lines.pop(0)
while body5_lines and (re.fullmatch(r"\*{3,}", body5_lines[0].strip())
                        or not body5_lines[0].strip()):
    body5_lines.pop(0)
body5 = "\n".join(body5_lines).strip()

post5 = {
    "slug": "5-haratot",
    "title": title5,
    "date": "2020-12-27",
    "category": "מיינדסט",
    "excerpt": "אחות בטיפול פליאטיבי תיעדה שנים של חרטות על ערש דווי. חמש החרטות החוזרות — והקשר העמוק שלהן לבחירות הכלכליות שאנחנו עושים עכשיו.",
    "readMinutes": 3,
    "featured": False,
    "image": "/assets/blog/5-haratot.jpg",
    "body": body5,
}

def render_post(p):
    parts = ["  {"]
    parts.append(f'    slug: "{p["slug"]}",')
    parts.append(f'    title: "{escape_for_ts(p["title"])}",')
    parts.append(f'    date: "{p["date"]}",')
    parts.append(f'    category: "{escape_for_ts(p["category"])}",')
    parts.append(f'    excerpt: "{escape_for_ts(p["excerpt"])}",')
    parts.append(f'    readMinutes: {p["readMinutes"]},')
    parts.append(f'    featured: {"true" if p["featured"] else "false"},')
    parts.append(f'    image: "{p["image"]}",')
    parts.append(f'    body: "{escape_for_ts(p["body"])}",')
    parts.append("  },")
    return "\n".join(parts)

# Read file
content = POSTS_TS.read_text(encoding="utf-8")

replacements = [
    ("hagada-kalkalit", post1),
    ("lehit-orer-kalkalit", post2),
    ("mahu-hofesh-kalkali", post3),
    ("7-percent-tshua", post4),
    ("7-hergelim", post5),
]

for old_slug, new_post in replacements:
    # Match full post object by slug
    pattern = r'  \{\n    slug: "' + re.escape(old_slug) + r'",\n(?:    .*\n)*?  \},'
    m = re.search(pattern, content)
    if not m:
        print(f"NOT FOUND: {old_slug}")
        continue
    new_block = render_post(new_post)
    content = content[:m.start()] + new_block + content[m.end():]
    print(f"  [ok] {old_slug} -> {new_post['slug']}")

POSTS_TS.write_text(content, encoding="utf-8")
print("\nwritten")