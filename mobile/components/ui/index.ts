/**
 * Core UI primitives — Phase 5 component library.
 *
 * Import from `@/components` (or `@/components/ui`) in future screens.
 * Do not add feature-specific or screen-level components here.
 */

export { AppText } from './AppText';
export type { AppTextProps, AppTextVariant, AppTextColor } from './AppText';

export { AppButton } from './AppButton';
export type {
  AppButtonProps,
  AppButtonVariant,
  AppButtonSize,
} from './AppButton';

export { AppInput } from './AppInput';
export type { AppInputProps } from './AppInput';

export { AppCard } from './AppCard';
export type { AppCardProps, AppCardVariant } from './AppCard';

export { ScreenContainer } from './ScreenContainer';
export type { ScreenContainerProps } from './ScreenContainer';

export { AppHeader } from './AppHeader';
export type { AppHeaderProps } from './AppHeader';

export { AppDivider } from './AppDivider';
export type { AppDividerProps } from './AppDivider';

export { AppBadge } from './AppBadge';
export type { AppBadgeProps, AppBadgeVariant } from './AppBadge';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { LoadingSkeleton } from './LoadingSkeleton';
export type {
  LoadingSkeletonProps,
  LoadingSkeletonVariant,
} from './LoadingSkeleton';
