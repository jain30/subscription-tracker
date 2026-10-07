import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type SocialAuthButtonProps = {
  label: string;
  Icon: LucideIcon;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Placeholder social auth CTA — no provider wiring yet.
 */
export function SocialAuthButton({
  label,
  Icon,
  onPress,
  style,
}: SocialAuthButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          minHeight: 50,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: pressed
            ? theme.colors.bg.subtle
            : theme.colors.bg.surface,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[4],
          opacity: pressed ? 0.92 : 1,
        },
        style,
      ]}
    >
      <Icon
        size={theme.icons.size.md}
        strokeWidth={theme.icons.strokeWidth.default}
        color={theme.colors.text.primary}
      />
      <AppText variant="buttonSm" color="primary">
        {label}
      </AppText>
    </Pressable>
  );
}

export type AuthFooterLinkProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Footer prompt + text action (e.g. Already have an account? Log In).
 */
export function AuthFooterLink({
  prompt,
  actionLabel,
  onPress,
  style,
}: AuthFooterLinkProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: theme.spacing[1],
          paddingVertical: theme.spacing[2],
        },
        style,
      ]}
    >
      <AppText variant="callout" color="secondary">
        {prompt}
      </AppText>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        hitSlop={theme.spacing[2]}
      >
        <AppText variant="bodyStrong" color="brand">
          {actionLabel}
        </AppText>
      </Pressable>
    </View>
  );
}

export type AuthDividerProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function AuthDivider({ label = 'or', style }: AuthDividerProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.border,
        }}
      />
      <AppText variant="caption" color="tertiary">
        {label}
      </AppText>
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.border,
        }}
      />
    </View>
  );
}

export type AuthFormCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Elevated surface for auth forms.
 */
export function AuthFormCard({ children, style }: AuthFormCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.bg.surface,
          borderRadius: theme.radius.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing[5],
          gap: theme.layout.formFieldGap,
          ...theme.elevation.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
