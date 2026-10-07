import { BILLING_CYCLES, CATEGORY_OPTIONS, CURRENCIES } from './constants';
import type { SubscriptionFormValues } from './types';
import { parseDisplayDate } from './utils/formatDate';

export type SubscriptionValidationErrors = Partial<
  Record<keyof SubscriptionFormValues, string>
>;

export function validateSubscriptionForm(
  values: SubscriptionFormValues,
): SubscriptionValidationErrors {
  const errors: SubscriptionValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Subscription name is required';
  }

  if (!values.category) {
    errors.category = 'Category is required';
  } else if (!CATEGORY_OPTIONS.some((item) => item.key === values.category)) {
    errors.category = 'Choose a valid category';
  }

  const price = Number.parseFloat(values.price);
  if (!values.price.trim() || Number.isNaN(price) || price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!values.billingCycle) {
    errors.billingCycle = 'Billing cycle is required';
  } else if (
    !(BILLING_CYCLES as readonly string[]).includes(values.billingCycle)
  ) {
    errors.billingCycle = 'Choose a billing cycle';
  }

  if (!values.renewalDate.trim()) {
    errors.renewalDate = 'Renewal date is required';
  } else if (parseDisplayDate(values.renewalDate) == null) {
    errors.renewalDate = 'Enter a valid renewal date';
  }

  if (!CURRENCIES.includes(values.currency)) {
    errors.currency = 'Choose a valid currency';
  }

  return errors;
}

export function isSubscriptionFormValid(
  values: SubscriptionFormValues,
): boolean {
  return Object.keys(validateSubscriptionForm(values)).length === 0;
}
