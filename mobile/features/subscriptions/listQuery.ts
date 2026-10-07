import type { Subscription } from './types';
import { categoryLabel } from './utils/category';
import { parseDisplayDate } from './utils/formatDate';

/** Status chips on the Subscription List toolbar. */
export type SubscriptionListFilter = 'all' | 'active' | 'trial' | 'canceled';

/** Sort keys for the Subscription List (derived only — never persisted). */
export type SubscriptionListSort =
  | 'renewal_asc'
  | 'renewal_desc'
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc';

export type SubscriptionListQuery = {
  query: string;
  filter: SubscriptionListFilter;
  sort: SubscriptionListSort;
};

export const DEFAULT_SUBSCRIPTION_LIST_SORT: SubscriptionListSort =
  'renewal_asc';

export const SUBSCRIPTION_LIST_SORT_OPTIONS: readonly {
  value: SubscriptionListSort;
  label: string;
}[] = [
  { value: 'renewal_asc', label: 'Renewal Date (Nearest First)' },
  { value: 'renewal_desc', label: 'Renewal Date (Latest First)' },
  { value: 'name_asc', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'price_asc', label: 'Price Low → High' },
  { value: 'price_desc', label: 'Price High → Low' },
] as const;

export function getSubscriptionListSortLabel(
  sort: SubscriptionListSort,
): string {
  return (
    SUBSCRIPTION_LIST_SORT_OPTIONS.find((option) => option.value === sort)
      ?.label ?? SUBSCRIPTION_LIST_SORT_OPTIONS[0].label
  );
}

function matchesSearch(subscription: Subscription, needle: string): boolean {
  if (!needle) {
    return true;
  }
  const name = subscription.name.toLowerCase();
  const category = categoryLabel(subscription.category).toLowerCase();
  return name.includes(needle) || category.includes(needle);
}

function matchesFilter(
  subscription: Subscription,
  filter: SubscriptionListFilter,
): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'active') {
    return subscription.status === 'active';
  }
  if (filter === 'trial') {
    return subscription.status === 'trial';
  }
  return subscription.status === 'canceled';
}

function renewalTimestamp(subscription: Subscription): number {
  const parsed = parseDisplayDate(subscription.renewalDate);
  if (parsed == null) {
    return Number.POSITIVE_INFINITY;
  }
  return parsed.getTime();
}

function compareSubscriptions(
  a: Subscription,
  b: Subscription,
  sort: SubscriptionListSort,
): number {
  switch (sort) {
    case 'renewal_asc':
      return renewalTimestamp(a) - renewalTimestamp(b);
    case 'renewal_desc':
      return renewalTimestamp(b) - renewalTimestamp(a);
    case 'name_asc':
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    case 'name_desc':
      return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' });
    case 'price_asc':
      return a.price - b.price;
    case 'price_desc':
      return b.price - a.price;
    default:
      return 0;
  }
}

/**
 * Derive the visible Subscription List from the current user's store slice.
 * Never mutates the underlying collection — filter + search + sort only.
 */
export function selectSubscriptionList(
  subscriptions: readonly Subscription[],
  { query, filter, sort }: SubscriptionListQuery,
): Subscription[] {
  const needle = query.trim().toLowerCase();

  const filtered = subscriptions.filter(
    (item) => matchesFilter(item, filter) && matchesSearch(item, needle),
  );

  return [...filtered].sort((a, b) => compareSubscriptions(a, b, sort));
}
