/**
 * Central renewal / calendar calculation layer (Phase 18).
 *
 * All upcoming-due / trial-ending / reminder-eligibility logic should go through
 * this module — not be reimplemented in screens or notification code later.
 *
 * Dates are treated as local calendar dates to avoid UTC day-shift bugs.
 */

import { DUE_SOON_DAYS } from '../constants';
import type { BillingCycle, ReminderOffset, Subscription } from '../types';
import { parseDisplayDate, toDateInputValue } from '../utils/formatDate';
import { isChargeable, isTrial } from './lifecycle';

export const DEFAULT_UPCOMING_WINDOW_DAYS = 30;

export type TimelineBucket = 'Tomorrow' | '3 days' | 'Next week' | 'Later';

export type RenewalAssessment = {
  subscriptionId: string;
  /** Parsed renewal calendar date, or null if malformed. */
  renewalDate: Date | null;
  /** Calendar days from today → renewal (negative = overdue). Null if unparseable. */
  daysUntil: number | null;
  relativeDueLabel: string;
  dueSoon: boolean;
  overdue: boolean;
  inUpcomingWindow: boolean;
  trialEndingSoon: boolean;
  reminderEligible: boolean;
  timelineBucket: TimelineBucket;
  /** Chargeable (active/trial) and has a usable renewal date. */
  chargeRelevant: boolean;
};

export type UpcomingRenewal = RenewalAssessment & {
  subscription: Subscription;
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function calendarToday(now: Date = new Date()): Date {
  return startOfDay(now);
}

/**
 * Parse YYYY-MM-DD as a local calendar date (never UTC-midnight parse).
 */
export function parseIsoCalendarDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10) - 1;
  const day = Number.parseInt(match[3], 10);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 0 ||
    month > 11 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

/**
 * Parse app renewal display date ("12 Aug 2026") or ISO calendar date.
 */
export function parseRenewalCalendarDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const iso = parseIsoCalendarDate(trimmed);
  if (iso) {
    return iso;
  }
  return parseDisplayDate(trimmed);
}

export function daysBetweenCalendar(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Advance a calendar renewal by one billing cycle (local date arithmetic).
 * Exposed for future “next after overdue” logic; Phase 18 UI still uses stored renewal_date.
 */
export function addBillingCycle(date: Date, cycle: BillingCycle): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (cycle === 'Weekly') {
    next.setDate(next.getDate() + 7);
    return next;
  }
  if (cycle === 'Monthly') {
    const day = next.getDate();
    next.setMonth(next.getMonth() + 1);
    // Clamp overflow (e.g. Jan 31 → Mar 3) back to last day of target month.
    if (next.getDate() < day) {
      next.setDate(0);
    }
    return next;
  }
  // Yearly
  const day = next.getDate();
  next.setFullYear(next.getFullYear() + 1);
  if (next.getDate() < day) {
    next.setDate(0);
  }
  return next;
}

export function getRelativeDueLabel(
  renewalDate: string,
  today: Date = calendarToday(),
): string {
  const renewal = parseRenewalCalendarDate(renewalDate);
  if (renewal == null) {
    return 'Upcoming';
  }

  const days = daysBetweenCalendar(today, renewal);

  if (days < 0) {
    return 'Overdue';
  }
  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'Tomorrow';
  }
  return `In ${days} days`;
}

export function isDueSoon(
  renewalDate: string,
  today: Date = calendarToday(),
  dueSoonDays: number = DUE_SOON_DAYS,
): boolean {
  const renewal = parseRenewalCalendarDate(renewalDate);
  if (renewal == null) {
    return false;
  }
  const days = daysBetweenCalendar(today, renewal);
  return days >= 0 && days <= dueSoonDays;
}

export function getTimelineBucket(
  renewalDate: string,
  today: Date = calendarToday(),
): TimelineBucket {
  const renewal = parseRenewalCalendarDate(renewalDate);
  if (renewal == null) {
    return 'Later';
  }
  const days = daysBetweenCalendar(today, renewal);
  if (days <= 1) {
    return 'Tomorrow';
  }
  if (days <= 3) {
    return '3 days';
  }
  if (days <= 14) {
    return 'Next week';
  }
  return 'Later';
}

function reminderOffsetToDays(offset: ReminderOffset): number | null {
  switch (offset) {
    case 'Off':
      return null;
    case 'Same day':
      return 0;
    case '1 day before':
      return 1;
    case '3 days before':
      return 3;
    case '7 days before':
      return 7;
    default:
      return null;
  }
}

