import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { AppText } from '@/components/ui';
import type { InsightsCategorySlice } from '@/features/insights';
import { useTheme, type CategoryKey } from '@/theme';

export type CategoryChartCardProps = {
  categories: InsightsCategorySlice[];
  style?: StyleProp<ViewStyle>;
};

const SIZE = 168;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function resolveToneColor(
  tone: InsightsCategorySlice['tone'],
  theme: ReturnType<typeof useTheme>['theme'],
): string {
  if (tone === 'brand') {
    return theme.colors.brand.soft;
  }
  if (tone === 'accent') {
    return theme.colors.status.trial;
  }
  return theme.colors.category[tone as CategoryKey] ?? theme.colors.category.other;
}

/**
 * Soft donut + legend for spending by category.
 */
export function CategoryChartCard({
  categories,
  style,
}: CategoryChartCardProps) {
  const { theme, reduceMotion } = useTheme();
  const [opacity] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }
    Animated.timing(opacity, {
      toValue: 1,
      duration: theme.motion.duration.transition,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [opacity, reduceMotion, theme.motion.duration.transition]);

  const segments = useMemo(() => {
    type Segment = InsightsCategorySlice & {
      dash: number;
      gap: number;
      offset: number;
      color: string;
    };

    return categories.reduce<Segment[]>((acc, category) => {
      const length = (category.percent / 100) * CIRCUMFERENCE;
      const offset = acc.reduce((sum, item) => sum + item.dash, 0);
      return [
        ...acc,
        {
          ...category,
          dash: length,
          gap: CIRCUMFERENCE - length,
          offset,
          color: resolveToneColor(category.tone, theme),
        },
      ];
    }, []);
  }, [categories, theme]);

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
    <View
      style={[
        {
          backgroundColor: theme.colors.bg.surface,
          borderRadius: theme.radius.xl,
          padding: theme.spacing[5],
          ...shadow,
        },
        style,
      ]}
    >
      <AppText variant="title2" color="primary">
        Spending by Category
      </AppText>
      <AppText
        variant="footnote"
        color="tertiary"
        style={{ marginTop: theme.spacing[1], marginBottom: theme.spacing[5] }}
      >
        Where your monthly spend goes
      </AppText>

      <Animated.View
        style={{
          alignItems: 'center',
          marginBottom: theme.spacing[5],
          opacity,
        }}
      >
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            <G transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={theme.colors.bg.subtle}
                strokeWidth={STROKE}
                fill="none"
              />
              {segments.map((segment) => (
                <Circle
                  key={segment.key}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  fill="none"
                  strokeDasharray={`${segment.dash} ${segment.gap}`}
                  strokeDashoffset={-segment.offset}
                  strokeLinecap="butt"
                />
              ))}
            </G>
          </Svg>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="caption" color="tertiary">
              Monthly
            </AppText>
            <AppText variant="title3" color="primary">
              100%
            </AppText>
          </View>
        </View>
      </Animated.View>

      <View style={{ gap: theme.spacing[3] }}>
        {categories.map((category) => (
          <View
            key={category.key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing[3],
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: theme.radius.full,
                backgroundColor: resolveToneColor(category.tone, theme),
              }}
            />
            <AppText
              variant="subhead"
              color="primary"
              style={{ flex: 1 }}
              numberOfLines={1}
            >
              {category.label}
            </AppText>
            <AppText variant="footnote" color="tertiary">
              {category.percent}%
            </AppText>
            <AppText
              variant="bodyStrong"
              color="primary"
              style={{ minWidth: 64, textAlign: 'right' }}
            >
              {category.amount}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
