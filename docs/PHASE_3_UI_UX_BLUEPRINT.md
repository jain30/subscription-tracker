# Subscription Tracker — Phase 3 UI/UX Blueprint & Screen Specifications

**Status:** Official UI design reference (design only — no implementation in this phase)  
**Phase 1:** Complete (Expo + Express + MongoDB foundation)  
**Phase 2:** Complete (product vision, IA, tokens, feature cut)  
**Phase 3 objective:** Specify every visual system, screen, interaction, and component so developers can build a production-ready UI without inventing design mid-flight

**Related:** [`PHASE_2_PLANNING.md`](./PHASE_2_PLANNING.md) — product vision, IA, and token foundations this document expands.

---

## How to use this document

| Audience | Use |
|---|---|
| Designers | Source of truth for visual language and screen intent |
| Frontend developers | Build screens and components against these specs |
| QA | Verify empty / loading / error / motion / a11y states |
| Product | Gate UI PRs against the Final Developer Checklist |

**Rules for implementation**

1. Do not invent new colors, radii, or type styles without updating this doc.
2. Prefer lists + typography hierarchy over nested card grids.
3. One primary CTA per view.
4. Cards only when interaction needs containment.
5. Respect Reduce Motion everywhere motion is specified.

---

## 1. Visual Style

### 1.1 Overall design philosophy

**Quiet confidence for money.**

The product restores financial calm. The UI should feel like a precise, warm instrument—never a panic dashboard, never a gamified wallet, never a spreadsheet wearing a coat of paint.

| Principle | What it means in UI | Why |
|---|---|---|
| **Clarity first** | Amounts, dates, and status readable before decoration | Users open the app for numbers, not vibes |
| **One job per screen** | Each screen answers one question | Reduces cognitive load; matches Phase 2 G1–G4 |
| **Quiet surfaces** | Soft neutrals, restrained accent, no glow | Money anxiety drops when chrome is calm |
| **Honest states** | Empty, loading, error, offline are designed—not afterthoughts | Trust is the product |
| **Premium without flash** | Capability upgrade, not chrome upgrade | Aligns with ethical monetization |
| **Motion with purpose** | 2–3 signature patterns only | Presence without noise |

**Inspiration blend (not copies):** Apple restraint · Airbnb warm empties · Linear precision · Stripe money honesty · Spotify hierarchy · Notion calm density.

### 1.2 Modern app style

**Style label:** Calm Product Modern — light, structured, content-led.

| Do | Don’t |
|---|---|
| Light surfaces with soft teal brand accents | Purple-on-white / indigo gradient themes |
| Typography-led hierarchy | Widget soup on first viewport |
| Soft borders + rare elevation | Multi-layer shadows and neon glow |
| Rounded-md buttons | Stadium pills everywhere |
| Outline icons, filled when selected | Emoji icons / multicolor chrome icons |
| Full-bleed brand moments on splash/onboarding only | Inset hero cards and floating promo stickers |

**Platform posture:** Native-feeling iOS/Android patterns (safe areas, large titles where useful, system sheets) with a distinctive brand voice—not a Material clone and not a pure iOS skin.

### 1.3 Colors

Inherited and locked from Phase 2. Hex values are the starting production palette; adjust only via token PR.

| Token | Hex | Role | Why |
|---|---|---|---|
| `color.bg.app` | `#F3F6F8` | App canvas | Soft cool gray reads as calm “desk light,” not hospital white |
| `color.bg.surface` | `#FFFFFF` | Cards, sheets, rows | Clean content plane; max contrast for money |
| `color.bg.subtle` | `#E8EEF2` | Grouped backgrounds, chips | Separates groups without borders-on-borders |
| `color.text.primary` | `#0F1C24` | Titles, amounts | Near-ink for trust and contrast |
| `color.text.secondary` | `#5B6B76` | Supporting copy | Readable hierarchy without washing out |
| `color.text.tertiary` | `#8A9AA6` | Meta, timestamps | Recedes so primary numbers win |
| `color.brand.primary` | `#0B6E6A` | Primary CTAs, selected tabs, key accents | Deep teal = trust + calm (banking-adjacent without cold blue) |
| `color.brand.primaryPressed` | `#085652` | Pressed primary | Clear tactile feedback |
| `color.brand.soft` | `#D7F0EE` | Soft fills, selected chips | Brand presence without shouting |
| `color.accent` | `#C9832A` | Premium highlights, rare emphasis | Warm gold-amber = value, not alarm |
| `color.success` | `#1F8A5B` | Paid / on track | Mint-green = healthy money state |
| `color.warning` | `#C47A12` | Due soon | Amber caution without panic red |
| `color.danger` | `#C23B3B` | Overdue / destructive | Reserved; never decorate with danger |
| `color.border` | `#D5DEE5` | Dividers, input borders | Soft structure |
| `color.overlay` | `#0F1C24` @ 40% | Modal scrim | Focus without black void |

**Category accents (muted, optional):** soft pastel tints for Streaming, Productivity, Health, Finance, Shopping, Other—always on a shared neutral base so lists don’t become rainbow noise.

