import type { BillingCycle, Category, CurrencyCode } from '../types';

/**
 * Known subscription catalog — powers name suggestions + auto-fill.
 */
export type CatalogSubscription = {
  name: string;
  categoryId: Category;
  /** Optional default price for faster create. */
  defaultPrice?: number;
  defaultCurrency?: CurrencyCode;
  defaultBillingCycle?: BillingCycle;
};

export const SUBSCRIPTION_CATALOG: readonly CatalogSubscription[] = [
  {
    name: 'Netflix',
    categoryId: 'entertainment',
    defaultPrice: 15.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Prime Video',
    categoryId: 'video_streaming',
    defaultPrice: 8.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Disney+',
    categoryId: 'video_streaming',
    defaultPrice: 10.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Spotify',
    categoryId: 'music',
    defaultPrice: 10.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'YouTube Premium',
    categoryId: 'entertainment',
    defaultPrice: 13.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Apple Music',
    categoryId: 'music',
    defaultPrice: 10.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'JioHotstar',
    categoryId: 'video_streaming',
    defaultPrice: 299,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Sony LIV',
    categoryId: 'video_streaming',
    defaultPrice: 299,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Zee5',
    categoryId: 'video_streaming',
    defaultPrice: 99,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Crunchyroll',
    categoryId: 'entertainment',
    defaultPrice: 9.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Udemy',
    categoryId: 'education',
    defaultPrice: 16.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Coursera',
    categoryId: 'education',
    defaultPrice: 49,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Skillshare',
    categoryId: 'education',
    defaultPrice: 13.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'LinkedIn Learning',
    categoryId: 'education',
    defaultPrice: 39.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Google One',
    categoryId: 'cloud_storage',
    defaultPrice: 1.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Dropbox',
    categoryId: 'cloud_storage',
    defaultPrice: 11.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'OneDrive',
    categoryId: 'cloud_storage',
    defaultPrice: 6.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'iCloud+',
    categoryId: 'cloud_storage',
    defaultPrice: 2.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Canva',
    categoryId: 'productivity',
    defaultPrice: 14.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'ChatGPT Plus',
    categoryId: 'ai_tools',
    defaultPrice: 20,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Claude Pro',
    categoryId: 'ai_tools',
    defaultPrice: 20,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'GitHub Copilot',
    categoryId: 'developer_tools',
    defaultPrice: 10,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Notion AI',
    categoryId: 'ai_tools',
    defaultPrice: 10,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Figma',
    categoryId: 'productivity',
    defaultPrice: 15,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Adobe Creative Cloud',
    categoryId: 'productivity',
    defaultPrice: 59.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Microsoft 365',
    categoryId: 'productivity',
    defaultPrice: 9.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Office 365',
    categoryId: 'productivity',
    defaultPrice: 9.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Xbox Game Pass',
    categoryId: 'gaming',
    defaultPrice: 16.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'PlayStation Plus',
    categoryId: 'gaming',
    defaultPrice: 17.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Nintendo Switch Online',
    categoryId: 'gaming',
    defaultPrice: 3.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Steam',
    categoryId: 'gaming',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Gym Membership',
    categoryId: 'fitness',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Cult Fit',
    categoryId: 'fitness',
    defaultPrice: 1499,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'HealthifyMe',
    categoryId: 'health',
    defaultPrice: 999,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Amazon Prime',
    categoryId: 'shopping',
    defaultPrice: 139,
    defaultBillingCycle: 'Yearly',
  },
  {
    name: 'Swiggy One',
    categoryId: 'food',
    defaultPrice: 25,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Zomato Gold',
    categoryId: 'food',
    defaultPrice: 50,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Truecaller Premium',
    categoryId: 'utilities',
    defaultPrice: 199,
    defaultCurrency: 'INR',
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'Bitwarden',
    categoryId: 'security',
    defaultPrice: 10,
    defaultBillingCycle: 'Yearly',
  },
  {
    name: 'NordVPN',
    categoryId: 'security',
    defaultPrice: 12.99,
    defaultBillingCycle: 'Monthly',
  },
  {
    name: 'ExpressVPN',
    categoryId: 'security',
    defaultPrice: 12.95,
    defaultBillingCycle: 'Monthly',
  },
] as const;

const NORMALIZE = (value: string) => value.trim().toLowerCase();

/**
 * Filter catalog names for typeahead suggestions.
 */
export function suggestSubscriptions(
  query: string,
  limit = 8,
): CatalogSubscription[] {
  const needle = NORMALIZE(query);
  if (needle.length < 1) {
    return [];
  }

  const startsWith: CatalogSubscription[] = [];
  const contains: CatalogSubscription[] = [];

  for (const item of SUBSCRIPTION_CATALOG) {
    const haystack = NORMALIZE(item.name);
    if (haystack === needle) {
      // Exact match — no need to keep suggesting the same value.
      continue;
    }
    if (haystack.startsWith(needle)) {
      startsWith.push(item);
    } else if (haystack.includes(needle)) {
      contains.push(item);
    }
  }

  return [...startsWith, ...contains].slice(0, limit);
}

/**
 * Resolve a catalog entry for an exact (case-insensitive) name match.
 */
export function resolveCatalogEntry(
  name: string,
): CatalogSubscription | undefined {
  const needle = NORMALIZE(name);
  if (!needle) {
    return undefined;
  }
  return SUBSCRIPTION_CATALOG.find(
    (item) => NORMALIZE(item.name) === needle,
  );
}

/**
 * Resolve a catalog category for an exact (case-insensitive) name match.
 */
export function resolveCatalogCategory(
  name: string,
): Category | undefined {
  return resolveCatalogEntry(name)?.categoryId;
}
