import { useMemo, useState } from 'react';
import { Platform, Switch, View } from 'react-native';

import { AppButton, AppInput, AppText } from '@/components/ui';
import {
  BILLING_CYCLES,
  CATEGORIES,
  CATEGORY_IDS,
  CREATE_STATUS_OPTIONS,
  CURRENCIES,
  EDIT_STATUS_OPTIONS,
  REMINDER_OPTIONS,
  categoryLabel,
  isSubscriptionFormValid,
  resolveCatalogCategory,
  statusLabel,
  suggestSubscriptions,
  validateSubscriptionForm,
  type BillingCycle,
  type CatalogSubscription,
  type Category,
  type CurrencyCode,
  type ReminderOffset,
  type SubscriptionFormValues,
  type SubscriptionStatus,
  type SubscriptionValidationErrors,
} from '@/features/subscriptions';
import { useTheme, type AppTheme } from '@/theme';

import { ColorPickerField } from './ColorPickerField';
import { DatePickerField } from './DatePickerField';
import { NameSuggestionList } from './NameSuggestionList';
import { OptionPickerSheet } from './OptionPickerSheet';
import { SelectField } from './SelectField';

export type SubscriptionFormProps = {
  values: SubscriptionFormValues;
  onChange: (patch: Partial<SubscriptionFormValues>) => void;
  /** When true, show validation for all invalid fields (e.g. after Save press). */
  forceShowErrors?: boolean;
  /**
   * Inline submit button. Prefer sticky footer on Create / Edit screens
   * (`showSubmitButton={false}`).
   */
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  submitLabel?: string;
  saving?: boolean;
  /**
   * Create: Active / Trial only.
   * Edit: Active / Trial / Canceled (reactivation supported).
   */
  mode?: 'create' | 'edit';
};

type PickerKey =
  | 'currency'
  | 'billingCycle'
  | 'category'
  | 'reminder'
  | 'status'
  | null;

/**
 * Shared Add / Edit form — smart name suggestions + searchable categories.
 */
