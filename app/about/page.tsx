"use client";

// NOTE ABOUT IMAGES:
// The photos are in the assets/ folder at the project root.
// Next.js can only serve static files from the public/ folder.
// To use the images, copy them from assets/ to public/assets/:
//   assets/473728944_10163099459323223_8417082330305987086_n.jpg → public/assets/photo1.jpg
//   assets/474037141_10163099459513223_5960892024388734908_n.jpg → public/assets/photo2.jpg
//   assets/474063516_10163099459583223_4876267628564463566_n.jpg → public/assets/photo3.jpg
// Then reference them as /assets/photo1.jpg etc.

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const values = [
  {
    icon: (
      <svg className="w-8 h-8 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "שקיפות מלאה",
    desc: "אני לא מוכר מוצרים ולא מרוויח עמלות. ההמלצות שלי הן אך ורק לטובתכם.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "ליווי אישי",
    desc: "כל לקוח מקבל תשומת לב מלאה. אני מכיר את הסיפור שלכם לעומק לפני שאני ממליץ כלום.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "ממוקד תוצאה",
    desc: "הייעוץ שלי לא נגמר בנייר. אני מלווה עד שהצעדים מיושמים בפועל.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#6B8E23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "השכלה ועצמאות",
    desc: "אני רוצה שתצאו מהתהליך עם הבנה עמוקה — לא תלות, אלא כלים לכל החיים.",
  },
];

const networkDomains = [
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: "ייעוץ משפטי",
    desc: 'עורכי דין מומחים בנדל"ן, ירושות ותכנון עיזבון',
    color: "from-[#1C3879] to-[#2a4a9e]",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "ייעוץ מס",
    desc: "רואי חשבון ויועצי מס לאופטימיזציה של תיק ההכנסות",
    color: "from-[#4A6FA5] to-[#3a5f95]",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'נדל"ן',
    desc: 'מומחי נדל"ן להשקעה — מגורים, מסחרי ונדל"ן בחו"ל',
    color: "from-[#6B8E23] to-[#5a781e]",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "שוק ההון",
    desc: "מנהלי תיקים ומומחי השקעות עם ניסיון שוק ארוך שנים",
    color: "from-[#1C3879] to-[#4A6FA5]",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#1C3879] py-24 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-[#6B8E23] bg-opacity-80 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              הכירו את אלכס
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              אודות אלכס ריסין
            </h1>
            <p className="text-blue-200 text-xl max-w-2xl mx-auto">
              יועץ פיננסי בלתי תלוי, המתמחה בתכנון פיננסי אישי ובניית עצמאות כלכלית אמיתית.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 720 0 0 20L0 40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/*
                To display the actual photo, copy the image files from assets/ to public/assets/
                and update the src below to: /assets/photo1.jpg
              */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-gradient-to-br from-[#1C3879] to-[#4A6FA5]">
                {/* Fallback placeholder — replace src with /assets/photo1.jpg once copied to public/ */}
                <img
                  src="/assets/photo1.jpg"
                  alt="אלכס ריסין — יועץ פיננסי"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center text-white text-center p-8">
                          <svg class="w-24 h-24 text-white opacity-30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p class="text-blue-200 text-sm">העתיקו את התמונות מתיקיית assets/ לתיקיית public/assets/</p>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#6B8E23] rounded-2xl opacity-20" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#4A6FA5] rounded-xl opacity-20" />
            </motion.div>

            {/* Content */}
            <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C3879] mb-6">
                הסיפור שלי
              </h2>

              {/* Placeholder for personal story */}
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {/* [סיפור אישי של אלכס יתווסף כאן] */}
                  [פסקה ראשונה — רקע אישי, מאיפה הגעתי ומה גרם לי להתעסק בתחום הפיננסי. מה חוויתי בעצמי שגרם לי להבין שאנשים צריכים ליווי אחר.]
                </p>
                <p>
                  [פסקה שנייה — הדרך המקצועית. הכשרות, ניסיון, מה למדתי מלקוחות לאורך השנים.]
                </p>
                <p>
                  [פסקה שלישית — הפילוסופיה שלי. למה אני עובד כיועץ בלתי תלוי, מה המשמעות שאני מוצא בעבודה, ומה אני מבטיח לכל לקוח.]
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-blue-50 rounded-xl p-4 flex-1 min-w-[140px] text-center">
                  <div className="text-2xl font-bold text-[#1C3879]">10+</div>
                  <div className="text-sm text-gray-500 mt-1">שנות ניסיון</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 flex-1 min-w-[140px] text-center">
                  <div className="text-2xl font-bold text-[#1C3879]">200+</div>
                  <div className="text-sm text-gray-500 mt-1">לקוחות מרוצים</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 flex-1 min-w-[140px] text-center">
                  <div className="text-2xl font-bold text-[#6B8E23]">100%</div>
                  <div className="text-sm text-gray-500 mt-1">ייעוץ בלתי תלוי</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#F8F9FA] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C3879] mb-4">
              הערכים שמנחים אותי
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 flex gap-5 items-start"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1C3879] mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Network */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C3879] mb-4">
              הרשת המקצועית שלי
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              כשהלקוח צריך מומחה בתחום ספציפי — יש לי את הקשרים הנכונים.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {networkDomains.map((domain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-gradient-to-br ${domain.color} rounded-2xl p-6 text-white`}
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                  {domain.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{domain.title}</h3>
                <p className="text-sm text-white text-opacity-80 leading-relaxed">
                  {domain.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1C3879] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              רוצים להכיר?
            </h2>
            <p className="text-blue-200 text-lg mb-10">
              שיחת ההיכרות בחינם ומחייבת לשום דבר — פשוט 30 דקות שיכולות לשנות הרבה.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 text-lg shadow-lg"
            >
              קבע שיחת היכרות חינם
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
