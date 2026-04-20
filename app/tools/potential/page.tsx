"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  calculatePotential,
  formatMagicIncome,
  formatMagicIncomeRange,
  formatMagicNetWorth,
  formatMagicNetWorthRange,
  type LoanInput,
  type PotentialInputs,
  type PotentialResult,
  type PropertyInput,
} from "./calculate";

// ============================================================================
// STAGE 2 - Emotional UX: transitions, count-ups, visual polish.
// ============================================================================

// Shared motion variants for step transitions
const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const stepTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

type Step = "welcome" | "intro" | "income" | "assets" | "result";

export type Gender = "male" | "female";
export type MaritalStatus = "single_or_divorced" | "married";

/** Pick the right wording based on user's gender. Defaults to male if not set. */
function t(gender: Gender | null, male: string, female: string): string {
  return gender === "female" ? female : male;
}

interface FormState {
  name: string;
  gender: Gender | null;
  maritalStatus: MaritalStatus | null;
  currentAge: string;
  yearsAhead: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  hasPrimaryResidence: boolean;
  primary: {
    value: string;
    mortgageBalance: string;
    monthlyPayment: string;
    endYear: string;
    endMonth: string;
  };
  hasInvestmentProperty: boolean;
  investment: {
    value: string;
    mortgageBalance: string;
    monthlyPayment: string;
    endYear: string;
    endMonth: string;
  };
  otherInvestments: string;
  additionalLoans: Array<{
    amount: string;
    monthlyPayment: string;
    endYear: string;
    endMonth: string;
  }>;
}

const emptyProperty = {
  value: "",
  mortgageBalance: "",
  monthlyPayment: "",
  endYear: "",
  endMonth: "",
};

const initialForm: FormState = {
  name: "",
  gender: null,
  maritalStatus: null,
  currentAge: "",
  yearsAhead: "10",
  monthlyIncome: "",
  monthlyExpenses: "",
  hasPrimaryResidence: false,
  primary: { ...emptyProperty },
  hasInvestmentProperty: false,
  investment: { ...emptyProperty },
  otherInvestments: "",
  additionalLoans: [],
};

// ---------------------------------------------------------------------------
// Parse form state → calculator inputs
// ---------------------------------------------------------------------------

function parseProperty(p: FormState["primary"]): PropertyInput {
  return {
    value: Number(p.value) || 0,
    mortgageBalance: Number(p.mortgageBalance) || 0,
    monthlyPayment: Number(p.monthlyPayment) || 0,
    endYear: Number(p.endYear) || new Date().getFullYear(),
    endMonth: Number(p.endMonth) || 1,
  };
}

/** Format a property's end date as "MM/YYYY" or empty string if missing */
function formatEndDate(p: FormState["primary"]): string {
  if (!p.endYear || !p.endMonth) return "";
  return `${p.endMonth.padStart(2, "0")}/${p.endYear}`;
}

/** Format additional loans as a readable single-cell string */
function formatLoans(loans: FormState["additionalLoans"]): string {
  return loans
    .filter((l) => Number(l.amount) > 0)
    .map((l) => {
      const amount = Number(l.amount).toLocaleString("he-IL");
      const payment = Number(l.monthlyPayment)
        ? `, ${Number(l.monthlyPayment).toLocaleString("he-IL")} ₪/חודש`
        : "";
      const end = l.endYear && l.endMonth ? `, עד ${l.endMonth}/${l.endYear}` : "";
      return `${amount} ₪${payment}${end}`;
    })
    .join("; ");
}