export function SubscriptionForm({
  values,
  onChange,
  forceShowErrors = false,
  showSubmitButton = false,
  onSubmit,
  submitLabel = 'Save',
  saving = false,
  mode = 'create',
}: SubscriptionFormProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [picker, setPicker] = useState<PickerKey>(null);
  const statusOptions =
    mode === 'edit' ? EDIT_STATUS_OPTIONS : CREATE_STATUS_OPTIONS;
  const renewalLabel =
    values.status === 'trial' ? 'Trial end / first charge date' : 'Next renewal date';
  const renewalPlaceholder =
    values.status === 'trial'
      ? 'Select trial end date'
      : 'Select renewal date';
  const [touched, setTouched] = useState<
    Partial<Record<keyof SubscriptionFormValues, boolean>>
  >({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const allErrors = useMemo(
    () => validateSubscriptionForm(values),
    [values],
  );
  const isValid = isSubscriptionFormValid(values);
  const revealErrors = showAllErrors || forceShowErrors;

  const errors = useMemo(() => {
    if (revealErrors) {
      return allErrors;
    }
    const next: SubscriptionValidationErrors = {};
    (Object.keys(allErrors) as (keyof SubscriptionFormValues)[]).forEach(
      (key) => {
        if (touched[key]) {
          next[key] = allErrors[key];
        }
      },
    );
    return next;
  }, [allErrors, revealErrors, touched]);

  /**
   * Drive suggestions from the query only — never from focus.
   * Gating on focus unmounted the list on blur before the press landed,
   * so onSelect never ran and the form never updated.
   * Exact catalog matches are already excluded by `suggestSubscriptions`.
   */
  const suggestions = useMemo(
    () => suggestSubscriptions(values.name),
    [values.name],
  );

  const markTouched = (key: keyof SubscriptionFormValues) => {
    setTouched((current) => ({ ...current, [key]: true }));
  };

  const patch = (next: Partial<SubscriptionFormValues>) => {
    onChange(next);
    (Object.keys(next) as (keyof SubscriptionFormValues)[]).forEach((key) => {
      markTouched(key);
    });
  };

  const applyName = (name: string, autoCategory = true) => {
    const next: Partial<SubscriptionFormValues> = { name };
    if (autoCategory) {
      const category = resolveCatalogCategory(name);
      if (category) {
        next.category = category;
        next.color = category;
      }
    }
    patch(next);
  };

  const onSelectSuggestion = (item: CatalogSubscription) => {
    const next: Partial<SubscriptionFormValues> = {
      name: item.name,
      category: item.categoryId,
      color: item.categoryId,
    };
    if (item.defaultPrice != null) {
      next.price = String(item.defaultPrice);
    }
    if (item.defaultBillingCycle) {
      next.billingCycle = item.defaultBillingCycle;
    }
    if (item.defaultCurrency) {
      next.currency = item.defaultCurrency;
    }
    patch(next);
  };

  const validateAndSubmit = () => {
    if (!isValid) {
      setShowAllErrors(true);
      return;
    }
    onSubmit?.();
  };

  return (
    <View style={styles.form}>
      <View style={styles.section}>
        <AppInput
          label="Subscription name"
          value={values.name}
          onChangeText={(name) => applyName(name, true)}
          placeholder="e.g. Netflix"
          errorMessage={errors.name}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <NameSuggestionList
          suggestions={suggestions}
          onSelect={onSelectSuggestion}
        />

        <SelectField
          label="Category"
          value={values.category ? categoryLabel(values.category) : ''}
          placeholder="Select category"
          onPress={() => setPicker('category')}
          errorMessage={errors.category}
        />

        <View style={styles.amountRow}>
          <View style={styles.amountField}>
            <AppInput
              label="Price"
              value={values.price}
              onChangeText={(price) => patch({ price })}
              placeholder="0.00"
              keyboardType="decimal-pad"
              errorMessage={errors.price}
            />
          </View>
          <View style={styles.currencyField}>
            <SelectField
              label="Currency"
              value={values.currency}
              onPress={() => setPicker('currency')}
              errorMessage={errors.currency}
            />
          </View>
        </View>

        <SelectField
          label="Status"
          value={statusLabel(values.status)}
          placeholder="Select status"
          onPress={() => setPicker('status')}
        />

        <SelectField
          label="Billing cycle"
          value={values.billingCycle}
          placeholder="Select billing cycle"
          onPress={() => setPicker('billingCycle')}
          errorMessage={errors.billingCycle}
        />

        <DatePickerField
          label={renewalLabel}
          value={values.renewalDate}
          placeholder={renewalPlaceholder}
          onChange={(renewalDate) => {
            patch({ renewalDate });
          }}
          errorMessage={errors.renewalDate}
        />
      </View>

      <View style={styles.optionalHeader}>
        <AppText
          variant="caption"
          color="secondary"
          style={styles.optionalLabel}
        >
          Advanced
        </AppText>
        <View style={styles.optionalRule} />
      </View>

      <View style={styles.section}>
        <SelectField
          label="Reminder"
          value={values.reminderOffset}
          onPress={() => setPicker('reminder')}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <AppText variant="subhead" color="secondary">
              Auto renew
            </AppText>
            <AppText variant="footnote" color="tertiary">
              Mark whether this renews automatically
            </AppText>
          </View>
          <Switch
            value={values.autoRenew}
            onValueChange={(autoRenew) => patch({ autoRenew })}
            trackColor={{
              false: theme.colors.bg.subtle,
              true: theme.colors.brand.soft,
            }}
            thumbColor={
              Platform.OS === 'android'
                ? values.autoRenew
                  ? theme.colors.brand.primary
                  : theme.colors.bg.surface
                : theme.colors.bg.surface
            }
            ios_backgroundColor={theme.colors.bg.subtle}
            accessibilityLabel="Auto renew"
          />
        </View>

        <AppInput
          label="Notes"
          value={values.notes}
          onChangeText={(notes) => patch({ notes })}
          placeholder="Add a note"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <ColorPickerField
          label="Color tag"
          value={values.color}
          options={CATEGORY_IDS}
          onChange={(color) =>
            patch({
              color,
              category: values.category || color,
            })
          }
        />
      </View>

      {showSubmitButton ? (
        <AppButton
          label={submitLabel}
          variant="primary"
          fullWidth
          size="lg"
          loading={saving}
          disabled={!isValid || saving}
          onPress={validateAndSubmit}
          style={styles.submit}
        />
      ) : null}

      <OptionPickerSheet
        visible={picker === 'currency'}
        title="Currency"
        selectedValue={values.currency}
        options={CURRENCIES.map((value) => ({ value, label: value }))}
        onSelect={(currency) => {
          patch({ currency: currency as CurrencyCode });
        }}
        onClose={() => {
          markTouched('currency');
          setPicker(null);
        }}
      />

      <OptionPickerSheet
        visible={picker === 'billingCycle'}
        title="Billing cycle"
        selectedValue={values.billingCycle}
        options={BILLING_CYCLES.map((value) => ({ value, label: value }))}
        onSelect={(billingCycle) => {
          patch({ billingCycle: billingCycle as BillingCycle });
        }}
        onClose={() => {
          markTouched('billingCycle');
          setPicker(null);
        }}
      />

      <OptionPickerSheet
        visible={picker === 'category'}
        title="Category"
        searchable
        searchPlaceholder="Search categories"
        selectedValue={values.category}
        options={CATEGORIES.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        onSelect={(category) => {
          patch({
            category: category as Category,
            color: category as Category,
          });
        }}
        onClose={() => {
          markTouched('category');
          setPicker(null);
        }}
      />

      <OptionPickerSheet
        visible={picker === 'reminder'}
        title="Reminder"
        selectedValue={values.reminderOffset}
        options={REMINDER_OPTIONS.map((value) => ({ value, label: value }))}
        onSelect={(reminderOffset) => {
          patch({ reminderOffset: reminderOffset as ReminderOffset });
        }}
        onClose={() => setPicker(null)}
      />

      <OptionPickerSheet
        visible={picker === 'status'}
        title="Status"
        selectedValue={values.status}
        options={statusOptions.map((value) => ({
          value,
          label: statusLabel(value),
        }))}
        onSelect={(status) => {
          patch({ status: status as SubscriptionStatus });
        }}
        onClose={() => {
          markTouched('status');
          setPicker(null);
        }}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return {
    form: {
      gap: theme.spacing[2],
      paddingBottom: theme.spacing[12],
    },
    section: {
      gap: theme.spacing[5],
    },
    amountRow: {
      flexDirection: 'row' as const,
      gap: theme.spacing[3],
      alignItems: 'flex-start' as const,
    },
    amountField: {
      flex: 1.5,
    },
    currencyField: {
      flex: 1,
    },
    optionalHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[3],
      marginTop: theme.spacing[6],
      marginBottom: theme.spacing[2],
    },
    optionalLabel: {
      letterSpacing: 0.6,
      textTransform: 'uppercase' as const,
    },
    optionalRule: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    switchRow: {
      minHeight: theme.layout.listRowHeight,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg.surface,
    },
    switchCopy: {
      flex: 1,
      gap: theme.spacing[1],
    },
    submit: {
      marginTop: theme.spacing[8],
    },
  };
}
