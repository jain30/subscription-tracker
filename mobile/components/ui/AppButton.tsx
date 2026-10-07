import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

export type AppButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive';

export type AppButtonSize = 'sm' | 'md' | 'lg';

export type AppButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  /** Full-width CTA (forms, sheets) */
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Primary action control. One primary CTA per view.
 * Uses `radius.md` — not stadium pills.
 */
export function AppButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  ...rest
}: AppButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const heights: Record<AppButtonSize, number> = {
    sm: theme.layout.touchTargetMin,
    md: 50,
    lg: 54,
  };

  const horizontalPadding: Record<AppButtonSize, number> = {
    sm: theme.spacing[3],
    md: theme.spacing[5],
    lg: theme.spacing[6],
  };

  const textVariant = size === 'sm' ? 'buttonSm' : 'button';

  const paletteByVariant = {
    primary: {
      bg: theme.colors.brand.primary,
      bgPressed: theme.colors.brand.primaryPressed,
      bgDisabled: theme.colors.brand.soft,
      text: 'onBrand' as const,
      border: 'transparent',
      borderWidth: 0,
    },
    secondary: {
      bg: theme.colors.bg.surface,
      bgPressed: theme.colors.bg.subtle,
      bgDisabled: theme.colors.bg.subtle,
      text: 'primary' as const,
      border: theme.colors.border,
      borderWidth: 1,
    },
    ghost: {
      bg: 'transparent',
      bgPressed: theme.colors.brand.soft,
      bgDisabled: 'transparent',
      text: 'brand' as const,
      border: 'transparent',
      borderWidth: 0,
    },
    destructive: {
      bg: theme.colors.status.overdue,
      bgPressed: theme.colors.status.overdue,
      bgDisabled: theme.colors.bg.subtle,
      text: 'danger' as const,
      border: 'transparent',
      borderWidth: 0,
    },
  }[variant];

  const spinnerColor =
    variant === 'primary'
      ? theme.colors.text.inverse
      : variant === 'destructive'
        ? theme.colors.danger
        : theme.colors.brand.primary;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        {
          minHeight: heights[size],
          paddingHorizontal: horizontalPadding[size],
          borderRadius: theme.radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: theme.spacing[2],
          backgroundColor: isDisabled
            ? paletteByVariant.bgDisabled
            : pressed
              ? paletteByVariant.bgPressed
              : paletteByVariant.bg,
          borderWidth: paletteByVariant.borderWidth,
          borderColor: paletteByVariant.border,
          opacity: isDisabled
            ? 0.55
            : pressed && variant === 'destructive'
              ? 0.88
              : 1,
          transform: pressed && !isDisabled ? [{ scale: 0.985 }] : undefined,
          alignSelf: fullWidth ? 'stretch' : 'auto',
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <AppText
          variant={textVariant}
          color={
            isDisabled && variant === 'ghost' ? 'tertiary' : paletteByVariant.text
          }
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
