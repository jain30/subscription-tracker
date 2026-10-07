-- =============================================================================
-- PHASE 17 — STEP 2
-- Initial schema: profiles, subscriptions, triggers, RLS
--
-- Fresh Supabase project only. Do NOT migrate AsyncStorage / mock users.
-- Identity authority: auth.users (Supabase Auth).
-- Application tables: public.profiles, public.subscriptions.
-- Security boundary: PostgreSQL Row Level Security (not the mobile client).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- gen_random_uuid() is provided by pgcrypto (enabled by default on Supabase).
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Domain value documentation (application ↔ database)
--
-- billing_cycle:
--   Weekly  → weekly
--   Monthly → monthly
--   Yearly  → yearly
--
-- reminder_offset:
--   Off            → off
--   Same day       → same_day
--   1 day before   → days_before_1
--   3 days before  → days_before_3
--   7 days before  → days_before_7
--
-- status: active | trial | canceled (matches TypeScript)
-- currency: ISO 4217 codes currently supported by the app
-- category / color: production Category ids (color is accent key, not hex)
--
-- Money:
--   price uses numeric(12,2) — exact decimal, never float.
--   Supported currencies (USD, EUR, GBP, INR, CAD) all use 2 minor units.
--   numeric(12,2) supports up to 9,999,999,999.99 — sufficient for MVP.
-- ---------------------------------------------------------------------------

-- =============================================================================
-- public.profiles
-- Application profile (1:1 with auth.users). No passwords / tokens / secrets.
-- =============================================================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_full_name_length_check CHECK (char_length(full_name) <= 200)
);

COMMENT ON TABLE public.profiles IS
  'Application profile for an authenticated user. Credentials live in auth.users only.';
COMMENT ON COLUMN public.profiles.id IS
  'Equals auth.users.id. Ownership key for RLS (auth.uid() = id).';
COMMENT ON COLUMN public.profiles.full_name IS
  'Display name from signup metadata. Not used for authorization.';

-- =============================================================================
-- public.subscriptions
-- User-owned subscription records. Preserves the existing domain fields.
-- =============================================================================
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users (id) ON DELETE CASCADE,

  name text NOT NULL,
  category text NOT NULL,
  price numeric(12, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  billing_cycle text NOT NULL,
  renewal_date date NOT NULL,
  reminder_offset text NOT NULL DEFAULT 'days_before_1',
  auto_renew boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'active',
  notes text NOT NULL DEFAULT '',
  -- Accent key (Category id), not a hex color string.
  color text NOT NULL DEFAULT 'other',
  -- Payment method *category/label* only. NEVER store PANs, CVVs, or bank secrets.
  payment_method text NOT NULL DEFAULT '',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT subscriptions_name_not_blank CHECK (char_length(btrim(name)) > 0),
  CONSTRAINT subscriptions_name_length_check CHECK (char_length(name) <= 200),
  CONSTRAINT subscriptions_price_non_negative CHECK (price >= 0),
  CONSTRAINT subscriptions_notes_length_check CHECK (char_length(notes) <= 4000),
  CONSTRAINT subscriptions_payment_method_length_check CHECK (char_length(payment_method) <= 64),

  CONSTRAINT subscriptions_category_check CHECK (
    category IN (
      'entertainment',
      'music',
      'video_streaming',
      'cloud_storage',
      'productivity',
      'education',
      'fitness',
      'health',
      'gaming',
      'shopping',
      'finance',
      'news',
      'developer_tools',
      'ai_tools',
      'business',
      'food',
      'travel',
      'utilities',
      'security',
      'kids',
      'other'
    )
  ),
  CONSTRAINT subscriptions_color_check CHECK (
    color IN (
      'entertainment',
      'music',
      'video_streaming',
      'cloud_storage',
      'productivity',
      'education',
      'fitness',
      'health',
      'gaming',
      'shopping',
      'finance',
      'news',
      'developer_tools',
      'ai_tools',
      'business',
      'food',
      'travel',
      'utilities',
      'security',
      'kids',
      'other'
    )
  ),
  CONSTRAINT subscriptions_currency_check CHECK (
    currency IN ('USD', 'EUR', 'GBP', 'INR', 'CAD')
  ),
  CONSTRAINT subscriptions_billing_cycle_check CHECK (
    billing_cycle IN ('weekly', 'monthly', 'yearly')
  ),
  CONSTRAINT subscriptions_status_check CHECK (
    status IN ('active', 'trial', 'canceled')
  ),
  CONSTRAINT subscriptions_reminder_offset_check CHECK (
    reminder_offset IN (
      'off',
      'same_day',
      'days_before_1',
      'days_before_3',
      'days_before_7'
    )
  )
);

