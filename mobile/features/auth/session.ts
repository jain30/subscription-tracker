import type { User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

import type { AuthUser } from './types';

/** Deep-link path for password recovery (matches Expo Router screen). */
export const AUTH_RESET_PATH = 'reset-password';

/**
 * Redirect URL for Supabase Auth emails (recovery / confirmation).
 * Production builds: subscriptiontracker://reset-password
 * Expo Go: exp://…/--/reset-password
 *
 * Dashboard (manual): Authentication → URL Configuration → Redirect URLs
 * must allow this scheme/path (and Expo Go URLs while developing).
 */
export function getPasswordResetRedirectUrl(): string {
  return Linking.createURL(AUTH_RESET_PATH);
}

export function getEmailConfirmRedirectUrl(): string {
  return Linking.createURL('/');
}

export function mapSupabaseUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  const fromMeta =
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    (typeof meta.fullName === 'string' && meta.fullName.trim()) ||
    '';

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: fromMeta || fallbackName(user.email),
  };
}

function fallbackName(email: string | undefined): string {
  if (!email) {
    return 'Subscription Tracker User';
  }
  const local = email.split('@')[0]?.trim();
  return local || 'Subscription Tracker User';
}

export type AuthUrlParams = {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
  tokenHash: string | null;
  type: string | null;
  errorCode: string | null;
  errorDescription: string | null;
};

/**
 * Parse Supabase auth callback URLs (hash or query) without logging secrets.
 */
export function parseAuthUrlParams(url: string): AuthUrlParams {
  const normalized = url.includes('#') ? url.replace('#', url.includes('?') ? '&' : '?') : url;
  const parsed = Linking.parse(normalized);
  const query = parsed.queryParams ?? {};

  return {
    accessToken: readParam(query.access_token),
    refreshToken: readParam(query.refresh_token),
    code: readParam(query.code),
    tokenHash: readParam(query.token_hash),
    type: readParam(query.type),
    errorCode: readParam(query.error) ?? readParam(query.error_code),
    errorDescription: readParam(query.error_description),
  };
}

function readParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].length > 0) {
    return value[0];
  }
  return null;
}
