/**
 * Color tokens — Phase 3 UI/UX Blueprint §1.3
 *
 * Single source of truth for palette values. Screens and components must
 * consume these tokens (via `useTheme()` / `theme.colors`) — never raw hex.
 */

export const palette = {
  /** Soft cool gray app canvas */
  fog: '#F2F5F7',
  /** Soft teal wash for splash / brand moments */
  mist: '#E4F3F1',
  white: '#FFFFFF',
  /** Grouped backgrounds / chips */
  mistGray: '#E7EDF1',
  /** Near-ink primary text */
  ink: '#0E1A21',
  slate: '#5A6A75',
  muted: '#8797A3',
  /** Deep teal brand */
  teal: '#0A6B67',
  tealPressed: '#07514E',
  tealSoft: '#D4EFED',
  /** Premium / rare emphasis */
  amber: '#C27D28',
  success: '#1E8558',
  warning: '#BF7611',
  danger: '#B83A3A',
  border: '#D2DBE2',
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
   * Keep in sync with `features/subscriptions/catalog/categories`.
   * Never use as the sole status indicator; pair with label/icon.
   */
  category: {
    entertainment: '#E8D5F2',
    music: '#F5D0E8',
    video_streaming: '#D9D4F7',
    cloud_storage: '#D5EAF7',
    productivity: '#D5E4F7',
    education: '#D7ECF5',
    fitness: '#D9F2DE',
    health: '#D7F0E4',
    gaming: '#E0D7F5',
    shopping: '#F5D9D6',
    finance: '#F5E6C8',
    news: '#E4E8F0',
    developer_tools: '#D6E8E4',
    ai_tools: '#E6D9F5',
    business: '#DCE4F0',
    food: '#F5E0D0',
    travel: '#D5EEF5',
    utilities: '#E8EEF2',
    security: '#D8E8F0',
    kids: '#F5E8D5',
    other: '#E8EEF2',
    /** @deprecated legacy alias — prefer video_streaming */
    streaming: '#D9D4F7',
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
