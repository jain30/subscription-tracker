import { useMemo, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import {
  Coins,
  Heart,
  Info,
  LogOut,
  Mail,
  MessageSquare,
  Shield,
  Trash2,
  UserRound,
} from 'lucide-react-native';

import { AnimatedSection } from '@/components/insights';
import {
  SettingsFooter,
  SettingsProfileHeader,
  SettingsRow,
  SettingsSectionCard,
} from '@/components/settings';
import { ConfirmSheet } from '@/components/subscriptions';
import { AppText, ScreenContainer } from '@/components/ui';
import { useAuthStore } from '@/features/auth';
import { useSubscriptionStore } from '@/features/subscriptions';
import { useTheme } from '@/theme';

const CONTENT_MAX_WIDTH = 560;
const SECTION_GAP = 28;
const APP_VERSION = '1.0.0';
const SUPPORT_EMAIL = 'jainpooja.vit@gmail.com';

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
 * Settings — streamlined, user-first personal finance control center.
 * Focused on account clarity, INR currency, direct support, and data privacy.
 */
export default function SettingsScreen() {
  const { theme } = useTheme();
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

  const handleContactSupport = async (type: 'support' | 'feedback' = 'support') => {
    const isFeedback = type === 'feedback';
    const subject = encodeURIComponent(
      isFeedback
        ? 'Subscription Tracker - Feature Request & Suggestions'
        : 'Subscription Tracker - Support Request',
    );
    const body = encodeURIComponent(
      `Hi Pooja,\n\n${
        isFeedback
          ? 'Here is my feedback/suggestion for Subscription Tracker:'
          : 'I need help with the following issue:'
      }\n\n[Write your message here]\n\n---\nAccount: ${profileEmail || 'Not signed in'}\nApp Version: ${APP_VERSION}\nPlatform: ${Platform.OS}`,
    );
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    if (Platform.OS === 'web') {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${subject}&body=${body}`;
      if (typeof window !== 'undefined') {
        const opened = window.open(gmailUrl, '_blank');
        if (!opened) {
          window.location.href = mailtoUrl;
        }
      }
      return;
    }

    try {
      await Linking.openURL(mailtoUrl);
    } catch {
      Alert.alert(
        'Contact Support',
        `Feel free to email us directly at:\n\n${SUPPORT_EMAIL}`,
        [{ text: 'OK' }],
      );
    }
  };

  const handleDeleteAccountRequest = () => {
    Alert.alert(
      'Delete Account',
      `To permanently delete your account and remove all your data, please tap below to email support from your registered address (${profileEmail || 'your email'}). We will process your deletion immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: () => void handleContactSupport() },
      ],
    );
  };

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
            Your account, currency, and data preferences
          </AppText>
        </View>

        {/* Profile Card */}
        <AnimatedSection delay={0}>
          <SettingsProfileHeader
            name={profileName}
            subtitle={profileSubtitle}
            badge="Cloud Synced"
            initials={profileInitials}
          />
        </AnimatedSection>

        {/* Account Details & Currency */}
        <AnimatedSection delay={50} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Account & Preferences">
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
              label="Default Currency"
              value="₹ INR (Indian Rupee)"
              showChevron={false}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        {/* Help & Support (Issue 7) */}
        <AnimatedSection delay={100} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Help & Support">
            <SettingsRow
              Icon={MessageSquare}
              label="Contact Support"
              value={SUPPORT_EMAIL}
              showChevron
              onPress={() => void handleContactSupport('support')}
            />
            <SettingsRow
              Icon={Heart}
              label="Send Feedback"
              value="Suggestions & Ideas"
              showChevron
              onPress={() => void handleContactSupport('feedback')}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        {/* Privacy & Security */}
        <AnimatedSection delay={150} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Privacy & Security">
            <SettingsRow
              Icon={Shield}
              label="Data Security"
              value="Row-Level Security (RLS)"
              showChevron={false}
              last
            />
          </SettingsSectionCard>
          <View style={{ paddingHorizontal: theme.spacing[2], marginTop: theme.spacing[2] }}>
            <AppText variant="footnote" color="secondary">
              Your financial records are isolated to your account. We never share or sell your subscription data.
            </AppText>
          </View>
        </AnimatedSection>

        {/* About */}
        <AnimatedSection delay={200} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="About">
            <SettingsRow
              Icon={Info}
              label="App Version"
              value={`${APP_VERSION} (Build 1)`}
              showChevron={false}
              last
            />
          </SettingsSectionCard>
        </AnimatedSection>

        {/* Account Actions */}
        <AnimatedSection delay={250} style={{ marginTop: SECTION_GAP }}>
          <SettingsSectionCard title="Account Actions">
            <SettingsRow
              Icon={LogOut}
              label="Sign out"
              destructive
              onPress={() => setSignOutVisible(true)}
            />
            <SettingsRow
              Icon={Trash2}
              label="Delete Account"
              destructive
              onPress={handleDeleteAccountRequest}
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

        <AnimatedSection delay={300}>
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
