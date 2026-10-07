import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  AppButton,
  AppDivider,
  AppHeader,
  AppText,
  ErrorState,
  LoadingSkeleton,
  ScreenContainer,
} from '@/components';
import {
  ConfirmSheet,
  DetailRow,
  SubscriptionHero,
} from '@/components/subscriptions';
import {
  categoryLabel,
  formatCurrency,
  isChargeable,
  useSubscriptionStore,
} from '@/features/subscriptions';
import { useTheme, type AppTheme } from '@/theme';

/**
 * Subscription detail — lifecycle-aware Cancel vs Delete.
 */
export default function SubscriptionDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id ?? '');
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const deleteSubscription = useSubscriptionStore(
    (state) => state.deleteSubscription,
  );
  const cancelSubscription = useSubscriptionStore(
    (state) => state.cancelSubscription,
  );
  const subscription = subscriptions.find((item) => item.id === id);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading] = useState(false);

  if (loading) {
    return (
      <ScreenContainer edges={['top', 'left', 'right']} scroll>
        <AppHeader title="Subscription" onBack={() => router.back()} />
        <View style={styles.loading}>
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="row" count={4} />
        </View>
      </ScreenContainer>
    );
  }

  if (subscription == null) {
    return (
      <ScreenContainer edges={['top', 'left', 'right']}>
        <AppHeader title="Subscription" onBack={() => router.back()} />
        <ErrorState
          title="Subscription not found"
          description="This subscription may have been deleted or the link is invalid."
          retryLabel="Go back"
          onRetry={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const amount = formatCurrency(subscription.price, subscription.currency);
  const reminderValue =
    subscription.reminderOffset === 'Off'
      ? 'Off'
      : `On · ${subscription.reminderOffset}`;
  const canCancel = isChargeable(subscription);
  const renewalRowLabel =
    subscription.status === 'canceled'
      ? 'Renewal date'
      : subscription.status === 'trial'
        ? 'Trial ends'
        : 'Next charge';
  const renewalRowValue =
    subscription.status === 'canceled'
      ? `${subscription.renewalDate} (not charging)`
      : subscription.renewalDate;

  return (
    <View style={styles.root}>
      <ScreenContainer
        edges={['top', 'left', 'right']}
        scroll
        contentStyle={styles.content}
      >
        <AppHeader
          title={subscription.name}
          onBack={() => router.back()}
          rightAction={
            <AppButton
              label="Edit"
              variant="ghost"
              size="sm"
              onPress={() =>
                router.push(`/(tabs)/subscriptions/${subscription.id}/edit`)
              }
            />
          }
        />

        <View style={styles.heroWrap}>
          <SubscriptionHero
            subscription={subscription}
            formattedAmount={amount}
          />
        </View>

        <AppText variant="title2" color="primary" style={styles.sectionTitle}>
          Details
        </AppText>

        <View style={styles.section}>
          <DetailRow label="Billing cycle" value={subscription.billingCycle} />
          <AppDivider spacing="none" />
          <DetailRow label={renewalRowLabel} value={renewalRowValue} />
          <AppDivider spacing="none" />
          <DetailRow
            label="Category"
            value={categoryLabel(subscription.category)}
          />
          <AppDivider spacing="none" />
          <DetailRow label="Reminder" value={reminderValue} />
          <AppDivider spacing="none" />
          <DetailRow
            label="Auto renew"
            value={subscription.autoRenew ? 'On' : 'Off · Manual renew'}
          />
        </View>

        {subscription.notes.length > 0 ? (
          <View style={styles.notesBlock}>
            <AppText
              variant="caption"
              color="secondary"
              style={styles.notesLabel}
            >
              Notes
            </AppText>
            <View style={styles.notesSurface}>
              <AppText variant="callout" color="secondary" style={styles.notes}>
                {subscription.notes}
              </AppText>
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            label="Edit subscription"
            variant="secondary"
            fullWidth
            size="lg"
            onPress={() =>
              router.push(`/(tabs)/subscriptions/${subscription.id}/edit`)
            }
          />
          {canCancel ? (
            <AppButton
              label="Cancel subscription"
              variant="secondary"
              fullWidth
              onPress={() => {
                setActionError(null);
                setCancelConfirmOpen(true);
              }}
            />
          ) : null}
          <AppButton
            label="Delete"
            variant="destructive"
            fullWidth
            onPress={() => {
              setActionError(null);
              setDeleteConfirmOpen(true);
            }}
          />
          {actionError ? (
            <AppText variant="footnote" color="danger">
              {actionError}
            </AppText>
          ) : null}
          {canCancel ? (
            <AppText variant="caption" color="tertiary" style={styles.hint}>
              Cancel keeps this record in your tracker and stops upcoming
              charges here. It does not cancel your account with the provider.
            </AppText>
          ) : null}
        </View>
      </ScreenContainer>

      <ConfirmSheet
        visible={cancelConfirmOpen}
        title={`Cancel ${subscription.name}?`}
        message="This keeps the subscription in your tracker but stops treating it as an upcoming charge. It does not cancel your real-world service with the provider."
        confirmLabel={canceling ? 'Canceling…' : 'Mark as canceled'}
        cancelLabel="Keep tracking"
        destructive
        onCancel={() => {
          if (!canceling) {
            setCancelConfirmOpen(false);
          }
        }}
        onConfirm={() => {
          void (async () => {
            setCanceling(true);
            setActionError(null);
            try {
              await cancelSubscription(subscription.id);
              setCancelConfirmOpen(false);
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : 'Unable to cancel subscription. Please try again.';
              setActionError(message);
              setCancelConfirmOpen(false);
            } finally {
              setCanceling(false);
            }
          })();
        }}
      />

      <ConfirmSheet
        visible={deleteConfirmOpen}
        title={`Delete ${subscription.name}?`}
        message="This permanently removes the tracker record. You can add it again later. This does not cancel your real-world service with the provider."
        confirmLabel={deleting ? 'Deleting…' : 'Delete permanently'}
        cancelLabel="Keep"
        destructive
        onCancel={() => {
          if (!deleting) {
            setDeleteConfirmOpen(false);
          }
        }}
        onConfirm={() => {
          void (async () => {
            setDeleting(true);
            setActionError(null);
            try {
              await deleteSubscription(subscription.id);
              setDeleteConfirmOpen(false);
              router.replace('/(tabs)/subscriptions');
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : 'Unable to delete subscription. Please try again.';
              setActionError(message);
              setDeleteConfirmOpen(false);
            } finally {
              setDeleting(false);
            }
          })();
        }}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg.app,
    },
    content: {
      paddingBottom: theme.spacing[16],
    },
    loading: {
      marginTop: theme.spacing[4],
      gap: theme.spacing[5],
    },
    heroWrap: {
      marginTop: theme.spacing[2],
    },
    sectionTitle: {
      marginTop: theme.spacing[8],
      marginBottom: theme.spacing[3],
    },
    section: {
      backgroundColor: theme.colors.bg.surface,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing[4],
      ...theme.elevation.none,
    },
    notesBlock: {
      marginTop: theme.spacing[8],
      gap: theme.spacing[3],
    },
    notesLabel: {
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
    notesSurface: {
      backgroundColor: theme.colors.bg.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing[4],
    },
    notes: {
      lineHeight: theme.typography.callout.lineHeight + 2,
    },
    actions: {
      marginTop: theme.spacing[10],
      gap: theme.layout.stackedCtaGap,
    },
    hint: {
      textAlign: 'center' as const,
      marginTop: theme.spacing[1],
    },
  };
}
