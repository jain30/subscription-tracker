/**
 * Central financial calculation layer (Phase 18).
 *
 * Never sum or compare amounts across currencies — Phase 18 has no FX system.
 * All monetary aggregates are grouped by currency.
 */

import type { BillingCycle, CurrencyCode, Subscription } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import {
  countByStatus,
  filterChargeable,
  isChargeable,
} from './lifecycle';
import {
  DEFAULT_UPCOMING_WINDOW_DAYS,
  selectUpcomingRenewals,
  type UpcomingRenewal,
} from './renewalEngine';

export type CurrencyTotal = {
  currency: CurrencyCode;
  amount: number;
  formatted: string;
  count: number;
};

export type FinancialSummary = {
  /** Chargeable subscription counts by status. */
  counts: ReturnType<typeof countByStatus>;
  /** Estimated monthly spend, one entry per currency (never cross-currency). */
  monthlyByCurrency: CurrencyTotal[];
  /** Estimated yearly spend, one entry per currency. */
  yearlyByCurrency: CurrencyTotal[];
  /** Sum of raw upcoming charge amounts in the window, per currency. */
  upcomingPaymentsByCurrency: CurrencyTotal[];
  upcomingRenewals: UpcomingRenewal[];
  trialsEndingSoon: UpcomingRenewal[];
};

/**
 * Convert stored price to monthly equivalent for spend estimates.
 */
export function toMonthlyPrice(price: number, cycle: BillingCycle): number {
  if (!Number.isFinite(price) || price < 0) {
    return 0;
  }
  if (cycle === 'Weekly') {
    return (price * 52) / 12;
  }
  if (cycle === 'Yearly') {
    return price / 12;
  }
  return price;
}

export function toYearlyPrice(price: number, cycle: BillingCycle): number {
  if (!Number.isFinite(price) || price < 0) {
    return 0;
  }
  if (cycle === 'Weekly') {
    return price * 52;
  }
  if (cycle === 'Monthly') {
    return price * 12;
  }
  return price;
}

function emptyTotals(): Map<CurrencyCode, { amount: number; count: number }> {
  return new Map();
}

function addTotal(
  map: Map<CurrencyCode, { amount: number; count: number }>,
  currency: CurrencyCode,
  amount: number,
): void {
  if (!Number.isFinite(amount)) {
    return;
  }
  const current = map.get(currency) ?? { amount: 0, count: 0 };
  map.set(currency, {
    amount: current.amount + amount,
    count: current.count + 1,
  });
}

function toCurrencyTotals(
  map: Map<CurrencyCode, { amount: number; count: number }>,
): CurrencyTotal[] {
  return [...map.entries()]
    .map(([currency, value]) => ({
      currency,
      amount: roundMoney(value.amount),
      formatted: formatCurrency(roundMoney(value.amount), currency),
      count: value.count,
    }))
    .sort((a, b) => a.currency.localeCompare(b.currency));
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Estimated monthly spend for chargeable subscriptions, grouped by currency.
 */
export function computeMonthlySpendByCurrency(
  subscriptions: readonly Subscription[],
): CurrencyTotal[] {
  const map = emptyTotals();
  for (const item of filterChargeable(subscriptions)) {
    addTotal(
      map,
      item.currency,
      toMonthlyPrice(item.price, item.billingCycle),
    );
  }
  return toCurrencyTotals(map);
}

/**
 * Estimated yearly spend for chargeable subscriptions, grouped by currency.
 */
export function computeYearlySpendByCurrency(
  subscriptions: readonly Subscription[],
): CurrencyTotal[] {
  const map = emptyTotals();
  for (const item of filterChargeable(subscriptions)) {
    addTotal(
      map,
      item.currency,
      toYearlyPrice(item.price, item.billingCycle),
    );
  }
  return toCurrencyTotals(map);
}

/**
 * Sum of upcoming charge amounts (raw price at renewal), grouped by currency.
 * Does not convert billing cycles — this is "amount expected at renewal".
 */
export function computeUpcomingPaymentsByCurrency(
  upcoming: readonly UpcomingRenewal[],
): CurrencyTotal[] {
  const map = emptyTotals();
  for (const item of upcoming) {
    const price = item.subscription.price;
    if (!Number.isFinite(price) || price < 0) {
      continue;
    }
    addTotal(map, item.subscription.currency, price);
  }
  return toCurrencyTotals(map);
}

/**
 * Full financial summary derived from the user's subscription working set.
 */
export function computeFinancialSummary(
  subscriptions: readonly Subscription[],
  options: {
    today?: Date;
    upcomingWindowDays?: number;
    upcomingLimit?: number;
    trialEndingDays?: number;
  } = {},
): FinancialSummary {
  const upcomingWindowDays =
    options.upcomingWindowDays ?? DEFAULT_UPCOMING_WINDOW_DAYS;
  const upcomingRenewals = selectUpcomingRenewals(subscriptions, {
    today: options.today,
    upcomingWindowDays,
    limit: options.upcomingLimit,
    trialEndingDays: options.trialEndingDays,
  });
  const trialsEndingSoon = upcomingRenewals.filter((item) => item.trialEndingSoon);

  return {
    counts: countByStatus(subscriptions),
    monthlyByCurrency: computeMonthlySpendByCurrency(subscriptions),
    yearlyByCurrency: computeYearlySpendByCurrency(subscriptions),
    upcomingPaymentsByCurrency:
      computeUpcomingPaymentsByCurrency(upcomingRenewals),
    upcomingRenewals,
    trialsEndingSoon,
  };
}

/** Safe monthly equivalent for a single subscription (0 if invalid / not chargeable). */
export function getChargeableMonthlyPrice(subscription: Subscription): number {
  if (!isChargeable(subscription)) {
    return 0;
  }
  return toMonthlyPrice(subscription.price, subscription.billingCycle);
}

export function getChargeableYearlyPrice(subscription: Subscription): number {
  if (!isChargeable(subscription)) {
    return 0;
  }
  return toYearlyPrice(subscription.price, subscription.billingCycle);
}

/**
 * Format a list of currency totals for UI.
 * Single currency → one amount string.
 * Multiple currencies → joined with " · " (never summed).
 */
export function formatCurrencyTotals(
  totals: readonly CurrencyTotal[],
  emptyLabel = formatCurrency(0, 'USD'),
): string {
  if (totals.length === 0) {
    return emptyLabel;
  }
  return totals.map((item) => item.formatted).join(' · ');
}
