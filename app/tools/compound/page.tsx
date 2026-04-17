"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// ============================================================================
// Compound interest calculator — two modes:
//   • forward  — given initial + monthly + rate + years → final value
//   • reverse  — given initial + monthly + target + years → required rate
// All math uses monthly compounding in REAL terms (the rate the user types is
// always real). The "בערכים של היום" toggle is purely a display switch:
//   • ON  — show sums in today's purchasing power (the raw real result)
//   • OFF — show the same sums inflated by (1 + INFLATION)^years, so the user
//           can see what the number "will look like" in nominal future money.
// In reverse mode the target input is interpreted in the same lens — when the
// toggle is off, the user is typing a nominal future-dollar target, and we
// convert it back to real before solving for the required rate.
// ============================================================================

const INFLATION = 0.03;

type Mode = "forward" | "reverse";

interface FormState {
  mode: Mode;
  initial: string;
  monthly: string;
  annualRate: string; // forward only
  target: string; // reverse only
  years: string;
  realTerms: boolean;
}

const initialForm: FormState = {
  mode: "forward",
  initial: "100000",
  monthly: "2000",
  annualRate: "6",
  target: "2000000",
  years: "20",
  realTerms: true,
};

// ---------------------------------------------------------------------------
// Math
// ---------------------------------------------------------------------------

/** Closed-form future value with monthly compounding and monthly deposits. */
function finalBalance(
  P: number,
  M: number,
  annualRate: number,
  years: number
): number {
  const i = annualRate / 12;
  const N = Math.round(years * 12);
  if (N <= 0) return P;
  if (Math.abs(i) < 1e-10) return P + M * N;
  const growth = Math.pow(1 + i, N);
  return P * growth + M * ((growth - 1) / i);
}

interface SimPoint {
  t: number; // 0..1 across the horizon
  balance: number;
  contributions: number;
}

/** Month-by-month simulation, for chart rendering. */
function simulate(
  P: number,
  M: number,
  annualRate: number,
  years: number
): SimPoint[] {
  const i = annualRate / 12;
  const N = Math.max(1, Math.round(years * 12));
  const pts: SimPoint[] = [];
  let balance = P;
  let contrib = P;
  pts.push({ t: 0, balance, contributions: contrib });
  for (let k = 1; k <= N; k++) {
    balance = balance * (1 + i) + M;
    contrib += M;
    pts.push({ t: k / N, balance, contributions: contrib });
  }
  return pts;
}

interface Solution {
  rate: number;
  feasible: boolean;
}

/**
 * Bisection over the annual-rate axis: find the rate such that the final
 * balance equals the target. Returns `feasible: false` when even a 100%
 * annual return can't reach the target.
 */
function solveRate(
  P: number,
  M: number,
  target: number,
  years: number
): Solution | null {
  if (years <= 0 || target <= 0) return null;
  const minReachable = P + M * years * 12;
  if (target <= minReachable) {
    // Target is already reachable with zero return — no growth needed.
    return { rate: 0, feasible: true };
  }
  // Upper bound check: 100% annual nominal return.
  if (finalBalance(P, M, 1, years) < target) {
    return { rate: 1, feasible: false };
  }
  let lo = 0;
  let hi = 1;
  for (let iter = 0; iter < 80; iter++) {
    const mid = (lo + hi) / 2;
    const fb = finalBalance(P, M, mid, years);
    if (fb < target) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-6) break;
  }
  return { rate: (lo + hi) / 2, feasible: true };
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function formatMoney(n: number): string {
  if (!isFinite(n) || n <= 0) return "₪0";
  return "₪" + Math.round(n).toLocaleString("en-US");
}

