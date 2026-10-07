import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage abstraction for device-local persistence.
 * Auth identity/session is owned by Supabase (encrypted auth storage adapter).
 * Keys authSession / users are retired and cleared on hydrate.
 */
export const storage = {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};

export const STORAGE_KEYS = {
  /** @deprecated Phase 17 Step 4 — retired; cleared on subscription hydrate */
  subscriptions: '@subscription-tracker/subscriptions',
  onboardingCompleted: '@subscription-tracker/onboarding-completed',
  /** @deprecated Phase 17 Step 3 — retired mock auth; cleared on hydrate */
  authSession: '@subscription-tracker/auth-session',
  /** @deprecated Phase 17 Step 3 — retired mock users; cleared on hydrate */
  users: '@subscription-tracker/users',
} as const;
