import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

export type AppBadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

export type AppBadgeProps = {
  label: string;
  variant?: AppBadgeVariant;
  style?: StyleProp<ViewStyle>;
};

/**
 * Status / meta chip. Color is never the only signal — label is required.
 */
export function AppBadge({
  label,
  variant = 'neutral',
  style,
}: AppBadgeProps) {
  const { theme } = useTheme();

  const tones: Record<
    AppBadgeVariant,
    { backgroundColor: string; color: 'success' | 'warning' | 'danger' | 'secondary' }
  > = {
    success: {
      backgroundColor: theme.colors.brand.soft,
      color: 'success',
    },
    warning: {
      backgroundColor: theme.colors.status.dueSoon,
      color: 'warning',
    },
    danger: {
      backgroundColor: theme.colors.status.overdue,
      color: 'danger',
    },
    neutral: {
      backgroundColor: theme.colors.bg.subtle,
      color: 'secondary',
    },
  };

  const tone = tones[variant];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: tone.backgroundColor,
          borderRadius: theme.radius.sm,
          paddingHorizontal: theme.spacing[2],
          paddingVertical: theme.spacing[1],
        },
        style,
      ]}
    >
      <AppText variant="caption" color={tone.color}>
        {label}
      </AppText>
    </View>
  );
}
