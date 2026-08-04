import { AppHeader, AppText, ScreenContainer } from '@/components';

/**
 * Subscriptions tab root — placeholder only (Phase 6).
 * Future: list, search/filter, detail, edit routes in this stack.
 */
export default function SubscriptionsScreen() {
  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <AppHeader title="Subscriptions" />
      <AppText variant="title1">Subscriptions</AppText>
    </ScreenContainer>
  );
}
