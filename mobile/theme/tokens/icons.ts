/**
 * Icon configuration — Phase 3 UI/UX Blueprint §1.8
 *
 * Stroke-based icons (Lucide / SF-like). Outline by default; filled only for
 * selected tabs / active status. Do not use emoji as UI chrome.
 *
 * Future icon components should read sizes and stroke from these tokens.
 */

export const iconSize = {
  /** Inline meta (captions, dense chips) */
  sm: 16,
  /** Dense lists */
  md: 20,
  /** Default chrome / tab / actions (24×24 grid) */
  lg: 24,
  /** Emphasized empty-state or header icons */
  xl: 32,
} as const;

export const icons = {
  size: iconSize,
  /**
   * Optical stroke weight for rounded stroke icons.
   * Blueprint: 1.75–2px. Use 1.75 as default; 2 for larger sizes if needed.
   */
  strokeWidth: {
    default: 1.75,
    emphasis: 2,
  },
  /**
   * Recommended library for implementation phases.
   * Keep a single consistent set — do not mix icon families.
   */
  library: 'lucide-react-native' as const,
  /**
   * Default semantic color roles for icons (resolved against theme colors
   * at usage time — these are role names, not hex values).
   */
  colorRole: {
    default: 'text.secondary',
    primary: 'text.primary',
    brand: 'brand.primary',
    muted: 'text.tertiary',
    danger: 'danger',
    inverse: 'text.inverse',
  },
} as const;

export type Icons = typeof icons;
export type IconSizeKey = keyof typeof iconSize;