**Status rule:** Never communicate status by color alone—pair with label and/or icon.

**Why not purple / cream-serif / dark-first:** Those reads as generic AI-finance skins and conflict with the calm teal identity already chosen in Phase 2. Dark mode ships only when a true brand dark theme is designed (post-MVP).

### 1.4 Typography

| Role | Font | Why |
|---|---|---|
| Display / brand moments | **Fraunces** (or Newsreader) | Soft serif warmth for splash, onboarding hero, empty-state titles—human, not corporate |
| UI / body | **Plus Jakarta Sans** (or DM Sans) | Modern geometric sans with excellent UI metrics; distinctive vs Inter/Roboto/system |
| Money / amounts | Same UI font + `tabular-nums` | Columns and totals align; money feels precise |

| Style | Size | Weight | Line height | Use |
|---|---|---|---|---|
| Display | 34 | Semibold | 1.25 | Onboarding brand, rare heroes |
| Title 1 | 28 | Semibold | 1.25 | Screen titles |
| Title 2 | 22 | Semibold | 1.25 | Section headers |
| Title 3 | 18 | Medium | 1.3 | Card / row titles |
| Body | 16 | Regular | 1.45 | Primary content |
| Body Strong | 16 | Medium | 1.45 | Emphasized body |
| Callout | 15 | Regular | 1.45 | Secondary paragraphs |
| Subhead | 14 | Medium | 1.4 | List meta |
| Footnote | 13 | Regular | 1.4 | Helper text |
| Caption | 12 | Medium | 1.35 | Badges, timestamps |
| Amount LG | 28–32 | Semibold | 1.2 | Monthly total |
| Amount MD | 18–20 | Semibold | 1.2 | Row amounts |
| Amount SM | 14 | Medium | 1.2 | Compact money |

**Rules**

- Never use Inter, Roboto, Arial, or system UI as the brand voice.
- Cap decorative Display usage; never clip currency at any Dynamic Type size.
- Screen reader: announce amount + currency + cycle together.

### 1.5 Spacing

Base unit **4**.

| Token | Value | Common use |
|---|---|---|
| `space.1` | 4 | Hair gaps, icon padding |
| `space.2` | 8 | Compact related items |
| `space.3` | 12 | Between stacked CTAs |
| `space.4` | 16 | Form field gap; default inset |
| `space.5` | 20 | Screen horizontal padding |
| `space.6` | 24 | Section gap (min) |
| `space.8` | 32 | Section gap (preferred) |
| `space.10` | 40 | Large section breaks |
| `space.12` | 48 | Hero breathing room |
| `space.16` | 64 | Rare dramatic spacing |

**Layout rules**

- Screen horizontal padding: **20**
- List row min height: **56–64**
- Touch targets: **≥ 44×44** (iOS) / **≥ 48×48** (Android)
- Adjacent targets spacing: **≥ 8**

**Why a 4pt grid:** Predictable rhythm, fewer one-off paddings, faster reviews.

### 1.6 Border radius

| Token | Value | Use | Why |
|---|---|---|---|
| `radius.sm` | 8 | Chips, inputs | Soft but precise |
| `radius.md` | 12 | Buttons, list rows | Friendly without pill-everything |
| `radius.lg` | 16 | Cards, tiles | Contained interaction surfaces |
| `radius.xl` | 24 | Sheets, large containers | Native sheet feel |
| `radius.full` | 999 | Avatars only | Sparingly—avoids generic “pill UI” |

### 1.7 Shadows / elevation

Prefer **surface + border** over heavy shadows. Elevation is rare and purposeful.

| Level | Use | Spec |
|---|---|---|
| 0 | Flat lists, most UI | Border only (`color.border`) |
| 1 | Interactive cards (rare) | Y:4 · Blur:12 · Opacity ~6% · `#0F1C24` |
| 2 | FAB / sticky bars | Y:6 · Blur:16 · Opacity ~10% |
| 3 | Modals / sheets | Y:12 · Blur:32 · Opacity ~16% |

**Why:** Money apps that float everything feel noisy and untrustworthy. Flat structure = clarity.

### 1.8 Icon style

- **Style:** Rounded stroke, optical weight **1.75–2px**
- **Grid:** 24×24 base; 20 dense lists; 16 inline meta
- **Corners:** Softly rounded (not sharp geometric, not bubbly)
- **Library:** One consistent set (Lucide / SF-like strokes curated to match)
- **Filled vs outline:** Outline default; filled only for selected tab / active status
- **Avoid:** Emoji as chrome; multicolor skeuomorphic icons

**Why:** Stroke icons stay quiet next to money figures; filled selection states provide clear wayfinding.

### 1.9 Illustration style

- Soft flat vector scenes; limited palette (teal + sand + one accent)
- Human-scale metaphors: quiet desk, soft calendar, calm receipt—not raining coins
- Used for: onboarding, empty states, Premium education, offline empathy
- One illustration family only
- Subtle enter motion (fade/slide); no looping cartoons

