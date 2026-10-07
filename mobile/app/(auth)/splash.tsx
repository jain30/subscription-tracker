import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { BrandMark } from '@/components/auth';
import {
  APP_NAME,
  SPLASH_DURATION_MS,
  useAuthStore,
} from '@/features/auth';
import { useTheme } from '@/theme';

/**
 * Brand splash — waits for real Supabase auth initialization before routing.
 */
export default function SplashScreen() {
  const { theme, reduceMotion } = useTheme();
  const session = useAuthStore((state) => state.session);
  const passwordRecoveryPending = useAuthStore(
    (state) => state.passwordRecoveryPending,
  );
  const onboardingCompleted = useAuthStore(
    (state) => state.onboardingCompleted,
  );
  const hydrated = useAuthStore((state) => state.hydrated);
  const hydrate = useAuthStore((state) => state.hydrate);

  const [opacity] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));
  const navigatedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (startedAtRef.current == null) {
      startedAtRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }

    const fadeIn = Animated.timing(opacity, {
      toValue: 1,
      duration: theme.motion.duration.transition,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    fadeIn.start();
    return () => fadeIn.stop();
  }, [opacity, reduceMotion, theme.motion.duration.transition]);

  useEffect(() => {
    if (!hydrated || navigatedRef.current) {
      return;
    }

    const startedAt = startedAtRef.current ?? Date.now();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, SPLASH_DURATION_MS - elapsed);

    const timer = setTimeout(() => {
      if (navigatedRef.current) {
        return;
      }
      navigatedRef.current = true;

      if (passwordRecoveryPending) {
        router.replace('/(auth)/reset-password');
        return;
      }

      if (session) {
        router.replace('/(tabs)/home');
        return;
      }

      if (!onboardingCompleted) {
        router.replace('/(auth)/onboarding');
        return;
      }

      router.replace('/(auth)/welcome');
    }, remaining);

    return () => clearTimeout(timer);
  }, [hydrated, onboardingCompleted, passwordRecoveryPending, session]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.colors.bg.app, theme.colors.bg.brandWash]}
        locations={[0.35, 1]}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      <Animated.View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          paddingHorizontal: theme.layout.screenPaddingX,
        }}
      >
        <BrandMark showWordmark size="xl" />
        <View
          style={{
            position: 'absolute',
            bottom: theme.spacing[16],
            flexDirection: 'row',
            gap: theme.spacing[2],
          }}
          accessibilityLabel={`${APP_NAME} is loading`}
        >
          {[0, 1, 2].map((index) => (
            <View
              key={`splash-dot-${index}`}
              style={{
                width: 6,
                height: 6,
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.brand.soft,
              }}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
