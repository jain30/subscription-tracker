import { useRef, useState } from 'react';
import { Keyboard, ScrollView, TextInput, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MailCheck } from 'lucide-react-native';

import {
  AuthFooterLink,
  AuthFormCard,
  AuthScreenShell,
} from '@/components/auth';
import { AppButton, AppInput, AppText } from '@/components/ui';
import {
  AuthError,
  isFormValid,
  useAuthStore,
  validateRegisterForm,
  type FieldErrors,
  type RegisterFormValues,
} from '@/features/auth';
import { useTheme } from '@/theme';

const INITIAL: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/**
 * Create account — Supabase Auth signup; profile row created by DB trigger.
 */
export default function RegisterScreen() {
  const { theme } = useTheme();
  const register = useAuthStore((state) => state.register);
  const session = useAuthStore((state) => state.session);
  const passwordRecoveryPending = useAuthStore(
    (state) => state.passwordRecoveryPending,
  );
  const hydrated = useAuthStore((state) => state.hydrated);
  const [values, setValues] = useState<RegisterFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors<RegisterFormValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToOffset = (offsetY: number) => {
    scrollRef.current?.scrollTo({ y: offsetY, animated: true });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 60);
  };

  if (hydrated && passwordRecoveryPending) {
    return <Redirect href="/(auth)/reset-password" />;
  }

  if (hydrated && session && !awaitingConfirmation) {
    return <Redirect href="/(tabs)/home" />;
  }

  const update = <K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
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
    if (submitting) {
      return;
    }

    const nextErrors = validateRegisterForm(values);
    setErrors(nextErrors);
    setFormError(null);
    if (!isFormValid(nextErrors)) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await register(values);
      if (result.needsEmailConfirmation) {
        setAwaitingConfirmation(true);
        return;
      }
      router.replace('/(tabs)/home');
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.code === 'EMAIL_TAKEN') {
          setErrors({ email: error.message });
          return;
        }
        if (error.code === 'INVALID_EMAIL') {
          setErrors({ email: error.message });
          return;
        }
        if (error.code === 'WEAK_PASSWORD') {
          setErrors({ password: error.message });
          return;
        }
        setFormError(error.message);
        return;
      }
      setFormError('Unable to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (awaitingConfirmation) {
    return (
      <AuthScreenShell title="Check Email" showBack={false}>
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
              Confirm your email
            </AppText>
            <AppText
              variant="callout"
              color="secondary"
              style={{ textAlign: 'center', maxWidth: 300 }}
            >
              We sent a confirmation link to {values.email.trim()}. Open it to
              activate your account, then log in.
            </AppText>
          </View>

          <AppButton
            label="Back to Log In"
            size="lg"
            fullWidth
            onPress={() => router.replace('/(auth)/login')}
            style={{ width: '100%', marginTop: theme.spacing[4] }}
          />
        </View>
      </AuthScreenShell>
    );
  }


  return (
    <AuthScreenShell title="Create Account" showBack scrollRef={scrollRef}>
      <View style={{ gap: theme.spacing[5], marginTop: theme.spacing[2] }}>
        <View style={{ gap: theme.spacing[2] }}>
          <AppText variant="title1" color="primary">
            Join Subscription Tracker
          </AppText>
          <AppText variant="callout" color="secondary">
            Create an account to keep every renewal organized.
          </AppText>
        </View>

        <AuthFormCard>
          <AppInput
            label="Full Name"
            value={values.fullName}
            onChangeText={(text) => update('fullName', text)}
            errorMessage={errors.fullName}
            autoComplete="name"
            textContentType="name"
            placeholder="Alex Morgan"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            onFocus={() => scrollToOffset(0)}
          />
          <AppInput
            ref={emailRef}
            label="Email"
            value={values.email}
            onChangeText={(text) => update('email', text)}
            errorMessage={errors.email}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="you@example.com"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            onFocus={() => scrollToOffset(0)}
          />
          <AppInput
            ref={passwordRef}
            label="Password"
            value={values.password}
            onChangeText={(text) => update('password', text)}
            errorMessage={errors.password}
            password
            autoComplete="new-password"
            textContentType="newPassword"
            placeholder="At least 8 characters"
            helperText="Minimum 8 characters"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            onFocus={() => scrollToOffset(80)}
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
            label="Create Account"
            size="lg"
            fullWidth
            loading={submitting}
            onPress={() => void handleSubmit()}
          />
        </AuthFormCard>

        <AuthFooterLink
          prompt="Already have an account?"
          actionLabel="Log In"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </AuthScreenShell>
  );
}
