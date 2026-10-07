import { useState } from 'react';
import {
  Animated,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppBadge, AppText } from '@/components/ui';
import { useTheme, type CategoryKey } from '@/theme';

export type SubscriptionRowProps = {
  name: string;
  /** Formatted amount, e.g. "$15.99" */
  amount: string;
  /** Relative due label, e.g. "Tomorrow" */
  relativeDue: string;
  /** Billing cycle label, e.g. "Monthly" */
  cycle: string;
  /** Show "Due soon" badge (≤ 3 days) — always paired with date text */
  dueSoon?: boolean;
  /** Optional category accent for monogram wash */
  accentKey?: CategoryKey;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ACCENT_KEYS: CategoryKey[] = [
  'entertainment',
  'music',
  'video_streaming',
  'cloud_storage',
  'productivity',
  'education',
  'fitness',
  'health',
  'gaming',
  'shopping',
  'finance',
  'ai_tools',
  'other',
];

function resolveAccentKey(name: string, accentKey?: CategoryKey): CategoryKey {
  if (accentKey) {
    return accentKey;
  }
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % 2147483647;
  }
  return ACCENT_KEYS[Math.abs(hash) % ACCENT_KEYS.length];
}

/**
 * Flat list row for upcoming / subscription previews.
 * Amounts trail-align; monogram wash for identity.
 */
export function SubscriptionRow({
  name,
  amount,
  relativeDue,
  cycle,
  dueSoon = false,
  accentKey,
  onPress,
  style,
}: SubscriptionRowProps) {
  const { theme, reduceMotion } = useTheme();
  const [scale] = useState(() => new Animated.Value(1));
  const meta = `${relativeDue} · ${cycle}`;
  const accessibilityLabel = dueSoon
    ? `${name}, ${amount}, ${meta}, Due soon`
    : `${name}, ${amount}, ${meta}`;
  const monogram = name.trim().charAt(0).toUpperCase() || '?';
  const resolvedAccent = resolveAccentKey(name, accentKey);
  const avatarSize = theme.spacing[10];

  const animatePress = (pressed: boolean) => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: pressed ? 0.985 : 1,
      friction: 7,
      tension: 220,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        disabled={onPress == null}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPressIn={() => animatePress(true)}
        onPressOut={() => animatePress(false)}
        style={({ pressed }) => ({
          minHeight: theme.layout.listRowHeight,
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[1],
          marginHorizontal: -theme.spacing[1],
          borderRadius: theme.radius.lg,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
          backgroundColor: pressed ? theme.colors.bg.subtle : 'transparent',
        })}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.category[resolvedAccent],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText
            variant="title3"
            color="primary"
            style={{ fontFamily: theme.fontFamily.sans.semibold }}
          >
            {monogram}
          </AppText>
        </View>

        <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
          <AppText variant="title3" color="primary" numberOfLines={1}>
            {name}
          </AppText>
          <AppText variant="footnote" color="secondary" numberOfLines={1}>
            {meta}
          </AppText>
        </View>

        <View style={{ alignItems: 'flex-end', gap: theme.spacing[1] }}>
          <AppText variant="amountMd" color="primary">
            {amount}
          </AppText>
          {dueSoon ? <AppBadge label="Due soon" variant="warning" /> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}
