/**
 * Color tokens — Phase 3 UI/UX Blueprint §1.3
 *
 * Single source of truth for palette values. Screens and components must
 * consume these tokens (via `useTheme()` / `theme.colors`) — never raw hex.
 */

export const palette = {
  /** Soft cool gray app canvas */
  fog: '#F3F6F8',
  /** Soft teal wash for splash / brand moments */
  mist: '#E6F4F2',
  white: '#FFFFFF',
  /** Grouped backgrounds / chips */
  mistGray: '#E8EEF2',
  /** Near-ink primary text */
  ink: '#0F1C24',
  slate: '#5B6B76',
  muted: '#8A9AA6',
  /** Deep teal brand */
  teal: '#0B6E6A',
  tealPressed: '#085652',
  tealSoft: '#D7F0EE',
  /** Premium / rare emphasis */
  amber: '#C9832A',
  success: '#1F8A5B',
  warning: '#C47A12',
  danger: '#C23B3B',
  border: '#D5DEE5',
} as const;

/**
 * Semantic color roles mapped for UI consumption.
 * Nested structure mirrors blueprint token names (`color.bg.app`, etc.).
 */
export const colors = {
  bg: {
    app: palette.fog,
    surface: palette.white,
    subtle: palette.mistGray,
    brandWash: palette.mist,
  },
  text: {
    primary: palette.ink,
    secondary: palette.slate,
    tertiary: palette.muted,
    inverse: palette.white,
    /** Text on solid brand buttons */
    onBrand: palette.white,
  },
  brand: {
    primary: palette.teal,
    primaryPressed: palette.tealPressed,
    soft: palette.tealSoft,
  },
  accent: palette.amber,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  border: palette.border,
  /**
   * Modal / sheet scrim — ink @ 40%.
   * Prefer this over stacking opacity styles when possible.
   */
  overlay: 'rgba(15, 28, 36, 0.4)',
  /**
   * Muted category accents — soft pastels on a shared neutral base.
   * Never use as the sole status indicator; pair with label/icon.
   */
  category: {
    streaming: '#E8D5F2',
    productivity: '#D5E4F7',
    health: '#D7F0E4',
    finance: '#F5E6C8',
    shopping: '#F5D9D6',
    other: '#E8EEF2',
  },
  /**
   * Status fills (muted). Always pair with a text label.
   */
  status: {
    active: palette.tealSoft,
    trial: '#F5E6C8',
    canceled: palette.mistGray,
    dueSoon: '#F8E8CC',
    overdue: '#F5D9D6',
  },
} as const;

export type Colors = typeof colors;
export type CategoryKey = keyof typeof colors.category;
export type StatusKey = keyof typeof colors.status;
