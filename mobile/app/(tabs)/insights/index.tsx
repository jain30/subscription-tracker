import { AppHeader, AppText, ScreenContainer } from '@/components';

/**
 * Insights tab root — placeholder only (Phase 6).
 * Future: spend overview, category breakdown.
 */
export default function InsightsScreen() {
  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <AppHeader title="Insights" />
      <AppText variant="title1">Insights</AppText>
    </ScreenContainer>
  );
}
