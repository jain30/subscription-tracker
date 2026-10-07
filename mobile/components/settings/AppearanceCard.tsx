import {
  Platform,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/ui';
import type {
  SettingsAccentSwatch,
  SettingsThemeOption,
} from '@/features/settings';
import { useTheme } from '@/theme';

import { SettingsSectionCard } from './SettingsSectionCard';

export type AppearanceCardProps = {
  themeValue: SettingsThemeOption;
  accents: SettingsAccentSwatch[];
  selectedAccentId: string;
  style?: StyleProp<ViewStyle>;
  /**
   * When true, theme/accent controls are display-only and labeled Coming soon.
   * No local fake preference mutation.
   */
  unavailable?: boolean;
};

const THEME_OPTIONS: { id: SettingsThemeOption; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
];

function resolveAccentColor(
  role: SettingsAccentSwatch['role'],
  theme: ReturnType<typeof useTheme>['theme'],
): string {
  switch (role) {
    case 'brand':
      return theme.colors.brand.primary;
    case 'accent':
      return theme.colors.accent;
    case 'streaming':
      return theme.colors.category.streaming;
    case 'productivity':
    case 'health':
    case 'finance':
    case 'shopping':
    case 'other':
      return theme.colors.category[role];
    default:
      return theme.colors.brand.primary;
  }
}

/**
 * Theme radios + accent swatches.
 * Unavailable mode preserves the approved section chrome without fake persistence.
 */
export function AppearanceCard({
  themeValue,
  accents,
  selectedAccentId,
  style,
  unavailable = false,
}: AppearanceCardProps) {
  const { theme } = useTheme();

  return (
    <SettingsSectionCard title="Appearance" style={style}>
      {unavailable ? (
        <AppText
          variant="caption"
          color="tertiary"
          style={{
            paddingHorizontal: theme.spacing[4],
            paddingTop: theme.spacing[3],
          }}
        >
          Coming soon
        </AppText>
      ) : null}

      <View
        style={{
          paddingHorizontal: theme.spacing[4],
          paddingTop: theme.spacing[3],
          opacity: unavailable ? 0.55 : 1,
        }}
      >
        <AppText variant="subhead" color="secondary">
          Theme
        </AppText>
        <View
          style={{
            marginTop: theme.spacing[3],
            flexDirection: 'row',
            gap: theme.spacing[2],
          }}
        >
          {THEME_OPTIONS.map((option) => {
            const selected = option.id === themeValue;
            return (
              <View
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled: unavailable }}
                accessibilityLabel={`${option.label} theme${
                  unavailable ? ', Coming soon' : ''
                }`}
                style={{
                  flex: 1,
                  minHeight: theme.layout.touchTargetComfortable,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: theme.radius.md,
                  backgroundColor: selected
                    ? theme.colors.brand.soft
                    : theme.colors.bg.app,
                }}
              >
                <AppText
                  variant="subhead"
                  color={selected ? 'brand' : 'secondary'}
                >
                  {option.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: theme.spacing[4],
          paddingTop: theme.spacing[5],
          paddingBottom: theme.spacing[4],
          opacity: unavailable ? 0.55 : 1,
        }}
      >
        <AppText variant="subhead" color="secondary">
          Accent Color
        </AppText>
        <View
          style={{
            marginTop: theme.spacing[3],
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing[3],
          }}
        >
          {accents.map((swatch) => {
            const selected = swatch.id === selectedAccentId;
            const color = resolveAccentColor(swatch.role, theme);
            return (
              <View
                key={swatch.id}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: unavailable }}
                accessibilityLabel={`Accent color${
                  unavailable ? ', Coming soon' : ''
                }`}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: selected ? 2 : 0,
                  borderColor: selected
                    ? theme.colors.brand.primary
                    : 'transparent',
                }}
              >
                <View
                  style={[
                    {
                      width: 28,
                      height: 28,
                      borderRadius: theme.radius.full,
                      backgroundColor: color,
                    },
                    selected
                      ? Platform.OS === 'ios'
                        ? {
                            shadowColor: theme.colors.text.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.14,
                            shadowRadius: 4,
                          }
                        : { elevation: 1 }
                      : null,
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>
    </SettingsSectionCard>
  );
}
