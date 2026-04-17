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



// ---- Process steps ----
const steps = [
  {
    title: "מבינים את התמונה המלאה",
    desc: "שיחה ממוקדת שבה מבינים מה באמת חשוב לכם — ואיפה נוצר הפער מול מה שקורה היום.",
  },
  {
    title: "בונים כיוון ברור שמתאים לכם",
    desc: "אסטרטגיה ברורה שמחברת את כל ההחלטות למסלול אחד — כזה שתוכלו להבין ולהתקדם לפיו.",
  },
  {
    title: "יוצאים לדרך — עם כלים וביטחון",
    desc: "מגדירים צעדים ברורים — כך שתוכלו לקבל החלטות לבד. ואני זמין בנקודות החשובות, כשצריך לקבל החלטה משמעותית.",
  },
];

// ---- Why Alex items ----
const whyItems = [
  'לא עוד "במה להשקיע" — אלא איך לחשוב נכון על הכסף שלכם',
  "תהליך קצר שמייצר עצמאות, לא תלות",
  "חיבור בין כל ההחלטות לתמונה אחת ברורה",
  "זמינות בנקודות קריטיות — כדי שלא תישארו לבד בהחלטות חשובות",
];

// ---- Testimonials ----
const testimonials = [
  {
    quote:
      "הבנו שלא נתקדם כלכלית בלי שינוי. אלכס בנה כמה תרחישים על השקעות שלא הכרנו קודם, נתן לנו זמן לקחת את ההחלטה בעצמנו — ואחרי תשעה חודשים הגענו לפורטפוליו מלא של השקעות.",
    author: "מיה ורועי",
    role: "זוג + 2 ילדים",
  },
  {
    quote:
      "התהליך עם אלכס היה מדויק עבורינו. לאורך הדרך קיבלנו המון כלים מעשיים, תמיכה ועזרה — גם אם לפעמים הייתה בעיקר נפשית ובכלל לא כלכלית.",
    author: "עדי ובן",
    role: "זוג + 2 ילדים",
  },
  {
    quote:
      "אחרי אכזבה מתהליך קודם — הפעם אנחנו חווים חוויה מתקנת. היה לנו ברור שאנחנו זקוקים לאיש מקצוע שיעשה לנו סדר ויכין תוכנית סדורה. אלכס בנה לנו תוכנית ואנחנו פועלים לפיה.",
    author: "עינת",
    role: "זוג + 4 ילדים",
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
      <section className="relative bg-[#1C3879] overflow-hidden min-h-[90vh] flex items-stretch">

        {/* Text side — RTL: appears on the RIGHT (65%) */}
        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-right justify-center px-8 sm:px-12 lg:px-24 xl:px-32 py-28 w-full lg:w-[65%]">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-[2.85rem] text-white leading-[1.4] mb-8"
          >
            <span className="font-normal">אתם כבר עובדים קשה בשביל הכסף.</span>
            <br />
            <span className="font-bold">השאלה אם הוא עובד כדי לבנות<br />את <span className="text-amber-300">החיים שאתם רוצים</span>.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-blue-100/70 leading-relaxed mb-5 max-w-xl"
          >
            תהליך תכנון פיננסי שמחבר את כל ההחלטות לתמונה אחת ברורה — ועוזר לכם לקבל החלטות טובות יותר, עם הכסף שכבר יש.
          </motion.p>

          {/* Mobile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:hidden mt-6 mb-6"
          >
            <img
              src="/assets/squeeze.jpg"
              alt="אלכס ריסין — יועץ פיננסי"
              className="w-[200px] h-[200px] object-cover rounded-2xl shadow-xl"
            />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-12 py-5 rounded-xl transition-all duration-300 text-lg shadow-lg hover:-translate-y-0.5"
            >
              קבעו שיחת היכרות
            </Link>
          </motion.div>

        </div>

        {/* Photo side — RTL: appears on the LEFT (desktop only) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hidden lg:flex lg:w-[35%] items-center justify-center p-12"
        >
          <img
            src="/assets/squeeze.jpg"
            alt="אלכס ריסין — יועץ פיננסי"
            className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
          />
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48L1440 48L1440 24C1200 48 720 0 0 24L0 48Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ================================================
          SECTION 2: RECOGNITION
      ================================================ */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[950px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Heading */}
          <motion.h2
            {...fadeUp}
            className="text-[2rem] md:text-[2.4rem] text-[#1C3879] leading-[1.25] mb-6"
          >
            <span className="font-normal">זה לא שאין לכם כסף.</span>
            <br />
            <span className="font-bold">זה שאין לו תפקיד ברור.</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            {...fadeUp}
            className="text-base md:text-lg text-[#6B7280] leading-relaxed mb-8 max-w-[650px]"
          >
            וכשזה המצב — קל להרגיש שאתם עושים את הדבר הנכון, בלי לדעת אם זה באמת מקדם אתכם.
          </motion.p>

          {/* Bullet list */}
          <div className="flex flex-col gap-[16px]">
            {[
              "אתם עושים מהלכים — אבל לא בטוחים אם זו הדרך הנכונה",
              "משלבים בין השקעות, נדל״ן וחסכונות — בלי תמונה אחת שמחברת הכול",
              "מרגישים שיש פוטנציאל ליותר — אבל אין דרך ברורה להגיע לשם",
              "מקבלים החלטות חשובות — בלי להבין איך הן משפיעות על התמונה הגדולה",
            ].map((item, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-gray-800 text-base md:text-[1.1rem] leading-[1.7]"
              >
                <span className="text-[#1C3879] ml-2">—</span>
                {item}
              </motion.p>
            ))}
          </div>

          {/* CTA */}
          <motion.div {...fadeUp} className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1C3879] hover:bg-[#142b5c] text-white font-bold px-10 py-[18px] rounded-xl transition-colors duration-300 text-lg"
            >
              בואו נעשה סדר — ונראה איך זה נראה אצלכם
            </Link>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm text-[#6B7280] mt-5"
            >
              או —{" "}
              <Link
                href="/tools/potential"
                className="text-[#1C3879] font-semibold underline underline-offset-4 decoration-[#5AC8C8] decoration-2 hover:decoration-[#1C3879] transition-colors"
              >
                גלו קודם את המספר שלכם
              </Link>{" "}
              במחשבון חינמי, תוך 5 דקות
            </motion.p>
          </motion.div>

        </div>
      </section>

      {/* ================================================
          SECTION 3: HOW IT WORKS
      ================================================ */}
      <section className="bg-[#EFF1F5] py-20 md:py-24">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-[2rem] md:text-[2.4rem] text-[#1C3879] leading-[1.25] mb-5">
              כך נראה תהליך שמייצר <span className="font-bold">כיוון ברור</span> לכסף שלכם
            </h2>
            <p className="text-[#6B7280] text-base md:text-lg max-w-[650px] mx-auto leading-relaxed">
              תהליך קצר וממוקד שמייצר כיוון ברור — ולא עוד רשימת המלצות שלא מתחברות אחת לשנייה.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-7 md:gap-8 mt-2">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.18 }}
                className="flex-1 bg-white rounded-2xl p-8 md:p-10 shadow-sm text-center"
              >
                <div className="w-10 h-10 bg-[#1C3879] text-white rounded-full flex items-center justify-center text-base font-bold mx-auto mb-6">
                  {i + 1}
                </div>
                <h3 className="text-xl md:text-[1.35rem] font-bold text-[#1C3879] mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-[1.7]">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Summary + CTA */}
          <motion.div {...fadeUp} className="text-center mt-16">
            <p className="text-[#6B7280] text-lg mb-10 max-w-2xl mx-auto">
              בסוף התהליך — יש לכם תמונה ברורה, ותוכנית שאפשר להתחיל לפעול לפיה מיד.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1C3879] hover:bg-[#142b5c] text-white font-bold px-10 py-[18px] rounded-xl transition-colors duration-300 text-lg"
            >
              בואו נבין מה נכון עבורכם
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================
          SECTION 4: WHY ALEX
      ================================================ */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Text side */}
            <motion.div {...fadeUp}>
              <h2 className="text-[2rem] md:text-[2.4rem] font-bold text-[#1C3879] leading-[1.25] mb-5">
                לא עוד ייעוץ פיננסי.<br />
                דרך אחרת לנהל את הכסף שלכם.
              </h2>
              <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed mb-10 max-w-[600px]">
                אני לא מנהל לכם את הכסף — אני עוזר לכם לקבל החלטות נכונות.
              </p>
              <div className="flex flex-col gap-5 mb-12">
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
                    <p className="text-gray-800 text-[1.1rem] leading-[1.7]">{item}</p>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#1C3879] hover:bg-[#142b5c] text-white font-bold px-10 py-[18px] rounded-xl transition-colors duration-300 text-lg"
              >
                קבעו שיחת היכרות
              </Link>
              <p className="text-sm text-[#9CA3AF] mt-5">
                ללא התחייבות &middot; שיחה קצרה וממוקדת
              </p>
            </motion.div>

            {/* Quote box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative lg:mt-8"
            >
              <div className="relative bg-[#1C3879] rounded-2xl p-8 md:p-10 max-w-[420px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden hover:-translate-y-0.5 transition-transform duration-200 flex flex-col text-right">
                {/* Quote mark */}
                <span className="absolute top-4 right-6 text-[80px] font-bold text-white/[0.08] leading-none select-none">
                  ״
                </span>

                <p className="relative text-blue-100 text-[19px] leading-[1.7] mb-4">
                  המטרה שלי היא לא לנהל לכם את הכסף — אלא שתדעו לנהל את ההחלטות שלכם.
                </p>
                <div className="relative inline-flex items-center gap-[10px] justify-start">
                  <img
                    src="/assets/why-me.jpg"
                    alt="אלכס ריסין"
                    className="w-[60px] h-[60px] rounded-full object-cover"
                  />
                  <span className="text-white font-semibold text-[15px] opacity-95">אלכס ריסין</span>
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
                <div>
                  <p className="text-white text-sm font-semibold">{t.author}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{t.role}</p>
                </div>
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
      <section className="bg-white py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C3879] mb-4 leading-tight">
              מוכנים להתחיל?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-3 leading-relaxed">
              לפעמים שיחה אחת היא כל מה שצריך כדי להתחיל לזוז.
            </p>
            <p className="text-base text-gray-400 mb-8">
              שיחה קצרה, בלי התחייבות — כדי להבין אם זה מתאים לכם.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-12 py-5 rounded-xl transition-all duration-300 text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              רוצים להתחיל? דברו איתי
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
