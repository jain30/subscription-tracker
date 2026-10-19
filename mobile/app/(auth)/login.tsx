import { useState } from "react";
import { Pressable, View } from "react-native";
import { Redirect, router } from "expo-router";

import {
  AuthFooterLink,
  AuthFormCard,
  AuthScreenShell,
} from "@/components/auth";
import { AppButton, AppInput, AppText } from "@/components/ui";
import {
  AuthError,
  isFormValid,
  useAuthStore,
  validateLoginForm,
  type FieldErrors,
  type LoginFormValues,
} from "@/features/auth";
import { useTheme } from "@/theme";

const INITIAL: LoginFormValues = {
  email: "",
  password: "",
};

/**
 * Email + password login — Supabase Auth verifies credentials.
 * Social login intentionally omitted until implemented.
 */
export default function LoginScreen() {
  const { theme } = useTheme();
  const login = useAuthStore((state) => state.login);
  const session = useAuthStore((state) => state.session);
  const passwordRecoveryPending = useAuthStore(
    (state) => state.passwordRecoveryPending,
  );
  const hydrated = useAuthStore((state) => state.hydrated);
  const [values, setValues] = useState<LoginFormValues>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors<LoginFormValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (hydrated && passwordRecoveryPending) {
    return <Redirect href="/(auth)/reset-password" />;
  }

  if (hydrated && session) {
    return <Redirect href="/(tabs)/home" />;
  }

  const update = <K extends keyof LoginFormValues>(
    key: K,
    value: LoginFormValues[K],
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

    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);
    setFormError(null);
    if (!isFormValid(nextErrors)) {
      return;
    }

    setSubmitting(true);
    try {
      await login(values.email, values.password);
      router.replace("/(tabs)/home");
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.code === "EMAIL_NOT_CONFIRMED") {
          setFormError(error.message);
          return;
        }
        if (error.code === "INVALID_EMAIL") {
          setErrors({ email: error.message });
          return;
        }
        if (error.code === "WEAK_PASSWORD") {
          setErrors({ password: error.message });
          return;
        }
        setFormError(error.message);
        return;
      }
      setFormError("Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell title="Log In" showBack>
      <View style={{ gap: theme.spacing[5], marginTop: theme.spacing[2] }}>
        <View style={{ gap: theme.spacing[2] }}>
          <AppText variant="title1" color="primary">
            Welcome back
          </AppText>
          <AppText variant="callout" color="secondary">
            Sign in to continue managing your subscriptions.
          </AppText>
        </View>

        <AuthFormCard>
          <AppInput
            label="Email"
            value={values.email}
            onChangeText={(text) => update("email", text)}
            errorMessage={errors.email}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="you@example.com"
          />
          <AppInput
            label="Password"
            value={values.password}
            onChangeText={(text) => update("password", text)}
            errorMessage={errors.password}
            password
            autoComplete="password"
            textContentType="password"
            placeholder="Your password"
          />

          {formError ? (
            <AppText variant="footnote" color="danger">
              {formError}
            </AppText>
          ) : null}

          <Pressable
            onPress={() => router.push("/(auth)/forgot-password")}
            accessibilityRole="button"
            accessibilityLabel="Forgot password"
            hitSlop={theme.spacing[2]}
            style={{ alignSelf: "flex-end" }}
          >
            <AppText variant="subhead" color="brand">
              Forgot Password
            </AppText>
          </Pressable>

          <AppButton
            label="Log In"
            size="lg"
            fullWidth
            loading={submitting}
            onPress={() => void handleSubmit()}
          />
        </AuthFormCard>

        <AuthFooterLink
          prompt="Don't have an account?"
          actionLabel="Create Account"
          onPress={() => router.replace("/(auth)/register")}
        />
      </View>
    </AuthScreenShell>
  );
}
