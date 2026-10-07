import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { MailCheck } from 'lucide-react-native';

import { AuthFormCard, AuthScreenShell } from '@/components/auth';
import { AppButton, AppInput, AppText } from '@/components/ui';
import {
  AuthError,
  isFormValid,
  useAuthStore,
  validateForgotPasswordForm,
  type FieldErrors,
  type ForgotPasswordFormValues,
} from '@/features/auth';
import { useTheme } from '@/theme';

const INITIAL: ForgotPasswordFormValues = {
  email: '',
};

/**
 * Forgot password — Supabase recovery email (redirect via app scheme).
 */
export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const requestPasswordReset = useAuthStore(
    (state) => state.requestPasswordReset,
  );
  const [values, setValues] = useState<ForgotPasswordFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors<ForgotPasswordFormValues>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const nextErrors = validateForgotPasswordForm(values);
    setErrors(nextErrors);
    setFormError(null);
    if (!isFormValid(nextErrors)) {
      return;
    }

    setSubmitting(true);
    try {
      await requestPasswordReset(values.email);
      setSent(true);
    } catch (error) {
      if (error instanceof AuthError) {
        setFormError(error.message);
        return;
      }
      setFormError('Unable to send a reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthScreenShell title="Check Email" showBack>
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
            <MailCheck
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
              Check your email
            </AppText>
            <AppText
              variant="callout"
              color="secondary"
              style={{ textAlign: 'center', maxWidth: 300 }}
            >
              If an account exists for {values.email.trim()}, you will receive a
              password reset link shortly. Open the link on this device to
              continue.
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
              label="Back to Log In"
              size="lg"
              fullWidth
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      </AuthScreenShell>
    );
  }

  return (
    <AuthScreenShell title="Forgot Password" showBack>
      <View style={{ gap: theme.spacing[5], marginTop: theme.spacing[2] }}>
        <View style={{ gap: theme.spacing[2] }}>
          <AppText variant="title1" color="primary">
            Reset your password
          </AppText>
          <AppText variant="callout" color="secondary">
            Enter the email associated with your account and we&apos;ll send a
            reset link.
          </AppText>
        </View>

        <AuthFormCard>
          <AppInput
            label="Email"
            value={values.email}
            onChangeText={(text) => {
              setValues({ email: text });
              setFormError(null);
              if (errors.email) {
                setErrors({});
              }
            }}
            errorMessage={errors.email}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="you@example.com"
          />
          {formError ? (
            <AppText variant="footnote" color="danger">
              {formError}
            </AppText>
          ) : null}
          <AppButton
            label="Send Reset Link"
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
