import { describe, expect, it } from 'vitest';

import {
  computeFinancialSummary,
  computeMonthlySpendByCurrency,
  formatCurrencyTotals,
  toMonthlyPrice,
  toYearlyPrice,
} from './financeEngine';
import type { Subscription } from '../types';

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: '1',
    userId: 'user-a',
    name: 'Service',
    category: 'other',
    price: 10,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: '15 Aug 2026',
    reminderOffset: '1 day before',
    autoRenew: true,
    status: 'active',
    notes: '',
    color: 'other',
    paymentMethod: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const TODAY = new Date(2026, 7, 11);

describe('price normalization', () => {
  it('converts weekly / monthly / yearly to monthly', () => {
    expect(toMonthlyPrice(10, 'Monthly')).toBe(10);
    expect(toMonthlyPrice(120, 'Yearly')).toBe(10);
    expect(toMonthlyPrice(10, 'Weekly')).toBeCloseTo((10 * 52) / 12);
  });

  it('converts to yearly', () => {
    expect(toYearlyPrice(10, 'Monthly')).toBe(120);
    expect(toYearlyPrice(100, 'Yearly')).toBe(100);
    expect(toYearlyPrice(10, 'Weekly')).toBe(520);
  });

  it('guards invalid prices', () => {
    expect(toMonthlyPrice(Number.NaN, 'Monthly')).toBe(0);
    expect(toYearlyPrice(-5, 'Monthly')).toBe(0);
  });
});

describe('finance multi-currency safety', () => {
  it('groups monthly totals by currency and never merges FX', () => {
    const totals = computeMonthlySpendByCurrency([
      makeSub({ id: '1', currency: 'USD', price: 20, billingCycle: 'Monthly' }),
      makeSub({ id: '2', currency: 'INR', price: 1000, billingCycle: 'Monthly' }),
      makeSub({
        id: '3',
        currency: 'USD',
        price: 120,
        billingCycle: 'Yearly',
      }),
    ]);

    expect(totals).toHaveLength(2);
    const usd = totals.find((t) => t.currency === 'USD');
    const inr = totals.find((t) => t.currency === 'INR');
    expect(usd?.amount).toBe(30); // 20 + 10
    expect(inr?.amount).toBe(1000);
    // Critical: never a single combined numeric total across currencies
    expect(formatCurrencyTotals(totals)).toContain('·');
    expect(formatCurrencyTotals(totals)).toMatch(/\$/);
  });

  it('excludes canceled from spend and upcoming payments', () => {
    const summary = computeFinancialSummary(
      [
        makeSub({
          id: 'live',
          status: 'active',
          price: 15,
          renewalDate: '12 Aug 2026',
        }),
        makeSub({
          id: 'dead',
          status: 'canceled',
          price: 99,
          renewalDate: '12 Aug 2026',
        }),
      ],
      { today: TODAY },
    );

    expect(summary.monthlyByCurrency).toHaveLength(1);
    expect(summary.monthlyByCurrency[0].amount).toBe(15);
    expect(summary.upcomingRenewals.map((i) => i.subscription.id)).toEqual([
      'live',
    ]);
    expect(summary.upcomingPaymentsByCurrency[0].amount).toBe(15);
  });

  it('includes trial and non-auto-renew in financial upcoming totals', () => {
    const summary = computeFinancialSummary(
      [
        makeSub({
          id: 'trial',
          status: 'trial',
          price: 5,
          renewalDate: '13 Aug 2026',
        }),
        makeSub({
          id: 'manual',
          autoRenew: false,
          price: 7,
          renewalDate: '14 Aug 2026',
        }),
      ],
      { today: TODAY },
    );
    expect(summary.upcomingRenewals).toHaveLength(2);
    expect(summary.upcomingPaymentsByCurrency[0].amount).toBe(12);
    expect(summary.counts.trial).toBe(1);
  });

  it('handles empty / malformed data safely', () => {
    const summary = computeFinancialSummary(
      [
        makeSub({ id: 'bad', renewalDate: 'nope', price: Number.NaN }),
      ],
      { today: TODAY },
    );
    expect(summary.monthlyByCurrency[0]?.amount ?? 0).toBe(0);
    expect(summary.upcomingRenewals).toHaveLength(0);
  });
});
