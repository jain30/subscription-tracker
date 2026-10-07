import { createElement, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText } from '@/components/ui';
import {
  formatDisplayDate,
  parseDisplayDate,
  toDateInputValue,
} from '@/features/subscriptions';
import { useTheme, type AppTheme } from '@/theme';

import { SelectField } from './SelectField';

export type DatePickerFieldProps = {
  label: string;
  value: string;
  onChange: (displayDate: string) => void;
  placeholder?: string;
  errorMessage?: string;
  minimumDate?: Date;
};

/**
 * Native calendar date field — formats to the existing display date string.
 */
export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  errorMessage,
  minimumDate,
}: DatePickerFieldProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [open, setOpen] = useState(false);

  const selectedDate = useMemo(() => {
    return parseDisplayDate(value) ?? new Date();
  }, [value]);

  const applyDate = (date: Date) => {
    onChange(formatDisplayDate(date));
  };

  const onNativeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (date) {
      applyDate(date);
    }
  };

  const applyIsoDateValue = (raw: string) => {
    if (!raw) {
      return;
    }
    const [year, month, day] = raw
      .split('-')
      .map((part) => Number.parseInt(part, 10));
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
      return;
    }
    applyDate(new Date(year, month - 1, day));
  };

  return (
    <View>
      <SelectField
        label={label}
        value={value}
        placeholder={placeholder}
        onPress={() => setOpen(true)}
        errorMessage={errorMessage}
      />

      {Platform.OS === 'android' && open ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onNativeChange}
          minimumDate={minimumDate}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          onRequestClose={() => setOpen(false)}
        >
          <View style={styles.sheetRoot}>
            <Pressable
              style={styles.scrim}
              onPress={() => setOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss date picker"
            />
            <View
              style={[
                styles.sheet,
                { paddingBottom: Math.max(insets.bottom, theme.spacing[4]) },
              ]}
            >
              <View style={styles.sheetHeader}>
                <AppText variant="title2" color="primary">
                  {label}
                </AppText>
                <AppButton
                  label="Done"
                  variant="ghost"
                  size="sm"
                  onPress={() => setOpen(false)}
                />
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={onNativeChange}
                minimumDate={minimumDate}
                themeVariant="light"
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {Platform.OS === 'web' ? (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <View style={styles.sheetRoot}>
            <Pressable
              style={styles.scrim}
              onPress={() => setOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss date picker"
            />
            <View
              style={[
                styles.sheet,
                { paddingBottom: Math.max(insets.bottom, theme.spacing[4]) },
              ]}
            >
              <View style={styles.sheetHeader}>
                <AppText variant="title2" color="primary">
                  {label}
                </AppText>
                <AppButton
                  label="Done"
                  variant="ghost"
                  size="sm"
                  onPress={() => setOpen(false)}
                />
              </View>
              <AppText
                variant="callout"
                color="secondary"
                style={styles.webHint}
              >
                Choose a renewal date
              </AppText>
              <View style={styles.webInputWrap}>
                {createElement('input', {
                  type: 'date',
                  value: toDateInputValue(selectedDate),
                  min: minimumDate
                    ? toDateInputValue(minimumDate)
                    : undefined,
                  onChange: (event: { target: { value: string } }) => {
                    applyIsoDateValue(event.target.value);
                  },
                  style: styles.webInput,
                  'aria-label': 'Renewal date',
                })}
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    sheetRoot: {
      flex: 1,
      justifyContent: 'flex-end' as const,
    },
    scrim: {
      position: 'absolute' as const,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: theme.colors.overlay,
    },
    sheet: {
      backgroundColor: theme.colors.bg.surface,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      paddingTop: theme.spacing[4],
      paddingHorizontal: theme.layout.screenPaddingX,
      ...theme.elevation.modal,
    },
    sheetHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: theme.spacing[2],
    },
    iosPicker: {
      alignSelf: 'stretch' as const,
      height: 216,
      width: '100%' as const,
    },
    webHint: {
      marginBottom: theme.spacing[3],
    },
    webInputWrap: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg.subtle,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      marginBottom: theme.spacing[2],
    },
    webInput: {
      fontFamily: theme.typography.body.fontFamily,
      fontSize: theme.typography.body.fontSize,
      lineHeight: `${theme.typography.body.lineHeight}px`,
      color: theme.colors.text.primary,
      minHeight: 44,
      width: '100%',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
    },
  };
}