**Why:** Warmth without shame; metaphors about control and clarity, not wealth fantasies.

### 1.10 Animation style

**Signature patterns (ship these three):**

1. **Screen enter** — fade + 8–12px upward settle · 200–280ms · decelerate
2. **Value change** — amount crossfade / restrained count · ≤250ms
3. **Success check** — compact confirmation after save · ≤300ms

**Global rules**

| Rule | Spec |
|---|---|
| Interactive duration | 150–300ms |
| Page transition | ≤400ms |
| Ease enter | Standard decelerate |
| Ease exit | Accelerate / fade |
| Reduce Motion | Opacity-only or instant |
| Never | Delay task completion for delight |

**Why:** Premium apps feel composed because motion is rare and consistent—not because everything bounces.

---

## 2. Screen-by-Screen Design

Screens specified below are the Phase 3 build targets called out in the brief. Auth sub-screens (Sign in / Sign up) follow the same visual system; detailed auth copy can expand alongside Milestone 2.

---

### 2.1 Splash

**Purpose**  
Brand recognition and a calm handoff while the app resolves session / bootstrap. Brand-only—no feature marketing.

**Layout**

```
┌─────────────────────────────┐
│                             │
│                             │
│         [App Mark]          │
│     Subscription Tracker    │  ← brand-forward; mark + wordmark dominate
│                             │
│                             │
│            · · ·            │  ← optional subtle progress (not a spinner wall)
│                             │
└─────────────────────────────┘
```

- Full-bleed soft wash: `color.bg.app` or very soft teal gradient (`#F3F6F8` → `#E6F4F2`)
- Centered logo mark + wordmark
- No headline, no CTA, no promo chips

**Hierarchy**

1. Brand mark  
2. Wordmark  
3. Optional indeterminate progress (minimal)

**Important components**

- `BrandMark`
- `Wordmark` (Plus Jakarta Sans Semibold or lockup SVG)
- Optional `ProgressDots` / hairline indeterminate bar

**Primary CTA** — None  
**Secondary CTA** — None  

**Empty state** — N/A  
**Loading state** — This screen *is* the loading state (max ~1.5s perceived; prefer cached home if session known)  
**Error state** — If bootstrap fails: fade to full-page error with Retry + Support link (do not loop splash forever)

**UX notes**

- First viewport = brand test: remove chrome and it still reads as Subscription Tracker.
- Auto-advance to Onboarding (first launch) or Home (returning).

---

### 2.2 Onboarding

**Purpose**  
Establish value, set currency + reminder defaults, and drive the first subscription add. Brand-forward welcome; one job per step.

**Recommended steps (MVP)**

| Step | Job | Content |
|---|---|---|
| 0 Welcome | Brand + promise | Brand hero, one sentence, primary CTA |
| 1 Account | Sign up / Sign in | Email auth; later social |
| 2 Preferences | Currency + default reminder time | Two controls max |
| 3 First add prompt | Guided empty → create | Templates + custom |
| 4 Notifications | Soft permission education | Explain value; allow skip |

**Layout — Welcome (Step 0)**

```
┌─────────────────────────────┐
│         [Brand]             │  ← hero-level brand signal
│                             │
│   See every charge          │  ← one headline (does not overpower brand)
│   before it hits.           │
│                             │
│   Track renewals in under   │  ← one supporting sentence
│   30 seconds a day.         │
│                             │
│   [ Illustration full-bleed │
│     or soft atmospheric BG ]│
│                             │
│   [ Get started ]           │  ← primary
│   Already have an account?  │  ← secondary text button
└─────────────────────────────┘
```

**Hierarchy**

1. Brand  
2. One headline  
3. One supporting sentence  
4. Dominant illustration / atmosphere  
5. CTA group  

**Important components**

- `BrandMark` / wordmark  
- `ProgressIndicator` (dots)  
- `AppButton` primary / tertiary  
- Onboarding illustration  
- Preference `SelectField` / `ToggleRow` on later steps  

**Primary CTA** — Get started → continue flow  
**Secondary CTA** — Sign in / Skip notifications (where ethical)

**Empty state** — N/A (contentful)  
**Loading state** — Button loading on account create; disable double-submit  
**Error state** — Inline field errors on auth; non-blocking banner for network

**UX notes**

- No stats, schedule widgets, or feature grids on first viewport.
- Success moment is not the last onboarding slide—it’s Home with a real total after first add.

---

### 2.3 Home

**Purpose**  
Answer in under 30 seconds: *How much am I spending? What’s next? What should I do?*

**Layout** — See Section 3 (Dashboard Layout) for exact composition.

**Hierarchy**

1. Greeting / date context (quiet)  
2. Monthly spend total (Amount LG)  
3. Upcoming renewals  
4. Quick actions  
5. Light recent activity (optional / later)  
6. FAB Add  

**Important components**

- `SummaryHeader`  
- `SubscriptionRow` (upcoming)  
- `ReminderCard` / due-soon chip  
- `QuickAction` chips or icon rows (max 3)  
- `FAB`  
- `EmptyState`  
- `LoadingSkeleton`  
- `Banner` (offline)

