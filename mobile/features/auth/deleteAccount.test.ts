import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios ?? obj.default },
}));

vi.mock('expo-linking', () => ({
  createURL: vi.fn((path: string) => `subscriptiontracker://${path}`),
  parse: vi.fn(),
}));

import { AuthError } from './types';

const mocks = vi.hoisted(() => {
  const invoke = vi.fn();
  const signOut = vi.fn();

  return {
    invoke,
    signOut,
  };
});

vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    functions: {
      invoke: mocks.invoke,
    },
    auth: {
      signOut: mocks.signOut,
    },
  },
}));

const mockClearActiveUser = vi.fn();
vi.mock('@/features/subscriptions/store', () => ({
  useSubscriptionStore: {
    getState: () => ({
      clearActiveUser: mockClearActiveUser,
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

describe('deleteAccount suite', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useAuthStore.setState({
      session: {
        user: { id: 'test-user-id', email: 'test@example.com', fullName: 'Test User' },
      },
      user: { id: 'test-user-id', email: 'test@example.com', fullName: 'Test User' },
      hydrated: true,
      isInitialized: true,
      isLoading: false,
      passwordRecoveryPending: false,
      recoveryEmail: null,
      recoveryRequestedAt: null,
    });
  });

  it('calls delete-account Edge Function and clears local state on success', async () => {
    mocks.invoke.mockResolvedValueOnce({
      data: { ok: true },
      error: null,
    });
    mocks.signOut.mockResolvedValueOnce({ error: null });

    await useAuthStore.getState().deleteAccount();

    expect(mocks.invoke).toHaveBeenCalledWith('delete-account', {
      method: 'POST',
    });
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' });
    expect(mockClearActiveUser).toHaveBeenCalled();

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.passwordRecoveryPending).toBe(false);
  });

  it('keeps the user signed in and throws when delete-account function fails', async () => {
    mocks.invoke.mockResolvedValueOnce({
      data: null,
      error: new Error('Failed to delete account on server'),
    });

    await expect(useAuthStore.getState().deleteAccount()).rejects.toThrow();

    expect(mocks.signOut).not.toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user?.id).toBe('test-user-id');
    expect(state.session).not.toBeNull();
  });
});
