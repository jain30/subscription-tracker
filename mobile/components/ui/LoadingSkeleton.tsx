import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

export type LoadingSkeletonVariant = 'text' | 'title' | 'avatar' | 'row' | 'card';

export type LoadingSkeletonProps = {
  variant?: LoadingSkeletonVariant;
  /** Repeat count for stacked placeholders (text/title/row) */
  count?: number;
  width?: number | `${number}%`;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Layout-faithful loading placeholder with a soft shimmer.
 * Prefer skeletons over full-screen spinners.
 */
export function LoadingSkeleton({
  variant = 'text',
  count = 1,
  width,
  height,
  style,
}: LoadingSkeletonProps) {
  const { theme, reduceMotion } = useTheme();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(0.7);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity, reduceMotion]);

  const dimensions = resolveDimensions(variant, theme, width, height);
  const itemCount = Math.max(1, count);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={[{ width: '100%' }, style]}
    >
      {Array.from({ length: itemCount }, (_, index) => (
        <Animated.View
          key={`skeleton-${variant}-${index}`}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            {
              opacity,
              backgroundColor: theme.colors.bg.subtle,
              borderRadius:
                variant === 'avatar' ? theme.radius.full : theme.radius.lg,
              width: dimensions.width,
              height: dimensions.height,
              marginBottom:
                index < itemCount - 1
                  ? variant === 'row'
                    ? theme.spacing[2]
                    : theme.spacing[2]
                  : 0,
            },
            variant === 'row' && {
              alignSelf: 'stretch',
              width: '100%' as const,
            },
            variant === 'card' && {
              alignSelf: 'stretch',
              width: '100%' as const,
            },
          ]}
        />
      ))}
    </View>
  );
}

function resolveDimensions(
  variant: LoadingSkeletonVariant,
  theme: ReturnType<typeof useTheme>['theme'],
  width?: number | `${number}%`,
  height?: number,
): { width: number | `${number}%`; height: number } {
  switch (variant) {
    case 'title':
      return {
        width: width ?? '70%',
        height: height ?? theme.typography.title2.lineHeight,
      };
    case 'avatar':
      return {
        width: width ?? theme.spacing[10],
        height: height ?? theme.spacing[10],
      };
    case 'row':
      return {
        width: width ?? '100%',
        height: height ?? theme.layout.listRowHeight,
      };
    case 'card':
      return {
        width: width ?? '100%',
        height: height ?? theme.spacing[16] + theme.spacing[10],
      };
    case 'text':
    default:
      return {
        width: width ?? '100%',
        height: height ?? theme.typography.body.lineHeight,
      };
  }
}
