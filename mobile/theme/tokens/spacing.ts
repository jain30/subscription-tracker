/**
 * Spacing tokens — Phase 3 UI/UX Blueprint §1.5
 *
 * 4pt base grid. Prefer these keys over magic numbers in StyleSheet.
 */

export const spacing = {
  /** 0 */
  0: 0,
  /** 4 — hair gaps, icon padding */
  1: 4,
  /** 8 — compact related items */
  2: 8,
  /** 12 — between stacked CTAs */
  3: 12,
  /** 16 — form field gap; default inset */
  4: 16,
  /** 20 — screen horizontal padding */
  5: 20,
  /** 24 — section gap (min) */
  6: 24,
  /** 32 — section gap (preferred) */
  8: 32,
  /** 40 — large section breaks */
  10: 40,
  /** 48 — hero breathing room */
  12: 48,
  /** 64 — rare dramatic spacing */
  16: 64,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
