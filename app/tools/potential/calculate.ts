// ============================================================================
// Financial Potential Calculator — Core Logic
// ============================================================================
// All amounts are in today's shekels (real terms). Inflation is baked in
// by using real returns, so the result is comparable to current purchasing
// power.
// ============================================================================

export const ASSUMPTIONS = {
  /** Real annual return on investment portfolio (stocks, ETFs) — after inflation */
  STOCK_RETURN: 0.08,
  /** Real annual appreciation of real estate value */
  RE_APPRECIATION: 0.04,
  /** Annual rental yield on investment property (before expenses) */
  RENT_YIELD: 0.03,
  /** Annual inflation (documented but not directly used — everything is in real terms) */
  INFLATION: 0.025,
  /** Safe withdrawal rate — 4% rule for passive income */
  PASSIVE_INCOME_RATE: 0.04,
} as const;

/**
 * Hypothetical investment-property purchase simulation — triggered when the
 * user owns no real estate but has enough liquidity and monthly surplus.
 * Produces a range (low/high scenarios) to give them a taste of what an
 * investment property could do for them.
 */
const HYPOTHETICAL = {
  /** Minimum liquid investments required to qualify (ILS) */
  MIN_LIQUID: 400_000,
  /** Minimum monthly surplus (income - expenses) required to qualify (ILS) */
  MIN_CASHFLOW: 3_000,
  /** price = clamp((liquid - RESERVE) * MULTIPLIER, MIN, MAX) */
  PRICE_MULTIPLIER: 4,
  PRICE_RESERVE: 100_000,
  PRICE_MIN: 1_200_000,
  PRICE_MAX: 2_000_000,
  /** 25% down payment, 75% mortgage */
  DOWN_PAYMENT_PCT: 0.25,
  /** Closing costs (purchase tax, lawyer, broker, fees) */
  CLOSING_COSTS: 100_000,
  /** Mortgage term in years */
  MORTGAGE_TERM_YEARS: 30,
  /**
   * Nominal annual mortgage rate (~current Israeli market). Converted to real
   * using the inflation assumption so it stays consistent with the rest of
   * the calculator which runs entirely in real terms.
   */
  MORTGAGE_RATE_NOMINAL: 0.047,
  /** Starting rental yield on the property value */
  INITIAL_RENT_YIELD: 0.03,
  /** Rent grows at half the rate of property appreciation (0.5% per 1%) */
  RENT_GROWTH_FACTOR: 0.5,
  /** High scenario: hold longer, bullish appreciation */
  SCENARIO_HIGH: { holdYears: 9, annualAppreciation: 0.08 },
  /** Low scenario: shorter hold, modest appreciation */
  SCENARIO_LOW: { holdYears: 5, annualAppreciation: 0.05 },
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PropertyInput {
  /** Current market value */
  value: number;
  /** Current mortgage balance remaining */
  mortgageBalance: number;
  /** Monthly mortgage payment */
  monthlyPayment: number;
  /** Mortgage end — full year, e.g. 2040 */
  endYear: number;
  /** Mortgage end month (1-12) */
  endMonth: number;
}

export interface LoanInput {
  /** Current loan balance */
  amount: number;
  /** Actual monthly payment (principal + interest) */
  monthlyPayment: number;
  /** Loan end — full year */
  endYear: number;
  /** Loan end month (1-12) */
  endMonth: number;
}

export interface PotentialInputs {
  currentAge: number;
  yearsAhead: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  primaryResidence: PropertyInput | null;
  investmentProperty: PropertyInput | null;
  /** Stocks, alternative investments, cash, pension */
  otherInvestments: number;
  additionalLoans: LoanInput[];
}

export interface PotentialResult {
  /** Net worth today, in shekels — the starting point */
  currentNetWorth: number;
  /** Total net worth at the end of the projection, in today's shekels */
  netWorth: number;
  /** Monthly passive income at 4% withdrawal rate */
  passiveIncomeMonthly: number;
  yearsAhead: number;
  futureAge: number;
  breakdown: {
    liquidPortfolio: number;
    primaryResidenceEquity: number;
    investmentPropertyEquity: number;
    remainingLoans: number;
  };
  /**
   * Present only when the user has no real estate and qualifies for the
   * hypothetical purchase simulation. Low/high scenarios combined into a
   * range of net worth + passive income.
   */
  scenarioRange: {
    netWorthMin: number;
    netWorthMax: number;
    passiveIncomeMinMonthly: number;
    passiveIncomeMaxMonthly: number;
  } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Months between now and the given end year/month. Minimum 1. */
function monthsUntil(endYear: number, endMonth: number): number {
  const now = new Date();
  const months =
    (endYear - now.getFullYear()) * 12 + (endMonth - (now.getMonth() + 1));
  return Math.max(1, months);
}

/** Convert an annual rate to an equivalent monthly compounding rate */
function annualToMonthly(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/**
 * Solve for the implicit monthly interest rate given a loan's current
 * balance, monthly payment, and months remaining, via bisection on the
 * annuity PV formula: P = M * (1 - (1+r)^(-N)) / r.
 *
 * Returns 0 if the provided numbers don't fit a positive rate (e.g. the
 * sum of payments is less than the balance).
 */
function solveImplicitMonthlyRate(
  balance: number,
  monthlyPayment: number,
  monthsRemaining: number
): number {
  if (monthsRemaining <= 0 || monthlyPayment <= 0 || balance <= 0) return 0;
  // If total payments barely cover the principal, there is no positive rate
  // that fits — treat as 0% and fall back to linear amortization.
  if (monthlyPayment * monthsRemaining <= balance) return 0;

  // Bisection on monthly rate ∈ [1e-6, 0.05] (~0% to ~80% annual)
  let lo = 1e-6;
  let hi = 0.05;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    // Present value of an annuity with this rate
    const pv =
      (monthlyPayment * (1 - Math.pow(1 + mid, -monthsRemaining))) / mid;
    if (pv > balance) {
      // Rate too low: the payments "support" more principal than we have
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}

/**
 * Exact remaining balance after `months` of standard amortization.
 * Uses the closed-form:  B(k) = P*(1+r)^k - M*((1+r)^k - 1)/r
 */
function amortizedBalanceAfter(
  initialBalance: number,
  monthlyPayment: number,
  monthlyRate: number,
  months: number
): number {
  if (months <= 0) return initialBalance;
  if (monthlyRate === 0) {
    return Math.max(0, initialBalance - monthlyPayment * months);
  }
  const compound = Math.pow(1 + monthlyRate, months);
  const balance =
    initialBalance * compound -
    (monthlyPayment * (compound - 1)) / monthlyRate;
  return Math.max(0, balance);
}

// ---------------------------------------------------------------------------
// Hypothetical investment-property purchase simulation
// ---------------------------------------------------------------------------

/**
 * Simulate buying an investment property today and holding it for a fixed
 * number of years before selling, then compounding proceeds at stock return.
 * If the projection horizon is shorter than the hold period, the property
 * is held until the end of the horizon and its equity is realized in place.
 *
 * Assumes the user has no real estate of their own (caller checks). Loans
 * and other cashflow are handled the same way as in `calculatePotential`.
 */
function simulateHypothetical(
  inputs: PotentialInputs,
  holdYears: number,
  annualAppreciation: number
): { netWorth: number; passiveIncomeMonthly: number } {
  // --- Purchase sizing ---
  const rawPrice =
    (inputs.otherInvestments - HYPOTHETICAL.PRICE_RESERVE) *
    HYPOTHETICAL.PRICE_MULTIPLIER;
  const price = Math.max(
    HYPOTHETICAL.PRICE_MIN,
    Math.min(HYPOTHETICAL.PRICE_MAX, rawPrice)
  );
  const downPayment = price * HYPOTHETICAL.DOWN_PAYMENT_PCT;
  const cashOutOfPocket = downPayment + HYPOTHETICAL.CLOSING_COSTS;

  // Liquid portfolio after purchase — any surplus stays invested
  let liquidPortfolio = Math.max(0, inputs.otherInvestments - cashOutOfPocket);

  // --- Mortgage setup (75% of price, 30-year annuity) ---
  // Convert nominal rate to real to stay consistent with the rest of the
  // calculator which runs entirely in real (inflation-adjusted) terms.
  const realAnnualRate =
    (1 + HYPOTHETICAL.MORTGAGE_RATE_NOMINAL) / (1 + ASSUMPTIONS.INFLATION) - 1;
  const monthlyMortgageRate = annualToMonthly(realAnnualRate);
  const termMonths = HYPOTHETICAL.MORTGAGE_TERM_YEARS * 12;
  let mortgageBalance = price * (1 - HYPOTHETICAL.DOWN_PAYMENT_PCT);
  const mortgagePayment =
    (mortgageBalance * monthlyMortgageRate) /
    (1 - Math.pow(1 + monthlyMortgageRate, -termMonths));

  // --- Property state ---
  let propertyValue = price;
  let monthlyRent = (price * HYPOTHETICAL.INITIAL_RENT_YIELD) / 12;

  const monthlyAppreciation = annualToMonthly(annualAppreciation);
  const monthlyRentGrowth =
    monthlyAppreciation * HYPOTHETICAL.RENT_GROWTH_FACTOR;
  const monthlyStockReturn = annualToMonthly(ASSUMPTIONS.STOCK_RETURN);

  const totalMonths = inputs.yearsAhead * 12;
  const holdMonths = holdYears * 12;
  // If horizon is shorter than the planned hold period, don't sell at all.
  const sellAtMonth = totalMonths >= holdMonths ? holdMonths : -1;

  // Additional loans — same handling as main calc
  const loans = inputs.additionalLoans.map((loan) => ({
    initialBalance: loan.amount,
    monthlyPayment: loan.monthlyPayment,
    monthsLeft: monthsUntil(loan.endYear, loan.endMonth),
  }));

  let propertySold = false;

  for (let m = 1; m <= totalMonths; m++) {
    let monthlyCashflow = inputs.monthlyIncome - inputs.monthlyExpenses;

    // Additional loans outflow
    for (const loan of loans) {
      if (m <= loan.monthsLeft) monthlyCashflow -= loan.monthlyPayment;
    }

    if (!propertySold) {
      // Rent in, mortgage out
      monthlyCashflow += monthlyRent;
      monthlyCashflow -= mortgagePayment;

      // Amortize the mortgage
      const interest = mortgageBalance * monthlyMortgageRate;
      const principal = Math.max(0, mortgagePayment - interest);
      mortgageBalance = Math.max(0, mortgageBalance - principal);

      // Appreciation and rent growth (compound monthly)
      propertyValue *= 1 + monthlyAppreciation;
      monthlyRent *= 1 + monthlyRentGrowth;

      // Sell at end of hold period (no capital gains tax per spec)
      if (sellAtMonth > 0 && m === sellAtMonth) {
        const saleProceeds = Math.max(0, propertyValue - mortgageBalance);
        liquidPortfolio += saleProceeds;
        propertySold = true;
        propertyValue = 0;
        mortgageBalance = 0;
        monthlyRent = 0;
      }
    }

    // Grow liquid portfolio and add net cashflow
    liquidPortfolio *= 1 + monthlyStockReturn;
    liquidPortfolio += monthlyCashflow;
  }

  // Remaining loan balances at end of horizon
  const remainingLoans = loans.reduce((sum, loan) => {
    if (totalMonths >= loan.monthsLeft) return sum;
    const rate = solveImplicitMonthlyRate(
      loan.initialBalance,
      loan.monthlyPayment,
      loan.monthsLeft
    );
    return (
      sum +
      amortizedBalanceAfter(
        loan.initialBalance,
        loan.monthlyPayment,
        rate,
        totalMonths
      )
    );
  }, 0);

  // If still held at horizon end, realize equity in place
  const propertyEquity = propertySold
    ? 0
    : Math.max(0, propertyValue - mortgageBalance);

  const investableNetWorth =
    Math.max(0, liquidPortfolio) + propertyEquity - remainingLoans;
  const netWorth = Math.max(0, investableNetWorth);
  const passiveIncomeMonthly =
    (netWorth * ASSUMPTIONS.PASSIVE_INCOME_RATE) / 12;

  return { netWorth, passiveIncomeMonthly };
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------

export function calculatePotential(inputs: PotentialInputs): PotentialResult {
  // --- Current net worth ---
  const currentPrimaryEquity = inputs.primaryResidence
    ? Math.max(
        0,
        inputs.primaryResidence.value - inputs.primaryResidence.mortgageBalance
      )
    : 0;
  const currentInvestmentEquity = inputs.investmentProperty
    ? Math.max(
        0,
        inputs.investmentProperty.value -
          inputs.investmentProperty.mortgageBalance
      )
    : 0;
  const currentLoansTotal = inputs.additionalLoans.reduce(
    (sum, l) => sum + l.amount,
    0
  );
  const currentNetWorth =
    inputs.otherInvestments +
    currentPrimaryEquity +
    currentInvestmentEquity -
    currentLoansTotal;

  const totalMonths = inputs.yearsAhead * 12;
  const monthlyStockReturn = annualToMonthly(ASSUMPTIONS.STOCK_RETURN);
  const monthlyAppreciation = annualToMonthly(ASSUMPTIONS.RE_APPRECIATION);

  // Starting state
  let liquidPortfolio = inputs.otherInvestments;

  const hasPrimary = inputs.primaryResidence !== null;
  let primaryValue = inputs.primaryResidence?.value ?? 0;
  const primaryMonthsLeft = hasPrimary
    ? monthsUntil(inputs.primaryResidence!.endYear, inputs.primaryResidence!.endMonth)
    : 0;
  const primaryInitialBalance = inputs.primaryResidence?.mortgageBalance ?? 0;
  const primaryMonthlyPayment = inputs.primaryResidence?.monthlyPayment ?? 0;

  const hasInvestment = inputs.investmentProperty !== null;
  let investmentValue = inputs.investmentProperty?.value ?? 0;
  const investmentMonthsLeft = hasInvestment
    ? monthsUntil(
        inputs.investmentProperty!.endYear,
        inputs.investmentProperty!.endMonth
      )
    : 0;
  const investmentInitialBalance = inputs.investmentProperty?.mortgageBalance ?? 0;
  const investmentMonthlyPayment = inputs.investmentProperty?.monthlyPayment ?? 0;

  // Each loan has its own monthly payment provided by the user — we use it
  // directly for cashflow, and approximate the remaining balance at the end
  // of the projection linearly.
  const loans = inputs.additionalLoans.map((loan) => {
    const monthsLeft = monthsUntil(loan.endYear, loan.endMonth);
    return {
      initialBalance: loan.amount,
      balance: loan.amount,
      monthlyPayment: loan.monthlyPayment,
      monthsLeft,
    };
  });

  // Simulate month by month
  for (let m = 1; m <= totalMonths; m++) {
    let monthlyCashflow = inputs.monthlyIncome - inputs.monthlyExpenses;

    // Rental income (based on current investment property value)
    if (hasInvestment && investmentValue > 0) {
      monthlyCashflow += (investmentValue * ASSUMPTIONS.RENT_YIELD) / 12;
    }

    // Primary mortgage outflow
    if (hasPrimary && m <= primaryMonthsLeft) {
      monthlyCashflow -= primaryMonthlyPayment;
    }

    // Investment mortgage outflow
    if (hasInvestment && m <= investmentMonthsLeft) {
      monthlyCashflow -= investmentMonthlyPayment;
    }

    // Additional loans outflow (payments include interest — balance is
    // tracked separately via linear approximation below)
    for (const loan of loans) {
      if (m <= loan.monthsLeft) {
        monthlyCashflow -= loan.monthlyPayment;
      }
    }

    // Real estate appreciation (compound monthly)
    primaryValue *= 1 + monthlyAppreciation;
    investmentValue *= 1 + monthlyAppreciation;

    // Liquid portfolio: grow existing balance, then add net cashflow
    liquidPortfolio *= 1 + monthlyStockReturn;
    liquidPortfolio += monthlyCashflow;
  }

  // Remaining balances — exact amortization using implicit-rate recovery
  // from (balance, monthly payment, months remaining).
  const primaryRemainingBalance =
    hasPrimary && totalMonths < primaryMonthsLeft
      ? amortizedBalanceAfter(
          primaryInitialBalance,
          primaryMonthlyPayment,
          solveImplicitMonthlyRate(
            primaryInitialBalance,
            primaryMonthlyPayment,
            primaryMonthsLeft
          ),
          totalMonths
        )
      : 0;

  const investmentRemainingBalance =
    hasInvestment && totalMonths < investmentMonthsLeft
      ? amortizedBalanceAfter(
          investmentInitialBalance,
          investmentMonthlyPayment,
          solveImplicitMonthlyRate(
            investmentInitialBalance,
            investmentMonthlyPayment,
            investmentMonthsLeft
          ),
          totalMonths
        )
      : 0;

  const primaryEquity = Math.max(0, primaryValue - primaryRemainingBalance);
  const investmentEquity = Math.max(
    0,
    investmentValue - investmentRemainingBalance
  );

  const remainingLoans = loans.reduce((sum, loan) => {
    if (totalMonths >= loan.monthsLeft) return sum;
    const rate = solveImplicitMonthlyRate(
      loan.initialBalance,
      loan.monthlyPayment,
      loan.monthsLeft
    );
    return (
      sum +
      amortizedBalanceAfter(
        loan.initialBalance,
        loan.monthlyPayment,
        rate,
        totalMonths
      )
    );
  }, 0);

  const netWorth =
    Math.max(0, liquidPortfolio) +
    primaryEquity +
    investmentEquity -
    remainingLoans;

  // Passive income: 4% rule applied to investable net worth
  // (excludes primary residence — you can't live off your own home)
  const investableNetWorth =
    Math.max(0, liquidPortfolio) + investmentEquity - remainingLoans;
  const passiveIncomeMonthly =
    (Math.max(0, investableNetWorth) * ASSUMPTIONS.PASSIVE_INCOME_RATE) / 12;

  // --- Hypothetical purchase simulation ---
  // Only runs when the user owns no real estate at all and has enough
  // liquidity + monthly surplus to make a meaningful purchase. Produces a
  // low/high range to headline the result screen.
  let scenarioRange: PotentialResult["scenarioRange"] = null;
  const hasAnyProperty = hasPrimary || hasInvestment;
  const monthlySurplus = inputs.monthlyIncome - inputs.monthlyExpenses;
  if (
    !hasAnyProperty &&
    inputs.otherInvestments > HYPOTHETICAL.MIN_LIQUID &&
    monthlySurplus > HYPOTHETICAL.MIN_CASHFLOW
  ) {
    const high = simulateHypothetical(
      inputs,
      HYPOTHETICAL.SCENARIO_HIGH.holdYears,
      HYPOTHETICAL.SCENARIO_HIGH.annualAppreciation
    );
    const low = simulateHypothetical(
      inputs,
      HYPOTHETICAL.SCENARIO_LOW.holdYears,
      HYPOTHETICAL.SCENARIO_LOW.annualAppreciation
    );
    scenarioRange = {
      netWorthMin: Math.min(low.netWorth, high.netWorth),
      netWorthMax: Math.max(low.netWorth, high.netWorth),
      passiveIncomeMinMonthly: Math.min(
        low.passiveIncomeMonthly,
        high.passiveIncomeMonthly
      ),
      passiveIncomeMaxMonthly: Math.max(
        low.passiveIncomeMonthly,
        high.passiveIncomeMonthly
      ),
    };
  }

  return {
    currentNetWorth: Math.max(0, currentNetWorth),
    netWorth,
    passiveIncomeMonthly,
    yearsAhead: inputs.yearsAhead,
    futureAge: inputs.currentAge + inputs.yearsAhead,
    breakdown: {
      liquidPortfolio: Math.max(0, liquidPortfolio),
      primaryResidenceEquity: primaryEquity,
      investmentPropertyEquity: investmentEquity,
      remainingLoans,
    },
    scenarioRange,
  };
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

/** Format a shekel amount into a "magic number" string — e.g. "4.2 מיליון ₪" */
export function formatMagicNetWorth(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions.toFixed(1)} מיליון ₪`;
  }
  if (amount >= 1_000) {
    const thousands = Math.round(amount / 1_000);
    return `${thousands.toLocaleString("he-IL")} אלף ₪`;
  }
  return `${Math.round(amount).toLocaleString("he-IL")} ₪`;
}

/** Format monthly passive income — e.g. "14 אלף ₪" */
export function formatMagicIncome(amount: number): string {
  if (amount >= 1_000) {
    const thousands = Math.round(amount / 1_000);
    return `${thousands.toLocaleString("he-IL")} אלף ₪`;
  }
  return `${Math.round(amount).toLocaleString("he-IL")} ₪`;
}

/** Format a net-worth range like "3.2 – 4.8 מיליון ₪" (unit written once) */
export function formatMagicNetWorthRange(min: number, max: number): string {
  // If both fall in the "millions" bucket, drop the unit on the low side.
  if (min >= 1_000_000 && max >= 1_000_000) {
    const lo = (min / 1_000_000).toFixed(1);
    const hi = (max / 1_000_000).toFixed(1);
    return `${lo} – ${hi} מיליון ₪`;
  }
  if (min >= 1_000 && max >= 1_000 && max < 1_000_000) {
    const lo = Math.round(min / 1_000).toLocaleString("he-IL");
    const hi = Math.round(max / 1_000).toLocaleString("he-IL");
    return `${lo} – ${hi} אלף ₪`;
  }
  return `${formatMagicNetWorth(min)} – ${formatMagicNetWorth(max)}`;
}

/** Format a passive-income range like "11 – 18 אלף ₪" (unit written once) */
export function formatMagicIncomeRange(min: number, max: number): string {
  if (min >= 1_000 && max >= 1_000) {
    const lo = Math.round(min / 1_000).toLocaleString("he-IL");
    const hi = Math.round(max / 1_000).toLocaleString("he-IL");
    return `${lo} – ${hi} אלף ₪`;
  }
  return `${formatMagicIncome(min)} – ${formatMagicIncome(max)}`;
}
