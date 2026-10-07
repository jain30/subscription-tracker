import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpDown, Layers, Search } from 'lucide-react-native';

import {
  AppDivider,
  AppHeader,
  AppText,
  EmptyState,
  FloatingActionButton,
  ScreenContainer,
  SubscriptionRow,
} from '@/components';
import {
  FilterPlaceholder,
  OptionPickerSheet,
  SearchPlaceholder,
} from '@/components/subscriptions';
import {
  DEFAULT_SUBSCRIPTION_LIST_SORT,
  SUBSCRIPTION_LIST_SORT_OPTIONS,
  formatCurrency,
  getSubscriptionDueSoon,
  getSubscriptionListSortLabel,
  getSubscriptionRelativeDue,
  selectSubscriptionList,
  useSubscriptionStore,
  type SubscriptionListFilter,
  type SubscriptionListSort,
} from '@/features/subscriptions';
import { useTheme, type AppTheme } from '@/theme';

/**
 * Subscriptions catalog — searchable, filterable, sortable list.
 * Store data is never mutated; display order is derived only.
 */
export default function SubscriptionsListScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const refresh = useSubscriptionStore((state) => state.refresh);
  const loading = useSubscriptionStore((state) => state.loading);
  const storeError = useSubscriptionStore((state) => state.error);

  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SubscriptionListFilter>('all');
  const [sort, setSort] = useState<SubscriptionListSort>(
    DEFAULT_SUBSCRIPTION_LIST_SORT,
  );
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const isCatalogEmpty = subscriptions.length === 0 && !loading;

  const visibleSubscriptions = useMemo(
    () => selectSubscriptionList(subscriptions, { query, filter, sort }),
    [subscriptions, query, filter, sort],
  );

  const hasActiveQuery = query.trim().length > 0;
  const isFilteredEmpty =
    !isCatalogEmpty && visibleSubscriptions.length === 0;

  const onRefresh = () => {
    setRefreshing(true);
    void (async () => {
      try {
        await refresh();
      } finally {
        setRefreshing(false);
      }
    })();
  };

  const goToAdd = () => {
    router.push('/(tabs)/subscriptions/new');
  };

  const clearSearch = () => {
    setQuery('');
  };

  const fabClearance =
    theme.spacing[16] + theme.spacing[12] + theme.spacing[2];

  return (
    <View style={styles.root}>
      <ScreenContainer
        edges={['top', 'left', 'right']}
        scroll
        contentStyle={[
          styles.content,
          {
            paddingBottom: isCatalogEmpty ? theme.spacing[8] : fabClearance,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand.primary}
            colors={[theme.colors.brand.primary]}
          />
        }
      >
        <AppHeader
          title="Subscriptions"
          rightAction={
            !isCatalogEmpty ? (
              <Pressable
                onPress={() => setSortSheetOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={`Sort, ${getSubscriptionListSortLabel(sort)}`}
                hitSlop={theme.spacing[2]}
                style={({ pressed }) => ({
                  minHeight: theme.layout.touchTargetMin,
                  minWidth: theme.layout.touchTargetMin,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: theme.spacing[1],
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <ArrowUpDown
                  size={theme.icons.size.md}
                  strokeWidth={theme.icons.strokeWidth.default}
                  color={theme.colors.brand.primary}
                />
                <AppText variant="subhead" color="brand">
                  Sort
                </AppText>
              </Pressable>
            ) : undefined
          }
        />

        {storeError ? (
          <AppText
            variant="footnote"
            color="danger"
            style={{ marginBottom: theme.spacing[3] }}
          >
            {storeError}
          </AppText>
        ) : null}

        {isCatalogEmpty ? (
          <EmptyState
            illustration={
              <Layers
                size={theme.icons.size.xl}
                strokeWidth={theme.icons.strokeWidth.default}
                color={theme.colors.brand.primary}
              />
            }
            title="No subscriptions yet"
            description="Add your first subscription to start tracking renewals."
            action={{
              label: '+ Add Subscription',
              onPress: goToAdd,
            }}
          />
        ) : (
          <View>
            <View style={styles.toolbar}>
              <SearchPlaceholder value={query} onChangeText={setQuery} />
              <FilterPlaceholder value={filter} onChange={setFilter} />
            </View>

            {isFilteredEmpty ? (
              <EmptyState
                illustration={
                  <Search
                    size={theme.icons.size.xl}
                    strokeWidth={theme.icons.strokeWidth.default}
                    color={theme.colors.brand.primary}
                  />
                }
                title="No subscriptions found"
                description={
                  hasActiveQuery
                    ? 'Try another search.'
                    : 'No subscriptions match this filter.'
                }
                secondaryAction={
                  hasActiveQuery
                    ? {
                        label: 'Clear search',
                        onPress: clearSearch,
                      }
                    : filter !== 'all'
                      ? {
                          label: 'Show all',
                          onPress: () => setFilter('all'),
                        }
                      : undefined
                }
                style={styles.filterEmpty}
              />
            ) : (
              <View style={styles.list}>
                {visibleSubscriptions.map((item, index) => (
                  <View key={item.id}>
                    <SubscriptionRow
                      name={item.name}
                      amount={formatCurrency(item.price, item.currency)}
                      relativeDue={
                        item.status === 'canceled'
                          ? 'Canceled'
                          : item.status === 'trial'
                            ? `Trial · ${getSubscriptionRelativeDue(item)}`
                            : getSubscriptionRelativeDue(item)
                      }
                      cycle={item.billingCycle}
                      dueSoon={
                        item.status !== 'canceled' &&
                        getSubscriptionDueSoon(item)
                      }
                      accentKey={item.color}
                      onPress={() =>
                        router.push(`/(tabs)/subscriptions/${item.id}`)
                      }
                    />
                    {index < visibleSubscriptions.length - 1 ? (
                      <AppDivider
                        spacing="none"
                        style={{
                          marginStart: theme.spacing[10] + theme.spacing[3],
                        }}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScreenContainer>

      {!isCatalogEmpty ? <FloatingActionButton onPress={goToAdd} /> : null}

      <OptionPickerSheet
        visible={sortSheetOpen}
        title="Sort subscriptions"
        options={[...SUBSCRIPTION_LIST_SORT_OPTIONS]}
        selectedValue={sort}
        onSelect={(value) => setSort(value as SubscriptionListSort)}
        onClose={() => setSortSheetOpen(false)}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg.app,
    },
    content: {
      flexGrow: 1,
    },
    toolbar: {
      marginTop: theme.spacing[2],
      gap: theme.spacing[3],
    },
    list: {
      marginTop: theme.spacing[5],
    },
    filterEmpty: {
      paddingVertical: theme.spacing[10],
    },
  };
}
