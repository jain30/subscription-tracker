import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/**
 * Subscriptions stack — list (`index`) is always the root screen.
 * Create / Detail / Edit push above the list and never replace it as the tab root.
 */
export default function SubscriptionsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.bg.app },
        animation: 'fade',
      }}
    />
  );
}