**Primary CTA** — FAB / “Add subscription”  
**Secondary CTA** — See all upcoming · Open Insights · Enable reminders (soft)

**Empty state**

- Illustration (calm desk / calendar)  
- Title: “Nothing tracked yet”  
- Body: “Add a subscription to see your monthly total and next charge.”  
- Primary: Add subscription  
- Secondary: Browse templates  

**Loading state**

- Skeleton: summary block + 3 upcoming rows  
- Prefer skeleton over full-screen spinner  

**Error state**

- Offline/error `Banner` + cached content if available + Retry  
- If no cache: full `ErrorState` with Retry  

---

### 2.4 Subscription List

**Purpose**  
Browse, search, filter, and manage the full catalog of tracked subscriptions.

**Layout**

```
┌─────────────────────────────┐
│ Subscriptions        [···]  │
│ [ Search....................]│
│ [All] [Active] [Canceled]   │  ← SegmentedControl (2–3 max)
│                             │
│ Netflix            $15.99   │
│ Due in 3 days · Monthly     │
│─────────────────────────────│
│ Spotify             $9.99   │
│ Due in 12 days · Monthly    │
│ …                           │
│                         ⊕   │  ← FAB
└─────────────────────────────┘
```

**Hierarchy**

1. Title + optional overflow (sort)  
2. Search  
3. Status segment / light filters  
4. List rows (name → amount → next date)  
5. FAB  

**Important components**

- `SearchBar`  
- `SegmentedControl`  
- `CategoryChip` (filter sheet—not a pill cluster in hero)  
- `SubscriptionRow`  
- `StatusChip`  
- `FAB`  
- Filter `Sheet`  

**Primary CTA** — FAB Add  
**Secondary CTA** — Sort / Filter · Archive list  

**Empty state**

- Global zero: same helpful empty as Home  
- Filter zero: “No matches” + Clear filters  

**Loading state** — Row skeletons (6–8)  
**Error state** — Full-page `ErrorState` + Retry; offline shows cached list + sync pending markers  

**UX notes**

- Flat list with dividers preferred over card-per-row.
- Swipe actions (optional P1): Archive · Remind · Delete (danger confirmed).

---

### 2.5 Subscription Details

**Purpose**  
Single source of truth for one subscription: identity, money, schedule, reminder, and actions.

**Layout**

```
┌─────────────────────────────┐
│ ←  Netflix           [Edit] │
│                             │
│  [Icon]  Netflix            │
│  Streaming · Active         │
│                             │
│  $15.99 / month             │  ← money first
│  Next charge 12 Aug 2026    │
│                             │
│  Reminder                   │
│  On · 1 day before     [›]  │
│                             │
│  Details                    │
│  Billing cycle · Monthly    │
│  Payment · Visa ••4242      │
│  Manage URL            [›]  │
│  Notes                      │
│                             │
│  [ Mark reviewed ]          │
│  [ Cancel / Archive ]       │  ← destructive secondary
└─────────────────────────────┘
```

**Hierarchy**

1. Identity (name + category + status)  
2. Amount + cadence  
3. Next charge date  
4. Reminder rule  
5. Metadata  
6. Destructive / archive  

**Important components**

- `NavHeader`  
- `StatusChip` / `CategoryChip`  
- `ListRow` / `ToggleRow`  
- `AppButton`  
- `AppModal` (delete confirm)  
- Snooze `Sheet`  

**Primary CTA** — Edit (header) or Mark reviewed / Snooze when arrived from reminder  
**Secondary CTA** — Open manage URL · Archive · Delete  

**Empty state** — Invalid id → Not found `ErrorState` with Back  
**Loading state** — Detail skeleton (header + amount + 4 rows)  
**Error state** — Can’t load; Back + Retry; offline = read-only cache + explanation on edit  

---

### 2.6 Add Subscription

**Purpose**  
Create a subscription in the happy path with ≤4 required fields. Effortless enough for weekly use.

**Entry points:** Home FAB · List FAB · Onboarding · Empty CTAs · Deep link `.../subscriptions/new`

**Layout** — Form sheet (medium) for quick add; full-screen modal for complex / templates expand.

```
┌─────────────────────────────┐
│ Add subscription      Cancel│
│                             │
│ [ Templates: Netflix · … ]  │  ← horizontal shortcuts
│                             │
│ Name *                      │
│ [ ........................ ]│
│                             │
│ Amount *          Currency  │
│ [ 0.00 .............. ] USD │
│                             │
│ Billing cycle *             │
│ [ Monthly              › ]  │
│                             │
│ Next billing date *         │
│ [ 12 Aug 2026          › ]  │
│                             │
│ — Optional —                │
│ Category · Reminder · Notes │
│                             │
│        [ Save ]             │
└─────────────────────────────┘
```

**Hierarchy**

1. Templates (accelerate)  
2. Required fields  
3. Optional expand  
4. Save  

**Required fields (happy path)**

