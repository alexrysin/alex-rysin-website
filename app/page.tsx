"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// ---- Animation variants ----
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.12 },
});

// ---- Pain point cards ----
const painPoints = [
  {
    icon: (
      <svg className="w-7 h-7 text-[#1C3879]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "מרוויחים יפה, אבל אין תוכנית",
    desc: "מרוויחים יפה, אבל אין תוכנית ברורה לאן זה הולך — הכסף פשוט נעלם בסוף החודש.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-[#1C3879]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "שיחות כסף בבית יוצרות מתח",
    desc: "כל שיחה על כסף בבית נגמרת במתח — אין הסכמה, אין כיוון, אין שלווה.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-[#1C3879]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "יודעים שצריך לעשות משהו",
    desc: "יודעים שצריך לעשות משהו — אבל לא יודעים מה קודם, ואז לא עושים כלום.",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-[#1C3879]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "כל יועץ אומר משהו אחר",
    desc: "כל יועץ אומר משהו אחר — קשה לדעת למי לסמוך ומי באמת עובד בשבילכם.",
  },
];

// ---- Process steps ----
const steps = [
  {
    num: "01",
    title: "שיחת היכרות",
    desc: "מבינים מה אתם רוצים להשיג ואיך נראה ה\"שם\" בשבילכם — ללא התחייבות.",
  },
  {
    num: "02",
    title: "בניית אסטרטגיה",
    desc: "תוכנית ברורה, מותאמת אישית, בלי ניב — שתוכלו להבין ולבצע.",
  },
  {
    num: "03",
    title: "יישום בפועל",
    desc: "מלווים אתכם עד שזה קורה בשטח — לא רק ייעוץ על הנייר.",
  },
];

// ---- Why Alex items ----
const whyItems = [
  "ייעוץ עצמאי — ללא עמלות, ללא מוצרים למכור",
  'תהליך קצר וממוקד, לא תלות יקרה לנצח',
  "ליווי עד לביצוע בפועל — לא רק ייעוץ בנייר",
  'רשת מקצועית: עו"ד, רו"ח, מומחי שוק הון ונדל"ן',
];

// ---- Testimonials ----
const testimonials = [
  {
    quote:
      "אלכס עזר לנו לראות את התמונה הגדולה לראשונה. אחרי שנים של בלגן פיננסי — יש לנו תוכנית ברורה.",
    author: "[שם לקוח — יתווסף בקרוב]",
  },
  {
    quote:
      "הייתי מהסס לפנות, חשבתי שזה רק לעשירים. הפגישה הראשונה שינתה לי את הפרספקטיבה לגמרי.",
    author: "[שם לקוח — יתווסף בקרוב]",
  },
  {
    quote:
      "לא עוד ייעוץ ערטילאי — אלכס הלך איתנו צעד אחרי צעד עד שהכל היה מיושם בפועל.",
    author: "[שם לקוח — יתווסף בקרוב]",
  },
];

// ---- CheckIcon ----
function CheckIcon() {
  return (
    <svg
      className="w-6 h-6 text-[#6B8E23] flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ================================================
          SECTION 1: HERO
      ================================================ */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#1C3879] overflow-hidden">
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 geometric-pattern opacity-40" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#4A6FA5] opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#6B8E23] opacity-10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-[#6B8E23] bg-opacity-80 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              תכנון פיננסי · עצמאות כלכלית
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            מרוויחים טוב.
            <br />
            <span className="text-blue-200">
              אז למה הכסף עדיין לא עובד בשבילכם?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl md:text-2xl text-blue-200 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            אנחנו עוזרים לאנשים חכמים לבנות עושר אמיתי — מהבהירות ועד לביצוע
            בפועל.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              קבע שיחת היכרות חינם
              <span className="text-xl">←</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-lg border border-white border-opacity-30"
            >
              קרא עוד אודותי
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 text-blue-200 text-sm"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6B8E23]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ללא עמלות
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6B8E23]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ייעוץ בלתי תלוי
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6B8E23]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ליווי עד לביצוע
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6B8E23]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              שיחת היכרות חינם
            </span>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1200 60 720 0 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ================================================
          SECTION 2: PAIN POINTS
      ================================================ */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C3879] mb-4">
              אם זה נשמע מוכר — אתם במקום הנכון
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              רוב האנשים שפונים אלינו מרגישים לפחות אחד מהדברים הבאים:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white border-r-4 border-[#1C3879] shadow-sm hover:shadow-md transition-shadow duration-300 p-6 rounded-lg flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  {point.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1C3879] mb-1">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1C3879] hover:bg-[#142b5c] text-white font-bold px-8 py-4 rounded-xl transition-colors duration-300 text-lg"
            >
              בואו נדבר — שיחה ראשונה בחינם
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================
          SECTION 3: HOW IT WORKS
      ================================================ */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C3879] mb-4">
              איך זה עובד
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              תהליך פשוט, ברור ומכוון תוצאה
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-12 right-[16.66%] left-[16.66%] h-0.5 bg-gradient-to-l from-[#6B8E23] to-[#1C3879] opacity-20" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.18 }}
                className="flex-1 bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 text-center relative"
              >
                <div className="text-7xl font-bold text-[#1C3879] opacity-10 leading-none mb-4 select-none">
                  {step.num}
                </div>
                <div className="w-12 h-12 bg-[#1C3879] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 -mt-2">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-[#1C3879] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 4: WHY ALEX
      ================================================ */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C3879] mb-6">
                למה לעבוד עם אלכס
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                יש הרבה יועצים פיננסיים. אלכס ריסין הוא אחד מעט שמלווה אתכם מהסיפור המלא עד לשורת הביצוע.
              </p>
              <div className="flex flex-col gap-5">
                {whyItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckIcon />
                    <p className="text-gray-700 text-lg">{item}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[#1C3879] font-bold border-2 border-[#1C3879] hover:bg-[#1C3879] hover:text-white px-6 py-3 rounded-xl transition-all duration-300"
                >
                  קרא עוד אודות אלכס
                  <span>←</span>
                </Link>
              </div>
            </motion.div>

            {/* Visual side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#1C3879] to-[#4A6FA5] rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: "100%", label: "בלתי תלוי" },
                    { num: "0", label: "עמלות מוצרים" },
                    { num: "360°", label: "ראיה פיננסית" },
                    { num: "∞", label: "שקיפות מלאה" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white bg-opacity-10 rounded-2xl p-5 text-center"
                    >
                      <div className="text-3xl font-bold text-[#6B8E23] mb-1">
                        {stat.num}
                      </div>
                      <div className="text-sm text-blue-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white border-opacity-20 text-center">
                  <p className="text-blue-200 text-sm leading-relaxed">
                    &quot;המטרה שלי היא שתצאו מהתהליך עם בהירות מלאה, תוכנית ברורה, וביטחון לפעול.&quot;
                  </p>
                  <p className="text-white font-semibold mt-2">— אלכס ריסין</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION 5: TESTIMONIALS
      ================================================ */}
      <section className="bg-[#1C3879] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              מה אומרים הלקוחות
            </h2>
            <p className="text-blue-200 text-lg">
              תוצאות אמיתיות מאנשים אמיתיים
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-[#243f8a] rounded-2xl p-7 flex flex-col gap-4 relative"
              >
                {/* Quote mark */}
                <div className="text-6xl text-[#6B8E23] font-serif leading-none select-none">
                  &ldquo;
                </div>
                <p className="text-blue-100 leading-relaxed text-sm flex-1 -mt-4">
                  {t.quote}
                </p>
                {/* Stars */}
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-blue-300 text-sm font-semibold">{t.author}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-12">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-white border-2 border-white border-opacity-40 hover:border-opacity-80 hover:bg-white hover:bg-opacity-10 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
            >
              ראו עוד המלצות
              <span>←</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================
          SECTION 6: FINAL CTA
      ================================================ */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C3879] mb-4">
              מוכנים להתחיל?
            </h2>
            <p className="text-xl text-gray-500 mb-3">
              לא מתחייבים לכלום. רק שיחה.
            </p>
            <p className="text-gray-400 mb-10">
              שיחת ההיכרות בחינם ומשך 30 דקות — ולא צריך להכין כלום מראש.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-10 py-5 rounded-xl transition-all duration-300 text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                קבע שיחת היכרות חינם
              </Link>
              <a
                href="https://wa.me/972501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#1C3879] border-2 border-[#1C3879] hover:bg-[#1C3879] hover:text-white font-bold px-8 py-5 rounded-xl transition-all duration-300 text-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                וואטסאפ
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