/**
 * Whether a chargeable subscription is within its configured reminder window.
 * Does not trigger notifications — eligibility only for a future notification system.
 */
export function isReminderEligible(
  subscription: Subscription,
  today: Date = calendarToday(),
): boolean {
  if (!isChargeable(subscription)) {
    return false;
  }
  const leadDays = reminderOffsetToDays(subscription.reminderOffset);
  if (leadDays == null) {
    return false;
  }
  const renewal = parseRenewalCalendarDate(subscription.renewalDate);
  if (renewal == null) {
    return false;
  }
  const days = daysBetweenCalendar(today, renewal);
  return days >= 0 && days <= leadDays;
}

export function assessRenewal(
  subscription: Subscription,
  options: {
    today?: Date;
    upcomingWindowDays?: number;
    dueSoonDays?: number;
    trialEndingDays?: number;
  } = {},
): RenewalAssessment {
  const today = options.today ?? calendarToday();
  const upcomingWindowDays =
    options.upcomingWindowDays ?? DEFAULT_UPCOMING_WINDOW_DAYS;
  const dueSoonDays = options.dueSoonDays ?? DUE_SOON_DAYS;
  const trialEndingDays = options.trialEndingDays ?? 7;

  const renewalDate = parseRenewalCalendarDate(subscription.renewalDate);
  const daysUntil =
    renewalDate == null ? null : daysBetweenCalendar(today, renewalDate);
  const chargeRelevant = isChargeable(subscription) && renewalDate != null;
  const overdue = daysUntil != null && daysUntil < 0;
  const dueSoon =
    daysUntil != null && daysUntil >= 0 && daysUntil <= dueSoonDays;
  const inUpcomingWindow =
    chargeRelevant &&
    daysUntil != null &&
    daysUntil <= upcomingWindowDays;
  // Overdue chargeable renewals remain in the upcoming set (still charge-relevant).
  const trialEndingSoon =
    isTrial(subscription) &&
    daysUntil != null &&
    daysUntil >= 0 &&
    daysUntil <= trialEndingDays;

  return {
    subscriptionId: subscription.id,
    renewalDate,
    daysUntil,
    relativeDueLabel: getRelativeDueLabel(subscription.renewalDate, today),
    dueSoon,
    overdue,
    inUpcomingWindow: Boolean(inUpcomingWindow),
    trialEndingSoon,
    reminderEligible: isReminderEligible(subscription, today),
    timelineBucket: getTimelineBucket(subscription.renewalDate, today),
    chargeRelevant,
  };
}

/**
 * Chargeable subscriptions whose renewal is overdue or within the upcoming window.
 * Sorted soonest-first. Malformed dates are skipped (never crash totals).
 */
export function selectUpcomingRenewals(
  subscriptions: readonly Subscription[],
  options: {
    today?: Date;
    upcomingWindowDays?: number;
    dueSoonDays?: number;
    trialEndingDays?: number;
    limit?: number;
  } = {},
): UpcomingRenewal[] {
  const today = options.today ?? calendarToday();
  const assessed: UpcomingRenewal[] = [];

  for (const subscription of subscriptions) {
    const assessment = assessRenewal(subscription, { ...options, today });
    if (!assessment.chargeRelevant || !assessment.inUpcomingWindow) {
      continue;
    }
    assessed.push({ ...assessment, subscription });
  }

  assessed.sort((a, b) => {
    const da = a.daysUntil ?? Number.POSITIVE_INFINITY;
    const db = b.daysUntil ?? Number.POSITIVE_INFINITY;
    if (da !== db) {
      return da - db;
    }
    return a.subscription.name.localeCompare(b.subscription.name, undefined, {
      sensitivity: 'base',
    });
  });

  if (options.limit != null && options.limit >= 0) {
    return assessed.slice(0, options.limit);
  }
  return assessed;
}

export function selectTrialsEndingSoon(
  subscriptions: readonly Subscription[],
  options: {
    today?: Date;
    trialEndingDays?: number;
    limit?: number;
  } = {},
): UpcomingRenewal[] {
  const today = options.today ?? calendarToday();
  const trialEndingDays = options.trialEndingDays ?? 7;
  const items = selectUpcomingRenewals(subscriptions, {
    today,
    trialEndingDays,
    upcomingWindowDays: trialEndingDays,
  }).filter((item) => item.trialEndingSoon);

  if (options.limit != null && options.limit >= 0) {
    return items.slice(0, options.limit);
  }
  return items;
}

/** Stable YYYY-MM-DD for tests / debugging — local calendar. */
export function toCalendarIso(date: Date): string {
  return toDateInputValue(date);
}
