import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme, type AppTheme, type CategoryKey } from '@/theme';
import type { Category } from '@/features/subscriptions';

export type ColorPickerFieldProps = {
  label?: string;
  value: Category | CategoryKey;
  options: readonly (Category | CategoryKey)[];
  onChange: (value: Category) => void;
};

/**
 * Soft accent swatches for subscription artwork — muted category pastels only.
 */
export function ColorPickerField({
  label = 'Accent color',
  value,
  options,
  onChange,
}: ColorPickerFieldProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const swatchSize = theme.spacing[8] + theme.spacing[1];

  return (
    <View style={styles.container}>
      <AppText variant="subhead" color="secondary">
        {label}
      </AppText>
      <View style={styles.row}>
        {options.map((key) => {
          const selected = key === value;
          return (
            <Pressable
              key={key}
              onPress={() => onChange(key as Category)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${key} accent`}
              style={({ pressed }) => [
                styles.swatch,
                {
                  width: swatchSize,
                  height: swatchSize,
                  backgroundColor:
                    theme.colors.category[key as CategoryKey] ??
                    theme.colors.category.other,
                },
                selected && styles.swatchSelected,
                pressed && styles.swatchPressed,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    container: {
      gap: theme.spacing[3],
    },
    row: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: theme.spacing[3],
    },
    swatch: {
      borderRadius: theme.radius.md,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    swatchSelected: {
      borderColor: theme.colors.brand.primary,
      transform: [{ scale: 1.06 }],
    },
    swatchPressed: {
      opacity: 0.85,
    },
  };
}
