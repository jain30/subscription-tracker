/**
 * Subscription domain types — production V1 model for MongoDB / Express alignment.
 */

export type BillingCycle = 'Weekly' | 'Monthly' | 'Yearly';

export type ReminderOffset =
  | 'Off'
  | 'Same day'
  | '1 day before'
  | '3 days before'
  | '7 days before';

export type SubscriptionStatus = 'active' | 'trial' | 'canceled';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD';

/** Production category ids — aligned with catalog + theme accents. */
export type Category =
  | 'entertainment'
  | 'music'
  | 'video_streaming'
  | 'cloud_storage'
  | 'productivity'
  | 'education'
  | 'fitness'
  | 'health'
  | 'gaming'
  | 'shopping'
  | 'finance'
  | 'news'
  | 'developer_tools'
  | 'ai_tools'
  | 'business'
  | 'food'
  | 'travel'
  | 'utilities'
  | 'security'
  | 'kids'
  | 'other';

/**
 * Canonical Subscription entity.
 * `userId` owns the record (MongoDB-ready). `color` stores the category accent.
 * `paymentMethod` is retained for future backend parity but not collected in V1 UI.
 */
export type Subscription = {
  id: string;
  /** Owning authenticated user — required for multi-user isolation */
  userId: string;
  name: string;
  category: Category;
  price: number;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  renewalDate: string;
  reminderOffset: ReminderOffset;
  autoRenew: boolean;
  status: SubscriptionStatus;
  notes: string;
  color: Category;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Form draft used by Add / Edit screens.
 * Create UI offers Active / Trial only; Cancel is a dedicated detail action.
 * Edit may include Canceled so a canceled record can be reactivated.
 */
export type SubscriptionFormValues = {
  name: string;
  price: string;
  currency: CurrencyCode;
  billingCycle: BillingCycle | '';
  renewalDate: string;
  category: Category | '';
  reminderOffset: ReminderOffset;
  notes: string;
  color: Category;
  autoRenew: boolean;
  status: SubscriptionStatus;
};

export type ListUiState =
  | 'populated'
  | 'loading'
  | 'empty'
  | 'offline'
  | 'error';

/** Input for creating a subscription (store CRUD). */
export type CreateSubscriptionInput = SubscriptionFormValues;

/** Input for updating a subscription (store CRUD). */
export type UpdateSubscriptionInput = SubscriptionFormValues;
