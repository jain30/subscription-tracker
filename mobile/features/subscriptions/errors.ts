/**
 * Safe subscription data-layer errors for UI consumption.
 * Never expose SQL / internal Supabase details to users.
 */

export type SubscriptionFailureCode =
  | 'NOT_AUTHENTICATED'
  | 'NOT_CONFIGURED'
  | 'NETWORK'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'UNEXPECTED';

export class SubscriptionError extends Error {
  readonly code: SubscriptionFailureCode;

  constructor(code: SubscriptionFailureCode, message: string) {
    super(message);
    this.name = 'SubscriptionError';
    this.code = code;
  }
}

export function mapSubscriptionError(
  error: unknown,
  fallback: { code: SubscriptionFailureCode; message: string } = {
    code: 'UNEXPECTED',
    message: 'Something went wrong. Please try again.',
  },
): SubscriptionError {
  if (error instanceof SubscriptionError) {
    return error;
  }

  const message = readMessage(error).toLowerCase();
  const code = readCode(error).toLowerCase();
  const status = readStatus(error);
  const hint = readHint(error).toLowerCase();

  // Privilege / RLS signals first — PostgREST often returns HTTP 401 for 42501.
  if (
    code === '42501' ||
    status === 403 ||
    message.includes('row-level security') ||
    message.includes('permission denied') ||
    (hint.includes('grant ') &&
      (hint.includes(' update') || hint.includes(', update')))
  ) {
    return new SubscriptionError(
      'PERMISSION_DENIED',
      'You do not have permission to perform this action.',
    );
  }

  if (status === 401 || code === 'pgrst301' || message.includes('jwt')) {
    return new SubscriptionError(
      'NOT_AUTHENTICATED',
      'Please sign in to manage subscriptions.',
    );
  }

  if (
    status === 404 ||
    code === 'pgrst116' ||
    message.includes('0 rows') ||
    message.includes('not found')
  ) {
    return new SubscriptionError(
      'NOT_FOUND',
      'Subscription not found.',
    );
  }

  if (
    status === 400 ||
    status === 409 ||
    code.startsWith('23') ||
    message.includes('check constraint') ||
    message.includes('violates') ||
    message.includes('invalid input')
  ) {
    return new SubscriptionError(
      'VALIDATION',
      'Some subscription details are invalid. Please review and try again.',
    );
  }

  // Network last — only clear transport failures (avoid matching arbitrary "fetch").
  if (isNetworkLike(error)) {
    return new SubscriptionError(
      'NETWORK',
      'Unable to reach the server. Check your connection and try again.',
    );
  }

  return new SubscriptionError(fallback.code, fallback.message);
}

function readMessage(error: unknown): string {
  if (error == null || typeof error !== 'object') {
    return '';
  }
  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' ? message : '';
}

function readCode(error: unknown): string {
  if (error == null || typeof error !== 'object') {
    return '';
  }
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' ? code : '';
}

function readStatus(error: unknown): number | null {
  if (error == null || typeof error !== 'object') {
    return null;
  }
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

function readHint(error: unknown): string {
  if (error == null || typeof error !== 'object') {
    return '';
  }
  const hint = (error as { hint?: unknown }).hint;
  return typeof hint === 'string' ? hint : '';
}

function isNetworkLike(error: unknown): boolean {
  const message = readMessage(error).toLowerCase();
  return (
    message.includes('failed to fetch') ||
    message.includes('network request failed') ||
    message.includes('networkerror') ||
    message.includes('timeout') ||
    message.includes('offline') ||
    message.startsWith('fetcherror:') ||
    /\bfetcherror\b/.test(message)
  );
}
