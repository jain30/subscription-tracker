import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cancelSubscriptionRemote, invalidateSubscriptionSessionCache, updateSubscriptionRemote } from './api';
import type { Subscription } from './types';

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const select = vi.fn(() => ({ maybeSingle }));
  const eq = vi.fn(() => ({ select }));
  const update = vi.fn(() => ({ eq }));
  const upsert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ update, upsert }));
  const getSession = vi.fn();
  return { maybeSingle, select, eq, update, upsert, from, getSession };
});

vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: { getSession: mocks.getSession },
    from: mocks.from,
  },
}));

function callArgs(mockFn: { mock: { calls: unknown } }): unknown[] {
  const calls = mockFn.mock.calls as unknown[];
  const args = calls[0];
  if (!Array.isArray(args) || args.length === 0) {
    throw new Error('expected mock call arguments');
  }
  return args;
}

function objectArg(mockFn: { mock: { calls: unknown } }): Record<string, unknown> {
  const arg = callArgs(mockFn)[0];
  if (arg == null || typeof arg !== 'object') {
    throw new Error('expected an object argument');
  }
  return arg as Record<string, unknown>;
}

const EXISTING_ID = '11111111-1111-1111-1111-111111111111';

function makeExisting(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: EXISTING_ID,
    userId: 'user-a',
    name: 'Spotify',
    category: 'entertainment',
    price: 15.99,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: '12 Aug 2026',
    reminderOffset: '1 day before',
    autoRenew: true,
    status: 'active',
    notes: 'Family plan',
    color: 'entertainment',
    paymentMethod: 'Visa',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function canceledRow() {
  return {
    id: EXISTING_ID,
    user_id: 'user-a',
    name: 'Spotify',
    category: 'entertainment',
    price: '15.99',
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: '2026-08-12',
    reminder_offset: 'days_before_1',
    auto_renew: true,
    status: 'canceled',
    notes: 'Family plan',
    color: 'entertainment',
    payment_method: 'Visa',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-08-12T00:00:00.000Z',
  };
}

describe('cancelSubscriptionRemote write path', () => {
  beforeEach(() => {
    invalidateSubscriptionSessionCache();
    mocks.getSession.mockReset();
    mocks.from.mockClear();
    mocks.update.mockClear();
    mocks.upsert.mockClear();
    mocks.eq.mockClear();
    mocks.select.mockClear();
    mocks.maybeSingle.mockReset();
    mocks.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-a' } } },
      error: null,
    });
  });

  it('updates the existing row by id with status canceled and no user_id', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: canceledRow(),
      error: null,
      status: 200,
    });

    const updated = await cancelSubscriptionRemote(EXISTING_ID, makeExisting());

    expect(mocks.from).toHaveBeenCalledWith('subscriptions');
    expect(mocks.update).toHaveBeenCalledTimes(1);
    expect(mocks.upsert).not.toHaveBeenCalled();
    const payload = objectArg(mocks.update);
    expect(payload.status).toBe('canceled');
    expect(payload.name).toBe('Spotify');
    expect(payload).not.toHaveProperty('id');
    expect(payload).not.toHaveProperty('user_id');
    expect(mocks.eq).toHaveBeenCalledWith('id', EXISTING_ID);
    expect(updated.status).toBe('canceled');
    expect(updated.id).toBe(EXISTING_ID);
  });

  it('keeps not-found behavior when the update returns no row', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: null,
      error: null,
      status: 200,
    });

    await expect(
      cancelSubscriptionRemote(EXISTING_ID, makeExisting()),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Subscription not found.',
    });
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
});

describe('updateSubscriptionRemote write path', () => {
  beforeEach(() => {
    invalidateSubscriptionSessionCache();
    mocks.getSession.mockReset();
    mocks.from.mockClear();
    mocks.update.mockClear();
    mocks.upsert.mockClear();
    mocks.eq.mockClear();
    mocks.select.mockClear();
    mocks.maybeSingle.mockReset();
    mocks.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user-a' } } },
      error: null,
    });
  });

  it('updates by id and does not use upsert', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { ...canceledRow(), status: 'active' },
      error: null,
      status: 200,
    });

    await updateSubscriptionRemote(
      EXISTING_ID,
      {
        name: 'Spotify',
        price: '15.99',
        currency: 'USD',
        billingCycle: 'Monthly',
        renewalDate: '12 Aug 2026',
        category: 'entertainment',
        reminderOffset: '1 day before',
        notes: 'Family plan',
        color: 'entertainment',
        autoRenew: true,
        status: 'active',
      },
      makeExisting(),
    );

    expect(mocks.update).toHaveBeenCalledTimes(1);
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.eq).toHaveBeenCalledWith('id', EXISTING_ID);
    const payload = objectArg(mocks.update);
    expect(payload.name).toBe('Spotify');
    expect(payload.status).toBe('active');
    expect(payload).not.toHaveProperty('id');
    expect(payload).not.toHaveProperty('user_id');
  });
});
