import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ShieldAlert, ShieldCheck } from 'lucide-react-native';

import { AuthFormCard, AuthScreenShell } from '@/components/auth';
import { AppButton, AppInput, AppText } from '@/components/ui';
import {
  AuthError,
  isFormValid,
  useAuthStore,
  validateResetPasswordForm,
  type FieldErrors,
  type ResetPasswordFormValues,
} from '@/features/auth';
import { useTheme } from '@/theme';

const INITIAL: ResetPasswordFormValues = {
  password: '',
  confirmPassword: '',
};

/**
 * Reset password — requires a Supabase recovery session from the email link.
 */
export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const passwordRecoveryPending = useAuthStore(
    (state) => state.passwordRecoveryPending,
  );
  const hydrated = useAuthStore((state) => state.hydrated);
  const updatePassword = useAuthStore((state) => state.updatePassword);

  const [values, setValues] = useState<ResetPasswordFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors<ResetPasswordFormValues>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false);

  // Only a recovery deep-link session may use this screen (not a normal login).
  const canReset = passwordRecoveryPending;

  const update = <K extends keyof ResetPasswordFormValues>(
    key: K,
    value: ResetPasswordFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFormError(null);
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const nextErrors = validateResetPasswordForm(values);
    setErrors(nextErrors);
    setFormError(null);
    if (!isFormValid(nextErrors)) {
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(values.password);
      setUpdated(true);
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.code === 'WEAK_PASSWORD') {
          setErrors({ password: error.message });
          return;
        }
        setFormError(error.message);
        return;
      }
      setFormError('Unable to update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <AuthScreenShell title="Reset Password" showBack={false}>
        <View style={{ flex: 1 }} />
      </AuthScreenShell>
    );
  }

  if (updated) {
    return (
      <AuthScreenShell title="Password Updated" showBack={false}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[6],
            paddingVertical: theme.spacing[10],
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.brand.soft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck
              size={theme.icons.size.xl}
              strokeWidth={theme.icons.strokeWidth.default}
              color={theme.colors.brand.primary}
            />
          </View>
          <View style={{ gap: theme.spacing[3], alignItems: 'center' }}>
            <AppText
              variant="title1"
              color="primary"
              style={{ textAlign: 'center' }}
            >
              Password updated
            </AppText>
            <AppText
              variant="callout"
              color="secondary"
              style={{ textAlign: 'center', maxWidth: 300 }}
            >
              Your password has been updated. Log in with your new credentials.
            </AppText>
          </View>
          <AppButton
            label="Log In"
            size="lg"
            fullWidth
            onPress={() => router.replace('/(auth)/login')}
            style={{ width: '100%', marginTop: theme.spacing[4] }}
          />
        </View>
      </AuthScreenShell>
    );
  }

  if (!canReset) {
    return (
      <AuthScreenShell title="Reset Password" showBack>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[6],
            paddingVertical: theme.spacing[10],
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.colors.brand.soft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert
              size={theme.icons.size.xl}
              strokeWidth={theme.icons.strokeWidth.default}
              color={theme.colors.brand.primary}
            />
          </View>
          <View style={{ gap: theme.spacing[3], alignItems: 'center' }}>
            <AppText
              variant="title1"
              color="primary"
              style={{ textAlign: 'center' }}
            >
              Reset link required
            </AppText>
            <AppText
              variant="callout"
              color="secondary"
              style={{ textAlign: 'center', maxWidth: 300 }}
            >
              Open the password reset link from your email on this device, or
              request a new link.
            </AppText>
          </View>
          <View
            style={{
              width: '100%',
              gap: theme.layout.stackedCtaGap,
              marginTop: theme.spacing[4],
            }}
          >
            <AppButton
              label="Request Reset Link"
              size="lg"
              fullWidth
              onPress={() => router.replace('/(auth)/forgot-password')}
            />
            <AppButton
              label="Back to Log In"
              variant="secondary"
              size="lg"
              fullWidth
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      </AuthScreenShell>
    );
  }

  const scrollRef = useRef<ScrollView>(null);

  const scrollToOffset = (offsetY: number) => {
    scrollRef.current?.scrollTo({ y: offsetY, animated: true });
  };

  return (
    <AuthScreenShell title="Reset Password" showBack={false} scrollRef={scrollRef}>
      <View style={{ gap: theme.spacing[5], marginTop: theme.spacing[2] }}>
        <View style={{ gap: theme.spacing[2] }}>
          <AppText variant="title1" color="primary">
            Choose a new password
          </AppText>
          <AppText variant="callout" color="secondary">
            Use at least 8 characters. Make it unique to this account.
          </AppText>
        </View>

        <AuthFormCard>
          <AppInput
            label="New Password"
            value={values.password}
            onChangeText={(text) => update('password', text)}
            errorMessage={errors.password}
            password
            autoComplete="new-password"
            textContentType="newPassword"
            placeholder="At least 8 characters"
            onFocus={() => scrollToOffset(0)}
          />
          <AppInput
            label="Confirm Password"
            value={values.confirmPassword}
            onChangeText={(text) => update('confirmPassword', text)}
            errorMessage={errors.confirmPassword}
            password
            autoComplete="new-password"
            textContentType="newPassword"
            placeholder="Re-enter password"
            onFocus={() => scrollToOffset(80)}
          />
          {formError ? (
            <AppText variant="footnote" color="danger">
              {formError}
            </AppText>
          ) : null}
          <AppButton
            label="Update Password"
            size="lg"
            fullWidth
            loading={submitting}
            onPress={() => void handleSubmit()}
          />
        </AuthFormCard>
      </View>
    </AuthScreenShell>
  );
}
