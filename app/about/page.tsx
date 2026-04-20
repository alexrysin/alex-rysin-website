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


export default function AboutPage() {
  return (
    <>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative lg:pl-14 lg:mt-8"
            >
              {/*
                To display the actual photo, copy the image files from assets/ to public/assets/
                and update the src below to: /assets/photo1.jpg
              */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] bg-gradient-to-br from-[#1C3879] to-[#4A6FA5]">
                <img
                  src="/assets/about.png"
                  alt="אלכס ריסין - יועץ פיננסי"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div {...fadeUp}>
              <div className="space-y-4 text-gray-600 leading-[1.8] text-base md:text-lg">
                <p>
                  לפני קצת יותר מעשור לא באמת הבנתי איך כסף עובד.
                  הרווחתי יפה, חסכתי, אבל גם עשיתי לא מעט טעויות יקרות.
                  לקראת הלידה של בתי הבכורה, הבנתי שאני לא יכול להשאיר את זה &quot;בערך&quot;.
                  שיש תחומים בחיים שצריך לקחת עליהם אחריות - והתחום הפיננסי הוא אחד המרכזיים שבהם.
                </p>
                <p>
                  לאורך השנים ליוויתי מאות משפחות ויחידים בצמתים פיננסיים משמעותיים - החלטות על השקעות, מינוף, נכסים, ותכנון קדימה.
                  ראיתי אנשים חכמים ומסודרים שמקבלים החלטות כלכליות, טובות יותר או פחות, אבל בלי דרך שמחברת אותן לתמונה אחת ברורה של העתיד הכלכלי שלהם.
                  לא בגלל חוסר ידע.
                  לפעמים בגלל היעדר כיוון ברור. ולפעמים בגלל הערכת חסר של פוטנציאל הכלכלי שלהם.
                </p>
                <p>
                  מתוך זה נבנתה הגישה שלי -{" "}
                  <em className="not-italic font-semibold text-[#1C3879]">לא רק &quot;מה לעשות עכשיו&quot;, אלא איך לחשוב קדימה</em>, לבנות אסטרטגיה, ולהבין איך כל מהלך מתחבר לתמונה הגדולה.
                </p>
                <p className="font-semibold text-[#1C3879]">
                  אני לא מנהל לאנשים את הכסף.
                </p>
                <p>
                  המטרה שלי היא שאתם תדעו לנהל את ההחלטות שלכם.
                  לבנות תמונה ברורה, שמחברת בין כל המשתנים, גם הכלכליים - וגם כאלה שמעבר -
                  ולהגיע למצב שבו אתם יודעים מה נכון לכם, גם עכשיו, וגם בעתיד, כשנסיבות החיים משתנות.
                </p>
                <p>
                  אני עובד כיועץ בלתי תלוי, בלי אינטרס למכור מוצרים -
                  ומתמקד בדבר אחד: לעזור לכם לבנות כיוון כלכלי שמשרת את החיים שאתם רוצים.
                </p>
                <p>
                  החזון שלי הוא פשוט:
                  לאפשר לכם להגיע למצב שבו הכסף נותן לכם יותר אפשרויות.
                  לבחור איך נראה היום שלכם -
                  ולעסוק במה שבאמת חשוב לכם.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-blue-50 rounded-xl p-4 flex-1 min-w-[140px] text-center">
                  <div className="text-2xl font-bold text-[#1C3879]">8+</div>
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

      {/* CTA */}
      <section className="bg-[#1C3879] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              רוצים להכיר?
            </h2>
            <p className="text-blue-200 text-lg mb-10">
              שיחת ההיכרות בחינם ומחייבת לשום דבר - שיחה שיכולה לשנות הרבה.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5a781e] text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 text-lg shadow-lg"
            >
              קבעו שיחת היכרות חינם
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
