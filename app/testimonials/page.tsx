"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const mainTestimonials = [
  {
    bold: "התהליך עם אלכס היה מדויק עבורינו.",
    rest: "התחלנו עם הגדרת יעדים, אלכס ערך עבורינו סקירה נרחבת של מצבנו הכלכלי ובחרנו את האופציה המתאימה ביותר. לאורך הדרך קיבלנו המון כלים מעשיים, תמיכה ועזרה — גם אם לפעמים הייתה בעיקר נפשית ובכלל לא כלכלית.",
    name: "עדי ובן",
    role: "זוג + 2 ילדים",
  },
  {
    bold: "מהר מאוד הבנתי שחסרה לי יד מכוונת.",
    rest: "הגדרנו את המטרות, ניתחנו מצב קיים ובנינו תוכנית איך מגיעים לשם. לאחר מכן, אלכס עזר לי לממש את התוכנית בפועל. אלכס מאוד רציני, סבלני וקשוב — והכי חשוב, אוהב את מה שהוא עושה ורואה בכך שליחות.",
    name: "ניר",
    role: 'הייטקיסט ומשקיע נדל"ן',
  },
  {
    bold: "היינו דיי מבולבלים לגבי הצעדים שאנחנו רוצים לעשות בעולם הפיננסי.",
    rest: 'התהליך היה מאד מקיף, ולאט לאט גיבשנו תוכנית. בשום שלב לא הרגשנו שאלכס דוחק בנו לקבל החלטות. הכל היה בקצב שלנו. סיימנו את התהליך עם דירה להשקעה בארץ ושני פרויקטים בארצות הברית.',
    name: "מישה ודנה",
    role: "זוג צעיר",
  },
  {
    bold: "אחרי אכזבה מתהליך קודם — הפעם אנחנו חווים חוויה מתקנת.",
    rest: "היה לנו ברור שאנחנו זקוקים לאיש מקצוע שיהיה אוזן קשבת, יעשה לנו סדר בדברים, יסביר לנו נתונים שאנחנו מתקשים להבין לבד, ויכין לנו תוכנית סדורה. אלכס בנה לנו תוכנית ואנחנו פועלים לפיה.",
    name: "עינת",
    role: "זוג + 4 ילדים",
  },
];

