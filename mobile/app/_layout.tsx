import 'react-native-gesture-handler';

import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { View } from 'react-native';

import { AuthError, useAuthStore } from '@/features/auth';
import { ThemeProvider, useTheme } from '@/theme';

/**
 * Root layout — application shell.
 *
 * Structure:
 * - ThemeProvider
 * - Supabase auth hydrate + single auth URL listener
 * - Root Stack: entry index, (auth) group, (tabs) protected shell
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { theme, fontsLoaded } = useTheme();
  const hydrate = useAuthStore((state) => state.hydrate);
  const handleAuthUrl = useAuthStore((state) => state.handleAuthUrl);
  const router = useRouter();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const processedUrls = new Set<string>();

    const processUrl = async (url: string | null) => {
      if (!url || processedUrls.has(url)) {
        return;
      }
      processedUrls.add(url);
      try {
        const handled = await handleAuthUrl(url);
        if (handled) {
          const recovery = useAuthStore.getState().passwordRecoveryPending;
          if (recovery) {
            router.replace('/(auth)/reset-password');
          }
        }
      } catch (error) {
        const message =
          error instanceof AuthError
            ? error.message
            : 'This reset link is invalid or has expired. Request a new one or enter your recovery code.';
        router.replace({
          pathname: '/(auth)/reset-password',
          params: { error: message },
        });
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      void processUrl(url);
    });

    void Linking.getInitialURL().then((url) => {
      void processUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleAuthUrl, router]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg.app }} />
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg.app },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
