import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/**
 * Shared per-tab stack shell.
 * Each tab owns an independent stack so pushed screens (details, edit, etc.)
 * preserve state when switching tabs.
 */
export function TabStackLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg.app },
        animation: 'fade',
      }}
    />
  );
}
