import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme, type AppTheme } from '@/theme';

export type DetailRowProps = {
  label: string;
  value: string;
  onPress?: () => void;
};

/**
 * Quiet detail meta row — label leading, value trailing.
 */
export function DetailRow({ label, value, onPress }: DetailRowProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const tappable = onPress != null;

  const body = (
    <>
      <AppText variant="subhead" color="secondary" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.valueWrap}>
        <AppText
          variant="bodyStrong"
          color="primary"
          numberOfLines={2}
          style={styles.value}
        >
          {value}
        </AppText>
        {tappable ? (
          <ChevronRight
            size={theme.icons.size.md}
            strokeWidth={theme.icons.strokeWidth.default}
            color={theme.colors.text.tertiary}
          />
        ) : null}
      </View>
    </>
  );

  if (tappable) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${value}`}
        style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed,
        ]}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${label}, ${value}`}
    >
      {body}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    row: {
      minHeight: theme.layout.listRowHeight,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[3],
      paddingVertical: theme.spacing[3] + 2,
      paddingHorizontal: theme.spacing[1],
      marginHorizontal: -theme.spacing[1],
      borderRadius: theme.radius.md,
    },
    rowPressed: {
      backgroundColor: theme.colors.bg.subtle,
    },
    label: {
      width: theme.spacing[16] + theme.spacing[6],
    },
    valueWrap: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[1],
      justifyContent: 'flex-end' as const,
    },
    value: {
      flexShrink: 1,
      textAlign: 'right' as const,
    },
  };
}
