import { Platform, type ViewStyle } from 'react-native';

import { palette } from './colors';

/**
 * Elevation / shadow tokens — Phase 3 UI/UX Blueprint §1.7
 *
 * Prefer surface + border for most UI. Shadows are reserved for FAB,
 * sticky bars, and modals/sheets. Platform-aware (iOS shadows / Android elevation).
 */

type ElevationLevel = 0 | 1 | 2 | 3;

const shadowInk = palette.ink;

/**
 * Soft cool-ink shadows — large blur, modest offset, low opacity.
 * Level 1 ~5%, Level 2 ~8%, Level 3 ~12%.
 */
const iosShadows: Record<ElevationLevel, ViewStyle> = {
  0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  1: {
    shadowColor: shadowInk,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  2: {
    shadowColor: shadowInk,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  3: {
    shadowColor: shadowInk,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 36,
  },
};

const androidElevation: Record<ElevationLevel, ViewStyle> = {
  0: { elevation: 0 },
  1: { elevation: 2 },
  2: { elevation: 5 },
  3: { elevation: 10 },
};

/**
 * Returns platform-appropriate shadow/elevation styles for a given level.
 */
export function getElevation(level: ElevationLevel): ViewStyle {
  if (Platform.OS === 'android') {
    return androidElevation[level];
  }
  return iosShadows[level];
}

/**
 * Precomputed elevation styles for common surfaces.
 * Level 0 is intentionally empty — use `colors.border` instead.
 */
export const elevation = {
  /** Flat lists / most UI — border only, no shadow */
  none: getElevation(0),
  /** Interactive cards (rare) */
  card: getElevation(1),
  /** FAB / sticky bars */
  raised: getElevation(2),
  /** Modals / sheets */
  modal: getElevation(3),
  get: getElevation,
} as const;

export type Elevation = typeof elevation;
export type { ElevationLevel };
