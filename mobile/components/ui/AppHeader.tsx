import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

export type AppHeaderProps = {
  title: string;
  /** Shows a back control when provided */
  onBack?: () => void;
  backAccessibilityLabel?: string;
  /** Optional trailing action (icon button or text control) */
  rightAction?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Stack-style navigation header. Back is optional for root screens.
 * Does not own navigation — callers pass `onBack`.
 */
export function AppHeader({
  title,
  onBack,
  backAccessibilityLabel = 'Go back',
  rightAction,
  style,
}: AppHeaderProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          minHeight: theme.layout.touchTargetComfortable + theme.spacing[2],
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[2],
          paddingVertical: theme.spacing[2],
          marginBottom: theme.spacing[1],
        },
        style,
      ]}
    >
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={backAccessibilityLabel}
          hitSlop={theme.spacing[2]}
          style={({ pressed }) => ({
            width: theme.layout.touchTargetMin,
            height: theme.layout.touchTargetMin,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.md,
            backgroundColor: pressed ? theme.colors.bg.subtle : 'transparent',
          })}
        >
          <ChevronLeft
            size={theme.icons.size.lg}
            strokeWidth={theme.icons.strokeWidth.default}
            color={theme.colors.text.primary}
          />
        </Pressable>
      ) : (
        <View style={{ width: theme.spacing[1] }} />
      )}

      <AppText
        variant="title2"
        color="primary"
        numberOfLines={1}
        style={{ flex: 1 }}
      >
        {title}
      </AppText>

      <View
        style={{
          minWidth: theme.layout.touchTargetMin,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {rightAction}
      </View>
    </View>
  );
}
