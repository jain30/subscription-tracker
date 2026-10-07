import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Layers } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { APP_NAME } from '@/features/auth';
import { useTheme } from '@/theme';

export type BrandMarkProps = {
  /** Show wordmark under / beside the mark */
  showWordmark?: boolean;
  /** Wordmark placement */
  layout?: 'stacked' | 'inline';
  size?: 'md' | 'lg' | 'xl';
  style?: StyleProp<ViewStyle>;
};

const SIZE_MAP = {
  md: 48,
  lg: 64,
  xl: 80,
} as const;

/**
 * App brand mark + optional wordmark for splash / auth / onboarding.
 */
export function BrandMark({
  showWordmark = false,
  layout = 'stacked',
  size = 'lg',
  style,
}: BrandMarkProps) {
  const { theme } = useTheme();
  const markSize = SIZE_MAP[size];
  const iconSize = Math.round(markSize * 0.42);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={APP_NAME}
      style={[
        {
          alignItems: 'center',
          flexDirection: layout === 'inline' ? 'row' : 'column',
          gap: layout === 'inline' ? theme.spacing[3] : theme.spacing[4],
        },
        style,
      ]}
    >
      <View
        style={{
          width: markSize,
          height: markSize,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.brand.primary,
          alignItems: 'center',
          justifyContent: 'center',
          ...theme.elevation.card,
        }}
      >
        <Layers
          size={iconSize}
          strokeWidth={theme.icons.strokeWidth.emphasis}
          color={theme.colors.text.onBrand}
        />
      </View>

      {showWordmark ? (
        <AppText
          variant={size === 'xl' ? 'title1' : 'title2'}
          color="primary"
          style={{
            textAlign: layout === 'stacked' ? 'center' : 'left',
            letterSpacing: -0.4,
          }}
        >
          {APP_NAME}
        </AppText>
      ) : null}
    </View>
  );
}
