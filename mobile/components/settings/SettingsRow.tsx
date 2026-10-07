import type { ComponentType } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronRight, type LucideProps } from 'lucide-react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme';

export type SettingsRowProps = {
  label: string;
  value?: string;
  Icon: ComponentType<LucideProps>;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
  last?: boolean;
};

/**
 * Premium settings row — icon, title, optional value, chevron.
 */
export function SettingsRow({
  label,
  value,
  Icon,
  onPress,
  destructive = false,
  showChevron = true,
  last = false,
}: SettingsRowProps) {
  const { theme } = useTheme();
  const iconColor = destructive
    ? theme.colors.danger
    : theme.colors.brand.primary;
  const labelColor = destructive ? 'danger' : 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={onPress == null}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => ({
        minHeight: theme.layout.listRowHeight,
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
        backgroundColor: pressed ? theme.colors.bg.subtle : 'transparent',
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.colors.bg.subtle,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: destructive
            ? theme.colors.status.overdue
            : theme.colors.brand.soft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          size={theme.icons.size.md}
          strokeWidth={theme.icons.strokeWidth.default}
          color={iconColor}
        />
      </View>

      <AppText
        variant="bodyStrong"
        color={labelColor}
        style={{ flex: 1 }}
        numberOfLines={1}
      >
        {label}
      </AppText>

      {value ? (
        <AppText
          variant="footnote"
          color="tertiary"
          numberOfLines={1}
          style={{ maxWidth: 140, textAlign: 'right' }}
        >
          {value}
        </AppText>
      ) : null}

      {showChevron ? (
        <ChevronRight
          size={theme.icons.size.md}
          strokeWidth={theme.icons.strokeWidth.default}
          color={theme.colors.text.tertiary}
        />
      ) : null}
    </Pressable>
  );
}
