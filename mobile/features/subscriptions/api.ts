/**
 * Supabase Postgres subscription data access (Phase 17 Step 4).
 * Authorization is enforced by RLS (auth.uid()); this module does not trust activeUserId.
 *
 * Both Edit and Cancel use targeted UPDATE by id (`.update(payload).eq('id', id)`).
 * PostgREST upsert (INSERT ... ON CONFLICT) is avoided because it triggers primary-key
 * privilege checks on RLS-restricted tables even when only updating mutable columns.
 */

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

import {
  formValuesToInsert,
  formValuesToUpdate,
  rowToSubscription,
  type SubscriptionRow,
} from './dbMappers';
import { mapSubscriptionError, SubscriptionError } from './errors';
import { subscriptionToFormValues } from './mappers';
import type { Subscription, SubscriptionFormValues } from './types';

const SUBSCRIPTION_SELECT =
  'id, user_id, name, category, price, currency, billing_cycle, renewal_date, reminder_offset, auto_renew, status, notes, color, payment_method, created_at, updated_at';

async function requireAuthenticatedSession(): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new SubscriptionError(
      'NOT_CONFIGURED',
      'Cloud sync is not configured. Add Supabase public keys to your environment.',
    );
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw mapSubscriptionError(error, {
      code: 'NOT_AUTHENTICATED',
      message: 'Please sign in to manage subscriptions.',
    });
  }
  if (data.session?.user == null) {
    throw new SubscriptionError(
      'NOT_AUTHENTICATED',
      'Please sign in to manage subscriptions.',
    );
  }
}

function throwIfRemoteError(
  error: { message?: string; code?: string; details?: string; hint?: string } | null,
  status: number | undefined,
): void {
  if (error == null) {
    return;
  }
  throw mapSubscriptionError({ ...error, status });
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  await requireAuthenticatedSession();

  const { data, error, status } = await supabase
    .from('subscriptions')
    .select(SUBSCRIPTION_SELECT)
    .order('renewal_date', { ascending: true });

  throwIfRemoteError(error, status);

  return (data as SubscriptionRow[] | null)?.map(rowToSubscription) ?? [];
}

export async function createSubscription(
  values: SubscriptionFormValues,
): Promise<Subscription> {
  await requireAuthenticatedSession();

  let payload;
  try {
    payload = formValuesToInsert(values);
  } catch (error) {
    throw mapSubscriptionError(error);
  }

  const { data, error, status } = await supabase
    .from('subscriptions')
    .insert(payload)
    .select(SUBSCRIPTION_SELECT)
    .single();

  throwIfRemoteError(error, status);
  if (data == null) {
    throw new SubscriptionError(
      'UNEXPECTED',
      'Subscription was not created. Please try again.',
    );
  }

  return rowToSubscription(data as SubscriptionRow);
}

export async function updateSubscriptionRemote(
  id: string,
  values: SubscriptionFormValues,
  existing: Subscription,
): Promise<Subscription> {
  await requireAuthenticatedSession();

  let payload;
  try {
    payload = formValuesToUpdate(values, existing);
  } catch (error) {
    throw mapSubscriptionError(error);
  }

  const { data, error, status } = await supabase
    .from('subscriptions')
    .update(payload)
    .eq('id', id)
    .select(SUBSCRIPTION_SELECT)
    .maybeSingle();

  throwIfRemoteError(error, status);
  if (data == null) {
    throw new SubscriptionError(
      'NOT_FOUND',
      'Subscription not found.',
    );
  }

  return rowToSubscription(data as SubscriptionRow);
}

/**
 * Soft-cancel: keep the row, set status = canceled.
 * Does not cancel the real-world merchant subscription — tracker only.
 *
 * Targeted UPDATE by id, not upsert. Upsert is INSERT … ON CONFLICT and can
 * fail the privilege check that a column-scoped UPDATE of an owned row does
 * not. The body stays a full formValuesToUpdate payload (no user_id).
 */
export async function cancelSubscriptionRemote(
  id: string,
  existing: Subscription,
): Promise<Subscription> {
  await requireAuthenticatedSession();

  let payload;
  try {
    const values = subscriptionToFormValues(existing);
    values.status = 'canceled';
    payload = formValuesToUpdate(values, existing);
  } catch (error) {
    throw mapSubscriptionError(error);
  }

  const { data, error, status } = await supabase
    .from('subscriptions')
    .update(payload)
    .eq('id', id)
    .select(SUBSCRIPTION_SELECT)
    .maybeSingle();

  throwIfRemoteError(error, status);
  if (data == null) {
    throw new SubscriptionError(
      'NOT_FOUND',
      'Subscription not found.',
    );
  }

  return rowToSubscription(data as SubscriptionRow);
}

export async function deleteSubscriptionRemote(id: string): Promise<void> {
  await requireAuthenticatedSession();

  const { data, error, status } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  throwIfRemoteError(error, status);
  if (data == null) {
    throw new SubscriptionError(
      'NOT_FOUND',
      'Subscription not found.',
    );
  }
}
