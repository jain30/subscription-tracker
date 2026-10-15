/**
 * View-model selectors for Home / Insights.
 * All renewal + finance math comes from the Phase 18 domain engines.
 */

import { UPCOMING_PREVIEW_LIMIT } from './constants';
import {
  calendarToday,
  computeFinancialSummary,
  formatCurrencyTotals,
  getChargeableMonthlyPrice,
  getChargeableYearlyPrice,
  isNonAutoRenewing,
  selectNeedsAttention,
  toMonthlyPrice,
  type AttentionItem,
  type CurrencyTotal,
} from './domain';
import type { Category, CurrencyCode, Subscription } from './types';
import { categoryLabel } from './utils/category';
import { formatCurrency } from './utils/formatCurrency';
import { formatDisplayDate } from './utils/formatDate';

export type HomeUpcomingItem = {
  id: string;
  name: string;
  amount: string;
  relativeDue: string;
  cycle: string;
  dueSoon: boolean;
  accentKey: Category;
  /** True when chargeable but auto-renew is off — label in UI, still upcoming. */
  nonAutoRenew: boolean;
  isTrial: boolean;
  overdue: boolean;
};

export type HomeDashboardView = {
  contextLabel: string;
  monthlyAmount: string;
  yearlyAmount: string;
  /** Per-currency monthly totals (never cross-currency summed). */
  monthlyByCurrency: CurrencyTotal[];
  yearlyByCurrency: CurrencyTotal[];
  upcomingPaymentsByCurrency: CurrencyTotal[];
  upcomingPaymentLabel: string;
  activeCount: number;
  trialCount: number;
  canceledCount: number;
  trialsEndingSoonCount: number;
  updatedLabel: string;
  upcoming: HomeUpcomingItem[];
  needsAttention: AttentionItem[];
};

