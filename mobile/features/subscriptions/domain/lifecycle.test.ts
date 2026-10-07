import { describe, expect, it } from 'vitest';

import {
  countByStatus,
  isChargeable,
  isNonAutoRenewing,
} from './lifecycle';
import type { Subscription } from '../types';

function makeSub(
  overrides: Partial<Subscription> = {},
): Subscription {
  return {
    id: '1',
    userId: 'user-a',
    name: 'Test',
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

describe('lifecycle', () => {
  it('treats active and trial as chargeable', () => {
    expect(isChargeable(makeSub({ status: 'active' }))).toBe(true);
    expect(isChargeable(makeSub({ status: 'trial' }))).toBe(true);
  });

  it('excludes canceled from chargeable', () => {
    expect(isChargeable(makeSub({ status: 'canceled' }))).toBe(false);
  });

  it('does not exclude non-auto-renewing active/trial from chargeable', () => {
    expect(
      isChargeable(makeSub({ status: 'active', autoRenew: false })),
    ).toBe(true);
    expect(
      isChargeable(makeSub({ status: 'trial', autoRenew: false })),
    ).toBe(true);
    expect(
      isNonAutoRenewing(makeSub({ status: 'active', autoRenew: false })),
    ).toBe(true);
    expect(
      isNonAutoRenewing(makeSub({ status: 'canceled', autoRenew: false })),
    ).toBe(false);
  });

  it('counts statuses', () => {
    const counts = countByStatus([
      makeSub({ id: '1', status: 'active' }),
      makeSub({ id: '2', status: 'trial' }),
      makeSub({ id: '3', status: 'canceled' }),
      makeSub({ id: '4', status: 'active' }),
    ]);
    expect(counts).toEqual({
      active: 2,
      trial: 1,
      canceled: 1,
      chargeable: 3,
      total: 4,
    });
  });
});
