/**
 * Platform entry for Supabase auth storage.
 *
 * Metro resolves:
 * - authStorage.native.ts on iOS/Android (SecureStore + encrypted AsyncStorage)
 * - authStorage.web.ts on web (browser localStorage)
 *
 * This file exists so TypeScript module resolution has a stable path.
 * Runtime bundlers prefer the platform-specific files above.
 */
export { authStorage } from './authStorage.native';
