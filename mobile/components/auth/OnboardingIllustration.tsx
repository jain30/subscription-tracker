import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  BellRing,
  ChartColumn,
  Layers,
  type LucideIcon,
} from 'lucide-react-native';

import type { OnboardingIllustrationKey } from '@/features/auth';
import { useTheme } from '@/theme';

export type OnboardingIllustrationProps = {
  kind: OnboardingIllustrationKey;
  style?: StyleProp<ViewStyle>;
};

const ILLUSTRATION_ICON: Record<OnboardingIllustrationKey, LucideIcon> = {
  track: Layers,
  renewal: BellRing,
  insights: ChartColumn,
};

/**
 * Soft geometric illustration placeholder for onboarding pages.
 */
export function OnboardingIllustration({
  kind,
  style,
}: OnboardingIllustrationProps) {
  const { theme } = useTheme();
  const Icon = ILLUSTRATION_ICON[kind];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: '100%',
          aspectRatio: 1.15,
          maxHeight: 280,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <View
        style={{
          width: '78%',
          aspectRatio: 1,
          maxWidth: 260,
          borderRadius: theme.radius.xl,
          backgroundColor: theme.colors.bg.brandWash,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -36,
            right: -28,
            width: 120,
            height: 120,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.brand.soft,
            opacity: 0.85,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -24,
            left: -20,
            width: 96,
            height: 96,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.bg.subtle,
          }}
        />
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.bg.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
            ...theme.elevation.card,
          }}
        >
          <Icon
            size={theme.icons.size.xl}
            strokeWidth={theme.icons.strokeWidth.default}
            color={theme.colors.brand.primary}
          />
        </View>
      </View>
    </View>
  );
}
