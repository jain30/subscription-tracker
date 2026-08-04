/**
 * Motion tokens — Phase 3 UI/UX Blueprint §1.10
 *
 * Three signature patterns only. Always respect Reduce Motion
 * (opacity-only or instant when `reduceMotion` is true).
 */

export const motion = {
  duration: {
    /** Button / row press feedback */
    press: 120,
    /** Interactive micro-interactions */
    fast: 150,
    /** Default interactive */
    normal: 200,
    /** Screen enter settle */
    enter: 250,
    /** Upper bound for interactive */
    slow: 300,
    /** Page / modal transitions */
    transition: 350,
    /** Hard ceiling for page transitions */
    transitionMax: 400,
    /** Highlight fade (e.g. deep-link row) */
    highlight: 800,
  },
  /**
   * Screen enter: fade + upward settle (px).
   */
  enter: {
    duration: 250,
    translateY: 10,
  },
  /**
   * Value / amount change crossfade.
   */
  valueChange: {
    duration: 200,
  },
  /**
   * Compact success confirmation after save.
   */
  success: {
    duration: 280,
  },
  /**
   * Easing labels — map to Reanimated / Animated curves in UI code.
   * `decelerate` for enters; `accelerate` for exits.
   */
  easing: {
    enter: 'decelerate' as const,
    exit: 'accelerate' as const,
    standard: 'standard' as const,
  },
} as const;

export type Motion = typeof motion;
