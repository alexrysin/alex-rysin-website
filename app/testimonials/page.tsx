import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "המלצות לקוחות | אלכס ריסין — תכנון פיננסי ועצמאות כלכלית",
  description:
    "לקוחות מספרים על הדרך לעצמאות כלכלית בליווי אלכס ריסין.",
};

const testimonials = [
  {
    quote:
      "[ציטוט לקוח אמיתי יתווסף כאן — תיאור הדרך, מה השתנה, ואיך הייעוץ עם אלכס עזר להגיע לתוצאה הרצויה.]",
    author: "[שם לקוח]",
    role: "[תפקיד / תחום עיסוק]",
    stars: 5,
  },
  {
    quote:
      "[ציטוט לקוח אמיתי יתווסף כאן — תיאור הדרך, מה השתנה, ואיך הייעוץ עם אלכס עזר להגיע לתוצאה הרצויה.]",
    author: "[שם לקוח]",
    role: "[תפקיד / תחום עיסוק]",
    stars: 5,
  },
  {
    quote:
      "[ציטוט לקוח אמיתי יתווסף כאן — תיאור הדרך, מה השתנה, ואיך הייעוץ עם אלכס עזר להגיע לתוצאה הרצויה.]",
    author: "[שם לקוח]",
    role: "[תפקיד / תחום עיסוק]",
    stars: 5,
  },
  {
    quote:
      "[ציטוט לקוח אמיתי יתווסף כאן — תיאור הדרך, מה השתנה, ואיך הייעוץ עם אלכס עזר להגיע לתוצאה הרצויה.]",
    author: "[שם לקוח]",
    role: "[תפקיד / תחום עיסוק]",
    stars: 5,
  },
  {
    quote:
      "[ציטוט לקוח אמיתי יתווסף כאן — תיאור הדרך, מה השתנה, ואיך הייעוץ עם אלכס עזר להגיע לתוצאה הרצויה.]",
    author: "[שם לקוח]",
    role: "[תפקיד / תחום עיסוק]",
    stars: 5,
  },
  {
    quote:
      "[ציטוט לקוח אמיתי יתווסף כאן — תיאור הדרך, מה השתנה, ואיך הייעוץ עם אלכס עזר להגיע לתוצאה הרצויה.]",
    author: "[שם לקוח]",
    role: "[תפקיד / תחום עיסוק]",
    stars: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 text-yellow-400">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1C3879] py-24 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#6B8E23] bg-opacity-80 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            הם כבר שם
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            המלצות לקוחות
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
            אנשים אמיתיים שבחרו לקחת שליטה על העתיד הפיננסי שלהם.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "200+", label: "לקוחות מרוצים" },
              { num: "5/5", label: "דירוג ממוצע" },
              { num: "10+", label: "שנות ניסיון" },
              { num: "100%", label: "המלצות אישיות" },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl font-bold text-[#1C3879]">{stat.num}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="bg-[#F8F9FA] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
              >
                {/* Stars */}
                <StarRating count={t.stars} />

                {/* Quote */}
                <div className="relative flex-1">
                  <span className="absolute -top-3 -right-1 text-5xl text-[#E0E0E0] font-serif leading-none select-none">
                    &ldquo;
                  </span>
                  <p className="text-gray-600 leading-relaxed text-sm pt-4">
                    {t.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 bg-[#1C3879] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.author.charAt(1)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1C3879] text-sm">{t.author}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder notice */}
          <div className="mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-center">
            <p className="text-yellow-800 text-sm font-medium">
              ⏳ ההמלצות שלמעלה הן placeholders — יתווספו המלצות אמיתיות מלקוחות בקרוב.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1C3879] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            רוצים להיות הסיפור הבא?
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            התחילו עם שיחת היכרות — בחינם, ללא התחייבות.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg"
            >
              קבע שיחת היכרות חינם
            </Link>
            <a
              href="https://wa.me/972501234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-lg border border-white border-opacity-30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              וואטסאפ
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
