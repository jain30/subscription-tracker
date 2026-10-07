import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  PixelRatio,
  Pressable,
  RefreshControl,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, ChartColumn, ChevronRight, LayoutGrid } from 'lucide-react-native';

import { AppCard, AppText, ScreenContainer } from '@/components';
import {
  ErrorState,
  FloatingActionButton,
  QuickActionBar,
  SummaryHeader,
  UpcomingCard,
} from '@/components/home';
import { useTheme } from '@/theme';
import {
  selectHomeDashboard,
  useSubscriptionStore,
  type HomeUpcomingItem,
} from '@/features/subscriptions';

const CONTENT_MAX_WIDTH = 560;

function greetingForHour(hour: number): string {
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

/**
 * Home dashboard — approved Phase 7 chrome + Phase 18 engine-backed data.
 */
export default function HomeScreen() {
  const { theme, reduceMotion } = useTheme();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [enterOpacity] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));
  const [enterTranslate] = useState(
    () => new Animated.Value(reduceMotion ? 0 : theme.motion.enter.translateY),
  );

  const fontScale = PixelRatio.getFontScale();
  const showYearly = fontScale <= 1.3;
  const isWide = windowWidth >= 600;
  const greeting = useMemo(() => greetingForHour(new Date().getHours()), []);

  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const loading = useSubscriptionStore((state) => state.loading);
  const error = useSubscriptionStore((state) => state.error);
  const hydrated = useSubscriptionStore((state) => state.hydrated);
  const refresh = useSubscriptionStore((state) => state.refresh);
  const clearError = useSubscriptionStore((state) => state.clearError);

  const isEmpty = subscriptions.length === 0;
  const showInitialLoading = hydrated && loading && isEmpty && error == null;
  const showError = error != null && isEmpty;

  const dashboard = useMemo(
    () => selectHomeDashboard(subscriptions),
    [subscriptions],
  );
  const upcoming = dashboard.upcoming;

  useEffect(() => {
    if (reduceMotion) {
      enterOpacity.setValue(1);
      enterTranslate.setValue(0);
      return;
    }

    enterOpacity.setValue(0);
    enterTranslate.setValue(theme.motion.enter.translateY);

    Animated.parallel([
      Animated.timing(enterOpacity, {
        toValue: 1,
        duration: theme.motion.enter.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(enterTranslate, {
        toValue: 0,
        duration: theme.motion.enter.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    enterOpacity,
    enterTranslate,
    isEmpty,
    reduceMotion,
    theme.motion.enter.duration,
    theme.motion.enter.translateY,
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    clearError();
    void (async () => {
      try {
        await refresh();
      } finally {
        setRefreshing(false);
      }
    })();
  };

  const onRetry = () => {
    clearError();
    void refresh();
  };

  const goToAdd = () => {
    router.push('/(tabs)/subscriptions/new');
  };

  const fabClearance =
    theme.spacing[16] + theme.spacing[12] + theme.spacing[4];

  const contentWidthStyle = isWide
    ? {
        width: '100%' as const,
        maxWidth: CONTENT_MAX_WIDTH,
        alignSelf: 'center' as const,
      }
    : undefined;

  const canvas = theme.colors.bg.app;

  if (showError) {
    return (
      <View style={{ flex: 1, backgroundColor: canvas }}>
        <ScreenContainer edges={['top', 'left', 'right']}>
          <HomeHeader greeting={greeting} dateLabel={dashboard.contextLabel} />
          <ErrorState
            title="Couldn’t load subscriptions"
            description={error}
            onRetry={onRetry}
          />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: canvas }}>
      <ScreenContainer
        edges={['top', 'left', 'right']}
        scroll
        contentStyle={[
          contentWidthStyle,
          {
            paddingBottom: isEmpty ? theme.spacing[10] : fabClearance,
            paddingTop: theme.spacing[2],
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand.primary}
            colors={[theme.colors.brand.primary]}
          />
        }
      >
        <HomeHeader greeting={greeting} dateLabel={dashboard.contextLabel} />

        {showInitialLoading ? (
          <View
            style={{
              paddingVertical: theme.spacing[16],
              alignItems: 'center',
              gap: theme.spacing[3],
            }}
          >
            <ActivityIndicator color={theme.colors.brand.primary} />
            <AppText variant="callout" color="secondary">
              Loading your subscriptions…
            </AppText>
          </View>
        ) : (
          <Animated.View
            style={{
              flexGrow: 1,
              opacity: enterOpacity,
              transform: [{ translateY: enterTranslate }],
            }}
          >
            <HomeBody
              isEmpty={isEmpty}
              showYearly={showYearly}
              monthlyAmount={dashboard.monthlyAmount}
              yearlyAmount={dashboard.yearlyAmount}
              activeCount={dashboard.activeCount}
              trialCount={dashboard.trialCount}
              trialsEndingSoonCount={dashboard.trialsEndingSoonCount}
              upcomingPaymentLabel={dashboard.upcomingPaymentLabel}
              footnote={
                error != null
                  ? 'Showing last loaded data — pull to refresh'
                  : undefined
              }
              upcoming={upcoming}
              onAddFirst={goToAdd}
              onOpenSubscription={(id) =>
                router.push(`/(tabs)/subscriptions/${id}`)
              }
              onSeeAll={() => router.push('/(tabs)/subscriptions')}
              onOpenInsights={() => router.push('/(tabs)/insights')}
            />
          </Animated.View>
        )}
      </ScreenContainer>

      {!isEmpty && !showInitialLoading ? (
        <FloatingActionButton onPress={goToAdd} />
      ) : null}
    </View>
  );
}

type HomeHeaderProps = {
  greeting: string;
  dateLabel: string;
};

function HomeHeader({ greeting, dateLabel }: HomeHeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        paddingTop: theme.spacing[2],
        paddingBottom: theme.spacing[4],
        gap: theme.spacing[1],
      }}
    >
      <View style={{ gap: theme.spacing[1] }}>
        <AppText
          variant="footnote"
          color="tertiary"
          style={{ letterSpacing: 0.2 }}
        >
          {greeting}
        </AppText>
        <AppText
          variant="title1"
          color="primary"
          style={{
            fontSize: 32,
            lineHeight: 38,
            letterSpacing: -0.6,
          }}
        >
          Home
        </AppText>
        <AppText
          variant="caption"
          color="tertiary"
          style={{ marginTop: theme.spacing[1] }}
        >
          {dateLabel}
        </AppText>
      </View>
    </View>
  );
}

type HomeBodyProps = {
  isEmpty: boolean;
  showYearly: boolean;
  monthlyAmount: string;
  yearlyAmount: string;
  activeCount: number;
  trialCount: number;
  trialsEndingSoonCount: number;
  upcomingPaymentLabel: string;
  footnote?: string;
  upcoming: HomeUpcomingItem[];
  onAddFirst: () => void;
  onOpenSubscription: (id: string) => void;
  onSeeAll: () => void;
  onOpenInsights: () => void;
};

function HomeBody({
  isEmpty,
  showYearly,
  monthlyAmount,
  yearlyAmount,
  activeCount,
  trialCount,
  trialsEndingSoonCount,
  upcomingPaymentLabel,
  footnote,
  upcoming,
  onAddFirst,
  onOpenSubscription,
  onSeeAll,
  onOpenInsights,
}: HomeBodyProps) {
  const { theme } = useTheme();

  const summaryFootnote = [
    footnote,
    !isEmpty
      ? `${activeCount} active${trialCount > 0 ? ` · ${trialCount} trial` : ''}${
          trialsEndingSoonCount > 0
            ? ` · ${trialsEndingSoonCount} trial ending soon`
            : ''
        }`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View>
      {isEmpty ? (
        <SummaryHeader
          variant="getStarted"
          onCtaPress={onAddFirst}
          style={{ marginTop: theme.spacing[1] }}
        />
      ) : (
        <SummaryHeader
          monthlyAmount={monthlyAmount}
          yearlyAmount={yearlyAmount}
          showYearly={showYearly}
          footnote={summaryFootnote || undefined}
          onPress={onOpenInsights}
          style={{ marginTop: theme.spacing[1] }}
        />
      )}

      <View
        style={{
          marginTop: theme.spacing[10],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing[3],
        }}
      >
        <AppText variant="title2" color="primary" style={{ flex: 1 }}>
          Upcoming
        </AppText>
        {!isEmpty ? (
          <Pressable
            onPress={onSeeAll}
            accessibilityRole="button"
            accessibilityLabel="See all upcoming charges"
            hitSlop={theme.spacing[2]}
            style={({ pressed }) => ({
              minHeight: theme.layout.touchTargetMin,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              paddingHorizontal: theme.spacing[2],
              borderRadius: theme.radius.md,
              opacity: pressed ? 0.65 : 1,
              backgroundColor: pressed ? theme.colors.bg.subtle : 'transparent',
            })}
          >
            <AppText variant="subhead" color="brand">
              See all
            </AppText>
            <ChevronRight
              size={16}
              strokeWidth={theme.icons.strokeWidth.default}
              color={theme.colors.brand.primary}
            />
          </Pressable>
        ) : null}
      </View>

      {!isEmpty && upcoming.length > 0 ? (
        <AppText
          variant="caption"
          color="tertiary"
          style={{ marginTop: theme.spacing[2] }}
        >
          Expected soon: {upcomingPaymentLabel}
        </AppText>
      ) : null}

      <View style={{ marginTop: theme.spacing[4], gap: theme.spacing[3] }}>
        {isEmpty ? (
          <HomeSectionPlaceholder
            icon={
              <CalendarDays
                size={theme.icons.size.lg}
                strokeWidth={theme.icons.strokeWidth.default}
                color={theme.colors.brand.primary}
              />
            }
            title="No renewals yet"
            description="Upcoming charges will appear here once you add a subscription."
          />
        ) : upcoming.length === 0 ? (
          <AppText
            variant="callout"
            color="secondary"
            style={{ paddingVertical: theme.spacing[4] }}
          >
            Nothing due in the next 30 days
          </AppText>
        ) : (
          upcoming.map((item) => (
            <UpcomingCard
              key={item.id}
              name={item.name}
              amount={item.amount}
              relativeDue={item.relativeDue}
              cycle={item.cycle}
              dueSoon={item.dueSoon}
              nonAutoRenew={item.nonAutoRenew}
              isTrial={item.isTrial}
              overdue={item.overdue}
              accentKey={item.accentKey}
              onPress={() => onOpenSubscription(item.id)}
            />
          ))
        )}
      </View>

      {isEmpty ? (
        <View style={{ marginTop: theme.spacing[10] }}>
          <AppText
            variant="caption"
            color="tertiary"
            style={{
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              marginBottom: theme.spacing[3],
            }}
          >
            Insights preview
          </AppText>
          <HomeSectionPlaceholder
            icon={
              <ChartColumn
                size={theme.icons.size.lg}
                strokeWidth={theme.icons.strokeWidth.default}
                color={theme.colors.brand.primary}
              />
            }
            title="Insights unlock with your first subscription"
            description="Category spend, timelines, and monthly estimates will show up here."
          />
        </View>
      ) : null}

      <QuickActionBar
        style={{ marginTop: theme.spacing[10] }}
        actions={[
          {
            key: 'templates',
            label: 'Templates',
            Icon: LayoutGrid,
            disabled: true,
            accessibilityHint: 'Coming soon',
          },
          {
            key: 'reminders',
            label: 'Reminders',
            Icon: Bell,
            disabled: true,
            accessibilityHint: 'Coming soon',
          },
        ]}
      />
      <AppText
        variant="caption"
        color="tertiary"
        style={{ marginTop: theme.spacing[2], paddingHorizontal: theme.spacing[1] }}
      >
        Templates and reminders are coming soon.
      </AppText>
    </View>
  );
}

type HomeSectionPlaceholderProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function HomeSectionPlaceholder({
  icon,
  title,
  description,
}: HomeSectionPlaceholderProps) {
  const { theme } = useTheme();

  return (
    <AppCard variant="elevated">
      <View
        style={{
          flexDirection: 'row',
          gap: theme.spacing[4],
          alignItems: 'flex-start',
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: theme.colors.brand.soft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1, gap: theme.spacing[1] }}>
          <AppText variant="bodyStrong" color="primary">
            {title}
          </AppText>
          <AppText variant="callout" color="secondary">
            {description}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}
