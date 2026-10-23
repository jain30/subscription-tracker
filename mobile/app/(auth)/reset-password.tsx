import { useRef, useState } from 'react';
import { Keyboard, ScrollView, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ShieldAlert, ShieldCheck } from 'lucide-react-native';

import { AuthFormCard, AuthScreenShell } from '@/components/auth';
import { AppButton, AppInput, AppText } from '@/components/ui';
import {
  AuthError,
  isFormValid,
  useAuthStore,
  validateEmail,
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
 * Reset password — requires a Supabase recovery session (from email link or verified 6-digit OTP).
 */
export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const searchParams = useLocalSearchParams<{ error?: string }>();
  const passwordRecoveryPending = useAuthStore(
    (state) => state.passwordRecoveryPending,
  );
  const recoveryEmail = useAuthStore((state) => state.recoveryEmail);
  const hydrated = useAuthStore((state) => state.hydrated);
  const updatePassword = useAuthStore((state) => state.updatePassword);
  const verifyRecoveryOtp = useAuthStore((state) => state.verifyRecoveryOtp);

  // Unconditional refs at the top level of the component
  const confirmPasswordRef = useRef<TextInput>(null);
  const otpInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  // Password reset form state
  const [values, setValues] = useState<ResetPasswordFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors<ResetPasswordFormValues>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false);

  // Recovery code verification state — derived without useEffect cascading renders
  const [enteredEmail, setEnteredEmail] = useState<string | null>(null);
  const otpEmail = enteredEmail ?? recoveryEmail ?? '';
  const [otpCode, setOtpCode] = useState('');
  const [otpEmailError, setOtpEmailError] = useState<string | null>(null);
  const [otpCodeError, setOtpCodeError] = useState<string | null>(null);
  const [localOtpError, setLocalOtpError] = useState<string | null>(null);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const displayOtpError = localOtpError ?? searchParams.error ?? null;
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

  const handleVerifyOtp = async () => {
    setOtpEmailError(null);
    setOtpCodeError(null);
    setLocalOtpError(null);

    const emailErr = validateEmail(otpEmail);
    if (emailErr) {
      setOtpEmailError(emailErr);
      return;
    }

    const cleanCode = otpCode.trim();
    if (!cleanCode) {
      setOtpCodeError('Enter the 6-digit code');
      return;
    }
    if (cleanCode.length < 6) {
      setOtpCodeError('Code must be 6 digits');
      return;
    }

    setVerifyingOtp(true);
    try {
      await verifyRecoveryOtp(otpEmail, cleanCode);
    } catch (error) {
      if (error instanceof AuthError) {
        setLocalOtpError(error.message);
        return;
      }
      setLocalOtpError('Invalid or expired recovery code. Please try again.');
    } finally {
      setVerifyingOtp(false);
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

  const scrollToOffset = (offsetY: number) => {
    scrollRef.current?.scrollTo({ y: offsetY, animated: true });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 60);
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
      <AuthScreenShell title="Reset Password" showBack scrollRef={scrollRef}>
        <View style={{ gap: theme.spacing[5], marginTop: theme.spacing[2] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <AppText variant="title1" color="primary">
              Enter recovery code
            </AppText>
            <AppText variant="callout" color="secondary">
              Enter your email and the 6-digit recovery code sent to your inbox
              to reset your password.
            </AppText>
          </View>

          {displayOtpError ? (
            <View
              style={{
                padding: theme.spacing[4],
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.status.overdue,
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing[3],
              }}
            >
              <ShieldAlert
                size={theme.icons.size.md}
                strokeWidth={theme.icons.strokeWidth.default}
                color={theme.colors.danger}
              />
              <AppText
                variant="subhead"
                color="danger"
                style={{ flex: 1 }}
              >
                {displayOtpError}
              </AppText>
            </View>
          ) : null}

          <AuthFormCard>
            <AppInput
              label="Email Address"
              value={otpEmail}
              onChangeText={(text) => {
                setEnteredEmail(text);
                setOtpEmailError(null);
                setLocalOtpError(null);
              }}
              errorMessage={otpEmailError ?? undefined}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="name@example.com"
              returnKeyType="next"
              onSubmitEditing={() => otpInputRef.current?.focus()}
            />
            <AppInput
              ref={otpInputRef}
              label="6-Digit Recovery Code"
              value={otpCode}
              onChangeText={(text) => {
                setOtpCode(text);
                setOtpCodeError(null);
                setLocalOtpError(null);
              }}
              errorMessage={otpCodeError ?? undefined}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="123456"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
                void handleVerifyOtp();
              }}
            />
            <AppButton
              label="Verify Code"
              size="lg"
              fullWidth
              loading={verifyingOtp}
              onPress={() => void handleVerifyOtp()}
            />
          </AuthFormCard>

          <View
            style={{
              width: '100%',
              gap: theme.layout.stackedCtaGap,
              marginTop: theme.spacing[2],
            }}
          >
            <AppButton
              label="Request New Link"
              variant="secondary"
              size="lg"
              fullWidth
              onPress={() => router.replace('/(auth)/forgot-password')}
            />
            <AppButton
              label="Back to Log In"
              variant="ghost"
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
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            onFocus={() => scrollToOffset(0)}
          />
          <AppInput
            ref={confirmPasswordRef}
            label="Confirm Password"
            value={values.confirmPassword}
            onChangeText={(text) => update('confirmPassword', text)}
            errorMessage={errors.confirmPassword}
            password
            autoComplete="new-password"
            textContentType="newPassword"
            placeholder="Re-enter password"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              void handleSubmit();
            }}
            onFocus={scrollToBottom}
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