1. Name  
2. Amount  
3. Billing cycle  
4. Next billing date  

**Important components**

- `TextField`  
- `AmountField`  
- `SelectField`  
- `DateField`  
- `ToggleRow` (reminder)  
- `AppButton`  
- Templates picker `Sheet`  
- Dirty-form discard `AppModal`  

**Primary CTA** — Save  
**Secondary CTA** — Cancel / Close · Browse more templates  

**Empty state** — Blank form with smart defaults (monthly; next billing ≈ today + 1 month; currency from prefs)  
**Loading state** — Save button loading; form locked against double submit  
**Error state** — Inline field validation + banner for server/network; keep draft  

**Success** — Toast “Subscription added” + navigate to Detail or Home (prefer Detail on first add)

---

### 2.7 Settings

**Purpose**  
Account, preferences, notifications, Premium entry, legal, and data rights—calm grouped lists.

**Layout**

```
┌─────────────────────────────┐
│ Settings                    │
│                             │
│ ┌ Profile ────────────────┐ │
│ │  AV  Alex · alex@…   ›  │ │
│ └─────────────────────────┘ │
│                             │
│ Preferences                 │
│ Currency                ›   │
│ Default reminder        ›   │
│ Appearance · System     ›   │
│                             │
│ Notifications           ›   │
│                             │
│ Premium                     │
│ Upgrade / Manage        ›   │
│                             │
│ Support & Legal             │
│ Help · Privacy · Terms  ›   │
│                             │
│ Data                        │
│ Export · Delete account ›   │
│                             │
│ Sign out                    │
└─────────────────────────────┘
```

**Hierarchy**

1. Profile identity  
2. Preferences that affect money display / reminders  
3. Notifications  
4. Premium  
5. Support / legal  
6. Data rights / sign out  

**Important components**

- `Avatar`  
- `ListRow`  
- `ToggleRow`  
- Destructive text button for delete / sign out  
- `Banner` for sync issues  

**Primary CTA** — Context-dependent (Save on subpages)  
**Secondary CTA** — Restore purchases (via Premium) · Sign out  

**Empty state** — N/A  
**Loading state** — Subtle placeholders for profile header  
**Error state** — Partial render + section Retry; offline: local prefs editable, account sync later  

---

### 2.8 Premium

**Purpose**  
Capability-focused upgrade. Communicate value without dark patterns, fake timers, or blocking core tracking.

**Layout**

```
┌─────────────────────────────┐
│ ✕                           │
│                             │
│      [ Soft illustration ]  │
│                             │
│   Go further with Premium   │  ← brand-adjacent title
│   Deeper insights, smarter  │
│   reminders, multi-device.  │
│                             │
│  ✓ Unlimited subscriptions  │
│  ✓ Advanced reminder rules  │
│  ✓ Rich insights            │
│  ✓ Priority sync            │
│                             │
│  ○ Monthly    $X / mo       │
│  ● Yearly     $Y / yr  Best │
│                             │
│      [ Start Premium ]      │
│  Restore purchases          │
│  Not now                    │
└─────────────────────────────┘
```

**Hierarchy**

1. Benefit headline (capability language)  
2. Feature rows (included outcomes)  
3. Plan select  
4. Purchase CTA  
5. Restore · Dismiss  

**Important components**

- `PaywallFeatureRow`  
- Plan `SegmentedControl` or selectable rows  
- `AppButton`  
- Store loading / error states  
- Success confirmation  

**Primary CTA** — Start Premium / Continue  
**Secondary CTA** — Restore purchases · Not now  

**Empty state** — N/A  
**Loading state** — Fetching products skeleton; CTA disabled until prices load  
**Error state** — Store unavailable + Retry + Restore; offline explains connection needed  

**Ethics (non-negotiable)**

- No fake urgency countdown  
- No blocking basic add/view behind paywall  
- Clear platform subscription management link after purchase  

---

## 3. Dashboard Layout (Home)

Exact composition of what users see on Home.

### 3.1 Top section — Monthly Spend

**What users see**

- Quiet greeting or today’s date (tertiary)  
- Label: “This month” / “Monthly spend”  
- **Amount LG** total of active recurring costs normalized to monthly  
- Optional secondary line: yearly equivalent in tertiary text  
- Soft brand wash behind summary (not a heavy card stack)

**UX**

- This is the first answer: *What do I pay?*  
- Tapping the summary can open Insights (light) or expand breakdown later  
- Amounts use tabular nums; currency from user prefs  

### 3.2 Middle section — Upcoming Renewals

**What users see**

- Section title: “Upcoming”  
- 3–5 next charges as `SubscriptionRow`  
- Each row: name · amount · relative due (“Tomorrow”, “In 3 days”) · `StatusChip` if due soon  
- Trailing “See all” → Upcoming list  

**UX**

- Second answer: *What hits next?*  
- Due soon uses warning chip + date text (not color alone)  
- Tap row → Subscription Details  

### 3.3 Bottom section — Quick Actions + light activity

**Quick Actions (max 3)**

