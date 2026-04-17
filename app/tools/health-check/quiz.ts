// ============================================================================
// Financial Health Check — Quiz data, scoring logic, and recommendations
// ============================================================================
// 5 categories × 3 questions = 15 questions.
// Each answer: "yes" = 2, "kind_of" = 1, "no" = 0.
// Category score: 0–6. Overall: 0–30, normalized to 0–100 for display.
// ============================================================================

export type Answer = "yes" | "kind_of" | "no";

export const ANSWER_VALUE: Record<Answer, number> = {
  yes: 2,
  kind_of: 1,
  no: 0,
};

export type CategoryId =
  | "resilience"
  | "debt"
  | "savings"
  | "long_term"
  | "awareness";

export interface Category {
  id: CategoryId;
  title: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: "resilience", title: "חוסן פיננסי", icon: "🛡️" },
  { id: "debt", title: "חובות והתחייבויות", icon: "💳" },
  { id: "savings", title: "הרגלי חיסכון והשקעה", icon: "💰" },
  { id: "long_term", title: "תכנון ארוך טווח", icon: "📋" },
  { id: "awareness", title: "מודעות ובקרה", icon: "🧭" },
];

export interface Question {
  id: string;
  category: CategoryId;
  text: string;
  /**
   * When true, a "yes" answer means LOW score (the question is phrased
   * such that "yes" is the problem — e.g. "do you have consumer debt?").
   */
  inverted?: boolean;
}

export const QUESTIONS: Question[] = [
  // --- Resilience ---
  {
    id: "r1",
    category: "resilience",
    text: "יש לכם קרן חירום נזילה של לפחות 3 חודשי הוצאות?",
  },
  {
    id: "r2",
    category: "resilience",
    text: "יש לכם ביטוח חיים ואובדן כושר עבודה?",
  },
  {
    id: "r3",
    category: "resilience",
    text: "יש לכם ביטוח בריאות פרטי?",
  },
  // --- Debt ---
  {
    id: "d1",
    category: "debt",
    text: "האם יש לכם חובות צרכניים (לא כולל משכנתא) מעל 30 אלף ₪?",
    inverted: true,
  },
  {
    id: "d2",
    category: "debt",
    text: "ההחזרים החודשיים שלכם על חובות (כולל משכנתא) נמוכים מ-30% מההכנסה?",
  },
  {
    id: "d3",
    category: "debt",
    text: "יש לכם תוכנית ברורה להחזר כל החובות שלכם?",
  },
  // --- Savings ---
  {
    id: "s1",
    category: "savings",
    text: "אתם חוסכים באופן קבוע לפחות 10% מההכנסה החודשית?",
  },
  {
    id: "s2",
    category: "savings",
    text: "יש לכם ידע בסיסי באפיקי השקעה (מדדים, קרנות, אג״ח)?",
  },
  {
    id: "s3",
    category: "savings",
    text: "אתם משקיעים באפיק שאינו רק פיקדון בנקאי?",
  },
  // --- Long term ---
  {
    id: "l1",
    category: "long_term",
    text: "אתם יודעים כמה כסף יהיה לכם בפנסיה?",
  },
  {
    id: "l2",
    category: "long_term",
    text: "יש לכם יעדים כלכליים כתובים ל-5 / 10 שנים?",
  },
  {
    id: "l3",
    category: "long_term",
    text: "בדקתם בשנה האחרונה שדמי הניהול בפנסיה / קופ״ג שלכם סבירים?",
  },
  // --- Awareness ---
  {
    id: "a1",
    category: "awareness",
    text: "אתם יודעים בדיוק כמה יוצא וכמה נכנס מדי חודש?",
  },
  {
    id: "a2",
    category: "awareness",
    text: "אתם מנהלים תקציב כלשהו (דיגיטלי / אקסל / מחברת)?",
  },
  {
    id: "a3",
    category: "awareness",
    text: "ישבתם עם בן/בת הזוג (אם יש) על המטרות הכלכליות המשותפות בחצי השנה האחרונה?",
  },
];

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export interface CategoryScore {
  id: CategoryId;
  title: string;
  icon: string;
  /** 0–6 */
  raw: number;
  /** 0–100 */
  percent: number;
}

export interface QuizResult {
  /** Raw total 0–30 */
  totalRaw: number;
  /** 0–100 */
  totalPercent: number;
  tier: Tier;
  categories: CategoryScore[];
}

export type Tier = "foundation" | "stable" | "building" | "attention";

