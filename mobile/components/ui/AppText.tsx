import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme';
import type { TypographyKey } from '@/theme';

export type AppTextVariant =
  | 'display'
  | 'title'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body'
  | 'bodyStrong'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption'
  | 'amountLg'
  | 'amountMd'
  | 'amountSm'
  | 'button'
  | 'buttonSm';

export type AppTextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'onBrand'
  | 'brand'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export type AppTextProps = Omit<TextProps, 'style'> & {
  /** Typography token (alias `title` → `title1`) */
  variant?: AppTextVariant;
  /** Semantic text color from the theme */
  color?: AppTextColor;
  /** Optional style override — prefer tokens first */
  style?: TextStyle | TextStyle[];
};

function resolveTypographyKey(variant: AppTextVariant): TypographyKey {
  if (variant === 'title') {
    return 'title1';
  }
  return variant;
}

/**
 * Themed text primitive. Always prefer this over raw `Text` for product UI.
 */
export function AppText({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}: AppTextProps) {
  const { theme } = useTheme();
  const typographyKey = resolveTypographyKey(variant);

  const colorMap: Record<AppTextColor, string> = {
    primary: theme.colors.text.primary,
    secondary: theme.colors.text.secondary,
    tertiary: theme.colors.text.tertiary,
    inverse: theme.colors.text.inverse,
    onBrand: theme.colors.text.onBrand,
    brand: theme.colors.brand.primary,
    accent: theme.colors.accent,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
  };

  return (
    <Text
      {...rest}
      style={[
        theme.typography[typographyKey],
        { color: colorMap[color] },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
