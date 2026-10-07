import { Platform, Switch, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type SettingsSwitchRowProps = {
  label: string;
  /** Visual switch position only — ignored when unavailable. */
  value?: boolean;
  last?: boolean;
  /**
   * When true, the switch is non-interactive and shows Coming soon.
   * Does not persist or mutate application state.
   */
  unavailable?: boolean;
};

/**
 * Settings switch row.
 * Unavailable rows must not fake-toggle or persist preferences.
 */
export function SettingsSwitchRow({
  label,
  value = false,
  last = false,
  unavailable = false,
}: SettingsSwitchRowProps) {
  const { theme } = useTheme();
  const checked = unavailable ? false : value;

  return (
    <View
      style={{
        minHeight: theme.layout.listRowHeight,
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.colors.bg.subtle,
        opacity: unavailable ? 0.72 : 1,
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: unavailable }}
      accessibilityLabel={
        unavailable ? `${label}, Coming soon` : label
      }
    >
      <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
        <AppText variant="bodyStrong" color="primary" numberOfLines={1}>
          {label}
        </AppText>
        {unavailable ? (
          <AppText variant="caption" color="tertiary">
            Coming soon
          </AppText>
        ) : null}
      </View>
      <Switch
        value={checked}
        disabled
        trackColor={{
          false: theme.colors.bg.subtle,
          true: theme.colors.brand.soft,
        }}
        thumbColor={
          Platform.OS === 'android'
            ? checked
              ? theme.colors.brand.primary
              : theme.colors.bg.surface
            : theme.colors.bg.surface
        }
        ios_backgroundColor={theme.colors.bg.subtle}
      />
    </View>
  );
}
