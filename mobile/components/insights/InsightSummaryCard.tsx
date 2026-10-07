import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

import type { InsightsHighlight } from '@/features/insights';

export type InsightSummaryCardProps = {
  highlights: InsightsHighlight[];
  style?: StyleProp<ViewStyle>;
};

/**
 * Smart spending summary — static highlight cards from mock copy.
 */
export function InsightSummaryCard({
  highlights,
  style,
}: InsightSummaryCardProps) {
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
        Smart Spending Summary
      </AppText>
      <AppText
        variant="footnote"
        color="tertiary"
        style={{ marginTop: theme.spacing[1], marginBottom: theme.spacing[4] }}
      >
        Highlights from your current subscriptions
      </AppText>

      <View style={{ gap: theme.spacing[3] }}>
        {highlights.map((item) => (
          <View
            key={item.id}
            style={{
              borderRadius: theme.radius.xl,
              overflow: 'hidden',
              ...shadow,
            }}
          >
            <LinearGradient
              colors={[theme.colors.bg.surface, theme.colors.bg.brandWash]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: theme.spacing[4],
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: theme.spacing[3],
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: theme.colors.brand.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles
                  size={theme.icons.size.md}
                  strokeWidth={theme.icons.strokeWidth.default}
                  color={theme.colors.brand.primary}
                />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="caption" color="secondary">
                  {item.title}
                </AppText>
                <AppText variant="bodyStrong" color="primary">
                  {item.body}
                </AppText>
              </View>
            </LinearGradient>
          </View>
        ))}
      </View>
    </View>
  );
}
