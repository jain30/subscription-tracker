import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

import type { InsightsTimelineItem } from '@/features/insights';

export type UpcomingTimelineProps = {
  items: InsightsTimelineItem[];
  style?: StyleProp<ViewStyle>;
};

const BUCKET_ORDER: InsightsTimelineItem['bucket'][] = [
  'Tomorrow',
  '3 days',
  'Next week',
  'Later',
];

/**
 * Soft timeline of upcoming renewals, grouped by relative bucket.
 */
export function UpcomingTimeline({ items, style }: UpcomingTimelineProps) {
  const { theme } = useTheme();

  const grouped = BUCKET_ORDER.map((bucket) => ({
    bucket,
    entries: items.filter((item) => item.bucket === bucket),
  })).filter((group) => group.entries.length > 0);

  const shadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
        }
      : { elevation: 2 };

  return (
    <View style={style}>
      <AppText variant="title2" color="primary">
        Upcoming Payments
      </AppText>
      <AppText
        variant="footnote"
        color="tertiary"
        style={{ marginTop: theme.spacing[1], marginBottom: theme.spacing[4] }}
      >
        Next renewals on your calendar
      </AppText>

      <View
        style={{
          backgroundColor: theme.colors.bg.surface,
          borderRadius: theme.radius.xl,
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[4],
          ...shadow,
        }}
      >
        {grouped.map((group, groupIndex) => (
          <View
            key={group.bucket}
            style={{
              marginBottom:
                groupIndex < grouped.length - 1 ? theme.spacing[5] : 0,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing[3],
                marginBottom: theme.spacing[3],
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: theme.radius.full,
                  backgroundColor:
                    group.bucket === 'Tomorrow' || group.bucket === '3 days'
                      ? theme.colors.accent
                      : theme.colors.brand.primary,
                  opacity: group.bucket === 'Later' ? 0.45 : 0.85,
                }}
              />
              <AppText
                variant="caption"
                color="secondary"
                style={{ letterSpacing: 0.4, textTransform: 'uppercase' }}
              >
                {group.bucket}
              </AppText>
            </View>

            <View
              style={{
                marginStart: 4,
                paddingStart: theme.spacing[4],
                borderStartWidth: 2,
                borderStartColor: theme.colors.bg.subtle,
                gap: theme.spacing[3],
              }}
            >
              {group.entries.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: theme.spacing[3],
                  }}
                >
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText variant="bodyStrong" color="primary" numberOfLines={1}>
                      {item.name}
                    </AppText>
                    <AppText variant="caption" color="tertiary">
                      {item.relativeDue}
                    </AppText>
                  </View>
                  <AppText variant="amountSm" color="primary">
                    {item.amount}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
