import { Tabs } from 'expo-router';
import { ChartColumn, Home, Layers, Settings } from 'lucide-react-native';

import { TabBarIcon } from '@/components/navigation';
import { useTheme } from '@/theme';

/**
 * Primary bottom tabs — Home, Subscriptions, Insights, Settings.
 * Each tab route is a nested stack folder for future feature screens.
 */
export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarActiveBackgroundColor: theme.colors.bg.surface,
        tabBarInactiveBackgroundColor: theme.colors.bg.surface,
        tabBarStyle: {
          backgroundColor: theme.colors.bg.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: theme.spacing[1],
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.caption.fontFamily,
          fontSize: theme.typography.caption.fontSize,
          lineHeight: theme.typography.caption.lineHeight,
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
