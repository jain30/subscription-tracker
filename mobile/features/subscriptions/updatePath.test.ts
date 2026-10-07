import { describe, expect, it } from 'vitest';

import { formValuesToUpdate } from './dbMappers';
import { mapSubscriptionError, SubscriptionError } from './errors';
import { subscriptionToFormValues } from './mappers';
import type { Subscription, SubscriptionFormValues } from './types';

function makeExisting(
  overrides: Partial<Subscription> = {},
): Subscription {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    userId: 'user-a',
    name: 'Netflix',
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

function makeForm(
  overrides: Partial<SubscriptionFormValues> = {},
): SubscriptionFormValues {
  return {
    name: 'Netflix',
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
    ...overrides,
  };
}

describe('formValuesToUpdate (Phase 20 UPDATE transport)', () => {
  it('maps edit form values to snake_case DB columns without ownership fields', () => {
    const payload = formValuesToUpdate(
      makeForm({
        name: 'Netflix Premium',
        price: '19.99',
        billingCycle: 'Yearly',
        renewalDate: '1 Sep 2026',
        category: 'video_streaming',
        color: 'video_streaming',
        status: 'trial',
      }),
      makeExisting(),
    );

    expect(payload).toEqual({
      name: 'Netflix Premium',
      category: 'video_streaming',
      price: '19.99',
      currency: 'USD',
      billing_cycle: 'yearly',
      renewal_date: '2026-09-01',
      reminder_offset: 'days_before_1',
      auto_renew: true,
      status: 'trial',
      notes: 'Family plan',
      color: 'video_streaming',
      payment_method: 'Visa',
    });

    expect(payload).not.toHaveProperty('id');
    expect(payload).not.toHaveProperty('user_id');
    expect(payload).not.toHaveProperty('created_at');
    expect(payload).not.toHaveProperty('updated_at');
  });

  it('preserves existing status when form status is empty', () => {
    const payload = formValuesToUpdate(
      makeForm({ status: '' as SubscriptionFormValues['status'] }),
      makeExisting({ status: 'trial' }),
    );
    expect(payload.status).toBe('trial');
  });

  it('builds a full cancel upsert payload (status canceled, all required columns)', () => {
    const existing = makeExisting({ status: 'active', name: 'Spotify' });
    const values = subscriptionToFormValues(existing);
    values.status = 'canceled';
    const payload = formValuesToUpdate(values, existing);

    expect(payload.status).toBe('canceled');
    expect(payload.name).toBe('Spotify');
    expect(payload.price).toBe('15.99');
    expect(payload.billing_cycle).toBe('monthly');
    expect(payload.renewal_date).toBe('2026-08-12');
    expect(payload).not.toHaveProperty('id');
    expect(payload).not.toHaveProperty('user_id');
  });
});

describe('mapSubscriptionError (Phase 20)', () => {
  it('maps PostgREST 42501 (often HTTP 401) to PERMISSION_DENIED, not NETWORK/AUTH', () => {
    const mapped = mapSubscriptionError({
      message: 'permission denied for table subscriptions',
      code: '42501',
      hint: 'Grant the required privileges to the current role with: GRANT SELECT, UPDATE ON public.subscriptions TO authenticated;',
      status: 401,
    });
    expect(mapped).toBeInstanceOf(SubscriptionError);
    expect(mapped.code).toBe('PERMISSION_DENIED');
  });

  it('maps Failed to fetch to NETWORK', () => {
    const mapped = mapSubscriptionError({
      message: 'TypeError: Failed to fetch',
    });
    expect(mapped.code).toBe('NETWORK');
    expect(mapped.message).toContain('Unable to reach the server');
  });

  it('does not treat arbitrary messages containing "fetch" as NETWORK', () => {
    const mapped = mapSubscriptionError({
      message: 'Could not prefetch related rows',
      code: 'PGRST000',
    });
    expect(mapped.code).not.toBe('NETWORK');
  });
});
