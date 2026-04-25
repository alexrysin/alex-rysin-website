import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "הצהרת נגישות | אלכס ריסין",
  description: "הצהרת נגישות אתר אלכס ריסין - תכנון פיננסי ועצמאות כלכלית",
};

export default function AccessibilityPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1C3879] py-20 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-20" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            הצהרת נגישות
          </h1>
          <p className="text-blue-200 text-xl">
            אנו מחויבים לנגישות דיגיטלית לכלל המשתמשים
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg text-right">

          <div className="space-y-8 text-gray-700 leading-relaxed">

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <p className="text-[#1C3879] font-semibold">
                עדכון אחרון: מרץ 2025
              </p>
              <p className="mt-2 text-sm">
                אתר זה נמצא בתהליך הנגשה מתמשך בהתאם לתקן ישראלי 5568 (WCAG 2.0 ברמה AA)
                ובהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1C3879] mb-3">מה אנחנו עושים</h2>
              <p>
                אנו פועלים להבטיח שהאתר יהיה נגיש לכלל המשתמשים, לרבות אנשים עם מוגבלויות שונות -
                ראייה, שמיעה, קוגניציה ומוטוריקה. האתר עומד ברמת תאימות AA לפי תקן WCAG 2.0.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1C3879] mb-3">תכונות הנגישות באתר</h2>
              <ul className="space-y-2 list-none pr-0">
                {[
                  'קישור "דלג לתוכן הראשי" בראש כל עמוד',
                  "תמיכה מלאה בניווט מקלדת",
                  "תוויות ARIA לכל אלמנטים אינטראקטיביים",
                  'שפת העמוד מוגדרת לעברית (lang="he")',
                  "כיוון טקסט RTL מלא",
                  "יחסי קונטרסט צבעים עומדים בדרישות WCAG AA",
                  "אנימציות מושבתות עבור משתמשים עם prefers-reduced-motion",
                  'תמיות עבור שגיאות טפסים (role="alert")',
                  "ניווט מובנה עם aria-current לציון עמוד פעיל",
                  "תמיות ARIA לתפריט הנייד (aria-expanded, aria-controls)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#4d6617] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1C3879] mb-3">מגבלות ידועות</h2>
              <p>
                אנו עובדים באופן שוטף לשפר את נגישות האתר. כרגע ידוע לנו על הגבלות הבאות:
              </p>
              <ul className="mt-3 space-y-1 list-disc list-inside text-gray-600">
                <li>חלק מתמונות הפרופיל עשויות להזדקק לתיאורים מלאים יותר - יושלם בקרוב</li>
                <li>הבלוג יכלול תגיות lang מפורטות כאשר יתמלא בתוכן</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1C3879] mb-3">דיווח על בעיות נגישות</h2>
              <p>
                נתקלתם בבעיית נגישות? נשמח לשמוע ולתקן. ניתן לפנות אלינו:
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="mailto:alex@example.com"
                  className="inline-flex items-center gap-2 text-[#1C3879] font-semibold hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  alex@example.com
                </a>
                <a
                  href="https://wa.me/972544580159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#1C3879] font-semibold hover:underline"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  וואטסאפ: 050-123-4567
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                נשאף לטפל בפניות נגישות בתוך 5 ימי עסקים.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-500">
              <p>
                הצהרה זו הוכנה בהתאם להנחיות ועדת שוויון זכויות לאנשים עם מוגבלות ותקן ת&quot;י 5568.
                אחרון עדכון: מרץ 2025.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F8F9FA] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">יש לכם שאלות? נשמח לעזור.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#1C3879] hover:bg-[#142b5c] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            צרו קשר
          </Link>
        </div>
      </section>
    </>
  );
}
