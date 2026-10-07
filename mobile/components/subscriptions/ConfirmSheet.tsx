import { useMemo } from 'react';
import {
  Modal,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText } from '@/components/ui';
import { useTheme, type AppTheme } from '@/theme';

export type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Custom confirmation sheet — never use native Alert for destructive flows.
 */
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={styles.scrim}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Dismiss confirmation"
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, theme.spacing[6]) },
          ]}
          accessibilityRole="summary"
        >
          <View style={styles.handle} />

          {destructive ? (
            <View style={styles.iconWrap}>
              <Trash2
                size={theme.icons.size.lg}
                strokeWidth={theme.icons.strokeWidth.default}
                color={theme.colors.danger}
              />
            </View>
          ) : null}

          <AppText variant="title2" color="primary" style={styles.title}>
            {title}
          </AppText>
          <AppText variant="callout" color="secondary" style={styles.message}>
            {message}
          </AppText>
          <View style={styles.actions}>
            <AppButton
              label={cancelLabel}
              variant="secondary"
              fullWidth
              onPress={onCancel}
            />
            <AppButton
              label={confirmLabel}
              variant={destructive ? 'destructive' : 'primary'}
              fullWidth
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(theme: AppTheme) {
  return {
    root: {
      flex: 1,
      justifyContent: 'flex-end' as const,
    },
    scrim: {
      ...StyleSheetAbsoluteFill,
      backgroundColor: theme.colors.overlay,
    },
    sheet: {
      backgroundColor: theme.colors.bg.surface,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      paddingTop: theme.spacing[3],
      paddingHorizontal: theme.spacing[6],
      gap: theme.spacing[3],
      ...theme.elevation.modal,
    },
    handle: {
      alignSelf: 'center' as const,
      width: theme.spacing[10],
      height: 5,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.bg.subtle,
      marginBottom: theme.spacing[3],
    },
    iconWrap: {
      alignSelf: 'center' as const,
      width: theme.spacing[12] + theme.spacing[2],
      height: theme.spacing[12] + theme.spacing[2],
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.status.overdue,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing[1],
    },
    title: {
      textAlign: 'center' as const,
    },
    message: {
      textAlign: 'center' as const,
      marginBottom: theme.spacing[3],
      maxWidth: 320,
      alignSelf: 'center' as const,
    },
    actions: {
      gap: theme.layout.stackedCtaGap,
      marginTop: theme.spacing[1],
    },
  };
}

const StyleSheetAbsoluteFill = {
  position: 'absolute' as const,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
