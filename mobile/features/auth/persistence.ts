import { storage, STORAGE_KEYS } from '@/services/storage';

/**
 * Device-local preference persistence only.
 * Auth session / user registry are owned by Supabase — never reconstructed here.
 */

export async function loadOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await storage.getItem(STORAGE_KEYS.onboardingCompleted);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function saveOnboardingCompleted(): Promise<void> {
  await storage.setItem(STORAGE_KEYS.onboardingCompleted, 'true');
}

/**
 * One-time cleanup of retired mock auth keys from Phase 15/15.1.
 * Safe to call on every hydrate — removes stale local identity artifacts.
 */
export async function retireMockAuthPersistence(): Promise<void> {
  try {
    await Promise.all([
      storage.removeItem(STORAGE_KEYS.authSession),
      storage.removeItem(STORAGE_KEYS.users),
    ]);
  } catch {
    // Best-effort cleanup; never block auth initialization.
  }
}
