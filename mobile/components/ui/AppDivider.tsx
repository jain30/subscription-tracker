import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export type AppDividerProps = {
  /** Vertical inset around the hairline */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

/**
 * Quiet horizontal rule for list/section separation.
 * Prefer this over ad-hoc borders so divider color stays tokenized.
 */
export function AppDivider({ spacing = 'md', style }: AppDividerProps) {
  const { theme } = useTheme();

  const vertical: Record<NonNullable<AppDividerProps['spacing']>, number> = {
    none: 0,
    sm: theme.spacing[2],
    md: theme.spacing[4],
    lg: theme.spacing[6],
  };

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          height: StyleSheet.hairlineWidth,
          backgroundColor: theme.colors.border,
          marginVertical: vertical[spacing],
        },
        style,
      ]}
    />
  );
}
