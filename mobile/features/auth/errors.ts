import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

import { AuthError, type AuthFailureCode } from './types';

type MappedAuthError = {
  code: AuthFailureCode;
  message: string;
};

/**
 * Map Supabase / network failures to safe, user-facing AuthError values.
 * Never surface stack traces, tokens, or internal implementation details.
 */
export function mapAuthError(
  error: unknown,
  fallback: MappedAuthError = {
    code: 'UNEXPECTED',
    message: 'Something went wrong. Please try again.',
  },
): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  if (!isSupabaseConfiguredError(error) && isNetworkLike(error)) {
    return new AuthError(
      'NETWORK',
      'Unable to reach the server. Check your connection and try again.',
    );
  }

  const supabaseError = asSupabaseAuthError(error);
  if (supabaseError) {
    const mapped = mapSupabaseMessage(supabaseError);
    return new AuthError(mapped.code, mapped.message);
  }

  return new AuthError(fallback.code, fallback.message);
}

function asSupabaseAuthError(error: unknown): SupabaseAuthError | null {
  if (error == null || typeof error !== 'object') {
    return null;
  }
  const candidate = error as Partial<SupabaseAuthError>;
  if (typeof candidate.message === 'string') {
    return candidate as SupabaseAuthError;
  }
  return null;
}

function isNetworkLike(error: unknown): boolean {
  if (error == null || typeof error !== 'object') {
    return false;
  }
  const message = String((error as { message?: unknown }).message ?? '').toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('offline')
  );
}

function isSupabaseConfiguredError(error: unknown): boolean {
  return asSupabaseAuthError(error) != null;
}

function mapSupabaseMessage(error: SupabaseAuthError): MappedAuthError {
  const status = error.status;
  const message = (error.message ?? '').toLowerCase();
  const code = (error.code ?? '').toLowerCase();

  if (status === 429 || message.includes('rate limit') || code.includes('over_request')) {
    return {
      code: 'RATE_LIMITED',
      message: 'Too many attempts. Please wait a moment and try again.',
    };
  }

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials') ||
    code === 'invalid_credentials'
  ) {
    return {
      code: 'INVALID_CREDENTIALS',
      message: 'Email or password is incorrect.',
    };
  }

  if (
    message.includes('email not confirmed') ||
    code === 'email_not_confirmed'
  ) {
    return {
      code: 'EMAIL_NOT_CONFIRMED',
      message: 'Please confirm your email before signing in.',
    };
  }

  if (
    message.includes('user already registered') ||
    message.includes('already been registered') ||
    message.includes('already registered') ||
    code === 'user_already_exists'
  ) {
    return {
      code: 'EMAIL_TAKEN',
      message: 'An account with this email already exists. Log in instead.',
    };
  }

  if (
    message.includes('password') &&
    (message.includes('weak') ||
      message.includes('least') ||
      message.includes('short') ||
      code.includes('weak_password'))
  ) {
    return {
      code: 'WEAK_PASSWORD',
      message: 'Choose a stronger password (at least 8 characters).',
    };
  }

  if (
    message.includes('invalid email') ||
    message.includes('unable to validate email') ||
    code === 'email_address_invalid'
  ) {
    return {
      code: 'INVALID_EMAIL',
      message: 'Enter a valid email address.',
    };
  }

  if (
    message.includes('otp_expired') ||
    message.includes('token has expired') ||
    message.includes('expired') ||
    message.includes('invalid token') ||
    code.includes('otp_expired') ||
    code.includes('flow_state')
  ) {
    return {
      code: 'RECOVERY_INVALID',
      message:
        'This reset link is invalid or has expired. Request a new one and try again.',
    };
  }

  if (message.includes('network') || message.includes('fetch')) {
    return {
      code: 'NETWORK',
      message: 'Unable to reach the server. Check your connection and try again.',
    };
  }

  return {
    code: 'UNEXPECTED',
    message: 'Something went wrong. Please try again.',
  };
}
