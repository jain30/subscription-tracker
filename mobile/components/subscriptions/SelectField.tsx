import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme, type AppTheme } from '@/theme';

export type SelectFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  errorMessage?: string;
};

/**
 * Form field that opens a picker sheet — large, calm touch target.
 */
export function SelectField({
  label,
  value,
  placeholder = 'Select',
  onPress,
  errorMessage,
}: SelectFieldProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const display = value.length > 0 ? value : placeholder;
  const isPlaceholder = value.length === 0;

  return (
    <View style={styles.container}>
      <AppText variant="subhead" color="secondary">
        {label}
      </AppText>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${display}`}
        style={({ pressed }) => [
          styles.field,
          errorMessage ? styles.fieldError : null,
          pressed && styles.fieldPressed,
        ]}
      >
        <AppText
          variant="body"
          color={isPlaceholder ? 'tertiary' : 'primary'}
          style={styles.value}
          numberOfLines={1}
        >
          {display}
        </AppText>
        <ChevronDown
          size={theme.icons.size.md}
          strokeWidth={theme.icons.strokeWidth.default}
          color={theme.colors.text.tertiary}
        />
      </Pressable>
      {errorMessage ? (
        <AppText variant="footnote" color="danger">
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    container: {
      gap: theme.spacing[2],
    },
    field: {
      minHeight: theme.layout.listRowHeight,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg.surface,
    },
    fieldError: {
      borderColor: theme.colors.danger,
      borderWidth: 1.5,
    },
    fieldPressed: {
      backgroundColor: theme.colors.bg.subtle,
      transform: [{ scale: 0.995 }],
    },
    value: {
      flex: 1,
    },
  };
}
