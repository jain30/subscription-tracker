import type {
  BillingCycle,
  CurrencyCode,
  ListUiState,
  ReminderOffset,
  SubscriptionStatus,
} from './types';
import { CATEGORIES } from './catalog/categories';

export const LIST_UI_STATES: readonly ListUiState[] = [
  'populated',
  'loading',
  'empty',
  'offline',
  'error',
] as const;

export const BILLING_CYCLES: readonly BillingCycle[] = [
  'Weekly',
  'Monthly',
  'Yearly',
] as const;

export const CURRENCIES: readonly CurrencyCode[] = [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'CAD',
] as const;

export const REMINDER_OPTIONS: readonly ReminderOffset[] = [
  'Off',
  'Same day',
  '1 day before',
  '3 days before',
  '7 days before',
] as const;

export const STATUS_VALUES: readonly SubscriptionStatus[] = [
  'active',
  'trial',
  'canceled',
] as const;

/** Statuses selectable when creating a subscription. */
export const CREATE_STATUS_OPTIONS: readonly SubscriptionStatus[] = [
  'active',
  'trial',
] as const;

/** Statuses selectable when editing (includes canceled for reactivation). */
export const EDIT_STATUS_OPTIONS: readonly SubscriptionStatus[] = [
  'active',
  'trial',
  'canceled',
] as const;

export function statusLabel(status: SubscriptionStatus): string {
  if (status === 'active') {
    return 'Active';
  }
  if (status === 'trial') {
    return 'Trial';
  }
  return 'Canceled';
}

/**
 * Backward-compatible category options derived from the production catalog.
 * Prefer `CATEGORIES` for new code.
 */
export const CATEGORY_OPTIONS: readonly {
  key: (typeof CATEGORIES)[number]['id'];
  label: string;
}[] = CATEGORIES.map((item) => ({
  key: item.id,
  label: item.name,
}));

/**
 * @deprecated Test fixture only — never use as the runtime "today" default.
 * Production code uses `calendarToday()` from the renewal engine.
 */
export const MOCK_TODAY = '2026-08-11';

/** Inclusive calendar-day window for "due soon" highlighting. */
export const DUE_SOON_DAYS = 3;

/** Max upcoming cards on Home. */
export const UPCOMING_PREVIEW_LIMIT = 5;

/** Inclusive upcoming charge window (days) for Home / Insights. */
export const UPCOMING_WINDOW_DAYS = 30;
