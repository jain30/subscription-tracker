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
          paddingVertical: theme.spacing[10],
          paddingHorizontal: theme.spacing[4],
          gap: theme.spacing[4],
        },
        style,
      ]}
    >
      {illustration ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ marginBottom: theme.spacing[2] }}
        >
          {illustration}
        </View>
      ) : null}

      <AppText
        variant="title2"
        color="primary"
        style={{ textAlign: 'center' }}
      >
        {title}
      </AppText>

      {description ? (
        <AppText
          variant="callout"
          color="secondary"
          style={{ textAlign: 'center', maxWidth: 320 }}
        >
          {description}
        </AppText>
      ) : null}

      {action || secondaryAction ? (
        <View
          style={{
            width: '100%',
            maxWidth: 320,
            gap: theme.layout.stackedCtaGap,
            marginTop: theme.spacing[2],
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