export interface TierInfo {
  id: Tier;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export const TIERS: Record<Tier, TierInfo> = {
  foundation: {
    id: "foundation",
    label: "יסודי",
    emoji: "🟢",
    color: "#16A34A",
    description:
      "יש לכם בסיס כלכלי יציב ומבנה ברור. המשיכו לחדד ולהתאים את התמונה למטרות המשתנות שלכם.",
  },
  stable: {
    id: "stable",
    label: "יציב",
    emoji: "🔵",
    color: "#2563EB",
    description:
      "אתם במסלול טוב, עם תשתית סבירה. יש כמה נקודות לחיזוק שיכולות להעלות את הביטחון הכלכלי שלכם למדרגה הבאה.",
  },
  building: {
    id: "building",
    label: "בבנייה",
    emoji: "🟡",
    color: "#D97706",
    description:
      "יש לכם התחלה טובה, אבל עדיין חסרות רגליים מרכזיות במבנה הכלכלי. כדאי להתחיל לבנות אותן בצורה מסודרת.",
  },
  attention: {
    id: "attention",
    label: "דורש תשומת לב",
    emoji: "🟠",
    color: "#DC2626",
    description:
      "זה הזמן לעצור ולעשות סדר. הנקודות למטה הן התחלה טובה, ושיחה עם איש מקצוע יכולה לעזור להפוך את התמונה בצורה משמעותית.",
  },
};

function tierFromPercent(percent: number): Tier {
  if (percent >= 85) return "foundation";
  if (percent >= 65) return "stable";
  if (percent >= 40) return "building";
  return "attention";
}

/**
 * Compute the full quiz result from a map of question id → answer.
 * Missing answers are treated as "no" (0 points) to avoid NaN.
 */
export function computeResult(answers: Record<string, Answer>): QuizResult {
  const categories: CategoryScore[] = CATEGORIES.map((cat) => {
    const qs = QUESTIONS.filter((q) => q.category === cat.id);
    const raw = qs.reduce((sum, q) => {
      const a = answers[q.id] ?? "no";
      let v = ANSWER_VALUE[a];
      // Inverted questions: "yes" = problem → low score.
      if (q.inverted) v = 2 - v;
      return sum + v;
    }, 0);
    return {
      id: cat.id,
      title: cat.title,
      icon: cat.icon,
      raw,
      percent: Math.round((raw / (qs.length * 2)) * 100),
    };
  });

  const totalRaw = categories.reduce((s, c) => s + c.raw, 0);
  const maxRaw = QUESTIONS.length * 2; // 30
  const totalPercent = Math.round((totalRaw / maxRaw) * 100);

  return {
    totalRaw,
    totalPercent,
    tier: tierFromPercent(totalPercent),
    categories,
  };
}

// ---------------------------------------------------------------------------
// Recommendations — shown for categories with raw score ≤ 3 (out of 6)
// ---------------------------------------------------------------------------

export const CATEGORY_RECOMMENDATIONS: Record<CategoryId, string> = {
  resilience:
    "חוסן פיננסי הוא הבסיס של הכל. קרן חירום של 3–6 חודשי הוצאות וביטוחים נכונים הם ההגנה הראשונה מפני אירועים בלתי צפויים. בלעדיהם, כל תוכנית השקעה עלולה להתפרק בבוקר הלא נכון.",
  debt:
    "חובות צרכניים עם ריבית גבוהה הם בור שחור שמוצץ כל תשואה פוטנציאלית. כדאי לבנות תוכנית החזר מסודרת — מי הריבית הגבוהה ביותר, כמה לשלם, ומתי תסיימו. לפני שמשקיעים, סגירת חובות צרכניים היא כמעט תמיד הצעד הכי רווחי.",
  savings:
    "חיסכון קבוע והשקעה נכונה הם המנוע של הצמיחה הכלכלית. אם אתם חוסכים פחות מ-10% מההכנסה או משאירים את הכל בעו״ש/פיקדון, אתם מפספסים את המנוע הכי חזק שיש — ריבית דריבית. כדאי ללמוד את עקרונות ההשקעה הפאסיבית ולהתחיל בקטן.",
  long_term:
    "בלי יעדים כתובים ובלי הבנה של מה מחכה לכם בפנסיה, קשה לדעת אם אתם בכיוון. הצעד הראשון הוא להיכנס לאתר הר הכסף ולאסוף את כל הקופות והקרנות שלכם, לבדוק את דמי הניהול, ולהגדיר על דף אחד איפה אתם רוצים להיות בעוד 5 ו-10 שנים.",
  awareness:
    "אי אפשר לנהל מה שלא מודדים. בלי ידיעה של ההכנסות וההוצאות החודשיות, כל החלטה כלכלית היא ניחוש. שלושה חודשים של מעקב פשוט (אפילו באפליקציה) יתנו לכם תמונה שתשנה את כל מערך הקבלת החלטות שלכם.",
};

/** Get recommendations only for categories that need attention (raw ≤ 3). */
export function getActionableRecommendations(
  result: QuizResult
): Array<{ category: CategoryScore; recommendation: string }> {
  return result.categories
    .filter((c) => c.raw <= 3)
    .map((c) => ({
      category: c,
      recommendation: CATEGORY_RECOMMENDATIONS[c.id],
    }));
}
