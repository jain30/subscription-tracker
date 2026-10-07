import { storage, STORAGE_KEYS } from '@/services/storage';

/**
 * Phase 17 Step 4 — AsyncStorage is no longer the subscription database.
 * One-time cleanup of the retired local multi-user blob.
 */
export async function retireLocalSubscriptionPersistence(): Promise<void> {
  try {
    await storage.removeItem(STORAGE_KEYS.subscriptions);
  } catch {
    // Best-effort; never block cloud hydration.
  }
}
