import { describe, expect, it } from 'vitest';

import { selectNeedsAttention } from './attention';
import { computeFinancialSummary } from './financeEngine';
import { isChargeable } from './lifecycle';
import { selectUpcomingRenewals } from './renewalEngine';
import type { Subscription } from '../types';

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: '1',
    userId: 'user-a',
    name: 'Netflix',
    category: 'entertainment',
    price: 649,
    currency: 'INR',
    billingCycle: 'Monthly',
    renewalDate: '15 Aug 2026',
    reminderOffset: '1 day before',
    autoRenew: true,
    status: 'active',
    notes: '',
    color: 'entertainment',
    paymentMethod: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const TODAY = new Date(2026, 7, 11);

describe('Phase 19 lifecycle cancel behavior', () => {
  it('keeps canceled chargeable=false and out of upcoming/spend', () => {
    const canceled = makeSub({
      id: 'c',
      status: 'canceled',
      renewalDate: '12 Aug 2026',
      price: 999,
    });
    expect(isChargeable(canceled)).toBe(false);

    const summary = computeFinancialSummary(
      [
        makeSub({ id: 'a', status: 'active', price: 10, currency: 'USD' }),
        canceled,
      ],
      { today: TODAY },
    );

    expect(summary.upcomingRenewals.map((i) => i.subscription.id)).not.toContain(
      'c',
    );
    expect(summary.monthlyByCurrency.every((t) => t.currency !== 'INR' || t.amount === 0 || t.count === 0)).toBe(
      true,
    );
    // canceled INR 999 not in monthly totals
    expect(summary.monthlyByCurrency.find((t) => t.currency === 'INR')).toBeUndefined();
    expect(summary.counts.canceled).toBe(1);
  });

  it('trial remains chargeable and can appear in attention', () => {
    const trial = makeSub({
      id: 't',
      status: 'trial',
      renewalDate: '13 Aug 2026',
      currency: 'USD',
      price: 5,
    });
    expect(isChargeable(trial)).toBe(true);
    const attention = selectNeedsAttention([trial], { today: TODAY });
    expect(attention.some((item) => item.reason === 'trial_ending')).toBe(true);
  });

  it('overdue and due-soon appear in needs attention; canceled never does', () => {
    const items = selectNeedsAttention(
      [
        makeSub({
          id: 'late',
          status: 'active',
          renewalDate: '1 Aug 2026',
          currency: 'USD',
        }),
        makeSub({
          id: 'soon',
          status: 'active',
          renewalDate: '12 Aug 2026',
          currency: 'USD',
        }),
        makeSub({
          id: 'gone',
          status: 'canceled',
          renewalDate: '12 Aug 2026',
          currency: 'USD',
        }),
      ],
      { today: TODAY },
    );

    expect(items.map((i) => i.id)).toContain('late');
    expect(items.map((i) => i.id)).toContain('soon');
    expect(items.map((i) => i.id)).not.toContain('gone');
    expect(items.find((i) => i.id === 'late')?.reason).toBe('overdue');
  });

  it('manual renew appears in attention without excluding from upcoming', () => {
    const manual = makeSub({
      id: 'm',
      autoRenew: false,
      // Outside due-soon (3 days) but inside 30-day window
      renewalDate: '25 Aug 2026',
      currency: 'USD',
    });
    const upcoming = selectUpcomingRenewals([manual], { today: TODAY });
    expect(upcoming).toHaveLength(1);
    const attention = selectNeedsAttention([manual], { today: TODAY });
    expect(attention.some((i) => i.reason === 'manual_renew')).toBe(true);
  });

  it('never merges multi-currency totals after cancel', () => {
    const summary = computeFinancialSummary(
      [
        makeSub({
          id: 'usd',
          currency: 'USD',
          price: 20,
          status: 'active',
        }),
        makeSub({
          id: 'inr',
          currency: 'INR',
          price: 649,
          status: 'active',
        }),
        makeSub({
          id: 'old',
          currency: 'EUR',
          price: 50,
          status: 'canceled',
        }),
      ],
      { today: TODAY },
    );
    expect(summary.monthlyByCurrency.map((t) => t.currency).sort()).toEqual([
      'INR',
      'USD',
    ]);
    expect(formatHasSeparator(summary.monthlyByCurrency.length > 1)).toBe(true);
  });
});

function formatHasSeparator(multi: boolean): boolean {
  return multi;
}
