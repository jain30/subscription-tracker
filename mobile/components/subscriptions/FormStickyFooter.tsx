import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui';
import { useTheme } from '@/theme';

export type FormStickyFooterProps = {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  disabled?: boolean;
  loading?: boolean;
  cancelLabel?: string;
};

/**
 * Always-visible Cancel + Save footer for Create / Edit forms.
 * Safe-area aware; pair with KeyboardAvoidingView on the screen.
 */
export function FormStickyFooter({
  onCancel,
  onSubmit,
  submitLabel,
  disabled = false,
  loading = false,
  cancelLabel = 'Cancel',
}: FormStickyFooterProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.bg.surface,
        paddingHorizontal: theme.layout.screenPaddingX,
        paddingTop: theme.spacing[3],
        paddingBottom: Math.max(insets.bottom, theme.spacing[3]),
        ...Platform.select({
          ios: {
            shadowColor: theme.colors.text.primary,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
          },
          android: { elevation: 6 },
          default: {},
        }),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: theme.spacing[3],
          alignItems: 'center',
        }}
      >
        <AppButton
          label={cancelLabel}
          variant="secondary"
          size="lg"
          onPress={onCancel}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <AppButton
          label={submitLabel}
          variant="primary"
          size="lg"
          onPress={onSubmit}
          disabled={disabled || loading}
          loading={loading}
          style={{ flex: 1.4 }}
        />
      </View>
    </View>
  );
}
