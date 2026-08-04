import { spacing } from './spacing';

/**
 * Layout constants derived from the spacing scale and Phase 3 rules.
 * Keeps screen padding, row heights, and touch targets consistent.
 */

export const layout = {
  /** Screen horizontal padding — `space.5` (20) */
  screenPaddingX: spacing[5],
  /** Preferred vertical section gap — `space.8` (32) */
  sectionGap: spacing[8],
  /** Minimum section gap — `space.6` (24) */
  sectionGapMin: spacing[6],
  /** Form field vertical gap — `space.4` (16) */
  formFieldGap: spacing[4],
  /** Between stacked CTAs — `space.3` (12) */
  stackedCtaGap: spacing[3],
  /** List row minimum height */
  listRowMinHeight: 56,
  /** Comfortable list row height */
  listRowHeight: 64,
  /** Minimum touch target (Apple HIG) */
  touchTargetMin: 44,
  /** Preferred Android touch target */
  touchTargetComfortable: 48,
  /** Minimum spacing between adjacent targets */
  touchTargetGap: spacing[2],
} as const;

export type Layout = typeof layout;
