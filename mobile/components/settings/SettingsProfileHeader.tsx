import { Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type SettingsProfileHeaderProps = {
  name: string;
  subtitle: string;
  badge: string;
  initials: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Profile hero — avatar, identity, premium badge. Edit is visual only.
 */
export function SettingsProfileHeader({
  name,
  subtitle,
  badge,
  initials,
  style,
}: SettingsProfileHeaderProps) {
  const { theme } = useTheme();

  const shadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.07,
          shadowRadius: 20,
        }
      : { elevation: 3 };

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.bg.surface,
          borderRadius: 28,
          overflow: 'hidden',
          ...shadow,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[theme.colors.bg.brandWash, theme.colors.bg.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: theme.spacing[5],
          gap: theme.spacing[4],
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing[4],
          }}
        >
          <View
            style={
              Platform.OS === 'ios'
                ? {
                    shadowColor: theme.colors.brand.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.18,
                    shadowRadius: 10,
                    borderRadius: theme.radius.full,
                  }
                : { elevation: 2, borderRadius: theme.radius.full }
            }
          >
            <LinearGradient
              colors={[theme.colors.brand.soft, theme.colors.brand.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: theme.radius.full,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppText
                variant="title2"
                color="onBrand"
                style={{ fontFamily: theme.fontFamily.sans.semibold }}
              >
                {initials}
              </AppText>
            </LinearGradient>
          </View>

          <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
            <AppText
              variant="title2"
              color="primary"
              numberOfLines={1}
              style={{ letterSpacing: -0.3 }}
            >
              {name}
            </AppText>
            <AppText variant="footnote" color="secondary" numberOfLines={1}>
              {subtitle}
            </AppText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            style={({ pressed }) => ({
              minHeight: theme.layout.touchTargetMin,
              paddingHorizontal: theme.spacing[3],
              paddingVertical: theme.spacing[2],
              borderRadius: theme.radius.md,
              backgroundColor: pressed
                ? theme.colors.brand.soft
                : theme.colors.bg.surface,
              justifyContent: 'center',
              transform: pressed ? [{ scale: 0.97 }] : undefined,
            })}
          >
            <AppText variant="subhead" color="brand">
              Edit
            </AppText>
          </Pressable>
        </View>

        <View
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[1] + 2,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.brand.soft,
          }}
        >
          <AppText variant="caption" color="brand">
            {badge}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
}