function formatBigMoney(n: number): string {
  if (!isFinite(n) || n <= 0) return "₪0";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `₪${m.toFixed(m < 10 ? 2 : 1)} מיליון`;
  }
  if (n >= 100_000) return `₪${Math.round(n / 1000)}K`;
  return "₪" + Math.round(n).toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function CompoundPage() {
  const [form, setForm] = useState<FormState>(initialForm);

  const P = Math.max(0, Number(form.initial) || 0);
  const M = Math.max(0, Number(form.monthly) || 0);
  const years = Math.max(0, Number(form.years) || 0);
  const realRate = Math.max(0, Number(form.annualRate) || 0) / 100;

  // Display lens: 1 when showing in today's money, (1+inf)^years when showing
  // inflated nominal values. Applied only to displayed "future" amounts.
  const displayScale = form.realTerms
    ? 1
    : Math.pow(1 + INFLATION, years);

  // Target interpretation mirrors the lens: when the user is typing in nominal
  // future dollars, convert back to real before solving.
  const targetEntered = Math.max(0, Number(form.target) || 0);
  const targetReal = displayScale > 0 ? targetEntered / displayScale : targetEntered;

  let effectiveRate = realRate;
  let solution: Solution | null = null;
  if (form.mode === "reverse") {
    solution = solveRate(P, M, targetReal, years);
    effectiveRate = solution?.rate ?? 0;
  }

  // Final value in REAL terms (today's money) — this is what the math produces.
  const finalValueReal =
    form.mode === "forward"
      ? finalBalance(P, M, effectiveRate, years)
      : solution?.feasible
        ? targetReal
        : finalBalance(P, M, effectiveRate, years);

  const totalContributionsReal = P + M * years * 12;

  // Scaled for display.
  const finalValueDisplay = finalValueReal * displayScale;
  const totalContributionsDisplay = totalContributionsReal * displayScale;
  const growthDisplay = Math.max(0, finalValueDisplay - totalContributionsDisplay);
  const growthPercent =
    finalValueDisplay > 0 ? (growthDisplay / finalValueDisplay) * 100 : 0;

  const points = simulate(P, M, effectiveRate, years);

  const showChart = years > 0 && (P > 0 || M > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(26,54,93,0.15)] p-6 sm:p-8 md:p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5AC8C8]/10 border border-[#5AC8C8]/30 mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5AC8C8]" />
              <span className="text-xs font-bold text-[#1A365D] tracking-wider">
                מחשבון חינמי
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-[2.2rem] font-bold text-[#1A365D] leading-tight mb-3"
            >
              מחשבון ריבית דריבית
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg"
            >
              ראו בעיניים איך הכסף שלכם עובד בשבילכם לאורך הזמן
            </motion.p>
          </div>

          {/* Mode tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex bg-gray-100 rounded-2xl p-1 mb-8"
          >
            <ModeTab
              active={form.mode === "forward"}
              onClick={() => setForm({ ...form, mode: "forward" })}
            >
              מה יהיה לי?
            </ModeTab>
            <ModeTab
              active={form.mode === "reverse"}
              onClick={() => setForm({ ...form, mode: "reverse" })}
            >
              איזו תשואה דרושה?
            </ModeTab>
          </motion.div>

          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
          >
            <Field label="סכום התחלתי (₪)">
              <MoneyInput
                value={form.initial}
                onChange={(v) => setForm({ ...form, initial: v })}
                placeholder="100,000"
              />
            </Field>
            <Field label="הפקדה חודשית (₪)">
              <MoneyInput
                value={form.monthly}
                onChange={(v) => setForm({ ...form, monthly: v })}
                placeholder="2,000"
              />
            </Field>

            {form.mode === "forward" ? (
              <Field label="תשואה שנתית ריאלית (%)">
                <PlainInput
                  value={form.annualRate}
                  onChange={(v) => setForm({ ...form, annualRate: v })}
                  placeholder="6"
                />
              </Field>
            ) : (
              <Field
                label={
                  form.realTerms
                    ? "סכום יעד (בערכים של היום)"
                    : `סכום יעד (בעוד ${years || "N"} שנים)`
                }
              >
                <MoneyInput
                  value={form.target}
                  onChange={(v) => setForm({ ...form, target: v })}
                  placeholder="2,000,000"
                />
              </Field>
            )}

            <Field label="תקופה (שנים)">
              <PlainInput
                value={form.years}
                onChange={(v) => setForm({ ...form, years: v })}
                placeholder="20"
              />
            </Field>
          </motion.div>

          {/* Real terms toggle */}
          <motion.label
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-start gap-3 cursor-pointer mb-8 px-1 select-none"
          >
            <input
              type="checkbox"
              checked={form.realTerms}
              onChange={(e) =>
                setForm({ ...form, realTerms: e.target.checked })
              }
              className="w-4 h-4 accent-[#5AC8C8] mt-0.5"
            />
            <div className="text-sm leading-snug">
              <span className="font-semibold text-[#1A365D]">
                בערכים של היום
              </span>
              <span className="text-gray-500 mr-2">
                (בהנחת אינפלציה של 3% בשנה)
              </span>
            </div>
          </motion.label>

          {/* Result card */}
          <ResultCard
            mode={form.mode}
            finalValue={finalValueDisplay}
            rate={effectiveRate}
            solution={solution}
            totalContributions={totalContributionsDisplay}
            growth={growthDisplay}
            growthPercent={growthPercent}
            realTerms={form.realTerms}
            years={years}
          />

          {/* Growth chart */}
          {showChart && (
            <GrowthChart
              points={points}
              years={years}
              finalValue={finalValueDisplay}
              realTerms={form.realTerms}
            />
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-10"
          >
            <p className="text-gray-700 text-base md:text-lg font-medium text-center mb-5">
              רוצים לבנות תוכנית אמיתית להגיע לשם?
            </p>
            <Link
              href="/contact"
              className="block w-full bg-gradient-to-l from-[#D4AF37] to-[#e6c350] text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 text-center transition-shadow"
            >
              קבעו שיחת היכרות
            </Link>
          </motion.div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 leading-relaxed mt-8 pt-6 border-t border-gray-100 text-center">
            החישוב הוא הערכה מתמטית בהנחת תשואה קבועה. תשואות בפועל משתנות
            לאורך זמן. אין לראות באמור המלצה להשקעה או תחליף לייעוץ מותאם אישית.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result card — different content per mode
// ---------------------------------------------------------------------------

function ResultCard({
  mode,
  finalValue,
  rate,
  solution,
  totalContributions,
  growth,
  growthPercent,
  realTerms,
  years,
}: {
  mode: Mode;
  finalValue: number;
  rate: number;
  solution: Solution | null;
  totalContributions: number;
  growth: number;
  growthPercent: number;
  realTerms: boolean;
  years: number;
}) {
  const lensLabel = realTerms
    ? "בערכים של היום"
    : `בעוד ${years} שנים (נומינלי)`;

  if (mode === "forward") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden bg-gradient-to-br from-[#1A365D] via-[#1A365D] to-[#2a4a7a] rounded-3xl p-7 md:p-10 shadow-2xl shadow-[#1A365D]/20 mb-6"
      >
        <div
          aria-hidden
          className="absolute top-0 right-0 w-40 h-40 bg-[#5AC8C8]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
        />
        <div className="relative text-center">
          <div className="text-[#5AC8C8] text-xs font-bold tracking-widest mb-3 uppercase">
            הסכום בסיום · {lensLabel}
          </div>
          <div className="text-4xl md:text-[3.2rem] font-bold text-white tracking-tight mb-6 leading-none">
            {formatMoney(finalValue)}
          </div>
          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="text-center">
              <div className="text-white/60 text-[11px] font-bold tracking-widest uppercase mb-1">
                סך הפקדות
              </div>
              <div className="text-white font-bold text-base md:text-lg">
                {formatBigMoney(totalContributions)}
              </div>
            </div>
            <div className="h-10 w-px bg-white/15" />
            <div className="text-center">
              <div className="text-[#5AC8C8] text-[11px] font-bold tracking-widest uppercase mb-1">
                רווח מריבית דריבית
              </div>
              <div className="text-[#5AC8C8] font-bold text-base md:text-lg">
                {formatBigMoney(growth)}
                <span className="text-[11px] font-semibold text-[#5AC8C8]/70 mr-1.5">
                  ({Math.round(growthPercent)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Reverse mode
  if (solution === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center text-gray-500 mb-6"
      >
        הזינו את הפרטים כדי לראות את התשואה הנדרשת
      </motion.div>
    );
  }

  const feasible = solution.feasible;
  const ratePct = rate * 100;

  let note: string;
  if (!feasible) {
    note =
      "היעד קשה להשגה בתנאים הנוכחיים. נסו להאריך את התקופה, להגדיל את ההפקדה החודשית, או להוריד את היעד.";
  } else if (ratePct < 0.1) {
    note =
      "אתם כבר בדרך — ההפקדות בלבד מספיקות כדי להגיע ליעד. כל תשואה נוספת היא בונוס.";
  } else if (ratePct <= 4) {
    note =
      "תשואה שמרנית. ניתן להגיע לזה גם עם תיק סולידי יחסית — אג״ח, פיקדונות, וקצת מניות.";
  } else if (ratePct <= 7) {
    note =
      "תשואה ריאלית סבירה לטווח ארוך, בתיק מניות מפוזר גלובלית. עקבי ולא דרמטי.";
  } else if (ratePct <= 10) {
    note =
      "יעד אגרסיבי. ידרוש חשיפה גבוהה למניות ומשמעת עצומה לאורך כל התקופה, גם בשוקי ירידות.";
  } else {
    note =
      "תשואה גבוהה מאוד. קשה להגיע אליה בצורה עקבית ללא סיכון מוגבר משמעותית.";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-gradient-to-br from-[#1A365D] via-[#1A365D] to-[#2a4a7a] rounded-3xl p-7 md:p-10 shadow-2xl shadow-[#1A365D]/20 mb-6"
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 w-40 h-40 bg-[#5AC8C8]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
      />
      <div className="relative text-center">
        <div className="text-[#5AC8C8] text-xs font-bold tracking-widest mb-3 uppercase">
          תשואה שנתית ריאלית נדרשת
        </div>
        <div
          dir="ltr"
          className="text-[3.2rem] md:text-[4.5rem] font-bold text-white tracking-tight mb-5 leading-none"
        >
          {feasible ? ratePct.toFixed(1) : "—"}
          <span className="text-3xl md:text-4xl text-white/60 mr-1">%</span>
        </div>
        <p
          className={`text-sm md:text-base leading-relaxed max-w-md mx-auto ${
            feasible ? "text-blue-100/80" : "text-[#fca5a5]"
          }`}
        >
          {note}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Growth chart — stacked areas: contributions (gray) + compound gain (teal)
// ---------------------------------------------------------------------------

function GrowthChart({
  points,
  years,
  finalValue,
  realTerms,
}: {
  points: SimPoint[];
  years: number;
  finalValue: number;
  realTerms: boolean;
}) {
  const CHART_W = 420;
  const CHART_H = 170;
  const PAD_L = 14;
  const PAD_R = 14;
  const PAD_T = 14;
  const PAD_B = 14;
  const innerW = CHART_W - PAD_L - PAD_R;
  const innerH = CHART_H - PAD_T - PAD_B;

  // Downsample to ~60 points for smoother curves.
  const SAMPLES = Math.min(60, points.length);
  const sampled: SimPoint[] = [];
  if (points.length <= SAMPLES) {
    sampled.push(...points);
  } else {
    const step = (points.length - 1) / (SAMPLES - 1);
    for (let i = 0; i < SAMPLES; i++) {
      sampled.push(points[Math.round(i * step)]);
    }
  }

  const yMax = Math.max(...sampled.map((p) => p.balance), 1) * 1.05;
  const xAt = (t: number) => PAD_L + t * innerW;
  const yAt = (v: number) => PAD_T + innerH - (v / yMax) * innerH;
  const baseY = PAD_T + innerH;

  const balancePath = sampled
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xAt(p.t).toFixed(1)} ${yAt(p.balance).toFixed(1)}`
    )
    .join(" ");

  // Closed polygon — baseline → up the balance curve → back to baseline
  const balanceArea =
    `M ${xAt(0).toFixed(1)} ${baseY.toFixed(1)} ` +
    sampled
      .map(
        (p) => `L ${xAt(p.t).toFixed(1)} ${yAt(p.balance).toFixed(1)}`
      )
      .join(" ") +
    ` L ${xAt(1).toFixed(1)} ${baseY.toFixed(1)} Z`;

  // Contributions polygon — covers the bottom portion of the balance area.
  const contribArea =
    `M ${xAt(0).toFixed(1)} ${baseY.toFixed(1)} ` +
    sampled
      .map(
        (p) =>
          `L ${xAt(p.t).toFixed(1)} ${yAt(p.contributions).toFixed(1)}`
      )
      .join(" ") +
    ` L ${xAt(1).toFixed(1)} ${baseY.toFixed(1)} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="bg-gray-50 rounded-2xl p-5 md:p-6"
    >
      {/* Header + legend */}
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="text-xs font-bold text-[#1A365D] tracking-widest uppercase">
          הצמיחה שלך
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-300" />
            <span className="text-gray-500 font-semibold">הפקדות</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-[#5AC8C8] to-[#1A365D]" />
            <span className="text-gray-500 font-semibold">רווח</span>
          </div>
        </div>
      </div>

      {/* Endpoint labels — LTR flow to match the chart's left-to-right axis.
          "היום" is always today's money (unscaled). The right label follows
          the lens — real or nominal future equivalent. */}
      <div dir="ltr" className="flex items-end justify-between mb-2 px-1">
        <div className="text-left" dir="rtl">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            היום
          </div>
          <div className="text-sm font-bold text-gray-600">
            {formatBigMoney(points[0].balance)}
          </div>
        </div>
        <div className="text-right" dir="rtl">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            בעוד {years} שנים{realTerms ? "" : " · נומינלי"}
          </div>
          <div className="text-sm font-bold text-[#1A365D]">
            {formatBigMoney(finalValue)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        aria-hidden
      >
        <defs>
          <linearGradient id="compoundGrowthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5AC8C8" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#1A365D" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient
            id="compoundBalanceStroke"
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
          >
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="55%" stopColor="#5AC8C8" />
            <stop offset="100%" stopColor="#1A365D" />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={PAD_L}
          y1={baseY}
          x2={PAD_L + innerW}
          y2={baseY}
          stroke="#E5E7EB"
          strokeWidth={1}
        />

        {/* Compound growth area (full balance) */}
        <motion.path
          d={balanceArea}
          fill="url(#compoundGrowthFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        />

        {/* Contributions area — layered on top, hiding the bottom portion */}
        <motion.path
          d={contribArea}
          fill="#D1D5DB"
          fillOpacity={0.8}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        />

        {/* Balance curve line */}
        <motion.path
          d={balancePath}
          fill="none"
          stroke="url(#compoundBalanceStroke)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Inputs & small UI bits
// ---------------------------------------------------------------------------

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 relative py-2.5 px-4 rounded-xl text-sm font-bold transition-colors ${
        active ? "text-white" : "text-[#1A365D]/60 hover:text-[#1A365D]"
      }`}
    >
      {active && (
        <motion.div
          layoutId="compound-mode-tab-bg"
          className="absolute inset-0 bg-gradient-to-l from-[#1A365D] to-[#2a4a7a] rounded-xl shadow-md shadow-[#1A365D]/25"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#1A365D] mb-2 tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const display = value ? Number(value).toLocaleString("en-US") : "";
  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#5AC8C8] focus:bg-white text-lg font-bold text-[#1A365D] transition-all placeholder:text-gray-400 placeholder:font-normal"
    />
  );
}

function PlainInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#5AC8C8] focus:bg-white text-lg font-bold text-[#1A365D] transition-all placeholder:text-gray-400 placeholder:font-normal"
    />
  );
}