const shortTestimonials = [
  {
    bold: "הרצון של אלכס לסייע, הסבלנות והתמיכה — עוד לפני שדיברנו על כל התקשרות מסחרית.",
    rest: "אלכס בנה עבורנו תכנית מפורטת. עד כה התוכנית מתממשת, ומאז ועד היום אלכס מלווה אותנו, זמין לכל שאלה.",
    name: "צליל ותבל",
  },
  {
    bold: "מקצועי ויסודי. כשבוחרים יועץ, מאוד חשוב שהוא יהיה בראש שלכם.",
    rest: "",
    name: "מאיה ובוריס",
  },
  {
    bold: "בן אדם מאוד מקצועי ויסודי! לוקח בחשבון את כל האספקטים של החיים.",
    rest: "",
    name: "יהונתן",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* 1. Opening + 2. Hero Testimonial Squeeze */}
      <section className="bg-[#F7F8FA] pt-12 pb-[72px] md:pt-14 md:pb-[80px]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">

          {/* Section heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[2.5rem] md:text-[3rem] font-bold text-[#1C3879] leading-[1.2] text-center mb-6"
          >
            מה קורה כשיש כיוון ברור
          </motion.h1>

          {/* Testimonial card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-[20px] shadow-[0_6px_24px_rgba(15,23,42,0.05)] mx-auto max-w-[800px] px-7 py-9 sm:px-10 sm:py-11 md:px-11 md:py-12 hover:shadow-[0_10px_32px_rgba(15,23,42,0.08)] transition-shadow duration-300"
          >
            {/* Quote icon */}
            <div className="text-center mb-5">
              <span className="text-[48px] font-serif text-[#1E3A8A] leading-none select-none" style={{ opacity: 0.07 }}>
                &ldquo;
              </span>
            </div>

            {/* Main quote */}
            <p className="text-[1.55rem] md:text-[1.85rem] font-bold text-[#1E3A8A] leading-[1.4] text-center max-w-[640px] mx-auto mb-6">
              הבנו שלא נתקדם כלכלית בלי שינוי — ואחרי תשעה חודשים הגענו לפורטפוליו מלא של השקעות.
            </p>

            {/* Divider */}
            <div className="w-[72px] h-[1px] bg-[#DDE1E7] mx-auto mb-7" />

            {/* Body — short paragraphs, right-aligned */}
            <div className="flex flex-col gap-4 text-right max-w-[660px] mx-auto">
              <p className="text-[#475569] text-[1.05rem] md:text-[1.15rem] leading-[1.7]">
                היינו עצמאית ושכיר, גרים בדירה עם משכנתא גבוהה לעוד הרבה שנים כמעט ללא יכולת לחסוך, שלא לדבר על להשקיע.
              </p>
              <p className="text-[#3D4D66] text-[1.05rem] md:text-[1.15rem] leading-[1.7] font-medium">
                אלכס בנה כמה תרחישים מבוססים על השקעות שלא הכרנו קודם. נתן לנו זמן לקחת את ההחלטה בעצמנו, ללא לחץ.
              </p>
              <p className="text-[#475569] text-[1.05rem] md:text-[1.15rem] leading-[1.7]">
                בחרנו את התמהיל הנכון עבורנו ויצאנו לדרך — עם ליווי ותמיכה לאורך כל הדרך.
              </p>
              <p className="text-[#3D4D66] text-[1.05rem] md:text-[1.15rem] leading-[1.7] font-medium">
                אנחנו לא מפחדים מהשקעות ובדרך הנכונה להגשמת המטרות.
              </p>
            </div>

            {/* Author */}
            <div className="text-center mt-8">
              <p className="text-[15px] font-bold text-[#1E3A8A]">מיה ורועי</p>
              <p className="text-[#94A3B8] text-[13px] mt-1">זוג + 2 ילדים</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Main Testimonials 2x2 */}
      <section className="bg-white pt-[72px] pb-[72px] md:pt-[88px] md:pb-[80px]">
        <div className="max-w-[920px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainTestimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white border border-[#E5E7EB] rounded-[18px] p-[34px] shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
              >
                <p className="leading-[1.7] mb-6">
                  <span className="font-bold text-[#1C3879] text-[1.25rem] md:text-[1.35rem]">
                    &ldquo;{t.bold}&rdquo;
                  </span>
                  {t.rest && (
                    <>
                      <br />
                      <span className="text-[#475569] text-[15px] leading-[1.8]">{t.rest}</span>
                    </>
                  )}
                </p>
                <div>
                  <p className="font-bold text-[#1C3879] text-[15px]">{t.name}</p>
                  <p className="text-[#94A3B8] text-[13px] mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Short Testimonials — Grid 3 */}
      <section className="bg-[#F7F8FA] py-[64px] md:py-[72px]">
        <div className="max-w-[960px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shortTestimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 shadow-[0_6px_14px_rgba(15,23,42,0.04)]"
              >
                <p className="text-[14px] leading-[1.8] mb-3">
                  <span className="font-bold text-[#1C3879]">&ldquo;{t.bold}&rdquo;</span>
                  {t.rest && (
                    <>
                      <br />
                      <span className="text-[#475569]">{t.rest}</span>
                    </>
                  )}
                </p>
                <p className="font-bold text-[#1C3879] text-[13px]">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="bg-white py-[80px] md:py-[96px]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl md:text-[1.9rem] font-bold text-[#1C3879] mb-8">
              רוצים להגיע לאותה נקודה?
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-semibold px-10 py-5 rounded-[14px] transition-all duration-200 text-lg shadow-[0_10px_24px_rgba(0,0,0,0.08)] hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
            >
              קבעו שיחת היכרות
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
