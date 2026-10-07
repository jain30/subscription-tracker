/**
 * App-wide constants and configuration.
 * EXPO_PUBLIC_* values are inlined at build time by Expo.
 *
 * Public (safe for the client bundle):
 * - EXPO_PUBLIC_SUPABASE_URL
 * - EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 * - EXPO_PUBLIC_API_URL (legacy Express scaffold; unused by Phase 17 auth)
 *
 * Never put service_role keys, database passwords, or other privileged
 * secrets in EXPO_PUBLIC_* variables or mobile source.
 */

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export const APP_NAME = 'Subscription Tracker';

/** Supabase project URL — public client configuration. */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';

/**
 * Supabase publishable (anon) key — public client configuration.
 * Protected by Postgres RLS; never substitute a service_role key here.
 */
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_PUBLISHABLE_KEY.length > 0;
