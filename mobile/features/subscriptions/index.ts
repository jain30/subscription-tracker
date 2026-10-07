/**
 * Subscription domain public API.
 */

export type {
  BillingCycle,
  Category,
  CreateSubscriptionInput,
  CurrencyCode,
  ListUiState,
  ReminderOffset,
  Subscription,
  SubscriptionFormValues,
  SubscriptionStatus,
  UpdateSubscriptionInput,
} from './types';

export {
  BILLING_CYCLES,
  CATEGORY_OPTIONS,
  CREATE_STATUS_OPTIONS,
  CURRENCIES,
  DUE_SOON_DAYS,
  EDIT_STATUS_OPTIONS,
  LIST_UI_STATES,
  MOCK_TODAY,
  REMINDER_OPTIONS,
  STATUS_VALUES,
  UPCOMING_PREVIEW_LIMIT,
  UPCOMING_WINDOW_DAYS,
  statusLabel,
} from './constants';

export {
  CATEGORIES,
  CATEGORY_IDS,
  SUBSCRIPTION_CATALOG,
  getCategoryColor,
  getCategoryDefinition,
  resolveCatalogCategory,
  resolveCatalogEntry,
  suggestSubscriptions,
  type CatalogSubscription,
  type CategoryDefinition,
} from './catalog';

export { DEMO_SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS } from './seed';

export {
  createEmptyFormValues,
  formValuesToSubscription,
  getSubscriptionDueSoon,
  getSubscriptionMonthlyPrice,
  getSubscriptionRelativeDue,
  getSubscriptionYearlyPrice,
  subscriptionToFormValues,
} from './mappers';

export {
  isSubscriptionFormValid,
  validateSubscriptionForm,
  type SubscriptionValidationErrors,
} from './validation';

export {
  categoryColorKey,
  categoryLabel,
  formatCurrency,
  formatDisplayDate,
  formatMoney,
  getRelativeDueLabel,
  getTimelineBucket,
  isDueSoon,
  nowIso,
  parseDisplayDate,
  toDateInputValue,
  toIsoDate,
  toMonthlyPrice,
  toYearlyPrice,
  type TimelineBucket,
} from './utils';

export {
  CHARGEABLE_STATUSES,
  DEFAULT_UPCOMING_WINDOW_DAYS,
  addBillingCycle,
  assessRenewal,
  attentionReasonsFor,
  calendarToday,
  computeFinancialSummary,
  computeMonthlySpendByCurrency,
  computeUpcomingPaymentsByCurrency,
  computeYearlySpendByCurrency,
  countByStatus,
  daysBetweenCalendar,
  filterChargeable,
  formatCurrencyTotals,
  getChargeableMonthlyPrice,
  getChargeableYearlyPrice,
  isActive,
  isCanceled,
  isChargeable,
  isNonAutoRenewing,
  isReminderEligible,
  isTrial,
  parseIsoCalendarDate,
  parseRenewalCalendarDate,
  roundMoney,
  selectNeedsAttention,
  selectTrialsEndingSoon,
  selectUpcomingRenewals,
  type AttentionItem,
  type AttentionReason,
  type CurrencyTotal,
  type FinancialSummary,
  type RenewalAssessment,
  type UpcomingRenewal,
} from './domain';

export {
  getSubscriptionById,
  useSubscriptionStore,
  type SubscriptionStoreState,
} from './store';

export { retireLocalSubscriptionPersistence } from './persistence';

export {
  SubscriptionError,
  mapSubscriptionError,
  type SubscriptionFailureCode,
} from './errors';

export {
  computeMonthlySpendTotal,
  formatDashboardDate,
  selectHomeDashboard,
  selectInsightsDashboard,
  type HomeDashboardView,
  type HomeUpcomingItem,
  type InsightsCategorySlice,
  type InsightsDashboardView,
  type InsightsHighlight,
  type InsightsStat,
  type InsightsTimelineItem,
  type InsightsTopSubscription,
  type InsightsTrendPoint,
} from './selectors';

export {
  DEFAULT_SUBSCRIPTION_LIST_SORT,
  SUBSCRIPTION_LIST_SORT_OPTIONS,
  getSubscriptionListSortLabel,
  selectSubscriptionList,
  type SubscriptionListFilter,
  type SubscriptionListQuery,
  type SubscriptionListSort,
} from './listQuery';
