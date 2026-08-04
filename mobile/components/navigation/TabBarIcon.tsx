import type { ComponentType } from 'react';
import { View, type ColorValue } from 'react-native';
import type { LucideProps } from 'lucide-react-native';

import { useTheme } from '@/theme';

type TabBarIconProps = {
  Icon: ComponentType<LucideProps>;
  color: ColorValue;
  focused: boolean;
};

/**
 * Consistent Lucide tab icons — outline by default, filled when selected.
 */
export function TabBarIcon({ Icon, color, focused }: TabBarIconProps) {
  const { theme } = useTheme();
  const iconColor = typeof color === 'string' ? color : theme.colors.text.secondary;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Icon
        size={theme.icons.size.lg}
        color={iconColor}
        strokeWidth={theme.icons.strokeWidth.default}
        fill={focused ? iconColor : 'transparent'}
      />
    </View>
  );
}
