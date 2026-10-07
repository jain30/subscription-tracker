import { Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppButton, AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type SummaryHeaderProps = {
  /** Formatted monthly amount, e.g. "$184.47" */
  monthlyAmount?: string;
  /** Formatted yearly amount without prefix, e.g. "$2,213.64" */
  yearlyAmount?: string;
  /** Hide yearly line under Dynamic Type / vertical pressure */
  showYearly?: boolean;
  /** Optional stale/offline footnote */
  footnote?: string;
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * `summary` — monthly spend hero.
   * `getStarted` — first-time user invite (same shell, different content).
   */
  variant?: 'summary' | 'getStarted';
  getStartedTitle?: string;
  getStartedBody?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
};

/**
 * Floating monthly-spend hero — soft gradient, layered surface, calm elevation.
 * Also hosts the first-time Get Started state without changing layout.
 */
export function SummaryHeader({
  monthlyAmount = '',
  yearlyAmount,
  showYearly = true,
  footnote,
  label = 'Monthly Spend',
  onPress,
  style,
  variant = 'summary',
  getStartedTitle = 'Start Tracking Your Subscriptions',
  getStartedBody = 'Track every subscription in one place.\nNever miss a renewal.\nUnderstand your monthly spending.',
  ctaLabel = '+ Add Your First Subscription',
  onCtaPress,
}: SummaryHeaderProps) {
  const { theme } = useTheme();
  const isGetStarted = variant === 'getStarted';

  const yearlyLine =
    !isGetStarted &&
    showYearly &&
    yearlyAmount != null &&
    yearlyAmount.length > 0
      ? `≈ ${yearlyAmount} yearly`
      : null;

  const accessibilityLabel = isGetStarted
    ? [getStartedTitle, getStartedBody, ctaLabel].filter(Boolean).join('. ')
    : [label, monthlyAmount, 'per month', yearlyLine, footnote]
        .filter(Boolean)
        .join(', ');

  const heroShadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 24,
        }
      : { elevation: 4 };

  const summaryContent = (
    <>
      <AppText
        variant="caption"
        color="secondary"
        style={{
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          opacity: 0.9,
        }}
      >
        {label}
      </AppText>

      <View
        style={{
          marginTop: theme.spacing[4],
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: theme.spacing[2],
        }}
      >
        <AppText
          variant="amountLg"
          color="primary"
          style={{
            fontSize: 44,
            lineHeight: 48,
            letterSpacing: -1,
          }}
        >
          {monthlyAmount}
        </AppText>
        <AppText
          variant="callout"
          color="tertiary"
          style={{
            marginBottom: theme.spacing[2],
            fontFamily: theme.fontFamily.sans.medium,
          }}
        >
          /mo
        </AppText>
      </View>

      {yearlyLine ? (
        <AppText
          variant="footnote"
          color="tertiary"
          style={{ marginTop: theme.spacing[3] }}
        >
          {yearlyLine}
        </AppText>
      ) : null}

      {footnote ? (
        <AppText
          variant="caption"
          color="tertiary"
          style={{ marginTop: theme.spacing[3] }}
        >
          {footnote}
        </AppText>
      ) : null}
    </>
  );

  const getStartedContent = (
    <>
      <AppText
        variant="title2"
        color="primary"
        style={{
          fontSize: 26,
          lineHeight: 32,
          letterSpacing: -0.4,
        }}
      >
        {getStartedTitle}
      </AppText>

      <AppText
        variant="callout"
        color="secondary"
        style={{
          marginTop: theme.spacing[4],
          lineHeight: theme.typography.callout.lineHeight + 4,
        }}
      >
        {getStartedBody}
      </AppText>

      {onCtaPress ? (
        <AppButton
          label={ctaLabel}
          variant="primary"
          fullWidth
          size="lg"
          onPress={onCtaPress}
          style={{ marginTop: theme.spacing[6] }}
          accessibilityLabel={ctaLabel}
        />
      ) : null}
    </>
  );

  const content = isGetStarted ? getStartedContent : summaryContent;

  const inner = (
    <View
      style={{
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: theme.colors.bg.surface,
      }}
    >
      <LinearGradient
        colors={[theme.colors.bg.brandWash, theme.colors.bg.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: theme.spacing[6],
          paddingVertical: theme.spacing[8],
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -40,
            right: -20,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: theme.colors.brand.soft,
            opacity: 0.45,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: -50,
            left: -30,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: theme.colors.bg.subtle,
            opacity: 0.55,
          }}
        />
        {content}
      </LinearGradient>
    </View>
  );

  const shellStyle: ViewStyle = {
    borderRadius: 28,
    backgroundColor: theme.colors.bg.surface,
    ...heroShadow,
  };

  if (!isGetStarted && onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Shows spending insights"
        style={({ pressed }) => [
          shellStyle,
          pressed && { transform: [{ scale: 0.985 }], opacity: 0.98 },
          style,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View
      accessible={!isGetStarted}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel}
      style={[shellStyle, style]}
    >
      {inner}
    </View>
  );
}
