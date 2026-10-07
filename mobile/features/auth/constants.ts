/**
 * Auth / onboarding copy and timing — Phase 15.
 */

export const APP_NAME = 'Subscription Tracker';
export const APP_TAGLINE = 'See every charge before it hits.';

export const SPLASH_DURATION_MS = 2000;

export const ONBOARDING_PAGES = [
  {
    id: 'track',
    title: 'Track Every Subscription',
    subtitle: 'Keep every recurring payment organized in one place.',
    illustration: 'track' as const,
  },
  {
    id: 'renewal',
    title: 'See What Is Coming Up',
    subtitle:
      'View upcoming renewals, trials ending soon, and items that need attention in the app.',
    illustration: 'renewal' as const,
  },
  {
    id: 'insights',
    title: 'Understand Your Spending',
    subtitle: 'See estimated monthly and yearly spend by currency.',
    illustration: 'insights' as const,
  },
] as const;

export type OnboardingIllustrationKey =
  (typeof ONBOARDING_PAGES)[number]['illustration'];
