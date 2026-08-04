/**
 * Assembled application theme.
 *
 * Import `lightTheme` for static StyleSheet factories, or `useTheme()` inside
 * components for the live theme + runtime flags (fontsLoaded, reduceMotion).
 */

import { colors, type Colors } from './tokens/colors';
import { elevation, type Elevation } from './tokens/elevation';
import { icons, type Icons } from './tokens/icons';
import { layout, type Layout } from './tokens/layout';
import { motion, type Motion } from './tokens/motion';
import { radius, type Radius } from './tokens/radius';
import { spacing, type Spacing } from './tokens/spacing';
import {
  fontFamily,
  typography,
  type FontFamily,
  type Typography,
} from './tokens/typography';

export type ThemeMode = 'light';

export type AppTheme = {
  mode: ThemeMode;
  colors: Colors;
  typography: Typography;
  fontFamily: FontFamily;
  spacing: Spacing;
  radius: Radius;
  elevation: Elevation;
  icons: Icons;
  layout: Layout;
  motion: Motion;
};

/**
 * Light theme — MVP brand theme (Phase 2/3).
 * Dark mode ships only when a true brand dark palette is designed.
 */
export const lightTheme: AppTheme = {
  mode: 'light',
  colors,
  typography,
  fontFamily,
  spacing,
  radius,
  elevation,
  icons,
  layout,
  motion,
};

export const themes = {
  light: lightTheme,
} as const;
