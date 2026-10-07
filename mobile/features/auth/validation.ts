import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from './types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email is required';
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address';
  }
  return undefined;
}

export function validatePassword(
  password: string,
  label = 'Password',
): string | undefined {
  if (!password) {
    return `${label} is required`;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `${label} must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return undefined;
}

export function validateLoginForm(
  values: LoginFormValues,
): FieldErrors<LoginFormValues> {
  const errors: FieldErrors<LoginFormValues> = {};
  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }
  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  return errors;
}

export function validateRegisterForm(
  values: RegisterFormValues,
): FieldErrors<RegisterFormValues> {
  const errors: FieldErrors<RegisterFormValues> = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues,
): FieldErrors<ForgotPasswordFormValues> {
  const errors: FieldErrors<ForgotPasswordFormValues> = {};
  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }
  return errors;
}

export function validateResetPasswordForm(
  values: ResetPasswordFormValues,
): FieldErrors<ResetPasswordFormValues> {
  const errors: FieldErrors<ResetPasswordFormValues> = {};

  const passwordError = validatePassword(values.password, 'New password');
  if (passwordError) {
    errors.password = passwordError;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export function isFormValid<T extends object>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length === 0;
}

export { normalizeEmail, MIN_PASSWORD_LENGTH };
