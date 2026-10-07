import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export type ProgressDotsProps = {
  count: number;
  activeIndex: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Minimal page indicator for onboarding.
 */
export function ProgressDots({ count, activeIndex, style }: ProgressDotsProps) {
  const { theme } = useTheme();

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`Page ${activeIndex + 1} of ${count}`}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing[2],
        },
        style,
      ]}
    >
      {Array.from({ length: count }).map((_, index) => {
        const active = index === activeIndex;
        return (
          <View
            key={`dot-${index}`}
            style={{
              width: active ? 22 : 8,
              height: 8,
              borderRadius: theme.radius.full,
              backgroundColor: active
                ? theme.colors.brand.primary
                : theme.colors.brand.soft,
            }}
          />
        );
      })}
    </View>
  );
}
