/**
 * Border radius tokens — Phase 3 UI/UX Blueprint §1.6
 *
 * Avoid `full` except for avatars. Primary buttons use `md`, not pills.
 */

export const radius = {
  /** 8 — chips, inputs */
  sm: 8,
  /** 12 — buttons, list rows */
  md: 12,
  /** 16 — cards, tiles */
  lg: 16,
  /** 24 — sheets, large containers */
  xl: 24,
  /** 999 — avatars only (sparingly) */
  full: 999,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof typeof radius;
