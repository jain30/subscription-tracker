# PHASE 17 — STEP 7 REPORT

## 1. Executive Verdict

**BLOCKED**

Credentials are present and the hosted Supabase project is reachable. A real env naming defect was found and fixed. However, the Phase 17 migration is **not applied** on the remote project (`public.profiles` and `public.subscriptions` are missing). Live RLS, auth E2E, and subscription CRUD verification therefore cannot proceed yet.

---

## 2. Environment Configuration

| Check | Result |
|-------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | **CONFIGURED** |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | **CONFIGURED** (after rename fix) |
| `ENV_FILE_GITIGNORED` | **PASS** (`mobile/.gitignore` → `.env`; not tracked) |
| `PRIVILEGED_SECRET_DETECTED` | **PASS** |

### Defect found and fixed

| Field | Detail |
|-------|--------|
| FILE | `mobile/.env` |
| PROBLEM | Key was named `EXPO_PUBLIC_SUPABASE_KEY`, but the app reads `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`mobile/constants/config.ts`). `isSupabaseConfigured` was effectively false for the publishable key. |
| CHANGE | Renamed the env variable to `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (value unchanged; never printed). |
| WHY | Without the expected name, the Expo client would treat Supabase as unconfigured / use fallback unavailable credentials. |
| VERIFICATION | Env name list now includes both expected public keys; Expo lint loads/export both Supabase vars; connection probe succeeds. |

Key family observed (metadata only): `sb_publishable_*` — **not** `sb_secret_*` / `service_role`.

Report-only summary:

- **SUPABASE_URL:** CONFIGURED  
- **SUPABASE_PUBLISHABLE_KEY:** CONFIGURED  
- **ENV_FILE_GITIGNORED:** PASS  
- **PRIVILEGED_SECRET_DETECTED:** PASS  

---

## 3. Supabase Client Verification

| Item | Finding |
|------|---------|
| Client creation | Single client: `mobile/lib/supabase/client.ts` via `createClient` from `@supabase/supabase-js` |
| Env vars used | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` via `mobile/constants/config.ts` |
| Dependency | `@supabase/supabase-js` present in `mobile/package.json` |
| Hardcoded production credentials | None found (only unavailable fallbacks when unset) |
| Privileged client | None |
| Express for auth/CRUD | Unused; auth uses Supabase Auth; CRUD uses `mobile/features/subscriptions/api.ts` → Supabase |
| Session storage | Native SecureStore+AES / web `localStorage` adapters |

**STATIC PASS** — client configuration matches the intended architecture.

---

## 4. Supabase Project Identity

**SUPABASE_PROJECT_IDENTITY: MATCH**

Evidence (no secrets printed):

- URL shape: valid `https://<ref>.supabase.co`
- Project ref length: 20 (standard Supabase ref)
- Auth health endpoint returned HTTP 200 with the configured publishable key
- Credentials were supplied by the developer from their dashboard

Region (Mumbai / South Asia) cannot be confirmed from the client URL alone; treat region as developer-attested.

---

## 5. Remote Database / Migration Status

Local migration file exists:

`supabase/migrations/20260810183000_initial_schema.sql`

Remote status from non-destructive PostgREST probes (anon/publishable key, no writes):

| Object | Remote status | Evidence |
|--------|---------------|----------|
| `public.subscriptions` | **MISSING** | `PGRST205` — Could not find the table `public.subscriptions` in the schema cache |
| `public.profiles` | **MISSING** | `PGRST205` — Could not find the table `public.profiles` in the schema cache |
| Unknown canary table | MISSING | Same `PGRST205` class (control) |

**Conclusion:** Migration is **(A) present locally** and **not (B) applied remotely**.

Cannot verify live FKs, CHECKs, indexes, triggers, or RLS until the migration is applied.

---

## 6. RLS Security Status

| Layer | Status | Notes |
|-------|--------|-------|
| Static RLS design in migration | **STATIC PASS** | Own-row policies; INSERT `WITH CHECK (auth.uid() = user_id)`; UPDATE USING+WITH CHECK; column grants exclude ownership/audit fields |
| Two-user plan coverage | **STATIC PASS** | `supabase/tests/rls_two_user_plan.sql` covers own CRUD, cross-user deny, ownership spoof, unauthenticated deny, integrity checks |
| Live RLS execution | **BLOCKED** | Tables do not exist on remote yet |

Do **not** weaken RLS. After migration apply, execute the two-user plan via authenticated API (anon/publishable key + user JWTs).

---

## 7. Authentication Status

| Area | Status |
|------|--------|
| Register / login / logout implementation | **STATIC PASS** |
| Session restoration (SecureStore / web storage) | **STATIC PASS** |
| Email confirmation UX (`needsEmailConfirmation`) | **STATIC PASS** |
| Wrong-password / duplicate-email mapping | **STATIC PASS** |
| Password recovery + recovery session gate | **STATIC PASS** |
| Deep-link handling (`subscriptiontracker://reset-password`) | **STATIC PASS** |
| Live auth flows (register/confirm/login/logout/restart/recovery) | **BLOCKED** |

Live auth was not executed in this step (no test-account creation; email/device flows remain manual). Project connectivity for Auth API is confirmed via `/auth/v1/health` **PASS**.

---

## 8. Subscription CRUD Status

| Area | Status |
|------|--------|
| CREATE/READ/UPDATE/DELETE/REFRESH code path | **STATIC PASS** (`api.ts` + Zustand store) |
| Cache updates only after success | **STATIC PASS** |
| `user_id` omitted on insert (DEFAULT `auth.uid()`) | **STATIC PASS** |
| Update payload excludes ownership/identity columns | **STATIC PASS** |
| Logout clears subscription cache | **STATIC PASS** |
| Live CRUD against remote Postgres | **BLOCKED** (tables missing) |

