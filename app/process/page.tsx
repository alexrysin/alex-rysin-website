"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const steps = [
  {
    title: "מבינים את התמונה המלאה",
    desc: "לא רק נתונים — אלא להבין מה באמת חשוב לכם, איפה אתם עומדים היום, ואיך נראה הפער בין מה שיש למה שאפשרי.",
    outcome: "יוצאים עם הבנה ברורה של המצב הכלכלי שלכם — בלי הנחות, בלי ניחושים.",
  },
  {
    title: "בונים כיוון שמתאים לכם",
    desc: "אסטרטגיה שמחברת בין כל ההחלטות למסלול אחד — כזה שתוכלו להבין, להסביר, ולפעול לפיו.",
    outcome: "לא עוד פעולות נקודתיות שלא מתחברות אחת לשנייה.",
  },
  {
    title: "יוצאים עם דרך — וביטחון לפעול",
    desc: "אתם יודעים מה לעשות, איך לפעול, ואיך לקבל החלטות גם בהמשך — בלי תלות באף אחד.",
    outcome: "תוכנית שאפשר להתחיל ליישם כבר מהיום.",
  },
];

const faqs = [
  {
    q: "כמה זמן התהליך לוקח?",
    a: "התהליך הוא קצר וממוקד. בדרך כלל מדובר במספר פגישות על פני כמה שבועות — תלוי במורכבות המצב שלכם.",
  },
  {
    q: "האם צריך ידע מוקדם בתחום הפיננסי?",
    a: "בכלל לא. אני מתאים את השפה והקצב אליכם. המטרה היא שתבינו כל החלטה לעומק — לא שתלמדו מונחים.",
  },
  {
    q: "מה קורה אחרי התהליך?",
    a: "אתם יוצאים עם תוכנית ברורה וכלים לפעול לבד. ואני זמין בנקודות קריטיות — כשצריך לקבל החלטה משמעותית.",
  },
  {
    q: "האם אתה מוכר מוצרים פיננסיים?",
    a: "לא. אני עובד כיועץ בלתי תלוי, בלי עמלות ובלי אינטרס למכור שום דבר. ההמלצות שלי הן אך ורק לטובתכם.",
  },
  {
    q: "למי התהליך מתאים?",
    a: "לאנשים שמרוויחים טוב, עושים מהלכים כלכליים, אבל מרגישים שאין תמונה אחת ברורה שמחברת הכול — ורוצים כיוון.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E5E7EB] py-[18px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-right gap-4 cursor-pointer"
      >
        <h3 className="text-[17px] md:text-lg font-semibold text-[#1C3879]">
          {q}
        </h3>
        <span
          className="text-[#1C3879] text-xl font-light flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="text-[#6B7280] text-[15px] leading-[1.7] mt-3">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[1150px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[2rem] md:text-[2.3rem] font-bold text-[#1C3879] leading-[1.3] mb-4">
              כך נראה תהליך שמייצר כיוון ברור
            </h1>
            <p className="text-base md:text-lg text-[#6B7280] leading-relaxed max-w-[650px]">
              תהליך קצר וממוקד שעוזר להבין את התמונה המלאה, ולצאת עם דרך ברורה לפעול.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#F7F8FA] py-20 md:py-24">
        <div className="max-w-[1150px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Timeline wrapper */}
          <div className="relative pr-14 md:pr-28">
            {/* Vertical line */}
            <div className="absolute right-[23px] md:right-[27px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#C7D2E3] to-[#94A3B8] rounded-full" />

            {/* Steps */}
            <div className="flex flex-col gap-14 md:gap-[92px]">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative mr-0 md:mr-[72px]"
                >
                  {/* Circle with number + halo */}
                  <div className="absolute -right-14 md:-right-28 top-0 w-[48px] h-[48px] md:w-[56px] md:h-[56px] bg-[#1C3879] text-white rounded-full flex items-center justify-center text-base md:text-lg font-bold z-10 shadow-[0_0_0_8px_rgba(28,56,121,0.08)]">
                    {i + 1}
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-[18px] py-7 px-[30px] shadow-[0_12px_28px_rgba(15,23,42,0.06)] max-w-[440px] min-h-[130px]">
                    <h2 className="text-[22px] font-bold text-[#1C3879] mb-3">
                      {step.title}
                    </h2>
                    <p className="text-[#475569] text-base leading-[1.7] mb-3">
                      {step.desc}
                    </p>
                    <p className="text-[#4A6FA5] text-base font-medium leading-[1.7]">
                      {step.outcome}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* In Practice block */}
          <motion.div
            {...fadeUp}
            className="mt-[72px] bg-white border border-[#E5E7EB] rounded-[18px] p-[34px] max-w-[720px] shadow-[0_10px_22px_rgba(15,23,42,0.04)]"
          >
            <h3 className="text-[22px] font-bold text-[#1C3879] mb-4">
              איך זה נראה בפועל
            </h3>
            <div className="space-y-[14px] text-[#475569] text-base leading-[1.8]">
              <p>ברוב המקרים, התהליך כולל שני מפגשים:</p>
              <p>
                במפגש הראשון ממפים את התמונה המלאה — הכנסות, הוצאות, נכסים, התחייבויות, אפשרויות מינוף ומצב פנסיוני — ומגדירים יעדים לטווח קצר וארוך.
              </p>
              <p>
                לאחר מכן נבנית תוכנית שמבוססת על מה שעלה בפגישה, ולעיתים כוללת מספר תרחישים.
              </p>
              <p>
                במפגש השני עוברים על התוכנית, מחדדים את המשמעויות, ומתרגמים אותה לפעולות ברורות — מה עושים בפועל, כבר מהיום הראשון.
              </p>
              <p>
                גם לאחר מכן אני נשאר זמין לשאלות ולדיוקים לאורך הדרך.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp} className="text-center mt-[44px]">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-semibold px-[30px] py-4 rounded-[14px] transition-all duration-200 text-lg shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
            >
              קבעו שיחת היכרות
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[800px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.h2
            {...fadeUp}
            className="text-[2rem] md:text-[2.2rem] font-bold text-[#1C3879] mb-12 text-center"
          >
            שאלות נפוצות
          </motion.h2>

          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F7F8FA] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              לפעמים שיחה אחת היא כל מה שצריך כדי להתחיל לזוז.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1C3879] hover:bg-[#142b5c] text-white font-bold px-10 py-[18px] rounded-xl transition-colors duration-300 text-lg"
            >
              בואו נעשה סדר — ונבין מה נכון עבורכם
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