/** Fire-and-forget submission. Never throws, never blocks the UI. */
function submitToSheet(form: FormState, result: PotentialResult): void {
  const payload = {
    name: form.name.trim(),
    gender: form.gender === "male" ? "משקיע" : form.gender === "female" ? "משקיעה" : "",
    maritalStatus:
      form.maritalStatus === "married"
        ? "נשוי/אה"
        : form.maritalStatus === "single_or_divorced"
          ? "רווק/ה או גרוש/ה"
          : "",
    currentAge: Number(form.currentAge) || "",
    yearsAhead: Number(form.yearsAhead) || "",
    monthlyIncome: Number(form.monthlyIncome) || "",
    monthlyExpenses: Number(form.monthlyExpenses) || "",
    hasPrimaryResidence: form.hasPrimaryResidence,
    primary: form.hasPrimaryResidence
      ? {
          value: Number(form.primary.value) || "",
          mortgageBalance: Number(form.primary.mortgageBalance) || "",
          monthlyPayment: Number(form.primary.monthlyPayment) || "",
          mortgageEnd: formatEndDate(form.primary),
        }
      : null,
    hasInvestmentProperty: form.hasInvestmentProperty,
    investment: form.hasInvestmentProperty
      ? {
          value: Number(form.investment.value) || "",
          mortgageBalance: Number(form.investment.mortgageBalance) || "",
          monthlyPayment: Number(form.investment.monthlyPayment) || "",
          mortgageEnd: formatEndDate(form.investment),
        }
      : null,
    otherInvestments: Number(form.otherInvestments) || "",
    additionalLoans: formatLoans(form.additionalLoans),
    resultNetWorth: Math.round(result.netWorth),
    resultPassiveIncome: Math.round(result.passiveIncomeMonthly),
    // When the hypothetical purchase simulation ran, include the range so
    // the spreadsheet captures the full low/high picture.
    resultNetWorthMin: result.scenarioRange
      ? Math.round(result.scenarioRange.netWorthMin)
      : "",
    resultNetWorthMax: result.scenarioRange
      ? Math.round(result.scenarioRange.netWorthMax)
      : "",
    resultPassiveIncomeMin: result.scenarioRange
      ? Math.round(result.scenarioRange.passiveIncomeMinMonthly)
      : "",
    resultPassiveIncomeMax: result.scenarioRange
      ? Math.round(result.scenarioRange.passiveIncomeMaxMonthly)
      : "",
  };

  // Don't await - we don't care about the response. Silent on errors.
  // We POST directly to the Google Apps Script webhook from the client.
  // Apps Script requires text/plain to avoid the CORS preflight, which it
  // doesn't support. The receiving script parses JSON from e.postData.contents.
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;
  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* silent */
  });
}

