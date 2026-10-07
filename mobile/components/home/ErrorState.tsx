import { View, type StyleProp, type ViewStyle } from 'react-native';
import { CloudOff } from 'lucide-react-native';

import { AppButton, AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type ErrorStateProps = {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  helpLabel?: string;
  onHelp?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Full-page recoverable failure. Calm copy — no stack traces.
 */
export function ErrorState({
  title = 'Couldn’t refresh right now',
  description = 'Something went wrong loading your Home. Please try again.',
  retryLabel = 'Retry',
  onRetry,
  helpLabel = 'Get help',
  onHelp,
  style,
}: ErrorStateProps) {
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="alert"
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
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          width: theme.spacing[16],
          height: theme.spacing[16],
          borderRadius: theme.radius.xl,
          backgroundColor: theme.colors.bg.subtle,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing[2],
        }}
      >
        <CloudOff
          size={theme.icons.size.xl}
          strokeWidth={theme.icons.strokeWidth.default}
          color={theme.colors.text.secondary}
        />
      </View>

      <AppText variant="title2" color="primary" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText
        variant="callout"
        color="secondary"
        style={{ textAlign: 'center', maxWidth: 300 }}
      >
        {description}
      </AppText>

      <View
        style={{
          width: '100%',
          maxWidth: 300,
          gap: theme.layout.stackedCtaGap,
          marginTop: theme.spacing[4],
        }}
      >
        {onRetry ? (
          <AppButton
            variant="primary"
            fullWidth
            label={retryLabel}
            onPress={onRetry}
          />
        ) : null}
        {onHelp ? (
          <AppButton
            variant="ghost"
            fullWidth
            label={helpLabel}
            onPress={onHelp}
          />
        ) : null}
      </View>
    </View>
  );
}
