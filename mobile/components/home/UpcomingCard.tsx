import { useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/components/ui';
import { useTheme, type CategoryKey } from '@/theme';

export type UpcomingCardProps = {
  name: string;
  amount: string;
  relativeDue: string;
  cycle: string;
  dueSoon?: boolean;
  /** Chargeable but auto-renew off — still an upcoming charge. */
  nonAutoRenew?: boolean;
  isTrial?: boolean;
  overdue?: boolean;
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
 * Wallet-style upcoming subscription surface for Home.
 */
export function UpcomingCard({
  name,
  amount,
  relativeDue,
  cycle,
  dueSoon = false,
  nonAutoRenew = false,
  isTrial = false,
  overdue = false,
  accentKey,
  onPress,
  style,
}: UpcomingCardProps) {
  const { theme, reduceMotion } = useTheme();
  const [scale] = useState(() => new Animated.Value(1));
  const metaParts = [relativeDue, cycle];
  if (isTrial) {
    metaParts.push('Trial');
  }
  if (nonAutoRenew) {
    metaParts.push('Manual renew');
  }
  const meta = metaParts.join(' · ');
  const badgeLabel = overdue
    ? 'Overdue'
    : dueSoon
      ? 'Due soon'
      : isTrial
        ? 'Trial'
        : null;
  const accessibilityLabel = [name, amount, meta, badgeLabel]
    .filter(Boolean)
    .join(', ');
  const monogram = name.trim().charAt(0).toUpperCase() || '?';
  const resolvedAccent = resolveAccentKey(name, accentKey);
  const iconSize = 48;
  const accent = theme.colors.category[resolvedAccent];

  const cardShadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 14,
        }
      : { elevation: 2 };

  const iconShadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
        }
      : { elevation: 1 };

  const animatePress = (pressed: boolean) => {
    if (reduceMotion) {
      return;
    }
    Animated.spring(scale, {
      toValue: pressed ? 0.978 : 1,
      friction: 7,
      tension: 240,
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
          backgroundColor: pressed
            ? theme.colors.bg.subtle
            : theme.colors.bg.surface,
          borderRadius: theme.radius.xl,
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
          ...cardShadow,
        })}
      >
        <View style={[{ borderRadius: 14 }, iconShadow]}>
          <LinearGradient
            colors={[accent, theme.colors.bg.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText
              variant="title3"
              color="primary"
              style={{
                fontFamily: theme.fontFamily.sans.semibold,
                fontSize: 18,
                lineHeight: 22,
              }}
            >
              {monogram}
            </AppText>
          </LinearGradient>
        </View>

        <View style={{ flex: 1, gap: 3, minWidth: 0 }}>
          <AppText
            variant="title3"
            color="primary"
            numberOfLines={1}
            style={{ fontFamily: theme.fontFamily.sans.semibold }}
          >
            {name}
          </AppText>
          <AppText variant="footnote" color="tertiary" numberOfLines={1}>
            {meta}
          </AppText>
        </View>

        <View style={{ alignItems: 'flex-end', gap: theme.spacing[1] }}>
          <AppText
            variant="amountMd"
            color="primary"
            style={{
              fontFamily: theme.fontFamily.sans.bold,
              fontSize: 17,
            }}
          >
            {amount}
          </AppText>
          {badgeLabel ? (
            <View
              style={{
                paddingHorizontal: theme.spacing[2],
                paddingVertical: 3,
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.status.dueSoon,
              }}
            >
              <AppText
                variant="caption"
                color="warning"
                style={{
                  fontSize: 10,
                  lineHeight: 12,
                  letterSpacing: 0.2,
                }}
              >
                {badgeLabel}
              </AppText>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}
