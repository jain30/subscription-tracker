import { useContext } from 'react';

import { ThemeContext, type ThemeContextValue } from './ThemeProvider';
import type { AppTheme } from './theme';

/**
 * Access the design system from any component under `ThemeProvider`.
 *
 * @example
 * const { theme, reduceMotion } = useTheme();
 * <Text style={[theme.typography.title1, { color: theme.colors.text.primary }]} />
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context == null) {
    throw new Error(
      'useTheme() must be used within a <ThemeProvider>. Wrap your root layout first.',
    );
  }

  return context;
}

/**
 * Convenience hook when only token values are needed.
 */
export function useAppTheme(): AppTheme {
  return useTheme().theme;
}
