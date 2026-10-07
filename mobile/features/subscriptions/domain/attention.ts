/**
 * Needs Attention — compact Home surface driven by Phase 18 engines.
 * Does not invent new thresholds; reuses renewal/lifecycle assessment.
 */

import {
  assessRenewal,
  calendarToday,
  selectUpcomingRenewals,
  type UpcomingRenewal,
} from './renewalEngine';
import { isNonAutoRenewing } from './lifecycle';
import type { Subscription } from '../types';
import { UPCOMING_PREVIEW_LIMIT } from '../constants';

export type AttentionReason =
  | 'overdue'
  | 'due_soon'
  | 'trial_ending'
  | 'manual_renew';

export type AttentionItem = {
  id: string;
  name: string;
  reason: AttentionReason;
  label: string;
  relativeDue: string;
  accentKey: Subscription['color'];
  subscription: Subscription;
};

function reasonPriority(reason: AttentionReason): number {
  switch (reason) {
    case 'overdue':
      return 0;
    case 'trial_ending':
      return 1;
    case 'due_soon':
      return 2;
    case 'manual_renew':
      return 3;
    default:
      return 9;
  }
}

function attentionLabel(
  reason: AttentionReason,
  relativeDue: string,
): string {
  if (reason === 'overdue') {
    return 'Overdue';
  }
  if (reason === 'trial_ending') {
    return `Trial ends · ${relativeDue}`;
  }
  if (reason === 'manual_renew') {
    return `Manual renew · ${relativeDue}`;
  }
  return relativeDue;
}

/**
 * Build Needs Attention items from chargeable upcoming renewals.
 * Priority: overdue → trial ending → due soon → manual renew in window.
 */
export function selectNeedsAttention(
  subscriptions: readonly Subscription[],
  options: { today?: Date; limit?: number } = {},
): AttentionItem[] {
  const today = options.today ?? calendarToday();
  const limit = options.limit ?? UPCOMING_PREVIEW_LIMIT;
  const upcoming = selectUpcomingRenewals(subscriptions, { today });

  const items: AttentionItem[] = [];

  for (const item of upcoming) {
    const reasons: AttentionReason[] = [];
    if (item.overdue) {
      reasons.push('overdue');
    }
    if (item.trialEndingSoon) {
      reasons.push('trial_ending');
    }
    if (item.dueSoon && !item.overdue) {
      reasons.push('due_soon');
    }
    if (
      isNonAutoRenewing(item.subscription) &&
      item.inUpcomingWindow &&
      !item.overdue
    ) {
      reasons.push('manual_renew');
    }

    if (reasons.length === 0) {
      continue;
    }

    // One row per subscription; highest-priority reason wins.
    reasons.sort((a, b) => reasonPriority(a) - reasonPriority(b));
    const reason = reasons[0];
    items.push({
      id: item.subscription.id,
      name: item.subscription.name,
      reason,
      label: attentionLabel(reason, item.relativeDueLabel),
      relativeDue: item.relativeDueLabel,
      accentKey: item.subscription.color,
      subscription: item.subscription,
    });
  }

  items.sort((a, b) => {
    const pr = reasonPriority(a.reason) - reasonPriority(b.reason);
    if (pr !== 0) {
      return pr;
    }
    const assessmentA = assessRenewal(a.subscription, { today });
    const assessmentB = assessRenewal(b.subscription, { today });
    return (assessmentA.daysUntil ?? 0) - (assessmentB.daysUntil ?? 0);
  });

  return items.slice(0, limit);
}

/** Test helper — classify a single upcoming renewal into attention reasons. */
export function attentionReasonsFor(
  item: UpcomingRenewal,
): AttentionReason[] {
  const reasons: AttentionReason[] = [];
  if (item.overdue) {
    reasons.push('overdue');
  }
  if (item.trialEndingSoon) {
    reasons.push('trial_ending');
  }
  if (item.dueSoon && !item.overdue) {
    reasons.push('due_soon');
  }
  if (
    isNonAutoRenewing(item.subscription) &&
    item.inUpcomingWindow &&
    !item.overdue
  ) {
    reasons.push('manual_renew');
  }
  return reasons;
}
