import { useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Plus } from 'lucide-react-native';

import { useTheme } from '@/theme';

export type FloatingActionButtonProps = {
  onPress?: () => void;
  accessibilityLabel?: string;
  /**
   * Distance from the bottom of the parent (tab scene) before spacing[3].
   * Default tab layouts already sit above the tab bar — leave 0.
   */
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Circular primary create control — soft float, spring press.
 */
export function FloatingActionButton({
  onPress,
  accessibilityLabel = 'Add subscription',
  bottomOffset = 0,
  style,
}: FloatingActionButtonProps) {
  const { theme, reduceMotion } = useTheme();
  const size = 58;
  const [scale] = useState(() => new Animated.Value(1));

  const fabShadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.brand.primary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.28,
          shadowRadius: 18,
        }
      : { elevation: 6 };

  const animatePress = (pressed: boolean) => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: pressed ? 0.9 : 1,
      friction: 5,
      tension: 260,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          end: theme.layout.screenPaddingX,
          bottom: bottomOffset + theme.spacing[3],
          transform: [{ scale }],
          borderRadius: theme.radius.full,
          ...fabShadow,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={theme.spacing[1]}
        onPressIn={() => animatePress(true)}
        onPressOut={() => animatePress(false)}
        style={({ pressed }) => ({
          width: size,
          height: size,
          borderRadius: theme.radius.full,
          backgroundColor: pressed
            ? theme.colors.brand.primaryPressed
            : theme.colors.brand.primary,
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Plus
          size={theme.icons.size.lg}
          strokeWidth={theme.icons.strokeWidth.emphasis}
          color={theme.colors.text.onBrand}
        />
      </Pressable>
    </Animated.View>
  );
}
