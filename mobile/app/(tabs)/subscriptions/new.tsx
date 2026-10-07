import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppHeader, AppText, ScreenContainer } from '@/components';
import {
  FormStickyFooter,
  SubscriptionForm,
} from '@/components/subscriptions';
import {
  createEmptyFormValues,
  isSubscriptionFormValid,
  useSubscriptionStore,
  type SubscriptionFormValues,
} from '@/features/subscriptions';
import { useTheme, type AppTheme } from '@/theme';

/**
 * Create subscription — owned by the Subscriptions stack.
 * Saves into the store, then returns to the Subscription List.
 */
export default function AddSubscriptionScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const [values, setValues] = useState<SubscriptionFormValues>(
    createEmptyFormValues,
  );
  const [saving, setSaving] = useState(false);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isValid = isSubscriptionFormValid(values);

  const onChange = (patch: Partial<SubscriptionFormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    if (saveError) {
      setSaveError(null);
    }
  };

  const goToList = () => {
    router.replace('/(tabs)/subscriptions');
  };

  const onCancel = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    goToList();
  };

  const onSave = async () => {
    if (!isValid) {
      setAttemptedSave(true);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await addSubscription(values);
      goToList();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save subscription. Please try again.';
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
          <AppHeader title="Add subscription" onBack={onCancel} />

          <View style={styles.intro}>
            <AppText variant="callout" color="secondary">
              Essentials first — add optional details when you’re ready.
            </AppText>
          </View>

          <SubscriptionForm
            values={values}
            onChange={onChange}
            forceShowErrors={attemptedSave}
            showSubmitButton={false}
            mode="create"
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
          submitLabel="Save Subscription"
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
