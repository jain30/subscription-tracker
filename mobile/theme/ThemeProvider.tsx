import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useFonts } from 'expo-font';
import { AccessibilityInfo } from 'react-native';

import { fontAssets } from './fonts';
import { lightTheme, type AppTheme, type ThemeMode } from './theme';

export type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
  /** True once brand fonts have finished loading */
  fontsLoaded: boolean;
  /** OS Reduce Motion preference — animations must honor this */
  reduceMotion: boolean;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  /** Defaults to light; dark is reserved until a brand dark theme exists */
  mode?: ThemeMode;
}>;

/**
 * Provides design tokens app-wide and loads brand fonts.
 *
 * Wrap the root layout with this provider before any themed UI.
 * Does not implement screens or navigation — foundation only.
 */
export function ThemeProvider({
  children,
  mode = 'light',
}: ThemeProviderProps) {
  const [fontsLoaded] = useFonts(fontAssets);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setReduceMotion(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  // Dark mode intentionally maps to light until a brand dark palette ships.
  const theme: AppTheme = lightTheme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      fontsLoaded: Boolean(fontsLoaded),
      reduceMotion,
    }),
    [theme, mode, fontsLoaded, reduceMotion],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
