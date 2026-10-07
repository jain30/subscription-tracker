import { useMemo } from 'react';
import { View } from 'react-native';

import { AppBadge, AppText } from '@/components/ui';
import { categoryLabel } from '@/features/subscriptions';
import type {
  BillingCycle,
  Subscription,
} from '@/features/subscriptions';
import { useTheme, type AppTheme } from '@/theme';

export type SubscriptionHeroProps = {
  subscription: Subscription;
  formattedAmount: string;
};

function periodLabel(cycle: BillingCycle): string {
  if (cycle === 'Weekly') {
    return 'per week';
  }
  if (cycle === 'Yearly') {
    return 'per year';
  }
  return 'per month';
}

/**
 * Detail identity block — soft artwork wash, money-first hierarchy.
 */
export function SubscriptionHero({
  subscription,
  formattedAmount,
}: SubscriptionHeroProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const artworkSize = theme.spacing[16] + theme.spacing[4];
  const monogram = subscription.name.trim().charAt(0).toUpperCase() || '?';
  const statusLabel =
    subscription.status === 'active'
      ? 'Active'
      : subscription.status === 'trial'
        ? 'Trial'
        : 'Canceled';
  const statusVariant =
    subscription.status === 'canceled'
      ? 'neutral'
      : subscription.status === 'trial'
        ? 'warning'
        : 'success';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.artwork,
          {
            width: artworkSize,
            height: artworkSize,
            backgroundColor: theme.colors.category[subscription.color],
          },
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <AppText
          variant="title1"
          color="primary"
          style={{ fontFamily: theme.fontFamily.sans.semibold }}
        >
          {monogram}
        </AppText>
      </View>

      <AppText variant="title1" color="primary" style={styles.name}>
        {subscription.name}
      </AppText>

      <View style={styles.metaRow}>
        <AppText variant="subhead" color="secondary">
          {categoryLabel(subscription.category)}
        </AppText>
        <AppBadge label={statusLabel} variant={statusVariant} />
      </View>

      <View style={styles.amountBlock}>
        <AppText variant="amountLg" color="primary" style={styles.amount}>
          {formattedAmount}
        </AppText>
        <AppText variant="footnote" color="tertiary" style={styles.period}>
          {periodLabel(subscription.billingCycle)}
        </AppText>
      </View>

      <View style={styles.renewalPill}>
        <AppText variant="callout" color="secondary" style={styles.renewal}>
          {subscription.status === 'canceled'
            ? 'Canceled — not an upcoming charge'
            : subscription.status === 'trial'
              ? `Trial ends ${subscription.renewalDate}`
              : `Next charge ${subscription.renewalDate}`}
        </AppText>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    container: {
      alignItems: 'center' as const,
      backgroundColor: theme.colors.bg.brandWash,
      borderRadius: theme.radius.xl,
      paddingVertical: theme.spacing[8],
      paddingHorizontal: theme.spacing[5],
      gap: theme.spacing[2],
      borderWidth: 1,
      borderColor: theme.colors.brand.soft,
      ...theme.elevation.none,
    },
    artwork: {
      borderRadius: theme.radius.xl,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing[3],
      ...theme.elevation.card,
    },
    name: {
      textAlign: 'center' as const,
    },
    metaRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[2],
      marginBottom: theme.spacing[3],
    },
    amountBlock: {
      alignItems: 'center' as const,
      gap: theme.spacing[1],
    },
    amount: {
      textAlign: 'center' as const,
    },
    period: {
      textAlign: 'center' as const,
    },
    renewalPill: {
      marginTop: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg.surface,
    },
    renewal: {
      textAlign: 'center' as const,
    },
  };
}