| Action | Why |
|---|---|
| Add subscription | Core loop |
| Templates | Faster add |
| Reminders / Notifications | Trust & retention |

Presented as a simple horizontal action row or compact tonal icon buttons—not a marketing strip.

**Recent Activity (P1 / later)**

- Last edits, reminders acknowledged, archives  
- Quiet timeline; omit from MVP if it clutters  

**Charts on Home?**

- **MVP Home:** no chart required—totals + upcoming win.  
- Light category spark or mini bar may live on Insights tab; Premium deepens.  
- Avoid chart-first home (clutter + slow TTFV).

### 3.4 Cards

- Default: **no cards** wrapping the whole dashboard.  
- Summary may sit on a single soft surface if it aids tap target—but avoid nested card grids.  
- Upcoming = list rows with dividers.  

### 3.5 Navigation on Home

- Root **Home** tab selected  
- Stack can push Upcoming list / Notification education  
- **FAB** bottom-end: Add subscription  
- Pull to refresh revalidates totals + upcoming  

### 3.6 User experience narrative

1. Open app → recognize brand briefly → land on Home  
2. Eyes hit monthly total (confidence)  
3. Scan upcoming (control)  
4. Act via FAB or row tap (clarity → action)  
5. Leave without friction  

**Success criteria:** A returning user understands spend and next charge without scrolling past the first viewport on a standard phone.

---

## 4. Navigation

### 4.1 Bottom Tabs (MVP)

| Tab | Icon (outline / filled selected) | Purpose |
|---|---|---|
| **Home** | House | Totals, upcoming, quick actions |
| **Subscriptions** | Layers / list | Full list, search, filters |
| **Insights** | Chart | Spend overview (light MVP) |
| **Settings** | Gear | Profile, prefs, Premium, legal |

**Rules**

- 3–4 tabs max; if scope pressure, merge Insights into Home and keep 3  
- Selected = filled icon + label + brand color  
- Preserve per-tab stack state on switch  
- Hide FAB on Settings / Insights if it conflicts; show on Home + Subscriptions  

### 4.2 Stack Navigation

- Each tab owns an independent stack  
- Push: Detail, Edit, Upcoming, sub-settings  
- Large titles optional on root list screens; inline on detail  
- Avoid nested tab navigators  

### 4.3 Modal Screens

| Pattern | Use | Dismiss |
|---|---|---|
| Form sheet (medium) | Quick add, filters, snooze, templates | Swipe down if clean |
| Full-screen modal | Complex create/edit, onboarding | Explicit close; warn if dirty |
| Confirm dialog | Delete, discard changes | Explicit actions only |
| Paywall modal | Upgrade moments | ✕ / Not now |

### 4.4 Floating Action Button

- Single action: **Add subscription**  
- Position: bottom-end above tab bar safe area  
- Elevation level 2  
- Optional hide-on-scroll on long lists  
- Accessibility label: “Add subscription”  

### 4.5 Back navigation

- Platform back (Android) / header back (iOS) pops stack  
- Modals: swipe / close; dirty forms → discard confirm  
- Deep link into Detail: back returns to sensible tab root (Subscriptions), not a dead stack  
- Reminder deep link: Detail with reminder action context; back to Home or Subscriptions  

### 4.6 Deep links (from Phase 2)

| Link | Destination |
|---|---|
| `subscriptiontracker://home` | Home |
| `.../subscriptions` | List |
| `.../subscriptions/:id` | Detail |
| `.../subscriptions/new` | Create modal |
| `.../premium` | Paywall |
| `.../settings/notifications` | Notification settings |

---

## 5. Reusable Components

Build these once; compose screens from them. Names align with Phase 2 component inventory.

### 5.1 Buttons

| Component | Variants | Notes |
|---|---|---|
| `AppButton` | primary, secondary, tertiary, destructive, ghost · sm/md/lg · loading | One primary per view; `radius.md` |
| `IconButton` | default, tonal, danger | Min 44×44 hit area |

### 5.2 Cards

| Component | When to use |
|---|---|
| `Card` | Only when interaction needs containment (elevated/flat) |
| Default | Prefer bare lists + section headers |

### 5.3 Inputs

| Component | Role |
|---|---|
| `TextField` | Text; default / error / disabled / secure |
| `AmountField` | Money + currency affix; tabular nums |
| `DateField` | Billing dates via picker sheet |
| `SelectField` | Cycle, category, etc. via sheet list |
| `ToggleRow` | Boolean settings; whole row tappable |
| `SearchBar` | Debounced search; clear; sticky under header |

### 5.4 Subscription & reminder

| Component | Role |
|---|---|
| `SubscriptionRow` | Name + amount + next date; active / dueSoon / canceled |
| `ReminderCard` | Compact reminder summary / due nudge |
| `StatusChip` | active, trial, canceled, dueSoon, overdue |
| `CategoryChip` | Filter selected/unselected |
| `SummaryHeader` | Monthly total block |

### 5.5 Charts

| Component | Role |
|---|---|
| `ChartBar` | Category or period spend (Insights) |
| `ChartDonut` | Category share (keep simple; Premium deepens) |

