import type { ReactNode } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type SettingsSectionCardProps = {
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Floating grouped settings surface — soft elevation, no heavy borders.
 */
export function SettingsSectionCard({
  title,
  children,
  style,
}: SettingsSectionCardProps) {
  const { theme } = useTheme();

  const shadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
        }
      : { elevation: 2 };

  return (
    <View style={style}>
      {title ? (
        <AppText
          variant="caption"
          color="tertiary"
          style={{
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            marginBottom: theme.spacing[3],
            marginStart: theme.spacing[1],
          }}
        >
          {title}
        </AppText>
      ) : null}
      <View
        style={{
          backgroundColor: theme.colors.bg.surface,
          borderRadius: theme.radius.xl,
          paddingVertical: theme.spacing[1],
          overflow: 'hidden',
          ...shadow,
        }}
      >
        {children}
      </View>
    </View>
  );
}
