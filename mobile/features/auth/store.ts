import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useSubscriptionStore } from '@/features/subscriptions/store';

import { mapAuthError } from './errors';
import {
  loadOnboardingCompleted,
  retireMockAuthPersistence,
  saveOnboardingCompleted,
} from './persistence';
import {
  getEmailConfirmRedirectUrl,
  getPasswordResetRedirectUrl,
  mapSupabaseUser,
  parseAuthUrlParams,
} from './session';
import {
  AuthError,
  type AuthSession,
  type AuthUser,
  type RegisterFormValues,
  type RegisterResult,
} from './types';
import { normalizeEmail } from './validation';

export type AuthStoreState = {
  /** UI mirror of the authenticated user — Supabase session is authoritative. */
  session: AuthSession | null;
  user: AuthUser | null;
  onboardingCompleted: boolean;
  /** True after first Supabase session resolution + listener attach. */
  hydrated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  /** Recovery deep link established a password-reset session. */
  passwordRecoveryPending: boolean;
  hydrate: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  clearPasswordRecovery: () => void;
  /** Process auth callback URLs (recovery / confirm) without logging tokens. */
  handleAuthUrl: (url: string) => Promise<boolean>;
};

let authListenerAttached = false;
let authSubscription: { unsubscribe: () => void } | null = null;

async function syncLocalWorkingSet(userId: string | null): Promise<void> {
  if (userId == null) {
    useSubscriptionStore.getState().clearActiveUser();
    return;
  }
  // Compatibility only — NOT an authorization boundary. RLS owns authz.
  // Loads the authenticated user's subscriptions from Postgres.
  try {
    await useSubscriptionStore.getState().setActiveUser(userId);
  } catch {
    // Auth may still succeed; subscription load errors surface via store.error.
  }
}

function toAuthSession(session: Session | null): {
  session: AuthSession | null;
  user: AuthUser | null;
} {
  if (session?.user == null) {
    return { session: null, user: null };
  }
  const user = mapSupabaseUser(session.user);
  return { session: { user }, user };
}

function assertConfigured(): void {
  if (!isSupabaseConfigured) {
    throw new AuthError(
      'NOT_CONFIGURED',
      'Authentication is not configured. Add Supabase public keys to your environment.',
    );
  }
}

/**
 * Production auth store — Zustand mirrors UI state; Supabase Auth owns identity.
 */