Home MVP may omit charts; Insights owns them.

### 5.6 Search

- `SearchBar` as above  
- Empty search → helpful zero + clear filters  

### 5.7 Badges

- `StatusChip` / caption badges for counts (e.g., due soon count)  
- Muted fills; readable text; never color-only  

### 5.8 Dialogs & sheets

| Component | Role |
|---|---|
| `AppModal` | Confirm / alert; destructive explicit |
| `Sheet` | Snap points; create, filters, snooze, templates |

### 5.9 Feedback & states

| Component | Role |
|---|---|
| `Toast` | Transient success/error/info |
| `Banner` | Persistent offline/warning |
| `LoadingSkeleton` | Header / row / detail placeholders |
| `EmptyState` | Illustration + title + body + CTA |
| `ErrorState` | Full page or inline + Retry |

### 5.10 Navigation chrome

| Component | Role |
|---|---|
| `TabBar` | 3–4 items |
| `NavHeader` | Large / inline |
| `FAB` | Single create action |
| `ProgressIndicator` | Onboarding dots/bar |
| `Avatar` | Settings profile |
| `SegmentedControl` | 2–3 mode options |
| `PaywallFeatureRow` | Premium capability row |
| `ListRow` | Settings / meta rows |

---

## 6. Micro Interactions

Keep animations **subtle and premium**. All durations respect Reduce Motion (fallback: opacity or instant).

### 6.1 Button press

- Scale to **0.98** or opacity **0.88** · **100–150ms**  
- Primary uses `color.brand.primaryPressed`  
- Disabled: no press motion; reduced opacity  
- Loading: replace label with spinner; keep width stable  

### 6.2 Screen transition

- Stack push: fade + **8–12px** horizontal/upward settle · **200–280ms** decelerate  
- Modal present: sheet slide up · **280–350ms**  
- Tab switch: crossfade content · **150–200ms** (no wild slides)  

### 6.3 Card / row press

- Background flash to `color.bg.subtle` · **100ms**  
- Optional 1px inset feel—no bounce  
- Haptic light impact on iOS when opening detail (optional, subtle)  

### 6.4 Success animation

- After Save: compact check in toast or brief checkmark near CTA · **≤300ms**  
- Do not block navigation on animation completion  
- Optional soft confetti **forbidden**—too gamified for money calm  

### 6.5 Delete animation

- Confirm modal first (always for destructive)  
- On confirm: row collapse height → 0 + fade · **200–250ms**  
- Toast with Undo **5–7s** when soft-delete/archive allows  
- Danger color only in confirm—not during row idle  

### 6.6 Pull to refresh

- Native refresh control tinted `color.brand.primary`  
- On complete: totals crossfade to new values · **200ms**  
- If unchanged: subtle settle only  

### 6.7 Loading

- Prefer **skeletons** matching final layout  
- Shimmer soft, low contrast, **~1.2s** loop  
- Spinners only in buttons or tiny local regions—not full-screen walls  

### 6.8 Empty state

- Illustration fades/slides up **12px** · **250ms** on first paint  
- CTA appears with slight delay **50–80ms** after title (hierarchy)  
- No looping Lottie distraction  

### 6.9 Notification animation

- In-app banner: slide from top under status bar · **250ms** · auto-dismiss  
- Badge count on tabs: soft scale pop **120ms** when increments  
- Reminder deep-link: highlight target row once with brand soft fill fade-out **800ms**  

### 6.10 Amount change

- When monthly total updates: crossfade or restrained tally · **≤250ms**  
- Never slot-machine spin digits  

---

## 7. Design Inspiration

Do **not** copy layouts or visuals. Learn the underlying craft.

### Apple Wallet

| Learn | Apply to |
|---|---|
| Passes feel tangible but uncluttered | Subscription identity on Detail—clear header, quiet meta |
| Status and dates scannable at a glance | Due dates and amounts first on rows |
| Restraint over decoration | Home without widget soup |

### Notion

| Learn | Apply to |
|---|---|
| Calm density; content over chrome | Settings grouped lists; readable meta |
| Empty states that invite creation | Warm empties with one clear CTA |
| Typography hierarchy as structure | Section titles + lists instead of card grids |

### Spotify

| Learn | Apply to |
|---|---|
| Strong hierarchy: hero → actions → lists | Home total → upcoming → actions |
| Consistent row patterns | `SubscriptionRow` rhythm everywhere |
| Focus on “what’s next” | Upcoming renewals as a primary middle section |

### Airbnb

| Learn | Apply to |
|---|---|
| Warmth in empty and onboarding | Illustrations, human copy, no shame |
| One primary CTA per view | Get started / Save / Add |
| Photography/illustration as emotion, UI as clarity | Soft vectors; UI stays precise |

### Linear

| Learn | Apply to |
|---|---|
| Precision, speed, keyboard-grade clarity | Forms with few required fields; fast add |
| Subtle motion; no noise | Signature 3 motion patterns only |
| Status without chaos | Muted chips + labels |

