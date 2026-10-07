import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { AppButton, type AppButtonProps } from './AppButton';
import { AppText } from './AppText';

export type EmptyStateProps = {
  /** Optional illustration / icon node (decorative — hidden from a11y tree) */
  illustration?: ReactNode;
  title: string;
  description?: string;
  /** Primary CTA — omit when empty state is informational only */
  action?: Pick<AppButtonProps, 'label' | 'onPress' | 'loading' | 'disabled'>;
  /** Secondary text action */
  secondaryAction?: Pick<AppButtonProps, 'label' | 'onPress' | 'disabled'>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Zero-data / zero-match state with warm copy and a clear next action.
 */
export function EmptyState({
  illustration,
  title,
  description,
  action,
  secondaryAction,
  style,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="summary"
      style={[
        {
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: theme.spacing[12],
          paddingHorizontal: theme.spacing[5],
          gap: theme.spacing[3],
        },
        style,
      ]}
    >
      {illustration ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: theme.spacing[16] + theme.spacing[4],
            height: theme.spacing[16] + theme.spacing[4],
            borderRadius: theme.radius.xl,
            backgroundColor: theme.colors.bg.brandWash,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing[3],
            borderWidth: 1,
            borderColor: theme.colors.brand.soft,
          }}
        >
          {illustration}
        </View>
      ) : null}

      <AppText
        variant="display"
        color="primary"
        style={{ textAlign: 'center', fontSize: 28, lineHeight: 34 }}
      >
        {title}
      </AppText>

      {description ? (
        <AppText
          variant="callout"
          color="secondary"
          style={{ textAlign: 'center', maxWidth: 300 }}
        >
          {description}
        </AppText>
      ) : null}

      {action || secondaryAction ? (
        <View
          style={{
            width: '100%',
            maxWidth: 300,
            gap: theme.layout.stackedCtaGap,
            marginTop: theme.spacing[5],
          }}
        >
          {action ? (
            <AppButton
              variant="primary"
              fullWidth
              label={action.label}
              onPress={action.onPress}
              loading={action.loading}
              disabled={action.disabled}
            />
          ) : null}
          {secondaryAction ? (
            <AppButton
              variant="ghost"
              fullWidth
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              disabled={secondaryAction.disabled}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
