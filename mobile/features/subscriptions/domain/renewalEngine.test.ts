import { describe, expect, it } from 'vitest';

import {
  addBillingCycle,
  assessRenewal,
  daysBetweenCalendar,
  getRelativeDueLabel,
  isDueSoon,
  isReminderEligible,
  parseIsoCalendarDate,
  parseRenewalCalendarDate,
  selectUpcomingRenewals,
} from './renewalEngine';
import type { Subscription } from '../types';

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: '1',
    userId: 'user-a',
    name: 'Netflix',
    category: 'entertainment',
    price: 15.99,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: '20 Aug 2026',
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

const TODAY = new Date(2026, 7, 11); // 11 Aug 2026 local

describe('renewalEngine date parsing', () => {
  it('parses ISO calendar dates as local dates (no UTC shift)', () => {
    const date = parseIsoCalendarDate('2026-08-11');
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2026);
    expect(date!.getMonth()).toBe(7);
    expect(date!.getDate()).toBe(11);
  });

  it('parses display dates', () => {
    const date = parseRenewalCalendarDate('12 Aug 2026');
    expect(date).not.toBeNull();
    expect(date!.getDate()).toBe(12);
    expect(date!.getMonth()).toBe(7);
  });

  it('rejects malformed dates', () => {
    expect(parseRenewalCalendarDate('')).toBeNull();
    expect(parseRenewalCalendarDate('not-a-date')).toBeNull();
    expect(parseIsoCalendarDate('2026-13-40')).toBeNull();
  });

  it('computes calendar day differences', () => {
    expect(
      daysBetweenCalendar(new Date(2026, 7, 11), new Date(2026, 7, 14)),
    ).toBe(3);
    expect(
      daysBetweenCalendar(new Date(2026, 7, 11), new Date(2026, 7, 11)),
    ).toBe(0);
    expect(
      daysBetweenCalendar(new Date(2026, 7, 11), new Date(2026, 7, 10)),
    ).toBe(-1);
  });
});

describe('billing cycle advancement', () => {
  it('adds weekly / monthly / yearly safely', () => {
    const base = new Date(2026, 0, 15);
    expect(addBillingCycle(base, 'Weekly').getDate()).toBe(22);
    expect(addBillingCycle(base, 'Monthly').getMonth()).toBe(1);
    expect(addBillingCycle(base, 'Yearly').getFullYear()).toBe(2027);
  });

  it('clamps month overflow (Jan 31 + 1 month)', () => {
    const jan31 = new Date(2026, 0, 31);
    const next = addBillingCycle(jan31, 'Monthly');
    expect(next.getMonth()).toBe(1);
    expect(next.getDate()).toBeLessThanOrEqual(28);
  });
});

describe('relative due + due soon', () => {
  it('labels today / tomorrow / overdue / in N days', () => {
    expect(getRelativeDueLabel('11 Aug 2026', TODAY)).toBe('Today');
    expect(getRelativeDueLabel('12 Aug 2026', TODAY)).toBe('Tomorrow');
    expect(getRelativeDueLabel('10 Aug 2026', TODAY)).toBe('Overdue');
    expect(getRelativeDueLabel('18 Aug 2026', TODAY)).toBe('In 7 days');
  });

  it('marks due soon within configured window', () => {
    expect(isDueSoon('11 Aug 2026', TODAY, 3)).toBe(true);
    expect(isDueSoon('14 Aug 2026', TODAY, 3)).toBe(true);
    expect(isDueSoon('15 Aug 2026', TODAY, 3)).toBe(false);
    expect(isDueSoon('10 Aug 2026', TODAY, 3)).toBe(false);
  });
});

describe('upcoming renewals', () => {
  it('includes active and trial, excludes canceled', () => {
    const items = selectUpcomingRenewals(
      [
        makeSub({ id: 'a', status: 'active', renewalDate: '15 Aug 2026' }),
        makeSub({ id: 't', status: 'trial', renewalDate: '16 Aug 2026' }),
        makeSub({ id: 'c', status: 'canceled', renewalDate: '12 Aug 2026' }),
      ],
      { today: TODAY, upcomingWindowDays: 30 },
    );
    expect(items.map((i) => i.subscription.id)).toEqual(['a', 't']);
  });

  it('keeps non-auto-renewing chargeable subscriptions in upcoming', () => {
    const items = selectUpcomingRenewals(
      [
        makeSub({
          id: 'manual',
          autoRenew: false,
          renewalDate: '13 Aug 2026',
        }),
      ],
      { today: TODAY },
    );
    expect(items).toHaveLength(1);
    expect(items[0].subscription.autoRenew).toBe(false);
  });

  it('includes overdue chargeable renewals', () => {
    const items = selectUpcomingRenewals(
      [makeSub({ id: 'late', renewalDate: '1 Aug 2026' })],
      { today: TODAY },
    );
    expect(items).toHaveLength(1);
    expect(items[0].overdue).toBe(true);
  });

  it('filters outside the upcoming window', () => {
    const items = selectUpcomingRenewals(
      [makeSub({ id: 'far', renewalDate: '20 Sep 2026' })],
      { today: TODAY, upcomingWindowDays: 30 },
    );
    expect(items).toHaveLength(0);
  });

  it('skips malformed renewal dates without throwing', () => {
    expect(() =>
      selectUpcomingRenewals(
        [makeSub({ id: 'bad', renewalDate: '???'} )],
        { today: TODAY },
      ),
    ).not.toThrow();
    expect(
      selectUpcomingRenewals(
        [makeSub({ id: 'bad', renewalDate: '???' })],
        { today: TODAY },
      ),
    ).toHaveLength(0);
  });

  it('flags trial ending soon', () => {
    const assessment = assessRenewal(
      makeSub({ status: 'trial', renewalDate: '14 Aug 2026' }),
      { today: TODAY, trialEndingDays: 7 },
    );
    expect(assessment.trialEndingSoon).toBe(true);
  });

  it('evaluates reminder eligibility from reminder offset', () => {
    const sub = makeSub({
      reminderOffset: '3 days before',
      renewalDate: '13 Aug 2026',
    });
    expect(isReminderEligible(sub, TODAY)).toBe(true);
    expect(
      isReminderEligible(
        makeSub({ reminderOffset: 'Off', renewalDate: '13 Aug 2026' }),
        TODAY,
      ),
    ).toBe(false);
  });
});
