import type { ReactElement, ReactNode } from 'react';
import {
  ScrollView,
  View,
  type RefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

export type ScreenContainerProps = {
  children: ReactNode;
  /** Include horizontal page padding (default true) */
  padded?: boolean;
  /** Wrap children in a ScrollView */
  scroll?: boolean;
  /** Safe-area edges to inset */
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Background role from theme */
  background?: 'app' | 'surface';
  /** Optional RefreshControl when `scroll` is true */
  refreshControl?: ReactElement<RefreshControlProps>;
};

/**
 * Screen shell with safe area, theme background, and standard padding.
 * Feature screens should compose this instead of raw SafeAreaView.
 */
export function ScreenContainer({
  children,
  padded = true,
  scroll = false,
  edges = ['top', 'right', 'bottom', 'left'],
  style,
  contentStyle,
  background = 'app',
  refreshControl,
}: ScreenContainerProps) {
  const { theme } = useTheme();

  const backgroundColor =
    background === 'surface' ? theme.colors.bg.surface : theme.colors.bg.app;

  const paddingStyle: ViewStyle = padded
    ? { paddingHorizontal: theme.layout.screenPaddingX }
    : {};

  const body = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingBottom: theme.spacing[10],
        },
        paddingStyle,
        contentStyle,
      ]}
      style={{ flex: 1 }}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, paddingStyle, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor }, style]}
    >
      {body}
    </SafeAreaView>
  );
}
