import type { TextStyle } from 'react-native';

/**
 * Typography tokens — Phase 3 UI/UX Blueprint §1.4
 *
 * Display: Fraunces (brand / empty-state titles)
 * UI / body / amounts: Plus Jakarta Sans
 * Amounts: always enable tabular nums via `fontVariant`.
 *
 * `fontFamily` values match the PostScript names registered by expo-font
 * when loading `@expo-google-fonts/*` assets (see `theme/fonts.ts`).
 */

export const fontFamily = {
  /** UI / body / amounts */
  sans: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semibold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
  },
  /** Display / brand moments only */
  display: {
    regular: 'Fraunces_400Regular',
    medium: 'Fraunces_500Medium',
    semibold: 'Fraunces_600SemiBold',
  },
} as const;

type TextStyleToken = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'fontVariant' | 'letterSpacing'
>;

function lh(size: number, ratio: number): number {
  return Math.round(size * ratio);
}

/**
 * Named text styles. Use `theme.typography.<style>` in StyleSheet / Text.
 */
export const typography = {
  /** Onboarding brand, rare heroes — Fraunces */
  display: {
    fontFamily: fontFamily.display.semibold,
    fontSize: 34,
    lineHeight: lh(34, 1.25),
  } satisfies TextStyleToken,

  /** Screen titles */
  title1: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: 28,
    lineHeight: lh(28, 1.25),
  } satisfies TextStyleToken,

  /** Section headers */
  title2: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: 22,
    lineHeight: lh(22, 1.25),
  } satisfies TextStyleToken,

  /** Card / row titles */
  title3: {
    fontFamily: fontFamily.sans.medium,
    fontSize: 18,
    lineHeight: lh(18, 1.3),
  } satisfies TextStyleToken,

  /** Primary content */
  body: {
    fontFamily: fontFamily.sans.regular,
    fontSize: 16,
    lineHeight: lh(16, 1.45),
  } satisfies TextStyleToken,

  /** Emphasized body */
  bodyStrong: {
    fontFamily: fontFamily.sans.medium,
    fontSize: 16,
    lineHeight: lh(16, 1.45),
  } satisfies TextStyleToken,

  /** Secondary paragraphs */
  callout: {
    fontFamily: fontFamily.sans.regular,
    fontSize: 15,
    lineHeight: lh(15, 1.45),
  } satisfies TextStyleToken,

  /** List meta */
  subhead: {
    fontFamily: fontFamily.sans.medium,
    fontSize: 14,
    lineHeight: lh(14, 1.4),
  } satisfies TextStyleToken,

  /** Helper text */
  footnote: {
    fontFamily: fontFamily.sans.regular,
    fontSize: 13,
    lineHeight: lh(13, 1.4),
  } satisfies TextStyleToken,

  /** Badges, timestamps */
  caption: {
    fontFamily: fontFamily.sans.medium,
    fontSize: 12,
    lineHeight: lh(12, 1.35),
  } satisfies TextStyleToken,

  /** Monthly total — tabular nums */
  amountLg: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: 32,
    lineHeight: lh(32, 1.2),
    fontVariant: ['tabular-nums'],
  } satisfies TextStyleToken,

  /** Row amounts — tabular nums */
  amountMd: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: 18,
    lineHeight: lh(18, 1.2),
    fontVariant: ['tabular-nums'],
  } satisfies TextStyleToken,

  /** Compact money — tabular nums */
  amountSm: {
    fontFamily: fontFamily.sans.medium,
    fontSize: 14,
    lineHeight: lh(14, 1.2),
    fontVariant: ['tabular-nums'],
  } satisfies TextStyleToken,

  /** Button labels */
  button: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: 16,
    lineHeight: lh(16, 1.25),
  } satisfies TextStyleToken,

  /** Compact button labels */
  buttonSm: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: 14,
    lineHeight: lh(14, 1.25),
  } satisfies TextStyleToken,
} as const;

export type Typography = typeof typography;
export type TypographyKey = keyof typeof typography;
export type FontFamily = typeof fontFamily;
