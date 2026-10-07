import { Stack } from 'expo-router';

import { useTheme } from '@/theme';

/**
 * Authentication stack — splash, onboarding, welcome, and credential screens.
 */
export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: theme.colors.bg.app },
      }}
    >
      <Stack.Screen name="splash" options={{ animation: 'none' }} />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen
        name="register"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
