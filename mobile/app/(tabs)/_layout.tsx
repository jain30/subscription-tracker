import { Tabs, Redirect, router } from 'expo-router';
import { ChartColumn, Home, Layers, Settings } from 'lucide-react-native';
import { View } from 'react-native';

import { TabBarIcon } from '@/components/navigation';
import { useAuthStore } from '@/features/auth';
import { useTheme } from '@/theme';

/**
 * Primary bottom tabs — Home, Subscriptions, Insights, Settings.
 * Protected by Supabase Auth session (UI guard only; RLS enforces data access).
 */
export default function TabsLayout() {
  const { theme } = useTheme();
  const session = useAuthStore((state) => state.session);
  const hydrated = useAuthStore((state) => state.hydrated);
  const passwordRecoveryPending = useAuthStore(
    (state) => state.passwordRecoveryPending,
  );

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg.app }} />
    );
  }

  if (passwordRecoveryPending) {
    return <Redirect href="/(auth)/reset-password" />;
  }

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarActiveBackgroundColor: theme.colors.bg.surface,
        tabBarInactiveBackgroundColor: theme.colors.bg.surface,
        tabBarStyle: {
          backgroundColor: theme.colors.bg.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: theme.spacing[2],
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.caption.fontFamily,
          fontSize: theme.typography.caption.fontSize,
          lineHeight: theme.typography.caption.lineHeight,
          letterSpacing: 0.1,
          marginBottom: theme.spacing[1],
        },
        sceneStyle: {
          backgroundColor: theme.colors.bg.app,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Subscriptions',
          tabBarAccessibilityLabel: 'Subscriptions',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Layers} color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: (event) => {
            // Always open Subscription List — never leave Create/Detail/Edit sticky.
            event.preventDefault();
            router.navigate('/(tabs)/subscriptions');
          },
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarAccessibilityLabel: 'Insights',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={ChartColumn} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarAccessibilityLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon Icon={Settings} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
