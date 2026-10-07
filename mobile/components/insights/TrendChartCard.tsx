import { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

import type { InsightsTrendPoint } from '@/features/insights';

export type TrendChartCardProps = {
  points: InsightsTrendPoint[];
  style?: StyleProp<ViewStyle>;
};

const CHART_HEIGHT = 148;
const PADDING_X = 8;
const PADDING_Y = 12;

/**
 * Soft 6-month spend trend line with muted fill.
 */
export function TrendChartCard({ points, style }: TrendChartCardProps) {
  const { theme, reduceMotion } = useTheme();
  const [width, setWidth] = useState(0);
  const [draw] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      draw.setValue(1);
      return;
    }
    draw.setValue(0);
    Animated.timing(draw, {
      toValue: 1,
      duration: theme.motion.duration.transitionMax,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [draw, reduceMotion, theme.motion.duration.transitionMax]);

  const geometry = useMemo(() => {
    if (width <= 0 || points.length === 0) {
      return null;
    }

    const values = points.map((point) => point.value);
    const min = Math.min(...values) * 0.92;
    const max = Math.max(...values) * 1.04;
    const range = Math.max(max - min, 1);
    const innerWidth = width - PADDING_X * 2;
    const innerHeight = CHART_HEIGHT - PADDING_Y * 2;

    const coords = points.map((point, index) => {
      const x =
        PADDING_X +
        (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
      const y =
        PADDING_Y +
        innerHeight -
        ((point.value - min) / range) * innerHeight;
      return { x, y, label: point.label, value: point.value };
    });

    const line = coords
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const area = [
      `M ${coords[0].x} ${CHART_HEIGHT - PADDING_Y}`,
      `L ${coords[0].x} ${coords[0].y}`,
      ...coords.slice(1).map((point) => `L ${point.x} ${point.y}`),
      `L ${coords[coords.length - 1].x} ${CHART_HEIGHT - PADDING_Y}`,
      'Z',
    ].join(' ');

    return { coords, line, area };
  }, [points, width]);

  const shadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
        }
      : { elevation: 2 };

  const lineOpacity = draw.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 1],
  });

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
        Monthly Spending Trend
      </AppText>
      <AppText
        variant="footnote"
        color="tertiary"
        style={{ marginTop: theme.spacing[1], marginBottom: theme.spacing[5] }}
      >
        {points.length > 0
          ? `Last ${points.length} months`
          : 'Trend history will appear when billing history is available'}
      </AppText>

      {points.length === 0 ? (
        <View
          style={{
            height: CHART_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: theme.spacing[4],
          }}
        >
          <AppText
            variant="callout"
            color="secondary"
            style={{ textAlign: 'center' }}
          >
            No historical spend chart yet. Current monthly and yearly estimates
            above are based on your active subscriptions.
          </AppText>
        </View>
      ) : (
      <View
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={{ height: CHART_HEIGHT }}
      >
        {width > 0 && geometry ? (
          <Animated.View style={{ flex: 1, opacity: lineOpacity }}>
            <Svg width={width} height={CHART_HEIGHT}>
              <Defs>
                <SvgLinearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop
                    offset="0%"
                    stopColor={theme.colors.brand.primary}
                    stopOpacity="0.18"
                  />
                  <Stop
                    offset="100%"
                    stopColor={theme.colors.brand.primary}
                    stopOpacity="0.02"
                  />
                </SvgLinearGradient>
              </Defs>

              {[0.25, 0.5, 0.75].map((ratio) => {
                const y = PADDING_Y + (CHART_HEIGHT - PADDING_Y * 2) * ratio;
                return (
                  <Path
                    key={`grid-${ratio}`}
                    d={`M ${PADDING_X} ${y} L ${width - PADDING_X} ${y}`}
                    stroke={theme.colors.border}
                    strokeWidth={1}
                    opacity={0.45}
                  />
                );
              })}

              <Path d={geometry.area} fill="url(#trendFill)" />
              <Path
                d={geometry.line}
                stroke={theme.colors.brand.primary}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {geometry.coords.map((point) => (
                <Circle
                  key={`${point.label}-${point.value}`}
                  cx={point.x}
                  cy={point.y}
                  r={3.5}
                  fill={theme.colors.bg.surface}
                  stroke={theme.colors.brand.primary}
                  strokeWidth={2}
                />
              ))}
            </Svg>
          </Animated.View>
        ) : null}
      </View>
      )}

      {points.length > 0 ? (
      <View
        style={{
          marginTop: theme.spacing[3],
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {points.map((point) => (
          <AppText key={point.label} variant="caption" color="tertiary">
            {point.label}
          </AppText>
        ))}
      </View>
      ) : null}
    </View>
  );
}
