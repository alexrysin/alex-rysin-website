"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ============================================================================
// Tools index - landing page listing all free financial planning tools.
// ============================================================================

const tools = [
  {
    href: "/tools/potential",
    eyebrow: "מחשבון אישי",
    title: "המספר שלי",
    description:
      "תוך 5 דקות תגלו את הפוטנציאל הכלכלי האמיתי שלכם - שווי נקי והכנסה חודשית שלא תלויה בעבודה, בעוד כמה שנים.",
    duration: "5 דקות",
    icon: "💎",
    accent: "from-[#1A365D] via-[#1A365D] to-[#2a4a7a]",
    accentText: "#5AC8C8",
  },
  {
    href: "/tools/health-check",
    eyebrow: "שאלון אבחון",
    title: "מבחן בריאות כלכלית",
    description:
      "15 שאלות קצרות על הבסיס הכלכלי שלכם - קרן חירום, חובות, חיסכון, תכנון ופיקוח. ציון לכל קטגוריה והמלצות אישיות.",
    duration: "3 דקות",
    icon: "🩺",
    accent: "from-[#5AC8C8] to-[#4ab8b8]",
    accentText: "#ffffff",
  },
  {
    href: "/tools/compound",
    eyebrow: "מחשבון",
    title: "ריבית דריבית",
    description:
      "תכננו כמה הכסף שלכם יצמח לאורך השנים - או חשבו איזו תשואה שנתית אתם צריכים כדי להגיע לסכום יעד.",
    duration: "2 דקות",
    icon: "📈",
    accent: "from-[#D4AF37] via-[#D4AF37] to-[#e6c350]",
    accentText: "#fff9db",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-14 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5AC8C8]/10 border border-[#5AC8C8]/30 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#5AC8C8]" />
            <span className="text-xs font-bold text-[#1C3879] tracking-wider">
              כלים חינמיים
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-[2.6rem] font-bold text-[#1C3879] leading-tight mb-5"
          >
            הכלים שלי עבורכם
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto"
          >
            כלים חינמיים שעוזרים לכם לעשות סדר בתמונה הכלכלית שלכם - בלי
            הרשמה, בלי מחויבות, ועם תוצאה מיידית.
          </motion.p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={tool.href}
                className="group block h-full bg-white rounded-3xl shadow-[0_20px_60px_-25px_rgba(26,54,93,0.2)] border border-gray-100 overflow-hidden hover:shadow-[0_25px_70px_-20px_rgba(26,54,93,0.3)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top accent strip - echoes the tool's visual identity */}
                <div
                  className={`relative overflow-hidden bg-gradient-to-br ${tool.accent} p-8 md:p-10`}
                >
                  <div
                    aria-hidden
                    className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: tool.accentText }}
                    >
                      {tool.eyebrow}
                    </div>
                    <div className="text-4xl leading-none" aria-hidden>
                      {tool.icon}
                    </div>
                  </div>
                  <div className="relative text-3xl md:text-[2rem] font-bold text-white tracking-tight mt-3">
                    {tool.title}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 md:p-7">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-400">
                      ⏱ {tool.duration}
                    </div>
                    <div className="inline-flex items-center gap-2 text-[#1C3879] font-bold text-sm group-hover:gap-3 transition-all">
                      <span>נסו עכשיו</span>
                      <span aria-hidden>←</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Closing note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center text-xs text-gray-400 mt-10"
        >
          כל הכלים אנונימיים &middot; ללא הרשמה &middot; אין לראות באמור המלצה
          להשקעה או תחליף לייעוץ מותאם אישית
        </motion.p>
      </div>
    </div>
  );
}
