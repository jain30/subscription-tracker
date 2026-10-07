import type { CurrencyCode } from '../types';

/**
 * Format a money amount with currency (tabular-friendly Intl).
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode | string = 'USD',
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/** @deprecated Prefer formatCurrency — kept for gradual migration aliases. */
export const formatMoney = formatCurrency;
