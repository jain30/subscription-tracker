/**
 * Phase 18/19 subscription domain — lifecycle, renewal, finance, attention.
 */

export {
  CHARGEABLE_STATUSES,
  countByStatus,
  filterChargeable,
  isActive,
  isCanceled,
  isChargeable,
  isNonAutoRenewing,
  isTrial,
} from './lifecycle';

export {
  DEFAULT_UPCOMING_WINDOW_DAYS,
  addBillingCycle,
  assessRenewal,
  calendarToday,
  daysBetweenCalendar,
  getRelativeDueLabel,
  getTimelineBucket,
  isDueSoon,
  isReminderEligible,
  parseIsoCalendarDate,
  parseRenewalCalendarDate,
  selectTrialsEndingSoon,
  selectUpcomingRenewals,
  toCalendarIso,
  type RenewalAssessment,
  type TimelineBucket,
  type UpcomingRenewal,
} from './renewalEngine';

export {
  computeFinancialSummary,
  computeMonthlySpendByCurrency,
  computeUpcomingPaymentsByCurrency,
  computeYearlySpendByCurrency,
  formatCurrencyTotals,
  getChargeableMonthlyPrice,
  getChargeableYearlyPrice,
  roundMoney,
  toMonthlyPrice,
  toYearlyPrice,
  type CurrencyTotal,
  type FinancialSummary,
} from './financeEngine';

export {
  attentionReasonsFor,
  selectNeedsAttention,
  type AttentionItem,
  type AttentionReason,
} from './attention';
