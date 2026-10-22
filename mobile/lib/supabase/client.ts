import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from '@/constants/config';
import type { Database } from '@/types/database';

import { authStorage } from './authStorage';

/**
 * Official Supabase JS client for Expo.
 *
 * Client may only use the project URL + publishable key.
 * Never initialize this client with a service_role key or database password.
 *
 * Auth session persistence:
 * - Native → SecureStore-backed encrypted storage (see authStorage.native.ts)
 * - Web → browser localStorage (see authStorage.web.ts)
 */
if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Add them to mobile/.env (public client values only).',
  );
}

export const supabase = createClient<Database>(
  SUPABASE_URL || 'https://unavailable.supabase.co',
  SUPABASE_PUBLISHABLE_KEY || 'unavailable-publishable-key',
  {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  },
);

export { isSupabaseConfigured };
