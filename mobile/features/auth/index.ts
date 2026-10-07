export { useAuthStore } from './store';
export type { AuthStoreState } from './store';

export {
  APP_NAME,
  APP_TAGLINE,
  ONBOARDING_PAGES,
  SPLASH_DURATION_MS,
} from './constants';
export type { OnboardingIllustrationKey } from './constants';

export {
  validateEmail,
  validatePassword,
  validateLoginForm,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
  isFormValid,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
} from './validation';
export type { FieldErrors } from './validation';

export type {
  AuthUser,
  AuthSession,
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  RegisterResult,
  AuthFailureCode,
} from './types';

export { AuthError } from './types';
export { mapAuthError } from './errors';
export {
  getPasswordResetRedirectUrl,
  getEmailConfirmRedirectUrl,
  AUTH_RESET_PATH,
} from './session';
