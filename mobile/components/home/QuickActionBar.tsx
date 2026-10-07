import type { ComponentType } from 'react';
import { useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { LucideProps } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type QuickActionItem = {
  key: string;
  label: string;
  Icon: ComponentType<LucideProps>;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
};

export type QuickActionBarProps = {
  /** Max 3 actions — Home populated uses Templates + Reminders only */
  actions: QuickActionItem[];
  title?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Premium shortcut cards — soft icon wells, gentle press, floating surface.
 */
export function QuickActionBar({
  actions,
  title = 'Quick actions',
  style,
}: QuickActionBarProps) {
  const { theme, reduceMotion } = useTheme();
  const visible = actions.slice(0, 3);

  if (visible.length === 0) {
    return null;
  }

  const cardShadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
        }
      : { elevation: 2 };

  return (
    <View style={style}>
      <AppText
        variant="caption"
        color="tertiary"
        style={{
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </AppText>

      <View
        style={{
          marginTop: theme.spacing[3],
          flexDirection: 'row',
          gap: theme.spacing[3],
        }}
      >
        {visible.map((action) => (
          <QuickActionTile
            key={action.key}
            action={action}
            cardShadow={cardShadow}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>
    </View>
  );
}

type QuickActionTileProps = {
  action: QuickActionItem;
  cardShadow: ViewStyle;
  reduceMotion: boolean;
};

function QuickActionTile({
  action,
  cardShadow,
  reduceMotion,
}: QuickActionTileProps) {
  const { theme } = useTheme();
  const [scale] = useState(() => new Animated.Value(1));
  const iconColor = action.disabled
    ? theme.colors.text.tertiary
    : theme.colors.brand.primary;

  const animatePress = (pressed: boolean) => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: pressed ? 0.96 : 1,
      friction: 6,
      tension: 240,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={action.onPress}
        disabled={action.disabled || action.onPress == null}
        accessibilityRole="button"
        accessibilityLabel={action.label}
        accessibilityHint={action.accessibilityHint}
        accessibilityState={{ disabled: Boolean(action.disabled) }}
        onPressIn={() => animatePress(true)}
        onPressOut={() => animatePress(false)}
        style={{
          minHeight: 112,
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing[3],
          paddingVertical: theme.spacing[5],
          paddingHorizontal: theme.spacing[3],
          borderRadius: theme.radius.xl,
          backgroundColor: theme.colors.bg.surface,
          opacity: action.disabled ? 0.5 : 1,
          ...cardShadow,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: theme.colors.brand.soft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <action.Icon
            size={theme.icons.size.lg}
            strokeWidth={theme.icons.strokeWidth.default}
            color={iconColor}
          />
        </View>
        <AppText
          variant="subhead"
          color="secondary"
          style={{ textAlign: 'center' }}
        >
          {action.label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}
