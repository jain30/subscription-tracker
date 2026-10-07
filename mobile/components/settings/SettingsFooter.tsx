import { View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type SettingsFooterProps = {
  version: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Calm centered Settings footer.
 */
export function SettingsFooter({ version, style }: SettingsFooterProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          alignItems: 'center',
          paddingVertical: theme.spacing[8],
          gap: theme.spacing[1],
        },
        style,
      ]}
    >
      <AppText variant="subhead" color="secondary">
        Subscription Tracker
      </AppText>
      <AppText variant="footnote" color="tertiary">
        Made with ❤️
      </AppText>
      <AppText variant="caption" color="tertiary">
        Version {version}
      </AppText>
    </View>
  );
}
