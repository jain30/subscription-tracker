/**
 * Design system public API.
 *
 * Preferred imports for screens / components:
 *   import { ThemeProvider, useTheme, lightTheme } from '@/theme';
 *
 * Token modules are also re-exported for StyleSheet factories that cannot
 * call hooks (e.g. module-scope styles with `lightTheme`).
 */

export { ThemeProvider, ThemeContext } from './ThemeProvider';
export type { ThemeContextValue } from './ThemeProvider';

export { useTheme, useAppTheme } from './useTheme';

export { lightTheme, themes } from './theme';
export type { AppTheme, ThemeMode } from './theme';

export { fontAssets } from './fonts';

export { colors, palette } from './tokens/colors';
export type { Colors, CategoryKey, StatusKey } from './tokens/colors';

export { typography, fontFamily } from './tokens/typography';
export type {
  Typography,
  TypographyKey,
  FontFamily,
} from './tokens/typography';

export { spacing } from './tokens/spacing';
export type { Spacing, SpacingKey } from './tokens/spacing';

export { radius } from './tokens/radius';
export type { Radius, RadiusKey } from './tokens/radius';

export { elevation, getElevation } from './tokens/elevation';
export type { Elevation, ElevationLevel } from './tokens/elevation';

export { icons, iconSize } from './tokens/icons';
export type { Icons, IconSizeKey } from './tokens/icons';

export { layout } from './tokens/layout';
export type { Layout } from './tokens/layout';

export { motion } from './tokens/motion';
export type { Motion } from './tokens/motion';
