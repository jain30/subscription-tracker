/**
 * Insights feature re-exports dashboard view types from the subscription domain.
 * Snapshot data is derived via selectInsightsDashboard(store).
 */

export type {
  InsightsCategorySlice,
  InsightsDashboardView,
  InsightsHighlight,
  InsightsStat,
  InsightsTimelineItem,
  InsightsTopSubscription,
  InsightsTrendPoint,
} from '@/features/subscriptions';
