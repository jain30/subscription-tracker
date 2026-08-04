import type { ReactNode } from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

export type AppCardVariant = 'flat' | 'elevated';

type SharedCardProps = {
  children: ReactNode;
  variant?: AppCardVariant;
  style?: StyleProp<ViewStyle>;
};

export type AppCardProps =
  | (SharedCardProps & {
      pressable?: false;
      onPress?: never;
    })
  | (SharedCardProps &
      Omit<PressableProps, 'style' | 'children'> & {
        pressable: true;
      });

/**
 * Interactive grouping surface. Prefer lists for most content;
 * use cards only when interaction needs containment.
 */
export function AppCard(props: AppCardProps) {
  const { theme } = useTheme();
  const { children, variant = 'flat', style } = props;

  const baseStyle: ViewStyle = {
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[4],
    borderWidth: variant === 'flat' ? 1 : 0,
    borderColor: theme.colors.border,
    ...(variant === 'elevated' ? theme.elevation.card : theme.elevation.none),
  };

  if (props.pressable) {
    const { pressable: _pressable, children: _c, variant: _v, style: _s, ...pressableProps } =
      props;

    return (
      <Pressable
        {...pressableProps}
        accessibilityRole={pressableProps.accessibilityRole ?? 'button'}
        style={({ pressed }) => [
          baseStyle,
          pressed && { backgroundColor: theme.colors.bg.subtle },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[baseStyle, style]}>{children}</View>;
}
