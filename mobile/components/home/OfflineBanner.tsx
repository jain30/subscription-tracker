import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { WifiOff } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type OfflineBannerProps = {
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Persistent offline / stale-data notice. Calm, non-alarmist.
 */
export function OfflineBanner({
  message = 'You’re offline. Showing last updated data.',
  retryLabel = 'Retry',
  onRetry,
  style,
}: OfflineBannerProps) {
  const { theme, reduceMotion } = useTheme();
  const [opacity] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));
  const [translateY] = useState(
    () => new Animated.Value(reduceMotion ? 0 : -6),
  );

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: theme.motion.duration.enter,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: theme.motion.duration.enter,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, reduceMotion, theme.motion.duration.enter, translateY]);

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: theme.colors.bg.surface,
          borderRadius: theme.radius.lg,
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    >
      <View
        style={{
          width: theme.spacing[8],
          height: theme.spacing[8],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.bg.subtle,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WifiOff
          size={theme.icons.size.sm}
          strokeWidth={theme.icons.strokeWidth.default}
          color={theme.colors.text.secondary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="footnote" color="secondary">
          {message}
        </AppText>
      </View>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          hitSlop={theme.spacing[2]}
          style={({ pressed }) => ({
            minHeight: theme.layout.touchTargetMin,
            minWidth: theme.layout.touchTargetMin,
            justifyContent: 'center',
            paddingHorizontal: theme.spacing[2],
            borderRadius: theme.radius.sm,
            backgroundColor: pressed ? theme.colors.brand.soft : 'transparent',
          })}
        >
          <AppText variant="subhead" color="brand">
            {retryLabel}
          </AppText>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
