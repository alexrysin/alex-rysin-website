"""Typo pass across all remaining posts. Each tuple: (before, after)."""
import sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

path = r"e:\Claude Code\Challenge\alex-rysin-website\content\posts.ts"

fixes = [
    # tel-aviv-bat-yam
    ("שהם יכולים באמת יכולים לקרוא לו בית",
     "שהם באמת יכולים לקרוא לו בית"),
    ("אם למשל אם נפנה", "אם למשל נפנה"),
    ("לאחר כעשור שנים הדירה תימכר", "לאחר כעשור הדירה תימכר"),
    ("הצמיחה הפיננסית העתידית .",
     "הצמיחה הפיננסית העתידית."),

    # hagada-kalkalit
    ("שהיה רוצה רוצים מפנסיה", "שהיה רוצה מפנסיה"),
    ("ובונה את עושרו ( ).", "ובונה את עושרו."),
    ("של אנשים עשירים ( , ).", "של אנשים עשירים."),
    ("ניקח עוד הלוואה ( ).", "ניקח עוד הלוואה."),
    ("–\\\"ּכֹל ּדִכְפִין", "– \\\"ּכֹל ּדִכְפִין"),
    ("\\\" הַּשַּתָא עַבּדין", "\\\"הַּשַּתָא עַבּדין"),

    # lehit-orer-kalkalit
    ("של בחירה?\\\" ( ).", "של בחירה?\\\"."),

    # beinoniyot-kalkalit
    ("ואד וזוגתו חוששים", "ואדם וזוגתו חוששים"),
    ("פורסמה בקבוצה הפייסבוק", "פורסמה בקבוצת הפייסבוק"),
    ("בדרך הלא מתוירת", "בדרך הלא מוכרת"),

    # mahu-hofesh-kalkali
    ("חתול פיננסי פוסט תחת הכותרת \\\"אולי די כבר עם החיפוש אחרי ״חופש כלכלי״!!!\\\" ( ).",
     "חתול פיננסי פוסט תחת הכותרת \\\"אולי די כבר עם החיפוש אחרי ״חופש כלכלי״!!!\\\"."),
    ("תבחר לעשות \\\"דאונשיפטינג\\\", כלומר לתאים את רמת החיים",
     "תבחר לעשות \\\"דאונשיפטינג\\\", כלומר להתאים את רמת החיים"),

    # kama-ole-hofesh
    ("האמריקני ענה בהבעת לעג, \\\" עשיתי תואר",
     "האמריקני ענה בהבעת לעג, \\\"עשיתי תואר"),
    ("הדייג המקסיקני שאל, \\\" אבל סניור",
     "הדייג המקסיקני שאל, \\\"אבל סניור"),

    # 7-percent-tshua
    ("הייתה בזו הלשון:\\n\\n\\\" נניח שהתשואה 7%",
     "הייתה בזו הלשון:\\n\\n\\\"נניח שהתשואה 7%"),
    ("שכירות של 3,500 - 3,300 ש\\\"ח",
     "שכירות של 3,300 - 3,500 ש\\\"ח"),

    # 7-hergelim
    ("ומשל האווזה וביתי הזהב", "ומשל האווזה וביצי הזהב"),
]

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

applied = 0
missing = []
for before, after in fixes:
    count = content.count(before)
    if count == 0:
        missing.append(before[:50])
        continue
    content = content.replace(before, after)
    print(f"  [x{count}] {before[:55]}...")
    applied += count

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"\napplied {applied} replacement(s)")
if missing:
    print(f"\nNOT FOUND ({len(missing)}):")
    for m in missing:
        print(f"  - {m}")