function parseInputs(form: FormState): PotentialInputs {
  return {
    currentAge: Number(form.currentAge) || 0,
    yearsAhead: Number(form.yearsAhead) || 10,
    monthlyIncome: Number(form.monthlyIncome) || 0,
    monthlyExpenses: Number(form.monthlyExpenses) || 0,
    primaryResidence: form.hasPrimaryResidence ? parseProperty(form.primary) : null,
    investmentProperty: form.hasInvestmentProperty
      ? parseProperty(form.investment)
      : null,
    otherInvestments: Number(form.otherInvestments) || 0,
    additionalLoans: form.additionalLoans
      .filter((l) => Number(l.amount) > 0)
      .map<LoanInput>((l) => ({
        amount: Number(l.amount),
        monthlyPayment: Number(l.monthlyPayment) || 0,
        endYear: Number(l.endYear) || new Date().getFullYear(),
        endMonth: Number(l.endMonth) || 1,
      })),
  };
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PotentialPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<PotentialResult | null>(null);

  function goNext() {
    const order: Step[] = ["welcome", "intro", "income", "assets", "result"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) {
      const next = order[idx + 1];
      if (next === "result") {
        const calculated = calculatePotential(parseInputs(form));
        setResult(calculated);
        // Fire-and-forget submission to Google Sheets via our API route.
        // Failures are silent - they never affect the user experience.
        submitToSheet(form, calculated);
      }
      setStep(next);
    }
  }

  function goBack() {
    const order: Step[] = ["welcome", "intro", "income", "assets", "result"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setStep("welcome");
  }

  const progressStep = ["intro", "income", "assets", "result"].indexOf(step) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F8FA] via-white to-[#F7F8FA] py-12 relative overflow-hidden">
      {/* Decorative background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-[400px] h-[400px] bg-[#5AC8C8]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1A365D]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Progress bar */}
        {step !== "welcome" && (
          <ProgressBar current={progressStep} total={4} />
        )}

        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(26,54,93,0.15)] p-8 md:p-12 border border-gray-100 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={stepTransition}
            >
              {step === "welcome" && <WelcomeStep onNext={goNext} />}
              {step === "intro" && (
                <IntroStep
                  form={form}
                  setForm={setForm}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === "income" && (
                <IncomeStep
                  form={form}
                  setForm={setForm}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === "assets" && (
                <AssetsStep
                  form={form}
                  setForm={setForm}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === "result" && result && (
                <ResultStep form={form} result={result} onReset={reset} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = (current / total) * 100;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#1A365D] tracking-wide">
          שלב {current} מתוך {total}
        </span>
        <span className="text-xs font-semibold text-[#5AC8C8]">
          {Math.round(percent)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-l from-[#5AC8C8] to-[#1A365D] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CountUp - animated number from 0 to target value
// ---------------------------------------------------------------------------

function CountUp({
  to,
  duration = 1800,
  format,
  delay = 0,
}: {
  to: number;
  duration?: number;
  format: (n: number) => string;
  delay?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let startTime = 0;
    const delayTimer = setTimeout(() => {
      const tick = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(to * eased);
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration, delay]);

  return <>{format(value)}</>;
}

// ---------------------------------------------------------------------------
// Shared UI bits
// ---------------------------------------------------------------------------

function StepHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8">
      <div className="text-xs font-bold text-[#5AC8C8] tracking-widest mb-2 uppercase">
        {eyebrow}
      </div>
      <h2 className="text-2xl md:text-[1.8rem] font-bold text-[#1A365D] mb-2 leading-tight">
        {title}
      </h2>
      <p className="text-gray-500 text-base">{subtitle}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-[#1A365D] mb-2.5">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "number",
  min,
  max,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#5AC8C8] focus:bg-white text-lg transition-all placeholder:text-gray-400"
    />
  );
}

/**
 * Numeric input that displays with thousand separators (e.g. "2,500,000")
 * while storing raw digits in state. Strips non-digits on every keystroke.
 */
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
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        onChange(digits);
      }}
      placeholder={placeholder}
      className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#5AC8C8] focus:bg-white text-lg transition-all placeholder:text-gray-400"
    />
  );
}

function PrimaryButton({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="w-full bg-gradient-to-l from-[#1A365D] to-[#2a4a7a] hover:shadow-xl hover:shadow-[#1A365D]/20 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg shadow-[#1A365D]/10"
    >
      {children}
    </motion.button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-gray-500 hover:text-[#1A365D] font-medium text-sm transition-colors"
    >
      ← חזרה
    </button>
  );
}

// ---------------------------------------------------------------------------
// Step 1 - Welcome
// ---------------------------------------------------------------------------

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-6">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-l from-[#5AC8C8]/10 to-[#1A365D]/5 border border-[#5AC8C8]/20 mb-6"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#5AC8C8] animate-pulse" />
        <span className="text-xs font-semibold text-[#1A365D] tracking-wider">
          המספר שלי
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-[2.4rem] font-bold text-[#1A365D] leading-[1.2] mb-5"
      >
        תוך 5 דקות תגלו מה{" "}
        <span className="relative inline-block">
          <span className="relative z-10">באמת אפשר</span>
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-1 h-3 bg-[#5AC8C8]/30 -z-0"
          />
        </span>{" "}
        להשיג
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg mx-auto"
      >
        כמה שאלות פשוטות, ונראה לכם את הפוטנציאל הכלכלי שלכם -
        שווי נקי והכנסה חודשית שלא תלויה בעבודה, בעוד כמה שנים.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <PrimaryButton onClick={onNext}>בואו נתחיל</PrimaryButton>
      </motion.div>

      {/* Privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-gray-400 text-xs leading-relaxed mt-6 max-w-md mx-auto"
      >
        המידע נשמר בדיסקרטיות מלאה ומשמש את אלכס לצרכי ליווי אישי בלבד.
        לא מועבר לאף גורם נוסף.
      </motion.p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 - Intro: name, gender, marital status, age, horizon
// ---------------------------------------------------------------------------

function IntroStep({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue =
    form.name.trim().length > 0 &&
    form.gender !== null &&
    form.maritalStatus !== null &&
    Number(form.currentAge) > 0 &&
    Number(form.yearsAhead) > 0;

  return (
    <div>
      <StepHeader
        eyebrow="בואו נכיר"
        title="כמה פרטים עליך"
        subtitle="כדי שנוכל להתאים את החוויה אליך אישית"
      />

      <div className="space-y-6">
        {/* Name */}
        <div>
          <Label>איך קוראים לך?</Label>
          <TextInput
            type="text"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="השם שלך"
          />
        </div>

        {/* Gender */}
        <div>
          <Label>אתם</Label>
          <div className="grid grid-cols-2 gap-3">
            <ChoicePill
              selected={form.gender === "male"}
              onClick={() => setForm({ ...form, gender: "male" })}
            >
              משקיע
            </ChoicePill>
            <ChoicePill
              selected={form.gender === "female"}
              onClick={() => setForm({ ...form, gender: "female" })}
            >
              משקיעה
            </ChoicePill>
          </div>
        </div>

        {/* Marital status */}
        <div>
          <Label>מצב משפחתי</Label>
          <div className="grid grid-cols-2 gap-3">
            <ChoicePill
              selected={form.maritalStatus === "single_or_divorced"}
              onClick={() =>
                setForm({ ...form, maritalStatus: "single_or_divorced" })
              }
            >
              רווק/ה או גרוש/ה
            </ChoicePill>
            <ChoicePill
              selected={form.maritalStatus === "married"}
              onClick={() => setForm({ ...form, maritalStatus: "married" })}
            >
              נשוי/אה
            </ChoicePill>
          </div>
        </div>

        {/* Age */}
        <div>
          <Label>הגיל שלך</Label>
          <TextInput
            value={form.currentAge}
            onChange={(v) => setForm({ ...form, currentAge: v })}
            placeholder="40"
            min={18}
            max={100}
          />
        </div>

        {/* Years ahead */}
        <div>
          <Label>כמה שנים קדימה נסתכל?</Label>
          <TextInput
            value={form.yearsAhead}
            onChange={(v) => setForm({ ...form, yearsAhead: v })}
            placeholder="10"
            min={1}
            max={50}
          />
          <p className="text-xs text-gray-500 mt-2">ברירת מחדל: 10 שנים</p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <PrimaryButton onClick={onNext} disabled={!canContinue}>
          המשך
        </PrimaryButton>
        <div className="text-center">
          <BackButton onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

function ChoicePill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`py-3.5 px-4 rounded-xl border-2 font-semibold transition-all ${
        selected
          ? "border-[#1A365D] bg-[#1A365D] text-white shadow-lg shadow-[#1A365D]/20"
          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-[#5AC8C8] hover:bg-white"
      }`}
    >
      {children}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Step 3 - Income & expenses
// ---------------------------------------------------------------------------

function IncomeStep({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue =
    Number(form.monthlyIncome) > 0 && Number(form.monthlyExpenses) >= 0;

  return (
    <div>
      <StepHeader
        eyebrow="תזרים חודשי"
        title="מה נכנס ומה יוצא"
        subtitle="לא צריך להיות מדויק - אומדן טוב מספיק"
      />

      <div className="space-y-6">
        <div>
          <Label>הכנסה חודשית נטו (₪)</Label>
          <MoneyInput
            value={form.monthlyIncome}
            onChange={(v) => setForm({ ...form, monthlyIncome: v })}
            placeholder="25,000"
          />
        </div>

        <div>
          <Label>הוצאות חודשיות ממוצעות (₪)</Label>
          <MoneyInput
            value={form.monthlyExpenses}
            onChange={(v) => setForm({ ...form, monthlyExpenses: v })}
            placeholder="18,000"
          />
          <p className="text-xs text-gray-500 mt-2">
            כולל הכל - משכנתא, מזון, חופשות, וכו&apos;
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <PrimaryButton onClick={onNext} disabled={!canContinue}>
          המשך
        </PrimaryButton>
        <div className="text-center">
          <BackButton onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 - Assets & liabilities
// ---------------------------------------------------------------------------

function AssetsStep({
  form,
  setForm,
  onNext,
  onBack,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function addLoan() {
    setForm({
      ...form,
      additionalLoans: [
        ...form.additionalLoans,
        { amount: "", monthlyPayment: "", endYear: "", endMonth: "" },
      ],
    });
  }

  function removeLoan(idx: number) {
    setForm({
      ...form,
      additionalLoans: form.additionalLoans.filter((_, i) => i !== idx),
    });
  }

  function updateLoan(
    idx: number,
    field: "amount" | "monthlyPayment" | "endYear" | "endMonth",
    v: string
  ) {
    setForm({
      ...form,
      additionalLoans: form.additionalLoans.map((loan, i) =>
        i === idx ? { ...loan, [field]: v } : loan
      ),
    });
  }

  return (
    <div>
      <StepHeader
        eyebrow="נכסים והתחייבויות"
        title="מה כבר יש לך"
        subtitle={`${t(form.gender, "סמן", "סמני")} רק את מה שרלוונטי - כל השאר פשוט דלג/י`}
      />

      <div className="space-y-6">
        {/* Primary residence */}
        <AssetCard
          checked={form.hasPrimaryResidence}
          onToggle={(checked) =>
            setForm({ ...form, hasPrimaryResidence: checked })
          }
          label="דירת מגורים"
          icon="🏠"
        >
          <PropertyFields
            data={form.primary}
            onChange={(primary) => setForm({ ...form, primary })}
          />
        </AssetCard>

        {/* Investment property */}
        <AssetCard
          checked={form.hasInvestmentProperty}
          onToggle={(checked) =>
            setForm({ ...form, hasInvestmentProperty: checked })
          }
          label={`נדל"ן להשקעה`}
          icon="🏢"
        >
          <PropertyFields
            data={form.investment}
            onChange={(investment) => setForm({ ...form, investment })}
          />
        </AssetCard>

        {/* Other investments */}
        <div>
          <Label>שווי נכסים נוספים (₪)</Label>
          <MoneyInput
            value={form.otherInvestments}
            onChange={(v) => setForm({ ...form, otherInvestments: v })}
            placeholder="500,000"
          />
          <p className="text-xs text-gray-500 mt-2">
            שוק ההון, השקעות אלטרנטיביות, כסף נזיל (לא כולל פנסיה)
          </p>
        </div>

        {/* Additional loans */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>הלוואות נוספות</Label>
            <button
              type="button"
              onClick={addLoan}
              className="text-[#5AC8C8] hover:text-[#4ab8b8] font-semibold text-sm"
            >
              + {t(form.gender, "הוסף", "הוסיפי")} הלוואה
            </button>
          </div>

          {form.additionalLoans.length === 0 && (
            <p className="text-sm text-gray-400">אין הלוואות נוספות</p>
          )}

          <div className="space-y-4">
            {form.additionalLoans.map((loan, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">
                    הלוואה {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLoan(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    הסר
                  </button>
                </div>
                <MoneyInput
                  value={loan.amount}
                  onChange={(v) => updateLoan(idx, "amount", v)}
                  placeholder="יתרת ההלוואה (₪)"
                />
                <MoneyInput
                  value={loan.monthlyPayment}
                  onChange={(v) => updateLoan(idx, "monthlyPayment", v)}
                  placeholder="החזר חודשי (₪)"
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput
                    value={loan.endMonth}
                    onChange={(v) => updateLoan(idx, "endMonth", v)}
                    placeholder="חודש סיום"
                    min={1}
                    max={12}
                  />
                  <TextInput
                    value={loan.endYear}
                    onChange={(v) => updateLoan(idx, "endYear", v)}
                    placeholder="שנת סיום"
                    min={new Date().getFullYear()}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <PrimaryButton onClick={onNext}>
          {t(form.gender, "חשב", "חשבי")} את הפוטנציאל שלי
        </PrimaryButton>
        <div className="text-center">
          <BackButton onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

function AssetCard({
  checked,
  onToggle,
  label,
  icon,
  children,
}: {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border-2 transition-all overflow-hidden ${
        checked
          ? "border-[#5AC8C8]/40 bg-gradient-to-bl from-[#5AC8C8]/5 to-transparent"
          : "border-gray-200 bg-gray-50/50"
      }`}
    >
      <label className="flex items-center gap-3 cursor-pointer p-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 rounded accent-[#1A365D]"
        />
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
        <span className="font-semibold text-[#1A365D] text-base">{label}</span>
      </label>

      <AnimatePresence initial={false}>
        {checked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertyFields({
  data,
  onChange,
}: {
  data: FormState["primary"];
  onChange: (d: FormState["primary"]) => void;
}) {
  return (
    <div className="space-y-4 border-t border-[#5AC8C8]/20 pt-5">
      <div>
        <Label>שווי הנכס (₪)</Label>
        <MoneyInput
          value={data.value}
          onChange={(v) => onChange({ ...data, value: v })}
          placeholder="2,500,000"
        />
      </div>
      <div>
        <Label>יתרת משכנתא (₪)</Label>
        <MoneyInput
          value={data.mortgageBalance}
          onChange={(v) => onChange({ ...data, mortgageBalance: v })}
          placeholder="1,200,000"
        />
      </div>
      <div>
        <Label>החזר חודשי (₪)</Label>
        <MoneyInput
          value={data.monthlyPayment}
          onChange={(v) => onChange({ ...data, monthlyPayment: v })}
          placeholder="6,500"
        />
      </div>
      <div>
        <Label>תאריך סיום משכנתא</Label>
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            value={data.endMonth}
            onChange={(v) => onChange({ ...data, endMonth: v })}
            placeholder="חודש (1-12)"
            min={1}
            max={12}
          />
          <TextInput
            value={data.endYear}
            onChange={(v) => onChange({ ...data, endYear: v })}
            placeholder="שנה (למשל 2040)"
            min={new Date().getFullYear()}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Personalized tips - rendered on the result screen
// ---------------------------------------------------------------------------

interface Tip {
  icon: string;
  title: string;
  body: string;
}

/**
 * Build a personalized list of tips based on the user's situation.
 * Rules (per product spec):
 *  - No property → always tip 1 ("cornerstone real estate"), plus one of:
 *      liquid > 700k → tip 2 (extra capital → stocks/global RE)
 *      400k ≤ liquid ≤ 700k → tip 4 (passive stock investing - gap fill)
 *      300k ≤ liquid < 400k → tip 3 (first-hand market purchase)
 *      liquid < 300k → tip 4 (passive stock investing)
 *  - Has property →
 *      liquid > 500k → tip 5 (efficient stock / global RE allocation)
 *      liquid ≤ 500k → tip 4 (passive stock investing)
 *
 * Tips 4 and 5 are deliberately mutually exclusive for property owners
 * to avoid duplicate "invest in stocks" messaging.
 */
function computeTips(form: FormState): Tip[] {
  const liquid = Number(form.otherInvestments) || 0;
  const hasProperty = form.hasPrimaryResidence || form.hasInvestmentProperty;
  const gender = form.gender;

  // Reusable gendered snippets
  const youWill = t(gender, "תשיג", "תשיגי");
  const yourGoals = t(gender, "מטרותיך", "מטרותייך");
  const yourPrefs = t(gender, "העדפותיך", "העדפותייך");
  const asInvestor = t(gender, "כמשקיע", "כמשקיעה");
  const yourGoalsRisk = t(
    gender,
    "מטרותיך וסיבולת הסיכון האישית שלך",
    "מטרותייך וסיבולת הסיכון האישית שלך"
  );
  const forYou = t(gender, "עבורך", "עבורך");

  const TIP_1: Tip = {
    icon: "🏠",
    title: "אבן הפינה - דירה בארץ",
    body: `ראוי שאבן הפינה של המבנה הכלכלי שלך תהיה רכישה של דירה יחידה בארץ, בין אם למגורים ובין אם להשקעה. בכך ${youWill} שתי מטרות חשובות. האחת היא גידור, לפחות חלקי, מפני עליות עתידיות במחירי הדיור והשכירות - ההוצאה על המגורים מהווה חלק נכבד בהוצאה של כל תא משפחתי בארץ. השנייה היא שבעבודה נכונה ברכישה של דירה טובה ומקדמת להשקעה ניתן להשיג תשואה מצרפית שתתחרה בכבוד על כל אלטרנטיבת השקעה אחרת, בוודאי ברמת סיכון דומה.`,
  };

  const TIP_2: Tip = {
    icon: "🌍",
    title: "הון נוסף - שוק ההון ונדל״ן גלובלי",
    body: `הכסף הנוסף יכול להיות מושקע בשוק ההון ו/או בנדל״ן מעבר לים, כתלות ב${yourGoals} האישיות וב${yourPrefs} ${asInvestor}.`,
  };

  const TIP_3: Tip = {
    icon: "🔑",
    title: "דירה בשוק היד הראשונה",
    body: `ניתן לשקול רכישה של דירה בשוק היד הראשונה, תוך תכנון מדוקדק של העסקה על מנת להשלים אותה בבטחה.`,
  };

  const TIP_4: Tip = {
    icon: "📈",
    title: "השקעה פאסיבית בשוק ההון",
    body: `מומלץ ללמוד את עקרונות ההשקעה הפאסיבית בשוק ההון ולהשקיע בהתאם ל${yourGoalsRisk}.`,
  };

  const TIP_5: Tip = {
    icon: "💼",
    title: "אלוקציה יעילה של ההון",
    body: `ניתן להפנות את ההון להשקעה יעילה בשוק ההון ו/או בהשקעה בנדל״ן גלובאלי. האלוקציה המדויקת ${forYou} צריכה להיקבע בהתאם ל${yourGoals} האישיות והעדפות ההשקעה שלך, כמובן לאחר הבנה של כל אפיק השקעה ומאפייניו.`,
  };

  const tips: Tip[] = [];

  if (!hasProperty) {
    tips.push(TIP_1);
    if (liquid > 700_000) {
      tips.push(TIP_2);
    } else if (liquid >= 400_000) {
      tips.push(TIP_4);
    } else if (liquid >= 300_000) {
      tips.push(TIP_3);
    } else {
      tips.push(TIP_4);
    }
  } else {
    if (liquid > 500_000) {
      tips.push(TIP_5);
    } else {
      tips.push(TIP_4);
    }
  }

  return tips;
}

// ---------------------------------------------------------------------------
// Step 5 - Result
// ---------------------------------------------------------------------------

function ResultStep({
  form,
  result,
  onReset,
}: {
  form: FormState;
  result: PotentialResult;
  onReset: () => void;
}) {
  const range = result.scenarioRange;
  const hasRange = range !== null;
  const firstName = form.name.trim();

  // ---- Growth chart geometry ----
  // A compact right-to-left SVG sparkline representing compound growth
  // from currentNetWorth (right) to netWorth (left), with an optional
  // min/max band in hypothetical-scenario mode.
  const CHART_W = 400;
  const CHART_H = 140;
  const PAD_L = 14;
  const PAD_R = 14;
  const PAD_T = 18;
  const PAD_B = 14;
  const innerW = CHART_W - PAD_L - PAD_R;
  const innerH = CHART_H - PAD_T - PAD_B;

  const startVal = Math.max(0, result.currentNetWorth);
  const endMaxVal = hasRange ? range.netWorthMax : result.netWorth;
  const endMinVal = hasRange ? range.netWorthMin : result.netWorth;
  const yMax = Math.max(endMaxVal, startVal, 1) * 1.08;

  // X axis flows left → right. t=0 → left (today), t=1 → right (future).
  const xAt = (t: number) => PAD_L + t * innerW;
  const yAt = (v: number) => PAD_T + innerH - (v / yMax) * innerH;

  // Exponential interpolation between start and end. Falls back to a
  // quadratic ease-in when the starting value is zero (can't compound).
  const curveVal = (start: number, end: number, years: number, t: number) => {
    if (start <= 0 || end <= 0 || years <= 0) return end * t * t;
    const rate = Math.pow(end / start, 1 / years) - 1;
    return start * Math.pow(1 + rate, years * t);
  };

  const CURVE_POINTS = 50;
  const maxPts: Array<[number, number]> = [];
  const minPts: Array<[number, number]> = [];
  for (let i = 0; i <= CURVE_POINTS; i++) {
    const t = i / CURVE_POINTS;
    maxPts.push([
      xAt(t),
      yAt(curveVal(startVal, endMaxVal, result.yearsAhead, t)),
    ]);
    minPts.push([
      xAt(t),
      yAt(curveVal(startVal, endMinVal, result.yearsAhead, t)),
    ]);
  }

  const toPath = (pts: Array<[number, number]>) =>
    pts
      .map(
        ([x, y], i) =>
          `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
      )
      .join(" ");

  const maxPath = toPath(maxPts);
  // Band between min and max curves (range mode only)
  const bandPath =
    hasRange && endMinVal !== endMaxVal
      ? `${toPath(maxPts)} ${minPts
          .slice()
          .reverse()
          .map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`)
          .join(" ")} Z`
      : null;

  // Personalized tips based on the user's situation.
  const tips = computeTips(form);
  // Tips animate in after the growth visualization; each one staggered.
  // CTA delay is pushed out so it lands after the last tip.
  const tipsBaseDelay = 2.0;
  const tipsStagger = 0.15;
  const ctaDelay = tipsBaseDelay + tips.length * tipsStagger + 0.2;

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
          {firstName ? `${firstName}, המספר שלך` : "המספר שלך"}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl md:text-[1.85rem] font-bold text-[#1A365D] leading-tight mb-2"
      >
        בפעולה נכונה, בעוד {result.yearsAhead} שנים
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-500 mb-10"
      >
        בגיל {result.futureAge} - זה מה שאפשר להגיע אליו
      </motion.p>

      {/* Net worth card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden bg-gradient-to-br from-[#1A365D] via-[#1A365D] to-[#2a4a7a] rounded-3xl p-8 md:p-10 mb-5 shadow-2xl shadow-[#1A365D]/20"
      >
        <div
          aria-hidden
          className="absolute top-0 right-0 w-40 h-40 bg-[#5AC8C8]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
        />
        <div className="relative">
          <div className="text-[#5AC8C8] text-xs font-bold tracking-widest mb-3 uppercase">
            שווי נקי
          </div>
          {hasRange ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight"
            >
              {formatMagicNetWorthRange(range.netWorthMin, range.netWorthMax)}
            </motion.div>
          ) : (
            <div className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              <CountUp
                to={result.netWorth}
                duration={2000}
                delay={700}
                format={formatMagicNetWorth}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Passive income card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden bg-gradient-to-br from-[#5AC8C8] to-[#4ab8b8] rounded-3xl p-8 md:p-10 mb-10 shadow-2xl shadow-[#5AC8C8]/25"
      >
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"
        />
        <div className="relative">
          <div className="text-white/80 text-xs font-bold tracking-widest mb-3 uppercase">
            הכנסה חודשית שלא תלויה בעבודה
          </div>
          {hasRange ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-3xl md:text-5xl font-bold text-white tracking-tight"
            >
              {formatMagicIncomeRange(
                range.passiveIncomeMinMonthly,
                range.passiveIncomeMaxMonthly
              )}
            </motion.div>
          ) : (
            <div className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              <CountUp
                to={result.passiveIncomeMonthly}
                duration={2000}
                delay={1100}
                format={formatMagicIncome}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Growth visualization - compound curve from today to future */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="bg-gray-50 rounded-2xl p-6 mb-10"
      >
        <div className="text-xs font-bold text-[#1A365D] tracking-widest mb-4 uppercase text-right">
          הצמיחה שלך
        </div>

        {/* Endpoint labels - chart flows LTR: "היום" on the left, future on the right */}
        <div dir="ltr" className="flex items-end justify-between mb-2">
          {/* Left side - today */}
          <div className="text-left" dir="rtl">
            <div className="text-[11px] font-semibold text-gray-500 mb-0.5">
              היום
            </div>
            <div className="text-sm font-semibold text-gray-600">
              {formatMagicNetWorth(result.currentNetWorth)}
            </div>
          </div>
          {/* Right side - future (the money shot) */}
          <div className="text-right" dir="rtl">
            <div className="text-[11px] font-semibold text-gray-500 mb-0.5">
              בעוד {result.yearsAhead} שנים
            </div>
            <div className="text-sm font-bold text-[#1A365D]">
              {hasRange
                ? formatMagicNetWorthRange(
                    range.netWorthMin,
                    range.netWorthMax
                  )
                : formatMagicNetWorth(result.netWorth)}
            </div>
          </div>
        </div>

        {/* Curve */}
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="w-full h-auto"
          aria-hidden
        >
          <defs>
            {/* Stroke gradient: gray (today) → teal → navy (future) */}
            <linearGradient id="potentialStroke" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#9CA3AF" />
              <stop offset="55%" stopColor="#5AC8C8" />
              <stop offset="100%" stopColor="#1A365D" />
            </linearGradient>
            {/* Band fill gradient (range mode) */}
            <linearGradient id="potentialBand" x1="0" y1="0" x2="100%" y2="0">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity={0} />
              <stop offset="100%" stopColor="#5AC8C8" stopOpacity={0.25} />
            </linearGradient>
          </defs>

          {/* Baseline */}
          <line
            x1={PAD_L}
            y1={PAD_T + innerH}
            x2={PAD_L + innerW}
            y2={PAD_T + innerH}
            stroke="#E5E7EB"
            strokeWidth={1}
          />

          {/* Min/max band - only when we have a scenario range */}
          {bandPath && (
            <motion.path
              d={bandPath}
              fill="url(#potentialBand)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            />
          )}

          {/* Primary growth curve (max scenario in range mode) */}
          <motion.path
            d={maxPath}
            fill="none"
            stroke="url(#potentialStroke)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 1.4, ease: "easeOut" }}
          />

          {/* Min curve (dashed, range mode only) */}
          {hasRange && endMinVal !== endMaxVal && (
            <motion.path
              d={toPath(minPts)}
              fill="none"
              stroke="#1A365D"
              strokeOpacity={0.4}
              strokeWidth={2}
              strokeDasharray="4 5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 1.5, ease: "easeOut" }}
            />
          )}

          {/* Start dot (right) */}
          <motion.circle
            cx={xAt(0)}
            cy={yAt(startVal)}
            r={4.5}
            fill="#9CA3AF"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.35 }}
            style={{ transformOrigin: `${xAt(0)}px ${yAt(startVal)}px` }}
          />
          {/* End dot (left) */}
          <motion.circle
            cx={xAt(1)}
            cy={yAt(endMaxVal)}
            r={6}
            fill="#1A365D"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 3.0 }}
            style={{ transformOrigin: `${xAt(1)}px ${yAt(endMaxVal)}px` }}
          />
        </svg>
      </motion.div>

      {/* Personalized tips */}
      {tips.length > 0 && (
        <div className="mb-10 text-right">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: tipsBaseDelay - 0.2 }}
            className="text-xs font-bold text-[#1A365D] tracking-widest mb-4 uppercase"
          >
            הצעדים הבאים שלך
          </motion.div>
          <div className="space-y-3">
            {tips.map((tip, idx) => (
              <motion.div
                key={`${tip.title}-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: tipsBaseDelay + idx * tipsStagger,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white border border-[#5AC8C8]/25 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    aria-hidden
                    className="text-2xl leading-none mt-0.5 shrink-0"
                  >
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#1A365D] mb-1.5">
                      {tip.title}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tip.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA block */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: ctaDelay }}
      >
        <p className="text-gray-700 text-lg mb-6 font-medium">
          רוצה להבין איך להגיע לשם?
        </p>

        <div className="space-y-3">
          <Link
            href="/contact"
            className="block w-full bg-gradient-to-l from-[#D4AF37] to-[#e6c350] text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 text-center"
          >
            {t(form.gender, "קבע", "קבעי")} שיחת היכרות
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="text-gray-400 hover:text-[#1A365D] font-medium text-sm mt-4 transition-colors"
          >
            חישוב מחדש
          </button>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: ctaDelay + 0.2 }}
        className="text-xs text-gray-400 leading-relaxed mt-10 pt-6 border-t border-gray-100 text-center"
      >
        אין לראות באמור המלצה להשקעה או תחליף לייעוץ מותאם אישית.
      </motion.p>
    </div>
  );
}
