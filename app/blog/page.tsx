import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "בלוג | אלכס ריסין — תכנון פיננסי ועצמאות כלכלית",
  description:
    "מאמרים מעשיים על תכנון פיננסי, השקעות, פנסיה ועצמאות כלכלית — בעברית פשוטה.",
};

const articles = [
  {
    category: "תכנון פיננסי",
    categoryColor: "bg-[#1C3879]",
    title: "[כותרת מאמר — יתווסף בקרוב]",
    date: "[תאריך פרסום]",
    summary:
      "[תקציר קצר של המאמר יופיע כאן. ניתן לצפות למאמרים מעשיים ומועילים על נושאים פיננסיים רלוונטיים.]",
    slug: "#",
  },
  {
    category: "השקעות",
    categoryColor: "bg-[#4A6FA5]",
    title: "[כותרת מאמר — יתווסף בקרוב]",
    date: "[תאריך פרסום]",
    summary:
      "[תקציר קצר של המאמר יופיע כאן. ניתן לצפות למאמרים מעשיים ומועילים על נושאים פיננסיים רלוונטיים.]",
    slug: "#",
  },
  {
    category: "עצמאות כלכלית",
    categoryColor: "bg-[#6B8E23]",
    title: "[כותרת מאמר — יתווסף בקרוב]",
    date: "[תאריך פרסום]",
    summary:
      "[תקציר קצר של המאמר יופיע כאן. ניתן לצפות למאמרים מעשיים ומועילים על נושאים פיננסיים רלוונטיים.]",
    slug: "#",
  },
  {
    category: "פנסיה וביטוח",
    categoryColor: "bg-[#1C3879]",
    title: "[כותרת מאמר — יתווסף בקרוב]",
    date: "[תאריך פרסום]",
    summary:
      "[תקציר קצר של המאמר יופיע כאן. ניתן לצפות למאמרים מעשיים ומועילים על נושאים פיננסיים רלוונטיים.]",
    slug: "#",
  },
  {
    category: "תכנון פיננסי",
    categoryColor: "bg-[#4A6FA5]",
    title: "[כותרת מאמר — יתווסף בקרוב]",
    date: "[תאריך פרסום]",
    summary:
      "[תקציר קצר של המאמר יופיע כאן. ניתן לצפות למאמרים מעשיים ומועילים על נושאים פיננסיים רלוונטיים.]",
    slug: "#",
  },
  {
    category: "נדל״ן",
    categoryColor: "bg-[#6B8E23]",
    title: "[כותרת מאמר — יתווסף בקרוב]",
    date: "[תאריך פרסום]",
    summary:
      "[תקציר קצר של המאמר יופיע כאן. ניתן לצפות למאמרים מעשיים ומועילים על נושאים פיננסיים רלוונטיים.]",
    slug: "#",
  },
];

const categories = ["הכל", "תכנון פיננסי", "השקעות", "עצמאות כלכלית", "פנסיה וביטוח", "נדל״ן"];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1C3879] py-24 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#6B8E23] bg-opacity-80 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            ידע שמשתלם
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">הבלוג</h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
            מאמרים מעשיים על כסף, השקעות ועצמאות כלכלית — בלי עגה מקצועית, בלי בלגן.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-[#1C3879] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-[#F8F9FA] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <article
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Placeholder image */}
                <div className={`${article.categoryColor} h-44 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 200 100" className="w-full h-full" fill="white">
                      <path d="M0 50 Q50 20 100 50 T200 50" stroke="white" strokeWidth="2" fill="none" />
                      <path d="M0 70 Q50 40 100 70 T200 70" stroke="white" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {article.date}
                  </p>

                  <h2 className="text-lg font-bold text-[#1C3879] mb-3 leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {article.summary}
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <Link
                      href={article.slug}
                      className="inline-flex items-center gap-1.5 text-[#1C3879] font-semibold text-sm hover:text-[#6B8E23] transition-colors"
                    >
                      קרא עוד
                      <span className="text-base">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming soon notice */}
          <div className="text-center mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100">
            <svg className="w-10 h-10 text-[#4A6FA5] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-[#1C3879] font-semibold mb-1">תוכן בדרך!</p>
            <p className="text-gray-500 text-sm">
              מאמרים חדשים יתפרסמו בקרוב. רוצים לקבל עדכון?{" "}
              <Link href="/contact" className="text-[#6B8E23] font-semibold hover:underline">
                השאירו פרטים
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#1C3879] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            רוצים לקבל תוכן שמשתלם ישר למייל?
          </h2>
          <p className="text-blue-200 mb-8">
            הצטרפו לרשימת הדיוור וקבלו טיפים פיננסיים מעשיים כל שבועיים.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
          >
            הצטרפו עכשיו — חינם
          </Link>
        </div>
      </section>
    </>
  );
}
