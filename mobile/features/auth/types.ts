/**
 * Production auth types — Phase 17 Step 3.
 * Supabase Auth is the identity authority; these types are UI/state mirrors only.
 */

import type { Session } from '@supabase/supabase-js';

/** Authenticated user as mirrored for UI (no tokens / passwords). */
export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

/**
 * UI session mirror — never store access/refresh tokens here.
 * Supabase client storage owns the real session.
 */
export type AuthSession = {
  user: AuthUser;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type RegisterResult = {
  /** True when signup succeeded but email confirmation is required. */
  needsEmailConfirmation: boolean;
};

export type AuthFailureCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'EMAIL_NOT_CONFIRMED'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'RATE_LIMITED'
  | 'NETWORK'
  | 'RECOVERY_INVALID'
  | 'RECOVERY_MISSING'
  | 'NOT_CONFIGURED'
  | 'UNEXPECTED';

export class AuthError extends Error {
  readonly code: AuthFailureCode;

  constructor(code: AuthFailureCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

export type { Session };
