import type { SupportedStorage } from '@supabase/supabase-js';

/**
 * Web auth session storage (Expo web / browser only).
 *
 * Explicit browser `localStorage` — not SecureStore and not a silent fallback.
 * Production target for Subscription Tracker is native mobile; web storage exists
 * so development on Expo web remains functional with a clear platform boundary.
 */
function createWebAuthStorage(): SupportedStorage {
  return {
    getItem: (key) => {
      if (typeof localStorage === 'undefined') {
        return Promise.resolve(null);
      }
      return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key, value) => {
      if (typeof localStorage === 'undefined') {
        return Promise.resolve();
      }
      localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      if (typeof localStorage === 'undefined') {
        return Promise.resolve();
      }
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
}

export const authStorage: SupportedStorage = createWebAuthStorage();
