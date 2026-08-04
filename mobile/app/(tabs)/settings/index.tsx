import { AppHeader, AppText, ScreenContainer } from '@/components';

/**
 * Settings tab root — placeholder only (Phase 6).
 * Future: profile, preferences, premium, legal.
 */
export default function SettingsScreen() {
  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <AppHeader title="Settings" />
      <AppText variant="title1">Settings</AppText>
    </ScreenContainer>
  );
}