function formatContextLabel(today: Date): string {
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Home dashboard view-model derived from the *current user's* subscriptions.
 * Callers must pass `useSubscriptionStore` working-set data only.
 */
export function selectHomeDashboard(
  subscriptions: Subscription[],
  options: { today?: Date } = {},
): HomeDashboardView {
  const today = options.today ?? calendarToday();
  const summary = computeFinancialSummary(subscriptions, {
    today,
    upcomingLimit: UPCOMING_PREVIEW_LIMIT,
  });

  const upcoming: HomeUpcomingItem[] = summary.upcomingRenewals.map((item) => ({
    id: item.subscription.id,
    name: item.subscription.name,
    amount: formatCurrency(
      item.subscription.price,
      item.subscription.currency,
    ),
    relativeDue: item.relativeDueLabel,
    cycle: item.subscription.billingCycle,
    dueSoon: item.dueSoon,
    accentKey: item.subscription.color,
    nonAutoRenew: isNonAutoRenewing(item.subscription),
    isTrial: item.trialEndingSoon || item.subscription.status === 'trial',
    overdue: item.overdue,
  }));

  return {
    contextLabel: formatContextLabel(today),
    monthlyAmount: formatCurrencyTotals(summary.monthlyByCurrency),
    yearlyAmount: formatCurrencyTotals(summary.yearlyByCurrency),
    monthlyByCurrency: summary.monthlyByCurrency,
    yearlyByCurrency: summary.yearlyByCurrency,
    upcomingPaymentsByCurrency: summary.upcomingPaymentsByCurrency,
    upcomingPaymentLabel: formatCurrencyTotals(
      summary.upcomingPaymentsByCurrency,
      formatCurrency(0, 'USD'),
    ),
    activeCount: summary.counts.active,
    trialCount: summary.counts.trial,
    canceledCount: summary.counts.canceled,
    trialsEndingSoonCount: summary.trialsEndingSoon.length,
    updatedLabel: 'Updated just now',
    upcoming,
    needsAttention: selectNeedsAttention(subscriptions, { today }),
  };
}

/**
 * @deprecated Prefer computeMonthlySpendByCurrency — single-number totals are
 * unsafe with mixed currencies. Kept for transitional call sites; returns the
 * first currency bucket only (or 0).
 */
export function computeMonthlySpendTotal(
  subscriptions: Subscription[],
): number {
  const summary = computeFinancialSummary(subscriptions);
  return summary.monthlyByCurrency[0]?.amount ?? 0;
}

export type InsightsCategorySlice = {
  key: string;
  label: string;
  amount: string;
  percent: number;
  tone: Category | 'brand' | 'accent';
  currency: CurrencyCode;
};

export type InsightsTrendPoint = {
  label: string;
  value: number;
};

export type InsightsTopSubscription = {
  id: string;
  name: string;
  monthlyCost: string;
  yearlyCost: string;
  renewalDate: string;
  categoryLabel: string;
  accentKey: Category;
  currency: CurrencyCode;
};

export type InsightsTimelineItem = {
  id: string;
  name: string;
  amount: string;
  bucket: 'Tomorrow' | '3 days' | 'Next week' | 'Later';
  relativeDue: string;
};

export type InsightsHighlight = {
  id: string;
  title: string;
  body: string;
};

export type InsightsStat = {
  id: string;
  label: string;
  value: string;
};

export type InsightsDashboardView = {
  monthlySpend: string;
  yearlySpend: string;
  activeCount: string;
  trendLabel: string;
  categories: InsightsCategorySlice[];
  trend: InsightsTrendPoint[];
  topSubscriptions: InsightsTopSubscription[];
  upcoming: InsightsTimelineItem[];
  highlights: InsightsHighlight[];
  stats: InsightsStat[];
};

/**
 * Insights dashboard — derived from domain engines.
 * Category / top lists are computed per currency group (no FX comparison).
 */
export function selectInsightsDashboard(
  subscriptions: Subscription[],
  options: { today?: Date } = {},
): InsightsDashboardView {
  const today = options.today ?? calendarToday();
  const summary = computeFinancialSummary(subscriptions, {
    today,
    upcomingLimit: 5,
  });

  const chargeable = subscriptions.filter(
    (item) => item.status === 'active' || item.status === 'trial',
  );

  // Build category slices within each currency separately, then flatten.
  const categories: InsightsCategorySlice[] = [];
  for (const bucket of summary.monthlyByCurrency) {
    const inCurrency = chargeable.filter((item) => item.currency === bucket.currency);
    const byCategory = new Map<Category, number>();
    for (const item of inCurrency) {
      const current = byCategory.get(item.category) ?? 0;
      byCategory.set(
        item.category,
        current + toMonthlyPrice(item.price, item.billingCycle),
      );
    }
    for (const [key, amount] of byCategory.entries()) {
      categories.push({
        key: `${bucket.currency}:${key}`,
        label:
          summary.monthlyByCurrency.length > 1
            ? `${categoryLabel(key)} (${bucket.currency})`
            : categoryLabel(key),
        amount: formatCurrency(amount, bucket.currency),
        percent:
          bucket.amount > 0 ? Math.round((amount / bucket.amount) * 100) : 0,
        tone: key,
        currency: bucket.currency,
      });
    }
  }
  categories.sort((a, b) => {
    if (a.currency !== b.currency) {
      return a.currency.localeCompare(b.currency);
    }
    return b.percent - a.percent;
  });

  // Top subscriptions: sort within each currency, then interleave by currency code.
  const topSubscriptions: InsightsTopSubscription[] = [];
  for (const bucket of summary.monthlyByCurrency) {
    const ranked = chargeable
      .filter((item) => item.currency === bucket.currency)
      .sort(
        (a, b) => getChargeableMonthlyPrice(b) - getChargeableMonthlyPrice(a),
      )
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.name,
        monthlyCost: formatCurrency(
          getChargeableMonthlyPrice(item),
          item.currency,
        ),
        yearlyCost: formatCurrency(
          getChargeableYearlyPrice(item),
          item.currency,
        ),
        renewalDate: item.renewalDate,
        categoryLabel: categoryLabel(item.category),
        accentKey: item.color,
        currency: item.currency,
      }));
    topSubscriptions.push(...ranked);
  }

  const upcoming: InsightsTimelineItem[] = summary.upcomingRenewals.map(
    (item) => ({
      id: item.subscription.id,
      name: item.subscription.name,
      amount: formatCurrency(
        item.subscription.price,
        item.subscription.currency,
      ),
      bucket: item.timelineBucket,
      relativeDue: item.relativeDueLabel,
    }),
  );

  const topCategory = categories[0];
  const highest = topSubscriptions[0];
  const nextDue = upcoming[0];

  const highlights: InsightsHighlight[] = [
    {
      id: 'h1',
      title: topCategory?.label ?? 'Spending',
      body: topCategory
        ? `You spend ${topCategory.amount}/month on ${topCategory.label}`
        : 'Add subscriptions to see spending highlights',
    },
    {
      id: 'h2',
      title: 'Highest cost',
      body: highest
        ? `${highest.name} is a top subscription in ${highest.currency}`
        : 'No subscriptions yet',
    },
    {
      id: 'h3',
      title: 'Renewing soon',
      body: nextDue
        ? `${nextDue.name} renews ${nextDue.relativeDue.toLowerCase()}`
        : 'No upcoming renewals',
    },
    {
      id: 'h4',
      title: 'Yearly outlook',
      body: `Estimated yearly: ${formatCurrencyTotals(summary.yearlyByCurrency)}`,
    },
  ];

  // Stats: never invent cross-currency averages as one money figure.
  const stats: InsightsStat[] = [
    { id: 's1', label: 'Active', value: String(summary.counts.active) },
    { id: 's2', label: 'Trials', value: String(summary.counts.trial) },
    { id: 's3', label: 'Cancelled', value: String(summary.counts.canceled) },
    {
      id: 's4',
      label: 'Monthly',
      value: formatCurrencyTotals(summary.monthlyByCurrency),
    },
    {
      id: 's5',
      label: 'Yearly',
      value: formatCurrencyTotals(summary.yearlyByCurrency),
    },
    {
      id: 's6',
      label: 'Upcoming',
      value: formatCurrencyTotals(summary.upcomingPaymentsByCurrency),
    },
  ];

  return {
    monthlySpend: formatCurrencyTotals(summary.monthlyByCurrency),
    yearlySpend: formatCurrencyTotals(summary.yearlyByCurrency),
    activeCount: String(summary.counts.chargeable),
    trendLabel:
      summary.trialsEndingSoon.length > 0
        ? `${summary.trialsEndingSoon.length} trial${summary.trialsEndingSoon.length === 1 ? '' : 's'} ending soon`
        : `${summary.upcomingRenewals.length} upcoming renewal${summary.upcomingRenewals.length === 1 ? '' : 's'}`,
    categories,
    // No fabricated billing history — empty until a future phase adds it.
    trend: [],
    topSubscriptions: topSubscriptions.slice(0, 5),
    upcoming,
    highlights,
    stats,
  };
}

/** Helper for tests / screens that need a stable display date. */
export function formatDashboardDate(today: Date = calendarToday()): string {
  return formatDisplayDate(today);
}
