import { create } from 'zustand';

import {
  cancelSubscriptionRemote,
  createSubscription as createSubscriptionRemote,
  deleteSubscriptionRemote,
  fetchSubscriptions,
  updateSubscriptionRemote,
} from './api';
import { mapSubscriptionError, SubscriptionError } from './errors';
import { retireLocalSubscriptionPersistence } from './persistence';
import type { Subscription, SubscriptionFormValues } from './types';

export type SubscriptionStoreState = {
  /**
   * Authenticated user's subscriptions (Zustand UI cache only).
   * Source of truth: Postgres public.subscriptions via RLS.
   */
  subscriptions: Subscription[];
  /**
   * Compatibility mirror of the authenticated user id.
   * NOT an authorization boundary — RLS uses auth.uid().
   */
  activeUserId: string | null;
  hydrated: boolean;
  loading: boolean;
  mutating: boolean;
  error: string | null;
  /** Clear legacy AsyncStorage blob; do not load it. */
  hydrate: () => Promise<void>;
  /** Load subscriptions for the authenticated session (RLS-scoped). */
  setActiveUser: (userId: string) => Promise<void>;
  clearActiveUser: () => void;
  refresh: () => Promise<void>;
  addSubscription: (values: SubscriptionFormValues) => Promise<Subscription>;
  updateSubscription: (
    id: string,
    values: SubscriptionFormValues,
  ) => Promise<Subscription>;
  /** Soft-cancel: status=canceled, row retained. */
  cancelSubscription: (id: string) => Promise<Subscription>;
  deleteSubscription: (id: string) => Promise<void>;
  getSubscription: (id: string) => Subscription | undefined;
  getAllSubscriptions: () => Subscription[];
  clearError: () => void;
};

let loadGeneration = 0;

/**
 * Subscription UI cache backed by Supabase Postgres.
 * Mutations update Zustand only after a successful server response.
 */
export const useSubscriptionStore = create<SubscriptionStoreState>(
  (set, get) => ({
    subscriptions: [],
    activeUserId: null,
    hydrated: false,
    loading: false,
    mutating: false,
    error: null,

    hydrate: async () => {
      if (get().hydrated) {
        return;
      }
      await retireLocalSubscriptionPersistence();
      set({
        subscriptions: [],
        hydrated: true,
        error: null,
      });
    },

    setActiveUser: async (userId) => {
      if (!get().hydrated) {
        await get().hydrate();
      }

      const generation = ++loadGeneration;
      set({
        activeUserId: userId,
        loading: true,
        error: null,
      });

      try {
        const subscriptions = await fetchSubscriptions();
        if (generation !== loadGeneration) {
          return;
        }
        set({
          subscriptions,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (generation !== loadGeneration) {
          return;
        }
        const mapped = mapSubscriptionError(error);
        set({
          subscriptions: [],
          loading: false,
          error: mapped.message,
        });
        throw mapped;
      }
    },

    clearActiveUser: () => {
      loadGeneration += 1;
      set({
        activeUserId: null,
        subscriptions: [],
        loading: false,
        mutating: false,
        error: null,
      });
    },

    refresh: async () => {
      const userId = get().activeUserId;
      if (userId == null) {
        set({ subscriptions: [], error: null });
        return;
      }
      await get().setActiveUser(userId);
    },

    addSubscription: async (values) => {
      if (get().mutating) {
        throw new SubscriptionError(
          'CONFLICT',
          'Another save is already in progress.',
        );
      }
      if (get().activeUserId == null) {
        throw new SubscriptionError(
          'NOT_AUTHENTICATED',
          'Please sign in to manage subscriptions.',
        );
      }

      set({ mutating: true, error: null });
      try {
        const created = await createSubscriptionRemote(values);
        set((state) => ({
          subscriptions: [created, ...state.subscriptions],
          mutating: false,
          error: null,
        }));
        return created;
      } catch (error) {
        const mapped = mapSubscriptionError(error);
        set({ mutating: false, error: mapped.message });
        throw mapped;
      }
    },

    updateSubscription: async (id, values) => {
      if (get().mutating) {
        throw new SubscriptionError(
          'CONFLICT',
          'Another save is already in progress.',
        );
      }

      const existing = get().subscriptions.find((item) => item.id === id);
      if (existing == null) {
        throw new SubscriptionError('NOT_FOUND', 'Subscription not found.');
      }

      set({ mutating: true, error: null });
      try {
        const updated = await updateSubscriptionRemote(id, values, existing);
        set((state) => ({
          subscriptions: state.subscriptions.map((item) =>
            item.id === id ? updated : item,
          ),
          mutating: false,
          error: null,
        }));
        return updated;
      } catch (error) {
        const mapped = mapSubscriptionError(error);
        set({ mutating: false, error: mapped.message });
        throw mapped;
      }
    },

    cancelSubscription: async (id) => {
      if (get().mutating) {
        throw new SubscriptionError(
          'CONFLICT',
          'Another save is already in progress.',
        );
      }

      const existing = get().subscriptions.find((item) => item.id === id);
      if (existing == null) {
        throw new SubscriptionError('NOT_FOUND', 'Subscription not found.');
      }
      if (existing.status === 'canceled') {
        return existing;
      }

      set({ mutating: true, error: null });
      try {
        const updated = await cancelSubscriptionRemote(id, existing);
        set((state) => ({
          subscriptions: state.subscriptions.map((item) =>
            item.id === id ? updated : item,
          ),
          mutating: false,
          error: null,
        }));
        return updated;
      } catch (error) {
        const mapped = mapSubscriptionError(error);
        set({ mutating: false, error: mapped.message });
        throw mapped;
      }
    },

    deleteSubscription: async (id) => {
      if (get().mutating) {
        throw new SubscriptionError(
          'CONFLICT',
          'Another save is already in progress.',
        );
      }

      set({ mutating: true, error: null });
      try {
        await deleteSubscriptionRemote(id);
        set((state) => ({
          subscriptions: state.subscriptions.filter((item) => item.id !== id),
          mutating: false,
          error: null,
        }));
      } catch (error) {
        const mapped = mapSubscriptionError(error);
        set({ mutating: false, error: mapped.message });
        throw mapped;
      }
    },

    getSubscription: (id) => {
      return get().subscriptions.find((item) => item.id === id);
    },

    getAllSubscriptions: () => {
      return get().subscriptions;
    },

    clearError: () => {
      set({ error: null });
    },
  }),
);

/** Imperative helpers for non-hook call sites. */
export function getSubscriptionById(id: string): Subscription | undefined {
  return useSubscriptionStore.getState().getSubscription(id);
}
