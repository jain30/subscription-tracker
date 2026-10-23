import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios ?? obj.default },
}));

vi.mock('expo-linking', () => ({
  createURL: vi.fn((path: string) => `subscriptiontracker://${path}`),
  parse: vi.fn((url: string) => {
    const [pathPart, queryPart] = url.split('?');
    const queryParams: Record<string, string> = {};
    if (queryPart) {
      for (const pair of queryPart.split('&')) {
        const [k, v] = pair.split('=');
        if (k) queryParams[decodeURIComponent(k)] = decodeURIComponent(v || '');
      }
    }
    return { path: pathPart, queryParams };
  }),
}));

import { AuthError } from './types';
import { validateResetPasswordForm } from './validation';

const mocks = vi.hoisted(() => {
  const resetPasswordForEmail = vi.fn();
  const verifyOtp = vi.fn();
  const updateUser = vi.fn();
  const signOut = vi.fn();
  const getSession = vi.fn();
  const signInWithPassword = vi.fn();
  const signUp = vi.fn();
  const onAuthStateChange = vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  }));
  const exchangeCodeForSession = vi.fn();
  const setSession = vi.fn();

  return {
    resetPasswordForEmail,
    verifyOtp,
    updateUser,
    signOut,
    getSession,
    signInWithPassword,
    signUp,
    onAuthStateChange,
    exchangeCodeForSession,
    setSession,
  };
});

vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      resetPasswordForEmail: mocks.resetPasswordForEmail,
      verifyOtp: mocks.verifyOtp,
      updateUser: mocks.updateUser,
      signOut: mocks.signOut,
      getSession: mocks.getSession,
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      onAuthStateChange: mocks.onAuthStateChange,
      exchangeCodeForSession: mocks.exchangeCodeForSession,
      setSession: mocks.setSession,
    },
  },
}));

vi.mock('@/features/subscriptions/store', () => ({
  useSubscriptionStore: {
    getState: () => ({
      clearActiveUser: vi.fn(),
      setActiveUser: vi.fn(),
      hydrate: vi.fn(),
    }),
  },
}));

vi.mock('./persistence', () => ({
  loadOnboardingCompleted: vi.fn(async () => true),
  saveOnboardingCompleted: vi.fn(async () => {}),
  retireMockAuthPersistence: vi.fn(async () => {}),
}));

import { useAuthStore } from './store';

