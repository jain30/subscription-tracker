import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type InsightsHeroProps = {
  monthlySpend: string;
  yearlySpend: string;
  activeCount: string;
  trendLabel: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Monthly overview hero — primary Insights focal point.
 */
export function InsightsHero({
  monthlySpend,
  yearlySpend,
  activeCount,
  trendLabel,
  style,
}: InsightsHeroProps) {
  const { theme } = useTheme();

  const shadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
        }
      : { elevation: 4 };

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Monthly spend ${monthlySpend}, yearly ${yearlySpend}, ${activeCount} active, ${trendLabel}`}
      style={[
        {
          borderRadius: 28,
          backgroundColor: theme.colors.bg.surface,
          overflow: 'hidden',
          ...shadow,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[theme.colors.bg.brandWash, theme.colors.bg.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: theme.spacing[6],
          paddingTop: theme.spacing[6],
          paddingBottom: theme.spacing[5],
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -36,
            right: -24,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: theme.colors.brand.soft,
            opacity: 0.5,
          }}
        />

        <AppText
          variant="caption"
          color="secondary"
          style={{ letterSpacing: 0.7, textTransform: 'uppercase' }}
        >
          Monthly Spend
        </AppText>

        <AppText
          variant="amountLg"
          color="primary"
          style={{
            marginTop: theme.spacing[2],
            fontSize: 42,
            lineHeight: 48,
            letterSpacing: -1,
          }}
        >
          {monthlySpend}
        </AppText>

        <View
          style={{
            marginTop: theme.spacing[3],
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing[2],
            alignSelf: 'flex-start',
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[1] + 2,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.brand.soft,
          }}
        >
          <TrendingUp
            size={theme.icons.size.sm}
            strokeWidth={theme.icons.strokeWidth.default}
            color={theme.colors.brand.primary}
          />
          <AppText variant="caption" color="brand">
            {trendLabel}
          </AppText>
        </View>

        <View
          style={{
            marginTop: theme.spacing[6],
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing[3],
          }}
        >
          <MetricChip label="Yearly" value={yearlySpend} />
          <MetricChip label="Active" value={activeCount} />
        </View>
      </LinearGradient>
    </View>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexGrow: 1,
        flexBasis: '30%',
        minWidth: 96,
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[3],
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.bg.surface,
      }}
    >
      <AppText variant="caption" color="tertiary">
        {label}
      </AppText>
      <AppText
        variant="bodyStrong"
        color="primary"
        style={{ marginTop: theme.spacing[1] }}
        numberOfLines={1}
      >
        {value}
      </AppText>
    </View>
  );
}