export const useAuthStore = create<AuthStoreState>((set, get) => ({
  session: null,
  user: null,
  onboardingCompleted: false,
  hydrated: false,
  isInitialized: false,
  isLoading: true,
  passwordRecoveryPending: false,

  hydrate: async () => {
    if (get().hydrated) {
      return;
    }

    set({ isLoading: true });

    await retireMockAuthPersistence();
    const onboardingCompleted = await loadOnboardingCompleted();
    await useSubscriptionStore.getState().hydrate();

    if (!isSupabaseConfigured) {
      await syncLocalWorkingSet(null);
      set({
        session: null,
        user: null,
        onboardingCompleted,
        hydrated: true,
        isInitialized: true,
        isLoading: false,
        passwordRecoveryPending: false,
      });
      return;
    }

    if (!authListenerAttached) {
      authListenerAttached = true;
      const { data } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session) => {
          void (async () => {
            const mapped = toAuthSession(session);
            const recovery =
              event === 'PASSWORD_RECOVERY'
                ? true
                : event === 'SIGNED_OUT'
                  ? false
                  : get().passwordRecoveryPending;

            set({
              session: mapped.session,
              user: mapped.user,
              passwordRecoveryPending: recovery,
            });

            await syncLocalWorkingSet(mapped.user?.id ?? null);
          })();
        },
      );
      authSubscription = data.subscription;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }

      const mapped = toAuthSession(data.session);
      set({
        session: mapped.session,
        user: mapped.user,
        onboardingCompleted,
        hydrated: true,
        isInitialized: true,
        isLoading: false,
      });
      await syncLocalWorkingSet(mapped.user?.id ?? null);
    } catch {
      set({
        session: null,
        user: null,
        onboardingCompleted,
        hydrated: true,
        isInitialized: true,
        isLoading: false,
        passwordRecoveryPending: false,
      });
      await syncLocalWorkingSet(null);
    }
  },

  completeOnboarding: async () => {
    await saveOnboardingCompleted();
    set({ onboardingCompleted: true });
  },

  login: async (email, password) => {
    assertConfigured();
    const normalized = normalizeEmail(email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });

    if (error) {
      throw mapAuthError(error, {
        code: 'INVALID_CREDENTIALS',
        message: 'Email or password is incorrect.',
      });
    }

    const mapped = toAuthSession(data.session);
    set({
      session: mapped.session,
      user: mapped.user,
      passwordRecoveryPending: false,
    });
    await syncLocalWorkingSet(mapped.user?.id ?? null);
  },

  register: async (values) => {
    assertConfigured();
    const normalized = normalizeEmail(values.email);
    const fullName = values.fullName.trim();

    const { data, error } = await supabase.auth.signUp({
      email: normalized,
      password: values.password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: getEmailConfirmRedirectUrl(),
      },
    });

    if (error) {
      throw mapAuthError(error);
    }

    // identities empty → email already registered (Supabase soft response).
    if (data.user != null && (data.user.identities?.length ?? 0) === 0) {
      throw new AuthError(
        'EMAIL_TAKEN',
        'An account with this email already exists. Log in instead.',
      );
    }

    if (data.session) {
      const mapped = toAuthSession(data.session);
      set({
        session: mapped.session,
        user: mapped.user,
        passwordRecoveryPending: false,
      });
      await syncLocalWorkingSet(mapped.user?.id ?? null);
      return { needsEmailConfirmation: false };
    }

    // User created; confirmation required — do not invent a logged-in session.
    set({
      session: null,
      user: null,
      passwordRecoveryPending: false,
    });
    await syncLocalWorkingSet(null);
    return { needsEmailConfirmation: true };
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw mapAuthError(error);
      }
    }

    await syncLocalWorkingSet(null);
    set({
      session: null,
      user: null,
      passwordRecoveryPending: false,
    });
  },

  requestPasswordReset: async (email) => {
    assertConfigured();
    const normalized = normalizeEmail(email);
    const redirectTo = getPasswordResetRedirectUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(normalized, {
      redirectTo,
    });

    if (error) {
      throw mapAuthError(error);
    }

    // Always present success to the UI to avoid account enumeration.
  },

  updatePassword: async (password) => {
    assertConfigured();

    // Recovery screen only — do not allow ordinary sessions to use this path.
    if (!get().passwordRecoveryPending) {
      throw new AuthError(
        'RECOVERY_MISSING',
        'Your reset session is missing or expired. Request a new reset link.',
      );
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || sessionData.session == null) {
      throw new AuthError(
        'RECOVERY_MISSING',
        'Your reset session is missing or expired. Request a new reset link.',
      );
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      throw mapAuthError(error);
    }

    // End recovery session; user signs in with the new password.
    await supabase.auth.signOut();
    await syncLocalWorkingSet(null);
    set({
      session: null,
      user: null,
      passwordRecoveryPending: false,
    });
  },

  clearPasswordRecovery: () => {
    set({ passwordRecoveryPending: false });
  },

  handleAuthUrl: async (url) => {
    if (!isSupabaseConfigured || !url) {
      return false;
    }

    const params = parseAuthUrlParams(url);

    if (params.errorCode || params.errorDescription) {
      throw new AuthError(
        'RECOVERY_INVALID',
        'This reset link is invalid or has expired. Request a new one and try again.',
      );
    }

    try {
      if (params.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(params.code);
        if (error) {
          throw error;
        }
      } else if (params.accessToken && params.refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: params.accessToken,
          refresh_token: params.refreshToken,
        });
        if (error) {
          throw error;
        }
      } else {
        return false;
      }

      const isRecovery =
        params.type === 'recovery' ||
        url.toLowerCase().includes('reset-password');

      const { data } = await supabase.auth.getSession();
      const mapped = toAuthSession(data.session);
      set({
        session: mapped.session,
        user: mapped.user,
        passwordRecoveryPending: isRecovery || get().passwordRecoveryPending,
      });

      if (isRecovery || get().passwordRecoveryPending) {
        // Recovery is not a normal app session — skip subscription hydrate.
        useSubscriptionStore.getState().clearActiveUser();
      } else {
        await syncLocalWorkingSet(mapped.user?.id ?? null);
      }
      return true;
    } catch (error) {
      throw mapAuthError(error, {
        code: 'RECOVERY_INVALID',
        message:
          'This reset link is invalid or has expired. Request a new one and try again.',
      });
    }
  },
}));

/** Test / teardown helper — not used by UI. */
export function __resetAuthListenerForTests(): void {
  authSubscription?.unsubscribe();
  authSubscription = null;
  authListenerAttached = false;
}
