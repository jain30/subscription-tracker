import { View } from 'react-native';
import { router } from 'expo-router';

import { AuthScreenShell, BrandMark } from '@/components/auth';
import { AppButton, AppText } from '@/components/ui';
import { APP_TAGLINE } from '@/features/auth';
import { useTheme } from '@/theme';

/**
 * Post-onboarding gateway — Create Account or Log In.
 */
export default function WelcomeScreen() {
  const { theme } = useTheme();

  return (
    <AuthScreenShell scroll={false} contentBottomPad={false}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[8],
            paddingHorizontal: theme.spacing[2],
          }}
        >
          <BrandMark showWordmark size="xl" />
          <AppText
            variant="title2"
            color="secondary"
            style={{
              textAlign: 'center',
              fontFamily: theme.typography.display.fontFamily,
              fontSize: 22,
              lineHeight: 30,
              letterSpacing: -0.3,
              maxWidth: 280,
            }}
          >
            {APP_TAGLINE}
          </AppText>
        </View>

        <View
          style={{
            gap: theme.layout.stackedCtaGap,
            paddingBottom: theme.spacing[6],
          }}
        >
          <AppButton
            label="Create Account"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/register')}
          />
          <AppButton
            label="Log In"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/login')}
          />
        </View>
      </View>
    </AuthScreenShell>
  );
}
