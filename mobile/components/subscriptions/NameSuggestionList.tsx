import { Platform, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import type { CatalogSubscription } from '@/features/subscriptions';
import { useTheme } from '@/theme';

export type NameSuggestionListProps = {
  suggestions: CatalogSubscription[];
  onSelect: (item: CatalogSubscription) => void;
};

/**
 * Compact typeahead list under the subscription name field.
 *
 * Selection uses `onPress` (not focus-gated unmount). On web, `preventDefault`
 * on press-in stops the TextInput from blurring mid-gesture.
 */
export function NameSuggestionList({
  suggestions,
  onSelect,
}: NameSuggestionListProps) {
  const { theme } = useTheme();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        marginTop: -theme.spacing[3],
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.bg.surface,
        overflow: 'hidden',
        zIndex: 20,
        elevation: 8,
        ...theme.elevation.card,
      }}
    >
      {suggestions.map((item, index) => (
        <Pressable
          key={item.name}
          accessibilityRole="button"
          accessibilityLabel={`Use suggestion ${item.name}`}
          onPressIn={(event) => {
            // Web: mousedown → blur → click. Preventing default keeps the
            // controlled input stable while onPress applies the catalog item.
            if (Platform.OS === 'web') {
              event.preventDefault();
            }
          }}
          onPress={() => {
            onSelect(item);
          }}
          style={({ pressed }) => ({
            minHeight: theme.layout.touchTargetMin,
            justifyContent: 'center',
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[3],
            backgroundColor: pressed
              ? theme.colors.bg.subtle
              : theme.colors.bg.surface,
            borderTopWidth: index === 0 ? 0 : 1,
            borderTopColor: theme.colors.border,
          })}
        >
          <AppText variant="body" color="primary">
            {item.name}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
