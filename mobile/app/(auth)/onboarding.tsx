import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AuthScreenShell,
  BrandMark,
  OnboardingIllustration,
  ProgressDots,
} from '@/components/auth';
import { AppButton, AppText } from '@/components/ui';
import {
  ONBOARDING_PAGES,
  useAuthStore,
  type OnboardingIllustrationKey,
} from '@/features/auth';
import { useTheme } from '@/theme';

type OnboardingItem = {
  id: string;
  title: string;
  subtitle: string;
  illustration: OnboardingIllustrationKey;
};

const PAGES: OnboardingItem[] = ONBOARDING_PAGES.map((page) => ({ ...page }));

const VIEWABILITY_CONFIG = {
  viewAreaCoveragePercentThreshold: 60,
};

/**
 * First-launch value pages — persisted locally when finished or skipped.
 */
export default function OnboardingScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const listRef = useRef<FlatList<OnboardingItem>>(null);
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const isLast = index === PAGES.length - 1;

  const onListLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width > 0 && width !== pageWidth) {
      setPageWidth(width);
    }
  };

  const finish = async () => {
    await completeOnboarding();
    router.replace('/(auth)/welcome');
  };

  const goNext = () => {
    if (isLast) {
      void finish();
      return;
    }
    const next = index + 1;
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setIndex(next);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) {
        setIndex(first.index);
      }
    },
    [],
  );

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (pageWidth <= 0) {
      return;
    }
    const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (next >= 0 && next < PAGES.length) {
      setIndex(next);
    }
  };

  return (
    <AuthScreenShell scroll={false} brandWash contentBottomPad={false}>
      <View
        style={{
          flex: 1,
          paddingBottom: Math.max(insets.bottom, theme.spacing[4]),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing[4],
          }}
        >
          <BrandMark size="md" />
          <Pressable
            onPress={() => void finish()}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            hitSlop={theme.spacing[2]}
            style={({ pressed }) => ({
              minHeight: theme.layout.touchTargetMin,
              justifyContent: 'center',
              paddingHorizontal: theme.spacing[2],
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <AppText variant="bodyStrong" color="secondary">
              Skip
            </AppText>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} onLayout={onListLayout}>
          {pageWidth > 0 ? (
            <FlatList
              ref={listRef}
              data={PAGES}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onMomentumScrollEnd={onMomentumScrollEnd}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={VIEWABILITY_CONFIG}
              getItemLayout={(_, itemIndex) => ({
                length: pageWidth,
                offset: pageWidth * itemIndex,
                index: itemIndex,
              })}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: pageWidth,
                    paddingTop: theme.spacing[2],
                    gap: theme.spacing[6],
                  }}
                >
                  <OnboardingIllustration kind={item.illustration} />
                  <View style={{ gap: theme.spacing[3] }}>
                    <AppText
                      variant="display"
                      color="primary"
                      style={{ textAlign: 'center' }}
                    >
                      {item.title}
                    </AppText>
                    <AppText
                      variant="callout"
                      color="secondary"
                      style={{
                        textAlign: 'center',
                        paddingHorizontal: theme.spacing[2],
                      }}
                    >
                      {item.subtitle}
                    </AppText>
                  </View>
                </View>
              )}
            />
          ) : null}
        </View>

        <View style={{ gap: theme.spacing[5], paddingTop: theme.spacing[4] }}>
          <ProgressDots count={PAGES.length} activeIndex={index} />
          <AppButton
            label={isLast ? 'Get Started' : 'Next'}
            size="lg"
            fullWidth
            onPress={goNext}
          />
        </View>
      </View>
    </AuthScreenShell>
  );
}