---

## 9. Data Privacy Audit

| # | Control | Status |
|---|---------|--------|
| 1 | Auth identity from Supabase Auth | STATIC PASS |
| 2 | Authorization via `auth.uid()` / RLS | STATIC PASS (design); LIVE BLOCKED |
| 3 | Client does not choose authoritative ownership | STATIC PASS |
| 4 | CREATE does not trust client `user_id` | STATIC PASS |
| 5 | UPDATE cannot change ownership (grants + RLS design) | STATIC PASS (design); LIVE BLOCKED |
| 6 | DELETE protected by RLS | STATIC PASS (design); LIVE BLOCKED |
| 7 | SELECT scoped by RLS | STATIC PASS (design); LIVE BLOCKED |
| 8 | Zustand is UI cache only | STATIC PASS |
| 9 | AsyncStorage not subscription source of truth | STATIC PASS (retired + cleared) |
| 10 | No passwords in app tables | STATIC PASS (migration design) |
| 11 | No `service_role` in mobile | PASS |
| 12 | No DB password in mobile | PASS |
| 13 | No access tokens in Zustand | STATIC PASS |
| 14 | Logout clears user-specific cache | STATIC PASS |
| 15 | No A→B cache bleed design | STATIC PASS (`clearActiveUser` / `setActiveUser`); LIVE BLOCKED |

---

## 10. Secret / Credential Audit

| Finding | Severity | Path / note |
|---------|----------|-------------|
| `service_role` mentions | Info | Comments / docs / migration notes only — not live secrets |
| Privileged keys in `mobile/.env` | None | Publishable key family only |
| `.env` tracked by Git | None | Ignored; not tracked |
| Hardcoded live Supabase credentials in source | None | |
| `as any` / `@ts-ignore` / `@ts-nocheck` in mobile | None | |
| Legacy Express `apiClient` | Low / deferred | Unused by Phase 17 auth/CRUD |

**No privileged secret exposure found in committed code.**

---

## 11. TypeScript / Lint Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` (mobile) | **PASS** (exit 0) |
| `npx expo lint` (mobile) | **PASS** (exit 0) |

Expo confirmed loading: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

---

## 12. Tests Actually Executed

1. Env presence / naming / privileged-key classification (no secret values printed)
2. Git ignore / untracked check for `mobile/.env`
3. Safe connection probe: `GET /auth/v1/health` → **200 PASS**
4. Safe PostgREST probes: `profiles` / `subscriptions` → **PGRST205 TABLE_MISSING**
5. TypeScript compile
6. Expo lint
7. Repository secret / unsafe-cast scan

Probe helper (optional re-run after migration):

`mobile/scripts/phase17-connection-probe.mjs`

---

## 13. Tests Still Blocked

1. Remote schema object verification (FKs, CHECKs, indexes, triggers, RLS enabled)
2. Two-user RLS isolation matrix (live)
3. Registration + email confirmation (live)
4. Login / wrong password / logout / restart session (device)
5. Subscription CRUD live
6. Password recovery + deep link end-to-end
7. Cross-user cache isolation after logout/login as User B
8. Dashboard Auth redirect allowlist confirmation

---

## 14. Required Manual Actions

1. **Apply the migration** to the hosted Supabase project (SQL Editor or linked CLI):
   - Run contents of `supabase/migrations/20260810183000_initial_schema.sql`
2. **Re-run the connection probe** and confirm `profiles` / `subscriptions` are no longer `TABLE_MISSING`  
   (expect empty result or permission-denied style access under anon — not “table not found”).
3. **Auth dashboard**
   - Confirm email confirmation policy for production
   - Add redirect URLs: `subscriptiontracker://reset-password`, `subscriptiontracker://**`, plus Expo Go reset URL while developing
4. **Execute** `supabase/tests/rls_two_user_plan.sql` matrix with User A / User B JWTs
5. **Device E2E**: register → confirm → login → CRUD → restart → logout → User B isolation → password recovery

---

## 15. Phase 17 Closure Decision

| Gate | Status | Evidence | Next Action |
|------|--------|----------|-------------|
| Env credentials present | **PASS** | URL + publishable key configured | Keep `.env` local only |
| Env naming correct | **PASS** | Renamed to `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | None |
| `.env` gitignored / untracked | **PASS** | `git check-ignore`; not in index | None |
| No privileged secrets in mobile | **PASS** | Scan + key family `sb_publishable` | Never add service_role |
| Supabase client config | **PASS** | Single typed client | None |
| Project reachable | **PASS** | Auth health HTTP 200 | None |
| Project identity | **MATCH** | Developer dashboard credentials reach live project | Optional: confirm Mumbai in dashboard |
| Migration applied remotely | **FAIL / BLOCKED** | `PGRST205` for both tables | Apply migration |
| RLS live isolation | **BLOCKED** | No tables yet | After migration, run two-user plan |
| Auth live E2E | **BLOCKED** | Not executed this step | Device + email tests |
| CRUD live E2E | **BLOCKED** | Tables missing | After migration |
| TypeScript | **PASS** | exit 0 | None |
| Expo lint | **PASS** | exit 0 | None |
| Phase 17 complete | **NO** | Live schema + E2E gates open | Complete manual actions 1–5 |

### Closure rule applied

Static correctness was **not** converted into live PASS. Connection PASS does not imply schema PASS. Phase 17 remains open until migration apply + live security/auth/CRUD gates succeed.
