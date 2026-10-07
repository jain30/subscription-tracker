import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

import type { InsightsTopSubscription } from '@/features/insights';

export type TopSubscriptionsCardProps = {
  items: InsightsTopSubscription[];
  style?: StyleProp<ViewStyle>;
};

/**
 * Highest-spend subscriptions — richer than list rows.
 */
export function TopSubscriptionsCard({
  items,
  style,
}: TopSubscriptionsCardProps) {
  const { theme } = useTheme();

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
        Highest Spending
      </AppText>
      <AppText
        variant="footnote"
        color="tertiary"
        style={{ marginTop: theme.spacing[1], marginBottom: theme.spacing[4] }}
      >
        Top subscriptions by monthly cost
      </AppText>

      <View style={{ gap: theme.spacing[3] }}>
        {items.map((item) => {
          const monogram = item.name.trim().charAt(0).toUpperCase() || '?';
          const accent = theme.colors.category[item.accentKey];

          return (
            <View
              key={item.id}
              style={{
                backgroundColor: theme.colors.bg.surface,
                borderRadius: theme.radius.xl,
                padding: theme.spacing[4],
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing[3],
                ...shadow,
              }}
            >
              <View
                style={{
                  borderRadius: 14,
                  ...Platform.select({
                    ios: {
                      shadowColor: theme.colors.text.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 6,
                    },
                    default: { elevation: 1 },
                  }),
                }}
              >
                <LinearGradient
                  colors={[accent, theme.colors.bg.surface]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AppText
                    variant="title3"
                    color="primary"
                    style={{ fontFamily: theme.fontFamily.sans.semibold }}
                  >
                    {monogram}
                  </AppText>
                </LinearGradient>
              </View>

              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <AppText
                  variant="title3"
                  color="primary"
                  numberOfLines={1}
                  style={{ fontFamily: theme.fontFamily.sans.semibold }}
                >
                  {item.name}
                </AppText>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing[2],
                    flexWrap: 'wrap',
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: theme.spacing[2],
                      paddingVertical: 3,
                      borderRadius: theme.radius.full,
                      backgroundColor: theme.colors.bg.subtle,
                    }}
                  >
                    <AppText
                      variant="caption"
                      color="secondary"
                      style={{ fontSize: 10, lineHeight: 12 }}
                    >
                      {item.categoryLabel}
                    </AppText>
                  </View>
                  <AppText variant="caption" color="tertiary">
                    Renews {item.renewalDate}
                  </AppText>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <AppText
                  variant="amountMd"
                  color="primary"
                  style={{ fontFamily: theme.fontFamily.sans.bold }}
                >
                  {item.monthlyCost}
                </AppText>
                <AppText variant="caption" color="tertiary">
                  {item.yearlyCost}/yr
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