describe('Task 25.02: Password Recovery Repair Test Suite', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useAuthStore.setState({
      session: null,
      user: null,
      hydrated: true,
      isInitialized: true,
      isLoading: false,
      passwordRecoveryPending: false,
      recoveryEmail: null,
    });
  });

  // Gate 1: Requesting a recovery email succeeds and preserves the email needed for verification
  it('Gate 1: requesting a recovery email succeeds and preserves the email for verification', async () => {
    mocks.resetPasswordForEmail.mockResolvedValueOnce({ error: null });

    const email = 'user@example.com';
    await useAuthStore.getState().requestPasswordReset(email);

    expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith(
      'user@example.com',
      expect.objectContaining({
        redirectTo: expect.stringContaining('reset-password'),
      }),
    );
    expect(useAuthStore.getState().recoveryEmail).toBe('user@example.com');
  });

  // Gate 2: A valid recovery OTP creates/establishes the expected recovery state
  it('Gate 2: a valid recovery OTP establishes recovery state and sets passwordRecoveryPending', async () => {
    mocks.verifyOtp.mockResolvedValueOnce({
      data: {
        session: {
          access_token: 'valid-access-token',
          refresh_token: 'valid-refresh-token',
          user: { id: 'test-user-id', email: 'user@example.com' },
        },
        user: { id: 'test-user-id', email: 'user@example.com' },
      },
      error: null,
    });

    await useAuthStore.getState().verifyRecoveryOtp('user@example.com', '123456');

    expect(mocks.verifyOtp).toHaveBeenCalledWith({
      email: 'user@example.com',
      token: '123456',
      type: 'recovery',
    });
    const state = useAuthStore.getState();
    expect(state.passwordRecoveryPending).toBe(true);
    expect(state.session).not.toBeNull();
    expect(state.user?.id).toBe('test-user-id');
  });

  // Gate 3: Incorrect, expired, or invalid codes never unlock the password form
  it('Gate 3: incorrect or expired codes throw RECOVERY_INVALID and never unlock the password form', async () => {
    mocks.verifyOtp.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: { message: 'Token has expired or is invalid', status: 400 },
    });

    await expect(
      useAuthStore.getState().verifyRecoveryOtp('user@example.com', '000000'),
    ).rejects.toThrow(AuthError);

    const state = useAuthStore.getState();
    expect(state.passwordRecoveryPending).toBe(false);
    expect(state.session).toBeNull();
  });

  // Gate 4: A RECOVERY_INVALID error never silently redirects into an endless forgot-password loop
  it('Gate 4: RECOVERY_INVALID error from direct url parsing throws RECOVERY_INVALID error to be routed to reset-password with message', async () => {
    const expiredLink =
      'subscriptiontracker://reset-password#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired';

    let thrownError: unknown = null;
    try {
      await useAuthStore.getState().handleAuthUrl(expiredLink);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(AuthError);
    expect((thrownError as AuthError).code).toBe('RECOVERY_INVALID');
    expect((thrownError as AuthError).message).toContain('invalid or has expired');
    // passwordRecoveryPending remains false, allowing the screen to show recovery code input rather than looping
    expect(useAuthStore.getState().passwordRecoveryPending).toBe(false);
  });

  // Gate 5: The password form is rendered only after successful verification or an established valid recovery session
  it('Gate 5: updatePassword refuses execution if recovery session is not established', async () => {
    useAuthStore.setState({ passwordRecoveryPending: false });

    await expect(
      useAuthStore.getState().updatePassword('NewSecurePassword123!'),
    ).rejects.toThrow('Your reset session is missing or expired');

    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  // Gate 6: Mismatched password and confirmation fields are rejected
  it('Gate 6: validateResetPasswordForm rejects mismatched passwords and passwords below 8 characters', () => {
    const shortMismatch = validateResetPasswordForm({
      password: 'short',
      confirmPassword: 'different',
    });
    expect(shortMismatch.password).toBe('New password must be at least 8 characters');
    expect(shortMismatch.confirmPassword).toBe('Passwords do not match');

    const mismatch = validateResetPasswordForm({
      password: 'ValidPassword123!',
      confirmPassword: 'DifferentPassword123!',
    });
    expect(mismatch.password).toBeUndefined();
    expect(mismatch.confirmPassword).toBe('Passwords do not match');

    const matching = validateResetPasswordForm({
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
    });
    expect(matching.password).toBeUndefined();
    expect(matching.confirmPassword).toBeUndefined();
  });

  // Gate 7: The password update API is not called before recovery verification succeeds
  it('Gate 7: password update API (supabase.auth.updateUser) is not called before recovery verification', async () => {
    useAuthStore.setState({ passwordRecoveryPending: false });

    await expect(
      useAuthStore.getState().updatePassword('ValidPassword123!'),
    ).rejects.toThrow();

    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  // Gate 8: A successful password update follows the existing safe success and navigation behavior
  it('Gate 8: successful password update calls updateUser, signs out recovery session, and clears pending recovery', async () => {
    useAuthStore.setState({
      passwordRecoveryPending: true,
      recoveryEmail: 'user@example.com',
      session: {
        user: { id: 'test-user-id', email: 'user@example.com', fullName: 'Test User' },
      },
    });

    mocks.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'test-user-id' } } },
      error: null,
    });
    mocks.updateUser.mockResolvedValueOnce({ error: null });
    mocks.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().updatePassword('NewSecurePassword123!');

    expect(mocks.updateUser).toHaveBeenCalledWith({
      password: 'NewSecurePassword123!',
    });
    expect(mocks.signOut).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.passwordRecoveryPending).toBe(false);
    expect(state.recoveryEmail).toBeNull();
    expect(state.session).toBeNull();
  });

  // Gate 9: Invalid or expired direct links show a useful error and provide a fresh-reset action
  it('Gate 9: handleAuthUrl with error query parameters maps to RECOVERY_INVALID', async () => {
    const errorUrl =
      'subscriptiontracker://reset-password?error=access_denied&error_code=otp_expired';

    await expect(useAuthStore.getState().handleAuthUrl(errorUrl)).rejects.toThrow(
      'This reset link is invalid or has expired. Request a new one and try again.',
    );
  });

  // Gate 10: Existing valid direct-link recovery handling is preserved
  it('Gate 10: existing valid direct-link with code exchanges code and sets passwordRecoveryPending', async () => {
    mocks.exchangeCodeForSession.mockResolvedValueOnce({ error: null });
    mocks.getSession.mockResolvedValueOnce({
      data: {
        session: {
          access_token: 'token-123',
          refresh_token: 'refresh-123',
          user: { id: 'direct-user', email: 'direct@example.com' },
        },
      },
      error: null,
    });

    const validUrl = 'subscriptiontracker://reset-password?code=valid-auth-code&type=recovery';
    const handled = await useAuthStore.getState().handleAuthUrl(validUrl);

    expect(handled).toBe(true);
    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith('valid-auth-code');
    expect(useAuthStore.getState().passwordRecoveryPending).toBe(true);
  });

  // Gate 10b: Custom Supabase templates may redirect token_hash instead of a PKCE code.
  it('Gate 10b: token_hash recovery links verify the token and establish a recovery session', async () => {
    mocks.verifyOtp.mockResolvedValueOnce({
      data: {
        session: {
          access_token: 'recovery-access-token',
          refresh_token: 'recovery-refresh-token',
          user: { id: 'hash-user', email: 'hash@example.com' },
        },
        user: { id: 'hash-user', email: 'hash@example.com' },
      },
      error: null,
    });

    const handled = await useAuthStore.getState().handleAuthUrl(
      'subscriptiontracker://reset-password?token_hash=valid-hash&type=recovery',
    );

    expect(handled).toBe(true);
    expect(mocks.verifyOtp).toHaveBeenCalledWith({
      token_hash: 'valid-hash',
      type: 'recovery',
    });
    expect(useAuthStore.getState().passwordRecoveryPending).toBe(true);
    expect(useAuthStore.getState().recoveryEmail).toBe('hash@example.com');
  });

  // Gate 11: Normal login, registration, logout, and session restoration do not regress
  it('Gate 11: normal login, registration, logout, and session restoration operate as expected', async () => {
    // 11a: Login
    mocks.signInWithPassword.mockResolvedValueOnce({
      data: {
        session: {
          access_token: 'login-token',
          user: { id: 'login-id', email: 'login@example.com' },
        },
      },
      error: null,
    });
    await useAuthStore.getState().login('login@example.com', 'Password123!');
    expect(useAuthStore.getState().user?.email).toBe('login@example.com');
    expect(useAuthStore.getState().passwordRecoveryPending).toBe(false);

    // 11b: Logout
    mocks.signOut.mockResolvedValueOnce({ error: null });
    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().passwordRecoveryPending).toBe(false);

    // 11c: Registration
    mocks.signUp.mockResolvedValueOnce({
      data: {
        user: { id: 'new-user', identities: [{ id: '1' }] },
        session: null,
      },
      error: null,
    });
    const regResult = await useAuthStore.getState().register({
      fullName: 'New User',
      email: 'new@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(regResult.needsEmailConfirmation).toBe(true);
  });
});
