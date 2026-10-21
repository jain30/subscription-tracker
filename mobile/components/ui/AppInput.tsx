import { forwardRef, useId, useState, type ReactNode } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

export type AppInputProps = Omit<
  TextInputProps,
  'style' | 'secureTextEntry' | 'editable'
> & {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  /** Enables secure entry with an accessible show/hide control */
  password?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Labeled text field with helper/error, optional icons, and password mode.
 * Error color is paired with `errorMessage` text — never color alone.
 */
export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput(
  {
    label,
    helperText,
    errorMessage,
    password = false,
    disabled = false,
    leftIcon,
    rightIcon,
    containerStyle,
    accessibilityLabel,
    onBlur,
    onFocus,
    ...rest
  },
  ref,
) {
  const { theme } = useTheme();
  const reactId = useId();
  const inputId = `app-input-${reactId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [focused, setFocused] = useState(false);
  const [secureVisible, setSecureVisible] = useState(false);

  const hasError = Boolean(errorMessage);

  const borderColor = hasError
    ? theme.colors.danger
    : focused
      ? theme.colors.brand.primary
      : theme.colors.border;

  const passwordToggle = password ? (
    <Pressable
      onPress={() => setSecureVisible((value) => !value)}
      accessibilityRole="button"
      accessibilityLabel={secureVisible ? 'Hide password' : 'Show password'}
      hitSlop={theme.spacing[2]}
      style={{
        minWidth: theme.layout.touchTargetMin,
        minHeight: theme.layout.touchTargetMin,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {secureVisible ? (
        <EyeOff
          size={theme.icons.size.md}
          strokeWidth={theme.icons.strokeWidth.default}
          color={theme.colors.text.secondary}
        />
      ) : (
        <Eye
          size={theme.icons.size.md}
          strokeWidth={theme.icons.strokeWidth.default}
          color={theme.colors.text.secondary}
        />
      )}
    </Pressable>
  ) : null;

  const trailing = rightIcon ?? passwordToggle;

  return (
    <View style={[{ gap: theme.spacing[2] }, containerStyle]}>
      {label ? (
        <AppText variant="subhead" color="secondary" nativeID={`${inputId}-label`}>
          {label}
        </AppText>
      ) : null}

      <View
        style={{
          minHeight: theme.layout.listRowHeight,
          flexDirection: 'row',
          alignItems: rest.multiline ? 'flex-start' : 'center',
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[4],
          borderWidth: focused || hasError ? 1.5 : 1,
          borderColor,
          borderRadius: theme.radius.md,
          backgroundColor: disabled
            ? theme.colors.bg.subtle
            : theme.colors.bg.surface,
        }}
      >
        {leftIcon ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={rest.multiline ? { paddingTop: theme.spacing[3] } : undefined}
          >
            {leftIcon}
          </View>
        ) : null}

        <TextInput
          ref={ref}
          {...rest}
          editable={!disabled}
          secureTextEntry={password && !secureVisible}
          placeholderTextColor={theme.colors.text.tertiary}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            theme.typography.body,
            {
              flex: 1,
              paddingVertical: theme.spacing[3],
              minHeight: rest.multiline
                ? theme.spacing[16]
                : undefined,
              color: theme.colors.text.primary,
              opacity: disabled ? 0.6 : 1,
            },
          ]}
        />

        {trailing}
      </View>

      {hasError ? (
        <AppText
          nativeID={errorId}
          variant="footnote"
          color="danger"
          accessibilityLiveRegion="polite"
        >
          {errorMessage}
        </AppText>
      ) : helperText ? (
        <AppText nativeID={helperId} variant="footnote" color="tertiary">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
});
