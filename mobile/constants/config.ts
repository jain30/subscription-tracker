/**
 * App-wide constants and configuration.
 * EXPO_PUBLIC_* values are inlined at build time by Expo.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export const APP_NAME = 'Subscription Tracker';
