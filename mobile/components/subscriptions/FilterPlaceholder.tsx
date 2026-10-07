import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import type { SubscriptionListFilter } from '@/features/subscriptions/listQuery';
import { useTheme, type AppTheme } from '@/theme';

const FILTERS: readonly {
  value: SubscriptionListFilter;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'canceled', label: 'Canceled' },
];

export type FilterPlaceholderProps = {
  value: SubscriptionListFilter;
  onChange: (value: SubscriptionListFilter) => void;
};

/**
 * Status filter chips — All / Active / Trial / Canceled.
 */
export function FilterPlaceholder({
  value,
  onChange,
}: FilterPlaceholderProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={styles.row}
      accessibilityRole="tablist"
      accessibilityLabel="Subscription status filters"
    >
      {FILTERS.map((filter) => {
        const isSelected = filter.value === value;
        return (
          <Pressable
            key={filter.value}
            onPress={() => onChange(filter.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={filter.label}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.chipSelected : null,
              pressed && !isSelected ? styles.chipPressed : null,
            ]}
          >
            <AppText
              variant="subhead"
              color={isSelected ? 'brand' : 'secondary'}
            >
              {filter.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    row: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: theme.spacing[2],
    },
    chip: {
      minHeight: theme.layout.touchTargetMin,
      paddingHorizontal: theme.spacing[4],
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    chipSelected: {
      backgroundColor: theme.colors.brand.soft,
      borderColor: theme.colors.brand.soft,
    },
    chipPressed: {
      backgroundColor: theme.colors.bg.subtle,
    },
  };
}
