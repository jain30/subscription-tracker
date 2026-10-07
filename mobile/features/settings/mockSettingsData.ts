/**
 * Static presentation data for Settings UI — Phase 11.
 * No auth, no persistence, no business rules.
 */

export type SettingsThemeOption = 'light' | 'dark' | 'system';

export type SettingsAccentSwatch = {
  id: string;
  /** Theme role key resolved at render time */
  role: 'brand' | 'streaming' | 'productivity' | 'health' | 'finance' | 'shopping' | 'accent' | 'other';
};

export type SettingsToggle = {
  id: string;
  label: string;
  value: boolean;
};

export type SettingsSnapshot = {
  profile: {
    name: string;
    subtitle: string;
    badge: string;
    initials: string;
  };
  account: {
    account: string;
    email: string;
    currency: string;
    region: string;
    language: string;
  };
  theme: SettingsThemeOption;
  accents: SettingsAccentSwatch[];
  selectedAccentId: string;
  notifications: SettingsToggle[];
  billing: {
    defaultCurrency: string;
    billingCycle: string;
    firstDayOfMonth: string;
    timeZone: string;
  };
  about: {
    version: string;
    build: string;
    developer: string;
  };
};

export const mockSettingsSnapshot: SettingsSnapshot = {
  profile: {
    name: 'Alex Morgan',
    subtitle: 'Managing 6 subscriptions',
    badge: 'Premium Preview',
    initials: 'AM',
  },
  account: {
    account: 'Personal',
    email: 'alex@example.com',
    currency: 'USD',
    region: 'United States',
    language: 'English',
  },
  theme: 'system',
  accents: [
    { id: 'teal', role: 'brand' },
    { id: 'streaming', role: 'streaming' },
    { id: 'productivity', role: 'productivity' },
    { id: 'health', role: 'health' },
    { id: 'finance', role: 'finance' },
    { id: 'shopping', role: 'shopping' },
    { id: 'amber', role: 'accent' },
    { id: 'other', role: 'other' },
  ],
  selectedAccentId: 'teal',
  notifications: [
    { id: 'payment', label: 'Payment reminders', value: true },
    { id: 'renewal', label: 'Renewal alerts', value: true },
    { id: 'weekly', label: 'Weekly spending summary', value: true },
    { id: 'monthly', label: 'Monthly report', value: false },
    { id: 'product', label: 'Product updates', value: false },
    { id: 'push', label: 'Push notifications', value: true },
    { id: 'email', label: 'Email notifications', value: true },
  ],
  billing: {
    defaultCurrency: 'USD ($)',
    billingCycle: 'Monthly',
    firstDayOfMonth: '1st',
    timeZone: 'America/New_York',
  },
  about: {
    version: '1.0.0',
    build: '11',
    developer: 'Subscription Tracker',
  },
};
