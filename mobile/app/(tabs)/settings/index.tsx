import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Bell,
  CalendarDays,
  CircleHelp,
  Clock3,
  Coins,
  Download,
  FileText,
  Globe2,
  Heart,
  Info,
  Languages,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  RotateCcw,
  Scale,
  Shield,
  Star,
  Trash2,
  Upload,
  UserRound,
  WalletCards,
} from 'lucide-react-native';

import { AnimatedSection } from '@/components/insights';
import {
  AppearanceCard,
  SettingsFooter,
  SettingsProfileHeader,
  SettingsRow,
  SettingsSectionCard,
  SettingsSwitchRow,
} from '@/components/settings';
import { ConfirmSheet } from '@/components/subscriptions';
import { AppText, ScreenContainer } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { mockSettingsSnapshot } from '@/features/settings';
import { useSubscriptionStore } from '@/features/subscriptions';
import { useTheme } from '@/theme';

const CONTENT_MAX_WIDTH = 560;
const SECTION_GAP = 28;
const APP_VERSION = '1.0.0';
const COMING_SOON = 'Coming soon';

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'ST';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

/**
 * Settings — approved section structure with honest unavailable controls.
 * Real: profile name/email, subscription count, sign out.
 */
export default function SettingsScreen() {
  const { theme } = useTheme();
  const presentation = mockSettingsSnapshot;
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const subscriptionCount = useSubscriptionStore(
    (state) => state.subscriptions.length,
  );
  const profileName = session?.user.fullName ?? 'Subscription Tracker User';
  const profileEmail = session?.user.email ?? '';
  const profileInitials = useMemo(
    () => initialsFromName(profileName),
    [profileName],
  );
  const profileSubtitle =
    subscriptionCount === 1
      ? 'Managing 1 subscription'
      : `Managing ${subscriptionCount} subscriptions`;

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await logout();
      setSignOutVisible(false);
      router.replace('/(auth)/welcome');
    } catch {
      setSignOutError('Unable to sign out. Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          theme.colors.bg.brandWash,
          theme.colors.bg.app,
          theme.colors.bg.app,
        ]}
        locations={[0, 0.16, 1]}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      <ScreenContainer
        edges={['top', 'left', 'right']}
        scroll
        style={{ backgroundColor: 'transparent' }}
        contentStyle={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          alignSelf: 'center',
          paddingTop: theme.spacing[2],
          paddingBottom: theme.spacing[12],
        }}
      >
        <View style={{ marginBottom: theme.spacing[5], gap: theme.spacing[1] }}>
          <AppText
            variant="title1"
            color="primary"
            style={{
              fontSize: 32,
              lineHeight: 38,
              letterSpacing: -0.6,
            }}
          >
            Settings
          </AppText>
          <AppText variant="callout" color="secondary">
            Control your subscription experience
          </AppText>
        </View>

        <AnimatedSection delay={0}>
          <SettingsProfileHeader
            name={profileName}
            subtitle={profileSubtitle}
            badge="Signed in"
            initials={profileInitials}
          />
        </AnimatedSection>

        <AnimatedSection delay={50} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Account">
            <SettingsRow
              Icon={UserRound}
              label="Full Name"
              value={profileName}
              showChevron={false}
            />
            <SettingsRow
              Icon={Mail}
              label="Email"
              value={profileEmail || '—'}
              showChevron={false}
            />
            <SettingsRow
              Icon={Coins}
              label="Currency"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Globe2}
              label="Region"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Languages}
              label="Language"
              value={COMING_SOON}
              showChevron={false}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        <AnimatedSection delay={90} style={{ marginTop: SECTION_GAP }}>
          <AppearanceCard
            themeValue={presentation.theme}
            accents={presentation.accents}
            selectedAccentId={presentation.selectedAccentId}
            unavailable
          />
        </AnimatedSection>

        <AnimatedSection delay={130} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Notifications">
            {presentation.notifications.map((item, index) => (
              <SettingsSwitchRow
                key={item.id}
                label={item.label}
                unavailable
                last={index === presentation.notifications.length - 1}
              />
            ))}
          </SettingsSectionCard>
        </AnimatedSection>

        <AnimatedSection delay={170} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Billing Preferences">
            <SettingsRow
              Icon={WalletCards}
              label="Default currency"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={CalendarDays}
              label="Billing cycle preference"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Bell}
              label="First day of month"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Clock3}
              label="Time zone"
              value={COMING_SOON}
              showChevron={false}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        <AnimatedSection delay={210} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Data & Privacy">
            <SettingsRow
              Icon={Download}
              label="Export data"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Upload}
              label="Import subscriptions"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Shield}
              label="Backup"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Lock}
              label="Privacy policy"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={FileText}
              label="Terms"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Scale}
              label="Permissions"
              value={COMING_SOON}
              showChevron={false}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        <AnimatedSection delay={250} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Support">
            <SettingsRow
              Icon={LifeBuoy}
              label="Help Center"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={CircleHelp}
              label="FAQs"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={MessageSquare}
              label="Contact Support"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Heart}
              label="Send Feedback"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Star}
              label="Rate this App"
              value={COMING_SOON}
              showChevron={false}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        <AnimatedSection delay={290} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="About">
            <SettingsRow
              Icon={Info}
              label="App Version"
              value={APP_VERSION}
              showChevron={false}
            />
            <SettingsRow
              Icon={Info}
              label="Build"
              value={presentation.about.build}
              showChevron={false}
            />
            <SettingsRow
              Icon={UserRound}
              label="Developer"
              value={presentation.about.developer}
              showChevron={false}
            />
            <SettingsRow
              Icon={FileText}
              label="Open Source Licenses"
              value={COMING_SOON}
              showChevron={false}
            />
            <SettingsRow
              Icon={Heart}
              label="Acknowledgements"
              value={COMING_SOON}
              showChevron={false}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        <AnimatedSection delay={330} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Danger Zone">
            <SettingsRow
              Icon={RotateCcw}
              label="Reset mock data"
              value={COMING_SOON}
              destructive
              showChevron={false}
            />
            <SettingsRow
              Icon={Trash2}
              label="Delete all subscriptions"
              value={COMING_SOON}
              destructive
              showChevron={false}
            />
            <SettingsRow
              Icon={LogOut}
              label="Sign out"
              destructive
              onPress={() => setSignOutVisible(true)}
              last
            />
          </SettingsSectionCard>
          {signOutError ? (
            <AppText
              variant="footnote"
              color="danger"
              style={{ marginTop: theme.spacing[2] }}
            >
              {signOutError}
            </AppText>
          ) : null}
        </AnimatedSection>

        <AnimatedSection delay={360}>
          <SettingsFooter version={APP_VERSION} />
        </AnimatedSection>
      </ScreenContainer>

      <ConfirmSheet
        visible={signOutVisible}
        title="Sign out?"
        message="You'll need to log in again to access your subscriptions on this device."
        confirmLabel={signingOut ? 'Signing out…' : 'Sign out'}
        cancelLabel="Cancel"
        destructive
        onConfirm={() => {
          if (!signingOut) {
            void handleSignOut();
          }
        }}
        onCancel={() => {
          if (!signingOut) {
            setSignOutVisible(false);
          }
        }}
      />
    </View>
  );
}