COMMENT ON TABLE public.subscriptions IS
  'User-owned recurring subscription records. Isolated by RLS on user_id.';
COMMENT ON COLUMN public.subscriptions.user_id IS
  'Owner. Must equal auth.uid() for client CRUD. Never trust client filtering alone.';
COMMENT ON COLUMN public.subscriptions.price IS
  'Exact money amount as numeric(12,2). Never floating point.';
COMMENT ON COLUMN public.subscriptions.renewal_date IS
  'Calendar renewal date only (no time-of-day). Display formatting is a UI concern.';
COMMENT ON COLUMN public.subscriptions.color IS
  'UI accent category key (same domain as category), not a color hex.';
COMMENT ON COLUMN public.subscriptions.payment_method IS
  'Optional payment method label/category. Must not store card numbers or bank credentials.';
COMMENT ON COLUMN public.subscriptions.reminder_offset IS
  'Per-subscription reminder rule token. Delivery history belongs in a future table.';

-- ---------------------------------------------------------------------------
-- Indexes (query-driven)
-- Home upcoming / list renewal sort: (user_id, renewal_date)
--   Leftmost user_id also covers ownership-scoped reads.
-- List status chips: (user_id, status)
-- ---------------------------------------------------------------------------
CREATE INDEX subscriptions_user_id_renewal_date_idx
  ON public.subscriptions (user_id, renewal_date);

CREATE INDEX subscriptions_user_id_status_idx
  ON public.subscriptions (user_id, status);

-- No UNIQUE on name — duplicate provider names are valid per user.

-- =============================================================================
-- updated_at maintenance (server-side; do not trust the client)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER subscriptions_set_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Profile creation on auth.users INSERT
-- Guarantees a profile even if the mobile client crashes after signup.
-- SECURITY DEFINER + fixed search_path: runs with definer privileges, bypasses RLS.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_full_name text;
BEGIN
  meta_full_name := coalesce(
    nullif(btrim(NEW.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(NEW.raw_user_meta_data ->> 'fullName'), ''),
    ''
  );

  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, meta_full_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Creates public.profiles row for each new auth.users row. Reads full_name/fullName from signup metadata.';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- Grants (explicit; mobile uses anon key + user JWT → authenticated role)
-- Never grant privileged roles to the mobile app.
-- =============================================================================
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon;
REVOKE ALL ON TABLE public.subscriptions FROM PUBLIC, anon;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- profiles: clients may read their row and edit display name only.
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name) ON TABLE public.profiles TO authenticated;

-- subscriptions: full CRUD except ownership / identity / audit columns.
GRANT SELECT, INSERT, DELETE ON TABLE public.subscriptions TO authenticated;
GRANT UPDATE (
  name,
  category,
  price,
  currency,
  billing_cycle,
  renewal_date,
  reminder_offset,
  auto_renew,
  status,
  notes,
  color,
  payment_method
) ON TABLE public.subscriptions TO authenticated;

-- anon: no table access (fail closed)
-- id, user_id, created_at, updated_at are not client-updatable (defense in depth;
-- RLS still blocks ownership spoofing even if grants were broader).

-- =============================================================================
-- Row Level Security
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Note: FORCE ROW LEVEL SECURITY is intentionally NOT used so the
-- SECURITY DEFINER profile-creation trigger (and service_role tooling)
-- can manage rows without a client INSERT policy. anon/authenticated
-- remain fully constrained by the policies below.

-- ---------------------------------------------------------------------------
-- profiles policies
-- SELECT / UPDATE own row only.
-- No INSERT for clients — created by handle_new_user trigger.
-- No DELETE for clients — removed via auth.users ON DELETE CASCADE.
-- ---------------------------------------------------------------------------
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- subscriptions policies
-- Ownership must equal auth.uid() on read and write.
-- INSERT WITH CHECK blocks inserting as another user.
-- UPDATE USING + WITH CHECK blocks reading/writing others' rows and
-- prevents transferring user_id to another account.
-- ---------------------------------------------------------------------------
CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "subscriptions_insert_own"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "subscriptions_update_own"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "subscriptions_delete_own"
  ON public.subscriptions
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
