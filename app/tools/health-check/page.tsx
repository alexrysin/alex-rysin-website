"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  computeResult,
  getActionableRecommendations,
  QUESTIONS,
  TIERS,
  type Answer,
  type QuizResult,
} from "./quiz";

// ============================================================================
// Financial Health Check - welcome / quiz / result
// ============================================================================

type Step = "welcome" | "quiz" | "result";

const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
const stepTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function HealthCheckPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  function start() {
    setAnswers({});
    setResult(null);
    setStep("quiz");
  }

  function finish(finalAnswers: Record<string, Answer>) {
    const r = computeResult(finalAnswers);
    setResult(r);
    submitToSheet(finalAnswers, r);
    setStep("result");
  }

  function reset() {
    setAnswers({});
    setResult(null);
    setStep("welcome");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(26,54,93,0.15)] p-6 sm:p-10 md:p-12 border border-gray-100 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepTransition}
            >
              {step === "welcome" && <WelcomeStep onStart={start} />}
              {step === "quiz" && (
                <QuizStep
                  answers={answers}
                  setAnswers={setAnswers}
                  onFinish={finish}
                  onBack={() => setStep("welcome")}
                />
              )}
              {step === "result" && result && (
                <ResultStep result={result} onReset={reset} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Welcome step
// ---------------------------------------------------------------------------

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5AC8C8]/10 border border-[#5AC8C8]/30 mb-6"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#5AC8C8]" />
        <span className="text-xs font-bold text-[#1A365D] tracking-wider">
          כלי חינמי · תוך 3 דקות
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-[2.4rem] font-bold text-[#1A365D] leading-tight mb-4"
      >
        מבחן בריאות כלכלית
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg mx-auto"
      >
        15 שאלות קצרות על הבסיס הכלכלי שלכם. בסוף תקבלו ציון לכל קטגוריה -
        והכיוונים שהכי חשוב להתחיל לעבוד עליהם.
      </motion.p>

      {/* What we check */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-50 rounded-2xl p-5 mb-10 text-right"
      >
        <div className="text-xs font-bold text-[#1A365D] tracking-widest mb-4 uppercase">
          מה נבדוק
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          {[
            ["🛡️", "חוסן פיננסי"],
            ["💳", "חובות והתחייבויות"],
            ["💰", "חיסכון והשקעה"],
            ["📋", "תכנון ארוך טווח"],
            ["🧭", "מודעות ובקרה"],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2">
              <span aria-hidden>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <PrimaryButton onClick={onStart}>בואו נתחיל</PrimaryButton>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quiz step - one question at a time with progress bar and auto-advance
// ---------------------------------------------------------------------------

function QuizStep({
  answers,
  setAnswers,
  onFinish,
  onBack,
}: {
  answers: Record<string, Answer>;
  setAnswers: (a: Record<string, Answer>) => void;
  onFinish: (a: Record<string, Answer>) => void;
  onBack: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const total = QUESTIONS.length;
  const question = QUESTIONS[idx];
  const current = answers[question.id];

  function pick(answer: Answer) {
    const next = { ...answers, [question.id]: answer };
    setAnswers(next);
    // Small delay so the selection is visible before advancing.
    setTimeout(() => {
      if (idx < total - 1) {
        setIdx(idx + 1);
      } else {
        onFinish(next);
      }
    }, 220);
  }

  function goBackOne() {
    if (idx > 0) setIdx(idx - 1);
    else onBack();
  }

  const progress = ((idx + 1) / total) * 100;

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1A365D] tracking-widest uppercase">
            שאלה {idx + 1} מתוך {total}
          </span>
          <button
            onClick={goBackOne}
            className="text-gray-400 hover:text-[#1A365D] font-medium text-xs transition-colors"
          >
            ← חזרה
          </button>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-[#5AC8C8] to-[#1A365D] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-[#1A365D] leading-snug mb-8 min-h-[4rem]">
            {question.text}
          </h2>

          <div className="space-y-3">
            <AnswerButton
              label="כן"
              selected={current === "yes"}
              onClick={() => pick("yes")}
            />
            <AnswerButton
              label="בערך"
              selected={current === "kind_of"}
              onClick={() => pick("kind_of")}
            />
            <AnswerButton
              label="לא"
              selected={current === "no"}
              onClick={() => pick("no")}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AnswerButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`w-full text-right py-4 px-6 rounded-xl text-lg font-semibold transition-all border-2 ${
        selected
          ? "bg-[#1A365D] text-white border-[#1A365D] shadow-lg shadow-[#1A365D]/20"
          : "bg-white text-[#1A365D] border-gray-200 hover:border-[#5AC8C8] hover:bg-gray-50"
      }`}
    >
      {label}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Result step - overall score, radar chart, recommendations, CTA
// ---------------------------------------------------------------------------

function ResultStep({
  result,
  onReset,
}: {
  result: QuizResult;
  onReset: () => void;
}) {
  const tier = TIERS[result.tier];
  const actionable = getActionableRecommendations(result);

  return (
    <div className="text-center py-2">
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-l from-[#5AC8C8]/10 to-[#1A365D]/5 border border-[#5AC8C8]/20 mb-5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#5AC8C8]" />
        <span className="text-xs font-bold text-[#1A365D] tracking-wider">
          התוצאה שלכם
        </span>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden bg-gradient-to-br from-[#1A365D] via-[#1A365D] to-[#2a4a7a] rounded-3xl p-8 md:p-10 mb-8 shadow-2xl shadow-[#1A365D]/20"
      >
        <div
          aria-hidden
          className="absolute top-0 right-0 w-40 h-40 bg-[#5AC8C8]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
        />
        <div className="relative">
          <div className="text-[#5AC8C8] text-xs font-bold tracking-widest mb-3 uppercase">
            ציון כולל
          </div>
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <CountUp to={result.totalPercent} duration={1500} delay={500} />
            <span className="text-2xl md:text-3xl font-semibold text-white/60">
              / 100
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
            <span aria-hidden>{tier.emoji}</span>
            <span className="text-sm font-bold text-white">{tier.label}</span>
          </div>
          <p className="text-blue-100/80 text-sm md:text-base mt-5 leading-relaxed max-w-md mx-auto">
            {tier.description}
          </p>
        </div>
      </motion.div>

      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gray-50 rounded-2xl p-6 mb-8"
      >
        <div className="text-xs font-bold text-[#1A365D] tracking-widest mb-4 uppercase">
          פירוט לפי קטגוריה
        </div>
        <RadarChart result={result} />
      </motion.div>

      {/* Recommendations */}
      {actionable.length > 0 && (
        <div className="mb-10 text-right">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-xs font-bold text-[#1A365D] tracking-widest mb-4 uppercase"
          >
            נקודות לחיזוק
          </motion.div>
          <div className="space-y-3">
            {actionable.map(({ category, recommendation }, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1.4 + idx * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white border border-[#5AC8C8]/25 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    aria-hidden
                    className="text-2xl leading-none mt-0.5 shrink-0"
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5 gap-3">
                      <div className="text-sm font-bold text-[#1A365D]">
                        {category.title}
                      </div>
                      <div className="text-xs font-semibold text-gray-400">
                        {category.raw} / 6
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 + actionable.length * 0.15 + 0.2 }}
      >
        <p className="text-gray-700 text-lg mb-6 font-medium">
          רוצים לתרגם את זה לתוכנית פעולה?
        </p>
        <div className="space-y-3">
          <Link
            href="/contact"
            className="block w-full bg-gradient-to-l from-[#D4AF37] to-[#e6c350] text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 text-center"
          >
            קבעו שיחת היכרות
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="text-gray-400 hover:text-[#1A365D] font-medium text-sm mt-4 transition-colors"
          >
            מילוי מחדש
          </button>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.8 + actionable.length * 0.15 }}
        className="text-xs text-gray-400 leading-relaxed mt-10 pt-6 border-t border-gray-100 text-center"
      >
        אין לראות באמור המלצה להשקעה או תחליף לייעוץ מותאם אישית.
      </motion.p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radar chart - 5 axes, SVG
// ---------------------------------------------------------------------------

function RadarChart({ result }: { result: QuizResult }) {
  const SIZE = 320;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const RADIUS = 92;
  const cats = result.categories;
  const N = cats.length;

  // Angles: start at top (-π/2) and go clockwise.
  const angleAt = (i: number) => -Math.PI / 2 + (i / N) * Math.PI * 2;

  // Concentric grid rings at 25%, 50%, 75%, 100%
  const rings = [0.25, 0.5, 0.75, 1];

  // Axis endpoints
  const axisPts = cats.map((_, i) => {
    const a = angleAt(i);
    return [CX + Math.cos(a) * RADIUS, CY + Math.sin(a) * RADIUS] as const;
  });

  // Data polygon points (fraction of full radius per axis)
  const dataPts = cats.map((c, i) => {
    const a = angleAt(i);
    const r = (c.percent / 100) * RADIUS;
    return [CX + Math.cos(a) * r, CY + Math.sin(a) * r] as const;
  });

  const dataPath =
    dataPts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") +
    " Z";

  // Label box dimensions and anchor points just outside the ring.
  const LABEL_BOX_W = 110;
  const LABEL_BOX_H = 48;
  const LABEL_OFFSET = 12;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`-60 0 ${SIZE + 120} ${SIZE}`}
        className="w-full max-w-[380px] h-auto"
        aria-hidden
      >
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5AC8C8" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#1A365D" stopOpacity={0.5} />
          </linearGradient>
        </defs>

        {/* Concentric rings */}
        {rings.map((r, idx) => {
          const pts = cats.map((_, i) => {
            const a = angleAt(i);
            return `${(CX + Math.cos(a) * RADIUS * r).toFixed(1)},${(
              CY +
              Math.sin(a) * RADIUS * r
            ).toFixed(1)}`;
          });
          return (
            <polygon
              key={idx}
              points={pts.join(" ")}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={1}
            />
          );
        })}

        {/* Axes */}
        {axisPts.map(([x, y], i) => (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        ))}

        {/* Data polygon (animated) */}
        <motion.path
          d={dataPath}
          fill="url(#radarFill)"
          stroke="#1A365D"
          strokeWidth={2}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* Data points */}
        {dataPts.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill="#1A365D"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.1 + i * 0.05 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        ))}

        {/* Labels - rendered as HTML via foreignObject so Hebrew RTL text
            wraps naturally without clashing at the bottom of the chart. */}
        {cats.map((c, i) => {
          const a = angleAt(i);
          const r = RADIUS + LABEL_OFFSET;
          const lx = CX + Math.cos(a) * r;
          const ly = CY + Math.sin(a) * r;
          const cosA = Math.cos(a);

          // Position box relative to the anchor point, based on which side
          // of the chart the label sits on.
          let boxX: number;
          let textAlign: "right" | "left" | "center";
          if (cosA > 0.2) {
            // Right-side label: box starts at lx, extends right; hug left edge.
            boxX = lx;
            textAlign = "left";
          } else if (cosA < -0.2) {
            // Left-side label: box ends at lx, extends left; hug right edge.
            boxX = lx - LABEL_BOX_W;
            textAlign = "right";
          } else {
            // Top / bottom label.
            boxX = lx - LABEL_BOX_W / 2;
            textAlign = "center";
          }
          const boxY = ly - LABEL_BOX_H / 2;

          return (
            <foreignObject
              key={c.id}
              x={boxX}
              y={boxY}
              width={LABEL_BOX_W}
              height={LABEL_BOX_H}
            >
              <div
                // @ts-expect-error - xmlns is required inside SVG foreignObject
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign,
                  fontSize: 11,
                  lineHeight: 1.25,
                  color: "#1A365D",
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  <span style={{ marginInlineEnd: 3 }} aria-hidden>
                    {c.icon}
                  </span>
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#6B7280",
                    fontWeight: 500,
                    marginTop: 1,
                  }}
                >
                  {c.raw} / 6
                </div>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function PrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="w-full bg-gradient-to-l from-[#1A365D] to-[#2a4a7a] hover:shadow-xl hover:shadow-[#1A365D]/20 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg shadow-[#1A365D]/10"
    >
      {children}
    </motion.button>
  );
}

/** Count-up number - animates from 0 to target over `duration` ms. */
function CountUp({
  to,
  duration = 1500,
  delay = 0,
}: {
  to: number;
  duration?: number;
  delay?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay]);

  return (
    <span className="text-6xl md:text-7xl font-bold text-white tracking-tight">
      {value}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Submission - fire-and-forget to our API route
// ---------------------------------------------------------------------------

function submitToSheet(
  answers: Record<string, Answer>,
  result: QuizResult
): void {
  const payload = {
    type: "health-check",
    totalPercent: result.totalPercent,
    tier: TIERS[result.tier].label,
    categories: result.categories.reduce<Record<string, number>>((acc, c) => {
      acc[c.id] = c.raw;
      return acc;
    }, {}),
    answers,
  };

  // POST directly to the Google Apps Script webhook. text/plain avoids the
  // CORS preflight that Apps Script doesn't support; the receiving script
  // parses JSON from e.postData.contents.
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_HEALTH_CHECK_URL;
  if (!webhookUrl) return;
  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* silent */
  });
}
