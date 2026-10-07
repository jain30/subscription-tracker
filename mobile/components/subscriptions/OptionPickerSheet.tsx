import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { Check, Search } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { useTheme, type AppTheme } from '@/theme';

export type PickerOption = {
  value: string;
  label: string;
};

export type OptionPickerSheetProps = {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  /** Enable search filter for large option lists (e.g. categories). */
  searchable?: boolean;
  searchPlaceholder?: string;
};

/**
 * Calm bottom sheet for single-select fields (category, currency, etc.).
 */
export function OptionPickerSheet({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  searchable = false,
  searchPlaceholder = 'Search',
}: OptionPickerSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [query, setQuery] = useState('');

  const dismiss = () => {
    setQuery('');
    onClose();
  };

  const filtered = useMemo(() => {
    if (!searchable) {
      return options;
    }
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    );
  }, [options, query, searchable]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={dismiss}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={styles.scrim}
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss picker"
        />
        <View
          style={[
            styles.sheet,
            {
              maxHeight: searchable ? '72%' : '58%',
              paddingBottom: Math.max(insets.bottom, theme.spacing[8]),
            },
          ]}
        >
          <View style={styles.handle} />
          <AppText variant="title2" color="primary" style={styles.title}>
            {title}
          </AppText>

          {searchable ? (
            <View style={styles.searchRow}>
              <Search
                size={theme.icons.size.md}
                strokeWidth={theme.icons.strokeWidth.default}
                color={theme.colors.text.tertiary}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={theme.colors.text.tertiary}
                autoCorrect={false}
                autoCapitalize="none"
                accessibilityLabel={searchPlaceholder}
                style={[theme.typography.body, styles.searchInput]}
              />
            </View>
          ) : null}

          <ScrollView
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {filtered.length === 0 ? (
              <AppText
                variant="callout"
                color="secondary"
                style={styles.empty}
              >
                No matches
              </AppText>
            ) : (
              filtered.map((option, index) => {
                const selected = option.value === selectedValue;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onSelect(option.value);
                      dismiss();
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option.label}
                    style={({ pressed }) => [
                      styles.row,
                      selected && styles.rowSelected,
                      pressed && styles.rowPressed,
                      index === filtered.length - 1 && styles.rowLast,
                    ]}
                  >
                    <AppText
                      variant={selected ? 'bodyStrong' : 'body'}
                      color={selected ? 'brand' : 'primary'}
                      style={styles.rowLabel}
                    >
                      {option.label}
                    </AppText>
                    {selected ? (
                      <Check
                        size={theme.icons.size.md}
                        strokeWidth={theme.icons.strokeWidth.emphasis}
                        color={theme.colors.brand.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })
            )}
          </ScrollView>
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
      paddingTop: theme.spacing[3],
      paddingHorizontal: theme.layout.screenPaddingX,
      ...theme.elevation.modal,
    },
    handle: {
      alignSelf: 'center' as const,
      width: theme.spacing[10],
      height: 5,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.bg.subtle,
      marginBottom: theme.spacing[4],
    },
    title: {
      marginBottom: theme.spacing[3],
    },
    searchRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[2],
      minHeight: theme.layout.touchTargetMin,
      paddingHorizontal: theme.spacing[3],
      marginBottom: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg.subtle,
    },
    searchInput: {
      flex: 1,
      paddingVertical: theme.spacing[2],
      color: theme.colors.text.primary,
    },
    list: {
      flexGrow: 0,
    },
    empty: {
      paddingVertical: theme.spacing[6],
      textAlign: 'center' as const,
    },
    row: {
      minHeight: theme.layout.listRowHeight,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      gap: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[3],
      marginHorizontal: -theme.spacing[1],
      borderRadius: theme.radius.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowSelected: {
      backgroundColor: theme.colors.brand.soft,
      borderBottomWidth: 0,
    },
    rowPressed: {
      backgroundColor: theme.colors.bg.subtle,
    },
    rowLabel: {
      flex: 1,
    },
  };
}