### Google Calendar

| Learn | Apply to |
|---|---|
| Time as the organizing principle | Next charge dates as first-class UI |
| Agenda scanning | Upcoming list mental model |
| Reminders that lead to action | Notification → Detail → Snooze / Reviewed |

---

## 8. Final Developer Checklist

Use this on every UI PR. Consistency > novelty.

### Visual system

- [ ] Colors come only from design tokens (no raw hex in components)
- [ ] Typography uses approved styles; money uses tabular nums
- [ ] Spacing follows 4pt scale; screen padding = 20
- [ ] Radii match tokens; primary buttons use `radius.md` (not pills by default)
- [ ] Shadows only for FAB / sticky / sheets—not every card
- [ ] Icons are stroke-consistent; filled only for selected/active
- [ ] Illustrations from one family; decorative art hidden from a11y tree

### Layout & hierarchy

- [ ] One job per screen; one primary CTA
- [ ] First viewport answers the screen’s core question without clutter
- [ ] Brand-forward on splash/onboarding; brand not overpowered by headlines
- [ ] No nested card grids where a list + divider works
- [ ] Safe areas respected; FAB clears tab bar

### States

- [ ] Empty state has illustration + title + body + CTA
- [ ] Loading uses skeletons matching layout
- [ ] Error offers Retry (+ Support when appropriate)
- [ ] Offline: banner + cached content when available
- [ ] Forms keep drafts on failure; no double-submit

### Navigation

- [ ] Tab stacks preserve state
- [ ] Modals use correct pattern (sheet vs full-screen vs dialog)
- [ ] Dirty forms warn on dismiss
- [ ] Deep links land on the correct screen with back stack sanity
- [ ] Reminder links open Detail with action context

### Components

- [ ] Reuse inventory components before inventing new ones
- [ ] Touch targets ≥ 44×44 / 48×48
- [ ] Status never color-only
- [ ] Destructive actions require explicit confirm
- [ ] Toasts for transient feedback; banners for persistent issues

### Motion

- [ ] Only approved signature animations
- [ ] Durations within 150–400ms ranges
- [ ] Reduce Motion honored
- [ ] Animations never block task completion
- [ ] No gamified confetti / bouncing money

### Accessibility & trust

- [ ] Contrast ≥ 4.5:1 body / 3:1 large text
- [ ] Dynamic Type / font scale: critical amounts never clip
- [ ] Icon buttons have accessibility labels
- [ ] Amounts announced with currency + cycle
- [ ] Copy is calm, precise, non-shaming
- [ ] Premium has no dark patterns; core tracking remains free

### Premium & ethics

- [ ] Paywall uses capability language
- [ ] Restore purchases visible
- [ ] No fake urgency timers
- [ ] Basic add/list/detail not hard-blocked

### QA smoke (UI)

- [ ] Splash → Onboarding or Home
- [ ] Add subscription happy path ≤4 required fields
- [ ] Home shows total + upcoming after first add
- [ ] List search/filter empty and success
- [ ] Detail edit / archive / delete confirm
- [ ] Settings prefs persist
- [ ] Premium load / purchase error / restore paths render correctly

---

## Appendix A — Screen ↔ Component map

| Screen | Key components |
|---|---|
| Splash | BrandMark, Progress |
| Onboarding | BrandMark, ProgressIndicator, AppButton, SelectField, Empty/Illustration |
| Home | SummaryHeader, SubscriptionRow, FAB, EmptyState, LoadingSkeleton, Banner |
| Subscription List | SearchBar, SegmentedControl, SubscriptionRow, FAB, Sheet |
| Subscription Details | NavHeader, StatusChip, ListRow, ToggleRow, AppButton, AppModal, Sheet |
| Add Subscription | TextField, AmountField, DateField, SelectField, ToggleRow, AppButton, Sheet |
| Settings | Avatar, ListRow, ToggleRow, Banner |
| Premium | PaywallFeatureRow, SegmentedControl/plan rows, AppButton |

---

## Appendix B — Copy tone examples

| Context | Do | Don’t |
|---|---|---|
| Empty Home | “Add a subscription to see your monthly total.” | “You haven’t added anything. Are you even trying?” |
| Due soon | “Netflix renews tomorrow · $15.99” | “WARNING: PAYMENT IMMINENT!!!” |
| Delete | “Archive Netflix? You can restore it later.” | “DELETE FOREVER???” |
| Premium | “Unlock richer insights and advanced reminders.” | “Limited offer — only 3 left!!!” |

---

## Appendix C — Phase exit criteria

Phase 3 is complete when:

1. This blueprint is accepted as the official UI design reference  
2. Token values above are ready to implement in `constants` / theme (Phase build Milestone 1)  
3. Engineers can implement Splash → Premium without inventing visual rules  
4. QA can test states and motion against Sections 2, 6, and 8  

**Next:** Milestone 1 — Design system tokens + app shell + core components (implementation), following this document.

---

**Phase 3 UI/UX Blueprint complete.** This is the official UI design reference for Subscription Tracker.
