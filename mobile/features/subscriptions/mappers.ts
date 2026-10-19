import type {
  Category,
  Subscription,
  SubscriptionFormValues,
} from './types';
import {
  getChargeableMonthlyPrice,
  getChargeableYearlyPrice,
  getRelativeDueLabel,
  isDueSoon,
} from './domain';
import { nowIso } from './utils/formatDate';

export function createEmptyFormValues(): SubscriptionFormValues {
  return {
    name: '',
    price: '',
    currency: 'INR',
    billingCycle: 'Monthly',
    renewalDate: '',
    category: '',
    reminderOffset: '1 day before',
    notes: '',
    color: 'other',
    autoRenew: true,
    status: 'active',
  };
}

export function subscriptionToFormValues(
  subscription: Subscription,
): SubscriptionFormValues {
  return {
    name: subscription.name,
    price: String(subscription.price),
    currency: subscription.currency,
    billingCycle: subscription.billingCycle,
    renewalDate: subscription.renewalDate,
    category: subscription.category,
    reminderOffset: subscription.reminderOffset,
    notes: subscription.notes,
    color: subscription.color,
    autoRenew: subscription.autoRenew,
    status: subscription.status,
  };
}

/**
 * @deprecated Local-only helper from pre-Supabase CRUD. Prefer dbMappers + API.
 * Kept for catalog/demo tooling — not used as cloud source of truth.
 */
export function formValuesToSubscription(
  values: SubscriptionFormValues,
  id: string,
  existing?: Subscription,
  userId?: string,
): Subscription {
  const timestamp = nowIso();
  const category = (values.category || values.color || 'other') as Category;
  const ownerId = userId ?? existing?.userId;
  if (!ownerId) {
    throw new Error('Subscription requires a userId.');
  }
  return {
    id,
    userId: ownerId,
    name: values.name.trim() || 'Untitled',
    category,
    price: Number.parseFloat(values.price) || 0,
    currency: values.currency,
    billingCycle: values.billingCycle || 'Monthly',
    renewalDate: values.renewalDate,
    reminderOffset: values.reminderOffset,
    autoRenew: values.autoRenew,
    status: values.status ?? existing?.status ?? 'active',
    notes: values.notes.trim(),
    color: values.color || category,
    paymentMethod: existing?.paymentMethod ?? '',
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

/** Display helpers used by list / home rows without storing derived fields. */
export function getSubscriptionRelativeDue(
  subscription: Subscription,
  today?: Date,
): string {
  return getRelativeDueLabel(subscription.renewalDate, today);
}

export function getSubscriptionDueSoon(
  subscription: Subscription,
  today?: Date,
): boolean {
  return isDueSoon(subscription.renewalDate, today);
}

export function getSubscriptionMonthlyPrice(
  subscription: Subscription,
): number {
  return getChargeableMonthlyPrice(subscription);
}

export function getSubscriptionYearlyPrice(
  subscription: Subscription,
): number {
  return getChargeableYearlyPrice(subscription);
}
