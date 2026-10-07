/**
 * Database row ↔ application Subscription mappers (Phase 17 Step 4).
 * Domain UI types stay Title-Case / display-oriented; Postgres uses snake_case tokens.
 */

import type { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database';

import type {
  BillingCycle,
  Category,
  CurrencyCode,
  ReminderOffset,
  Subscription,
  SubscriptionFormValues,
  SubscriptionStatus,
} from './types';
import {
  formatDisplayDate,
  parseDisplayDate,
  toDateInputValue,
} from './utils/formatDate';
import { SubscriptionError } from './errors';

export type SubscriptionRow = Tables<'subscriptions'>;
export type SubscriptionInsert = TablesInsert<'subscriptions'>;
export type SubscriptionUpdate = TablesUpdate<'subscriptions'>;

type DbBillingCycle = Database['public']['Enums']['billing_cycle'];
type DbReminderOffset = Database['public']['Enums']['reminder_offset'];
type DbCategory = Database['public']['Enums']['subscription_category'];
type DbCurrency = Database['public']['Enums']['currency_code'];
type DbStatus = Database['public']['Enums']['subscription_status'];

const BILLING_TO_DB: Record<BillingCycle, DbBillingCycle> = {
  Weekly: 'weekly',
  Monthly: 'monthly',
  Yearly: 'yearly',
};

const BILLING_FROM_DB: Record<DbBillingCycle, BillingCycle> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const REMINDER_TO_DB: Record<ReminderOffset, DbReminderOffset> = {
  Off: 'off',
  'Same day': 'same_day',
  '1 day before': 'days_before_1',
  '3 days before': 'days_before_3',
  '7 days before': 'days_before_7',
};

const REMINDER_FROM_DB: Record<DbReminderOffset, ReminderOffset> = {
  off: 'Off',
  same_day: 'Same day',
  days_before_1: '1 day before',
  days_before_3: '3 days before',
  days_before_7: '7 days before',
};

/** Convert display renewal date ("12 Aug 2026") → Postgres date ("2026-08-12"). */
export function displayRenewalToDbDate(renewalDate: string): string {
  const parsed = parseDisplayDate(renewalDate);
  if (parsed == null) {
    throw new SubscriptionError(
      'VALIDATION',
      'Enter a valid renewal date.',
    );
  }
  return toDateInputValue(parsed);
}

/** Convert Postgres date ("2026-08-12") → display renewal date. */
export function dbDateToDisplayRenewal(renewalDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(renewalDate.trim());
  if (match) {
    const year = Number.parseInt(match[1], 10);
    const month = Number.parseInt(match[2], 10) - 1;
    const day = Number.parseInt(match[3], 10);
    return formatDisplayDate(new Date(year, month, day));
  }

  const parsed = parseDisplayDate(renewalDate);
  if (parsed == null) {
    throw new SubscriptionError(
      'VALIDATION',
      'Subscription renewal date is invalid.',
    );
  }
  return formatDisplayDate(parsed);
}

/**
 * Exact money string with 2 decimal places for numeric(12,2).
 * Avoids floating-point persistence drift.
 */
export function formPriceToDbNumeric(price: string): string {
  const trimmed = price.trim();
  const value = Number.parseFloat(trimmed);
  if (!trimmed || Number.isNaN(value) || value < 0) {
    throw new SubscriptionError(
      'VALIDATION',
      'Price must be a valid amount.',
    );
  }
  return (Math.round(value * 100) / 100).toFixed(2);
}

export function dbPriceToNumber(price: number | string): number {
  if (typeof price === 'number') {
    if (Number.isNaN(price)) {
      throw new SubscriptionError('VALIDATION', 'Invalid subscription price.');
    }
    return Math.round(price * 100) / 100;
  }
  const value = Number.parseFloat(price);
  if (Number.isNaN(value)) {
    throw new SubscriptionError('VALIDATION', 'Invalid subscription price.');
  }
  return Math.round(value * 100) / 100;
}

export function rowToSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category as Category,
    price: dbPriceToNumber(row.price),
    currency: row.currency as CurrencyCode,
    billingCycle: BILLING_FROM_DB[row.billing_cycle],
    renewalDate: dbDateToDisplayRenewal(row.renewal_date),
    reminderOffset: REMINDER_FROM_DB[row.reminder_offset],
    autoRenew: row.auto_renew,
    status: row.status as SubscriptionStatus,
    notes: row.notes,
    color: row.color as Category,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Build an insert payload from form values.
 * Omits user_id so Postgres DEFAULT auth.uid() applies; RLS still checks ownership.
 */
export function formValuesToInsert(
  values: SubscriptionFormValues,
  existingPaymentMethod = '',
): SubscriptionInsert {
  const category = (values.category || values.color || 'other') as DbCategory;
  const billingCycle = values.billingCycle || 'Monthly';
  // Create UI only offers active/trial; never invent canceled on insert.
  const status: SubscriptionStatus =
    values.status === 'trial' ? 'trial' : 'active';

  return {
    name: values.name.trim() || 'Untitled',
    category,
    price: formPriceToDbNumeric(values.price),
    currency: values.currency as DbCurrency,
    billing_cycle: BILLING_TO_DB[billingCycle],
    renewal_date: displayRenewalToDbDate(values.renewalDate),
    reminder_offset: REMINDER_TO_DB[values.reminderOffset],
    auto_renew: values.autoRenew,
    status: status as DbStatus,
    notes: values.notes.trim(),
    color: (values.color || category) as DbCategory,
    payment_method: existingPaymentMethod,
  };
}

/** Build an update payload — never includes id / user_id / created_at. */
export function formValuesToUpdate(
  values: SubscriptionFormValues,
  existing: Subscription,
): SubscriptionUpdate {
  const category = (values.category || values.color || 'other') as DbCategory;
  const billingCycle = values.billingCycle || 'Monthly';
  const status: SubscriptionStatus = values.status || existing.status;

  return {
    name: values.name.trim() || 'Untitled',
    category,
    price: formPriceToDbNumeric(values.price),
    currency: values.currency as DbCurrency,
    billing_cycle: BILLING_TO_DB[billingCycle],
    renewal_date: displayRenewalToDbDate(values.renewalDate),
    reminder_offset: REMINDER_TO_DB[values.reminderOffset],
    auto_renew: values.autoRenew,
    status: status as DbStatus,
    notes: values.notes.trim(),
    color: (values.color || category) as DbCategory,
    payment_method: existing.paymentMethod,
  };
}
