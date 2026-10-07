import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

import type { InsightsStat } from '@/features/insights';

export type StatCardProps = {
  stats: InsightsStat[];
  style?: StyleProp<ViewStyle>;
};

/**
 * Compact premium statistic tiles.
 */
export function StatCard({ stats, style }: StatCardProps) {
  const { theme } = useTheme();

  const shadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
        }
      : { elevation: 2 };

  return (
    <View style={style}>
      <AppText variant="title2" color="primary">
        Quick Statistics
      </AppText>
      <AppText
        variant="footnote"
        color="tertiary"
        style={{ marginTop: theme.spacing[1], marginBottom: theme.spacing[4] }}
      >
        A calm snapshot of your catalog
      </AppText>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.spacing[3],
        }}
      >
        {stats.map((stat) => (
          <View
            key={stat.id}
            style={{
              width: '47%',
              flexGrow: 1,
              backgroundColor: theme.colors.bg.surface,
              borderRadius: theme.radius.xl,
              paddingVertical: theme.spacing[4],
              paddingHorizontal: theme.spacing[4],
              ...shadow,
            }}
          >
            <AppText variant="caption" color="tertiary">
              {stat.label}
            </AppText>
            <AppText
              variant="title3"
              color="primary"
              style={{
                marginTop: theme.spacing[2],
                fontFamily: theme.fontFamily.sans.semibold,
              }}
              numberOfLines={1}
            >
              {stat.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
