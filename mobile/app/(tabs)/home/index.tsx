import { AppHeader, AppText, ScreenContainer } from '@/components';

/**
 * Home tab root — placeholder only (Phase 6).
 * Future: dashboard totals, upcoming renewals, FAB.
 */
export default function HomeScreen() {
  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <AppHeader title="Home" />
      <AppText variant="title1">Home</AppText>
    </ScreenContainer>
  );
}
