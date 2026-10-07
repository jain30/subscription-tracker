import { useMemo } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '@/components';
import {
  AnimatedSection,
  CategoryChartCard,
  InsightSummaryCard,
  InsightsHero,
  StatCard,
  TopSubscriptionsCard,
  TrendChartCard,
  UpcomingTimeline,
} from '@/components/insights';
import { AppButton, AppText } from '@/components/ui';
import {
  selectInsightsDashboard,
  useSubscriptionStore,
} from '@/features/subscriptions';
import { useTheme } from '@/theme';

const CONTENT_MAX_WIDTH = 560;
const SECTION_GAP = 32;

/**
 * Insights dashboard — Phase 18 engines + empty/error states.
 */
export default function InsightsScreen() {
  const { theme } = useTheme();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const loading = useSubscriptionStore((state) => state.loading);
  const error = useSubscriptionStore((state) => state.error);
  const refresh = useSubscriptionStore((state) => state.refresh);
  const clearError = useSubscriptionStore((state) => state.clearError);
  const data = useMemo(
    () => selectInsightsDashboard(subscriptions),
    [subscriptions],
  );
  const isEmpty = subscriptions.length === 0;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          theme.colors.bg.brandWash,
          theme.colors.bg.app,
          theme.colors.bg.app,
        ]}
        locations={[0, 0.18, 1]}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      <ScreenContainer
        edges={['top', 'left', 'right']}
        scroll
        style={{ backgroundColor: 'transparent' }}
        contentStyle={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          alignSelf: 'center',
          paddingTop: theme.spacing[2],
          paddingBottom: theme.spacing[16],
        }}
      >
        <View style={{ marginBottom: theme.spacing[6], gap: theme.spacing[2] }}>
          <AppText
            variant="title1"
            color="primary"
            style={{
              fontSize: 32,
              lineHeight: 38,
              letterSpacing: -0.6,
            }}
          >
            Insights
          </AppText>
          <AppText variant="callout" color="secondary">
            Understand your subscription spending
          </AppText>
        </View>

        {error != null && isEmpty ? (
          <View style={{ gap: theme.spacing[4], paddingVertical: theme.spacing[8] }}>
            <AppText variant="title2" color="primary">
              Couldn’t load insights
            </AppText>
            <AppText variant="callout" color="secondary">
              {error}
            </AppText>
            <AppButton
              label="Retry"
              onPress={() => {
                clearError();
                void refresh();
              }}
            />
          </View>
        ) : isEmpty && loading ? (
          <AppText variant="callout" color="secondary">
            Loading your subscriptions…
          </AppText>
        ) : isEmpty ? (
          <View style={{ gap: theme.spacing[3], paddingVertical: theme.spacing[8] }}>
            <AppText variant="title2" color="primary">
              No insights yet
            </AppText>
            <AppText variant="callout" color="secondary">
              Add an active or trial subscription to see spending estimates and
              upcoming renewals.
            </AppText>
          </View>
        ) : (
          <>
            <AnimatedSection delay={0}>
              <InsightsHero
                monthlySpend={data.monthlySpend}
                yearlySpend={data.yearlySpend}
                activeCount={data.activeCount}
                averageCost={data.averageCost}
                trendLabel={data.trendLabel}
              />
            </AnimatedSection>

            <AnimatedSection delay={60} style={{ marginTop: SECTION_GAP }}>
              <CategoryChartCard categories={data.categories} />
            </AnimatedSection>

            <AnimatedSection delay={100} style={{ marginTop: SECTION_GAP }}>
              <TrendChartCard points={data.trend} />
            </AnimatedSection>

            <AnimatedSection delay={140} style={{ marginTop: SECTION_GAP }}>
              <TopSubscriptionsCard items={data.topSubscriptions} />
            </AnimatedSection>

            <AnimatedSection delay={180} style={{ marginTop: SECTION_GAP }}>
              <UpcomingTimeline items={data.upcoming} />
            </AnimatedSection>

            <AnimatedSection delay={220} style={{ marginTop: SECTION_GAP }}>
              <InsightSummaryCard highlights={data.highlights} />
            </AnimatedSection>

            <AnimatedSection delay={260} style={{ marginTop: SECTION_GAP }}>
              <StatCard stats={data.stats} />
            </AnimatedSection>
          </>
        )}
      </ScreenContainer>
    </View>
  );
}
