import { useMemo } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';

import { useTheme, type AppTheme } from '@/theme';

export type SearchPlaceholderProps = {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
};

/**
 * Subscription list search field — real-time, case-insensitive matching.
 * Visual shell matches the Phase 8 search affordance.
 */
export function SearchPlaceholder({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search subscriptions',
}: SearchPlaceholderProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const hasQuery = value.length > 0;

  return (
    <View style={styles.container} accessibilityRole="search">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Search
          size={theme.icons.size.md}
          strokeWidth={theme.icons.strokeWidth.default}
          color={theme.colors.text.tertiary}
        />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search subscriptions"
        style={[theme.typography.body, styles.input]}
      />
      {hasQuery ? (
        <Pressable
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={theme.spacing[2]}
          style={({ pressed }) => [
            styles.clearButton,
            pressed ? styles.clearPressed : null,
          ]}
        >
          <X
            size={theme.icons.size.md}
            strokeWidth={theme.icons.strokeWidth.default}
            color={theme.colors.text.secondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    container: {
      minHeight: theme.layout.listRowHeight,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing[3],
      color: theme.colors.text.primary,
      minHeight: theme.layout.touchTargetMin,
    },
    clearButton: {
      minWidth: theme.layout.touchTargetMin,
      minHeight: theme.layout.touchTargetMin,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginHorizontal: -theme.spacing[2],
    },
    clearPressed: {
      opacity: 0.7,
    },
  };
}
