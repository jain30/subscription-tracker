/**
 * Subscription lifecycle rules (Phase 18).
 *
 * Status is the primary chargeability signal.
 * `autoRenew === false` does NOT exclude a subscription from upcoming charges.
 */

import type { Subscription, SubscriptionStatus } from '../types';

/** Statuses that remain charge-relevant for renewals and spend. */
export const CHARGEABLE_STATUSES: readonly SubscriptionStatus[] = [
  'active',
  'trial',
] as const;

/**
 * Whether a subscription should appear in upcoming charges / spend estimates.
 * Canceled subscriptions are excluded. Non-auto-renewing active/trial remain included.
 */
export function isChargeable(subscription: Subscription): boolean {
  return (
    subscription.status === 'active' || subscription.status === 'trial'
  );
}

export function isTrial(subscription: Subscription): boolean {
  return subscription.status === 'trial';
}

export function isCanceled(subscription: Subscription): boolean {
  return subscription.status === 'canceled';
}

export function isActive(subscription: Subscription): boolean {
  return subscription.status === 'active';
}

/** Chargeable subscriptions that are not set to auto-renew. */
export function isNonAutoRenewing(subscription: Subscription): boolean {
  return isChargeable(subscription) && subscription.autoRenew === false;
}

export function filterChargeable(
  subscriptions: readonly Subscription[],
): Subscription[] {
  return subscriptions.filter(isChargeable);
}

export function countByStatus(subscriptions: readonly Subscription[]): {
  active: number;
  trial: number;
  canceled: number;
  chargeable: number;
  total: number;
} {
  let active = 0;
  let trial = 0;
  let canceled = 0;

  for (const item of subscriptions) {
    if (item.status === 'active') {
      active += 1;
    } else if (item.status === 'trial') {
      trial += 1;
    } else if (item.status === 'canceled') {
      canceled += 1;
    }
  }

  return {
    active,
    trial,
    canceled,
    chargeable: active + trial,
    total: subscriptions.length,
  };
}
