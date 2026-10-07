import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  AppHeader,
  AppText,
  ErrorState,
  ScreenContainer,
} from '@/components';
import {
  FormStickyFooter,
  SubscriptionForm,
} from '@/components/subscriptions';
import {
  isSubscriptionFormValid,
  subscriptionToFormValues,
  useSubscriptionStore,
  type SubscriptionFormValues,
} from '@/features/subscriptions';
import { useTheme, type AppTheme } from '@/theme';

/**
 * Edit subscription — reuses Create form, returns to Detail on success.
 */
export default function EditSubscriptionScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id ?? '');
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const updateSubscription = useSubscriptionStore(
    (state) => state.updateSubscription,
  );
  const subscription = subscriptions.find((item) => item.id === id);

  const [values, setValues] = useState<SubscriptionFormValues | null>(() =>
    subscription ? subscriptionToFormValues(subscription) : null,
  );
  const [saving, setSaving] = useState(false);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (subscription == null || values == null) {
    return (
      <ScreenContainer edges={['top', 'left', 'right', 'bottom']}>
        <AppHeader title="Edit" onBack={() => router.back()} />
        <ErrorState
          title="Subscription not found"
          description="This subscription may have been deleted."
          retryLabel="Go back"
          onRetry={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  const isValid = isSubscriptionFormValid(values);

  const onChange = (patch: Partial<SubscriptionFormValues>) => {
    setValues((current) => (current ? { ...current, ...patch } : current));
    if (saveError) {
      setSaveError(null);
    }
  };

  const onCancel = () => {
    router.back();
  };

  const onSave = async () => {
    if (!isValid) {
      setAttemptedSave(true);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await updateSubscription(id, values);
      router.back();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update subscription. Please try again.';
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScreenContainer
          edges={['top', 'left', 'right']}
          scroll
          contentStyle={styles.content}
          style={styles.flex}
        >
          <AppHeader title="Edit subscription" onBack={onCancel} />

          <View style={styles.intro}>
            <AppText variant="callout" color="secondary">
              Update details carefully — amounts and dates stay precise.
            </AppText>
          </View>

          <SubscriptionForm
            values={values}
            onChange={onChange}
            forceShowErrors={attemptedSave}
            showSubmitButton={false}
            mode="edit"
          />

          {saveError ? (
            <AppText
              variant="footnote"
              color="danger"
              style={{ marginTop: theme.spacing[4] }}
            >
              {saveError}
            </AppText>
          ) : null}
        </ScreenContainer>

        <FormStickyFooter
          onCancel={onCancel}
          onSubmit={() => void onSave()}
          submitLabel="Update Subscription"
          disabled={!isValid}
          loading={saving}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg.app,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingBottom: theme.spacing[6],
    },
    intro: {
      marginTop: theme.spacing[1],
      marginBottom: theme.spacing[6],
      paddingRight: theme.spacing[4],
    },
  };
}
