# Phase 7A — Home Dashboard Product Blueprint

**Status:** Planning only (no implementation)  
**Scope:** Home tab root screen only  
**Audience:** Product, design, engineering  
**Depends on:** Phase 2 vision · Phase 3 UI blueprint · Phase 4–6 foundation  

**North star for this screen:**  
*In under 5 seconds, a user should know what they pay, what’s next, and what to do—without stress, clutter, or judgment.*

---

## 1. Screen Purpose

### Why this screen exists

Home is the **daily financial pulse**—not a settings hub, not a full catalog, not an analytics lab.

It exists to restore **financial calm** by making recurring spend *visible, predictable, and actionable* the moment the app opens.

### Problem it solves

| Problem | Home’s answer |
|---|---|
| Invisible recurring spend | One clear monthly total |
| Surprise renewals | Upcoming charges, ordered by time |
| Decision friction | One obvious next action (add / open / see all) |
| Money-app overwhelm | Quiet layout; one job per section |
| Shame / anxiety | Neutral, precise copy; no scolding |

### What users should accomplish here

1. **Understand subscription health** — spend + near-term charges  
2. **Act with confidence** — open a due item, add something missing, enable reminders softly  
3. **Leave quickly** — success is a calm exit, not a long session  

**Home is not for:** managing the full list, deep charts, editing forms, Premium hard-sell, or account settings.

---

## 2. User Goals

Ranked by priority:

| Priority | Goal | Why |
|---|---|---|
| **P0** | See **monthly spend** at a glance | Primary anxiety reducer; answers “Am I spending too much?” without analysis |
| **P0** | See **what charges next** | Prevents surprise bank hits; creates control |
| **P0** | **Add** a missing subscription quickly | Core loop; activation & completeness of the total |
| **P1** | Open a specific upcoming item | Turns awareness into action (review, remind, cancel path later) |
| **P1** | See all upcoming beyond the preview | Home stays short; depth lives one tap away |
| **P2** | Soft path to reminders / notifications | Retention & trust—only after value is felt |
| **P2** | Peek yearly equivalent | Context without forcing Insights |
| **P3** | Light bridge to Insights | Curiosity, not obligation |

**Non-goals on Home:** search, multi-filter, bulk edit, category management, trend analysis, family sharing.

---

## 3. Business Goals

### How Home helps the product

Home is the **habit surface**. If Home is calm and useful, users return. If Home is busy or empty of meaning, the app becomes a forgotten list tool.

### Retention

| Mechanism | Effect |
|---|---|
| Instant monthly total | Habit cue: “check my spend” |
| Upcoming preview | Reason to open before charge dates |
| Fast add | Completeness → trust in numbers → return visits |
| Honest empty/error/offline | Credibility → lower uninstall after first glitch |

**Target experience:** useful in **≤30 seconds**, scannable in **≤5 seconds**.

### Trust

- Accurate money formatting (currency, tabular amounts)  
- Clear “as of” / cached behavior when offline  
- No fake urgency, no shame copy, no dark patterns  
- Totals that match list math users can mentally verify  

### Premium without aggressive upselling

Home **never** blocks core tracking.

Natural Premium moments (later, soft):

- After several subscriptions: quiet “Deeper insights” link near total → Insights/Premium  
- When free limits are approached: capability language in Settings/Paywall—not a banner takeover on Home  
- Advanced reminder rules: mentioned in reminder education, not as Home chrome  

**Forbidden on Home MVP:** countdown timers, “limited offer” strips, feature grids, locked charts in the first viewport.

---

## 4. Emotional Design

### Users should feel

| Emotion | How the UI creates it |
|---|---|
| **Calm** | Soft canvas, generous whitespace, few elements |
| **Trust** | Precise amounts/dates; stable layout; honest states |
| **Clarity** | One question answered per section |
| **Confidence** | Numbers first; no ambiguous “soon” without a date |
| **Control** | Clear CTAs; upcoming list feels actionable |

### Emotions that must never be created

| Never | Why / how we avoid it |
|---|---|
| Panic | No red-first UI; danger reserved for true overdue/destructive |
| Shame | No “you’re wasting money” copy |
| Overwhelm | Max 3–5 upcoming rows; no chart wall; no pill clusters |
| Guilt | Empty state invites—never scolds |
| Distrust | No skeleton forever; no silent data overwrite; no fake totals |
| Cheap urgency | No gamification, confetti money, or upsell chrome |

**Tone of voice on Home:** like a precise, quiet friend—not a finance lecture.

---

## 5. Information Hierarchy

### Perfect reading order (top → bottom)

1. **Quiet context** — date or short greeting (tertiary)  
2. **Monthly spend** — label + **Amount LG** (+ optional yearly line)  
3. **Upcoming** — section title + “See all” + 3–5 rows  
4. **Quick actions** — max 3, below the fold if needed on small phones  
5. **FAB** — persistent primary create (floats above tab bar)  

**Optional later (not MVP first viewport):** Recent activity.

### Why this order

| Position | Content | Justification |
|---|---|---|
| First | Spend total | Highest-anxiety question; money-first honesty |
| Second | Upcoming | Second question: “What hits next?” Time as organizer (Calendar craft) |
| Third | Quick actions | After understanding, offer control—don’t lead with chrome |
| Persistent | FAB | Create must always be reachable without scrolling past marketing |

### What is deliberately *not* in the hierarchy

- Charts on Home (Insights owns them)  
- Full subscription list (Subscriptions tab)  
- Settings shortcuts cluster  
- Promo / Premium hero  
- Multiple competing totals (daily, weekly, “saved”) in MVP  

---

## 6. Dashboard Layout

### Full vertical composition (populated state)

```
┌─────────────────────────────────────┐
│  Home                    (tab bar)  │
│                                     │
│  Tuesday, 4 Aug                     │  ← tertiary context
│                                     │
│  Monthly spend                      │  ← label (subhead/secondary)
│  $184.47                            │  ← Amount LG, primary
│  ≈ $2,213.64 / year                 │  ← tertiary, optional
│                                     │
│         [ soft brand wash ]         │  ← not a heavy card stack
│                                     │
│  Upcoming              See all ›    │  ← section header
│  ─────────────────────────────────  │
│  Netflix           $15.99           │
│  Tomorrow · Monthly    Due soon     │  ← chip + text (not color alone)
│  ─────────────────────────────────  │
│  iCloud+            $2.99           │
│  In 3 days · Monthly                │
│  ─────────────────────────────────  │
│  Adobe             $59.99           │
│  In 12 days · Monthly               │
│                                     │
│  Quick actions                      │
│  [ Add ]  [ Templates ]  [ Remind ] │  ← max 3; tonal, not promo strip
│                                     │
│                              (⊕)    │  ← FAB: Add subscription
└─────────────────────────────────────┘
```

### Top section — Monthly Spend

| Element | Spec | Purpose |
|---|---|---|
| Context line | Date or “Good afternoon” — tertiary | Human arrival without noise |
| Label | “Monthly spend” | Anchors the number |
| Amount | Amount LG, tabular nums, user currency | Primary answer |
| Yearly line | “≈ $X / year” tertiary | Soft context; optional if space/clarity suffers |
| Surface | Soft brand wash or single flat surface | Tap target for Insights later; **no nested cards** |
| Tap | Opens Insights (light) when available | Curiosity bridge |

**Spacing:** screen padding 20; below context `space.4–6`; below amount `space.2` then yearly; section break `space.8` before Upcoming.

**Do not:** wrap in multiple cards, show sparkline, show category pills in this block.

### Middle section — Upcoming Renewals

| Element | Spec | Purpose |
|---|---|---|
| Title | “Upcoming” | Time-based second job |
| Trailing | “See all” text button | Escape hatch; keeps Home short |
| Rows | 3 default, max 5 | Enough signal, not a list dump |
| Row content | Name → amount → relative due + cycle | Scan hierarchy |
| Due soon | `AppBadge`/chip **and** date text | A11y + calm urgency |
| Empty upcoming | If total exists but nothing in window: quiet “Nothing due in the next 30 days” | Honesty |

**Row tap →** Subscription Details (future).  
**See all →** Upcoming list in Home stack (future).  
**Dividers** between rows; flat list—not card-per-row.

**Spacing:** section title to first row `space.3–4`; row min height 56–64.

### Bottom section — Quick Actions

| Action | Label | Purpose | Priority |
|---|---|---|---|
| Add | Add | Core loop | P0 |
| Templates | Templates | Faster add | P1 |
| Reminders | Reminders | Soft notification education | P1 |

Presentation: horizontal tonal icon+label row—**not** a marketing strip, **not** pill cluster in the hero.

If space is tight on small devices: Quick Actions may sit just below first fold; FAB remains primary create.

### FAB

| Spec | Value |
|---|---|
| Action | Add subscription |
| Position | Bottom-end, above tab bar safe area |
| A11y label | “Add subscription” |
| Visibility | Home populated + empty; hide optional on scroll later |

### Titles & CTAs summary

| CTA | Type | Destination (future) |
|---|---|---|
| FAB / Add | Primary | Add Subscription modal/sheet |
| See all | Secondary | Upcoming list |
| Row tap | Navigation | Subscription Details |
| Templates | Secondary | Templates picker |
| Reminders | Secondary | Notification education / settings |
| Spend block tap | Tertiary | Insights |

### Cards policy on Home

- Default: **no card grid**  
- Summary: at most **one** soft surface if it improves tap clarity  
- Upcoming: **list + dividers**  
- Quick actions: not cards  

### What never appears on MVP Home

Charts, promo banners, Premium paywall embed, search bar, segmented filters, recent activity wall, multi-stat strips (“active / canceled / trials” counts).

---

## 7. Component Mapping

### Use existing (Phase 5)

| Need | Component |
|---|---|
| Screen shell / safe area | `ScreenContainer` (`edges` exclude bottom for tab bar) |
| Title chrome | `AppHeader` title “Home” (no back on root) |
| All text / amounts | `AppText` (`amountLg`, `title2`, `subhead`, `caption`, etc.) |
| Primary / secondary actions | `AppButton` (empty state CTAs; ghost “See all”) |
| Status chips | `AppBadge` (due soon / warning) |
| Separators | `AppDivider` |
| Empty | `EmptyState` |
| Loading | `LoadingSkeleton` (`title` + `row` variants) |
| Soft grouping (rare) | `AppCard` flat only if summary needs containment |

### New reusable components required (design now, build later)

| Component | Why new | Notes |
|---|---|---|
| **`SummaryHeader`** | Domain-specific spend block; not a generic card | Label + Amount LG + optional yearly; optional press |
| **`SubscriptionRow`** | Core list atom reused on Home, List, Upcoming | Name, amount, due meta, optional badge |
| **`FAB`** | Single create action; elevation level 2 | Home + List later |
| **`QuickActionBar`** | Max-3 tonal actions; consistent hit targets | Not a marketing carousel |
| **`Banner`** | Offline / error persistent notice | Dismissible when safe |
| **`ErrorState`** | Full-page recoverable failure | Retry + optional support |

**Not needed on Home MVP:** charts, search, segment control, paywall rows, form fields.

---

## 8. User Journey

### First-time user (0 subscriptions)

1. Lands on Home after onboarding (or redirects here)  
2. Sees **warm empty state** (not a blank dashboard of zeros)  
3. Primary: Add subscription · Secondary: Browse templates  
4. After first save → Home **populated** with real total + that item in Upcoming  
5. Soft reminder prompt only after first value (not before)

**Success moment:** Home shows a real total—not empty widgets.

### Returning user (typical)

1. Open app → Home (cached total visible immediately if available)  
2. Scan amount → scan Upcoming  
3. Tap due item or leave  
4. Optional pull-to-refresh  

Session goal: **clarity in seconds**, not engagement farming.

### Power user (many subscriptions)

1. Total still primary—never replaced by chart soup  
2. Upcoming shows next 3–5 only  
3. “See all” / Subscriptions tab for depth  
4. FAB remains for rapid add  
5. Quick actions stay ≤3; no density creep  

### User with no subscriptions

Empty state owns the screen (Section 9). Do not show `$0.00` as a fake “healthy” dashboard unless product later decides an explicit zero state after user clears all—prefer empty/invite while count is zero.

### User with many subscriptions

- Cap Upcoming preview  
- Keep whitespace between summary and list  
- Never auto-expand into full list on Home  
- Performance: render preview rows only; don’t fetch full history for Home  

---

## 9. Empty State

### Concept

**Illustration:** quiet desk + soft calendar or calm receipt—teal/sand palette, one family. Metaphor: clarity and readiness, not raining coins or “broke” jokes.

### Copy

| Element | Copy |
|---|---|
| Headline | **Nothing tracked yet** |
| Supporting | Add a subscription to see your monthly total and next charge. |
| Primary CTA | **Add subscription** |
| Secondary CTA | **Browse templates** |

### Why

- Warm, not scolding  
- States the two Home answers they’ll unlock (total + next charge)  
- Primary drives activation; templates reduce creation friction  
- No Premium mention; no fake sample data that trains distrust  

### Layout notes

- Centered in content area above tab bar  
- Illustration decorative (hidden from a11y tree)  
- One primary button; secondary ghost  
- FAB may still appear for consistency **or** be omitted if it duplicates primary—**decision for impl:** prefer **one** primary in empty (EmptyState CTA); FAB optional once ≥1 subscription. Recommended: **hide FAB on empty** to avoid dual primaries.

---

## 10. Loading State

### How it should feel

**Calm skeleton**, layout-faithful—never a full-screen spinner wall.

### Composition

1. Skeleton for summary block (label bar + large amount bar)  
2. Skeleton for section title  
3. **3** row skeletons  

### Animation

- Soft opacity shimmer (~1.2s loop)  
- Respect **Reduce Motion** → static muted placeholders  
- Duration to content: aim **<300ms** when cache hit; network fill without layout jump  

### Timing

| Scenario | Behavior |
|---|---|
| Cache available | Show cached Home instantly; quiet refresh |
| Cold load | Skeletons ≤ perceived 1–1.5s then content or error |
| Pull to refresh | Native refresh tint brand primary; totals crossfade ≤200ms |

### What should never happen

- Blank white flash  
- Blocking modal spinner  
- Layout jump when numbers arrive  
- Skeleton longer than necessary after data is ready  
- Fake “demo” numbers while loading  

---

## 11. Error State

| Scenario | Treatment | Recovery |
|---|---|---|
| **No internet** | Offline `Banner` + cached Home if any | Retry; banner explains offline |
| **Network failure on refresh** | Keep showing last good data + banner | Retry; don’t wipe UI |
| **Server error** | Banner if cache; else full `ErrorState` | Retry; optional Help |
| **Unknown error** | Same as server; generic calm copy | Retry; don’t expose stack traces |

### Copy principles

- Calm, precise: “Couldn’t refresh right now.”  
- Never blame the user  
- Always offer **Retry**  
- If cache shown: “Showing last updated data” (timestamp when available)

### What not to do

- Full wipe of trusted numbers on transient failure  
- Infinite splash/retry loops  
- Alarm-red full screen for offline  

---

## 12. Offline Experience

### Should still work

- View **cached** monthly total  
- View **cached** upcoming preview  
- Navigate to cached detail if already in local cache (when that feature exists)  
- Read-only browsing of last known Home  

### Should not work (or must explain)

- Guaranteed fresh totals  
- Create/edit that requires server **unless** offline queue strategy is chosen later (Phase 2 left this open—**Home MVP recommendation:** block write with clear message, or queue with “Pending sync” marker—pick one globally later; Home must stay consistent)  
- Reminder scheduling that needs network push registration  

### Cached presentation

- Banner: offline  
- Optional footnote under total: “Updated earlier” / relative time  
- No pretend “live” indicators  

---

## 13. Accessibility

| Area | Requirement |
|---|---|
| **Touch targets** | ≥44×44 (iOS) / ≥48×48 (Android); rows ≥56 height; FAB comfortable |
| **Screen readers** | Announce amount + currency + “per month” together; rows as name, amount, due date; FAB labeled “Add subscription”; decorative illustration hidden |
| **Dynamic Type** | Reflow; **never clip currency**; Display type capped; test 100–200% |
| **Contrast** | Body ≥4.5:1; large text ≥3:1; status never color-only |
| **Reduce Motion** | No shimmer loop; opacity/instant only |
| **One-handed** | FAB bottom-end; primary scan content in upper half; avoid critical actions only in top-leading corner |

---

## 14. Performance Goals

| Goal | Spec |
|---|---|
| **Render immediately** | Shell, header, cached summary/upcoming |
| **Never block UI** | Network fetch; image/illustration decode; noncritical analytics |
| **Home query** | Lightweight summary + next N renewals—not full history |
| **Animations** | Enter fade+settle 200–280ms; amount crossfade ≤250ms; never delay navigation |
| **List** | Only preview rows mounted on Home |
| **Target** | Interaction ready <1s on mid-tier devices with cache |

---

## 15. Future Backend Integration

Planning only—no implementation.

| Home section | Data | Likely API (from Phase 2) | Loading behavior |
|---|---|---|---|
| Monthly spend | Sum of active subs normalized to monthly; user currency | `GET /insights/summary` and/or derived from `GET /subscriptions` | Cache-first; revalidate on focus/pull |
| Yearly equivalent | Derived client- or server-side | Same summary payload | Same as total |
| Upcoming rows | Next 3–5 by `nextBillingDate` | `GET /subscriptions?sort=nextBilling&limit=5` or `GET /reminders` / upcoming endpoint | Cache-first; skeleton only on cold |
| See all upcoming | Paginated upcoming | Same list API with wider window | Push new screen; own loading |
| Quick action: Templates | Catalog | `GET /templates` | Prefetch optional; don’t block Home |
| Offline banner | Connectivity + sync state | Client | Local |
| Reminder CTA | Permission + prefs | `GET /users/me` + device register later | Soft, nonblocking |

**Eventual loading pattern:** stale-while-revalidate; show last good Home; reconcile quietly; conflict rules for edits belong to CRUD phases—not Home display.

---

## 16. Future Scalability (3 years)

### How Home grows without clutter

| Principle | Practice |
|---|---|
| **One job per section** | New jobs → new screens/tabs |
| **Preview, don’t dump** | Caps on Upcoming; deep links out |
| **Progressive disclosure** | Power features behind tap (Insights, Premium) |
| **Replace, don’t stack** | New modules must displace or move old ones |

### Safe additions (later)

- Soft “due today” emphasis within Upcoming  
- Single-line insight teaser under total (“Top category: Streaming”)—one line max  
- Recent activity **collapsed** or on a child screen  
- Household switcher for family plans—header, not a widget grid  

### Never add to Home

- Full analytics suite / multiple charts  
- News feed, tips carousel, achievement badges  
- Ad-like Premium takeover  
- Bank sync status walls  
- Search + filter chrome  
- More than 3 quick actions  
- Per-row swipe complexity competing with Details  

### Move elsewhere

| Content | Destination |
|---|---|
| Full list / search / filters | Subscriptions tab |
| Trends, category charts | Insights (+ Premium depth) |
| Account, currency, legal | Settings |
| Paywall | Modal / Premium route |
| Notification inbox | Optional child of Home/Settings—not root widgets |

---

## 17. UX Review (self-critique)

### Strengths

- Clear 5-second story: spend → next → act  
- Aligns with Phase 2 calm philosophy and Phase 3 hierarchy  
- Empty/loading/error/offline treated as first-class  
- Ethical Premium path  

### Weaknesses & risks

| Risk | Mitigation |
|---|---|
| Summary + Upcoming may feel sparse to users expecting “dashboards” | Educate via empty→first value; resist adding widgets |
| Dual create (FAB + Quick Action Add) | Hide FAB on empty; on populated keep FAB, demote Quick Add or keep Templates+Remind only |
| Yearly line may clutter small phones / large Dynamic Type | Hide yearly under space pressure; never clip monthly amount |
| “See all” vs Subscriptions tab confusion | Upcoming = time-ordered window; Subscriptions = full catalog—keep copy distinct |
| Soft brand wash could become a decorative card | Keep flat; border optional; no elevation on summary |
| Offline write policy still ambiguous org-wide | Lock strategy before Home write entry points ship |

### Suggested improvements before build

1. **Lock empty-state FAB policy** (recommended: hide on empty).  
2. **Lock Upcoming window** (e.g. next 30 days, max 5 rows).  
3. **Lock yearly line** as progressive (show only if fits).  
4. **Define “due soon” threshold** (e.g. ≤3 days) for badge.  
5. Add **content spec** for relative dates (“Today”, “Tomorrow”, “In X days”, then absolute).

---

## 18. Final Executive Summary

**Home is the calm front door of Subscription Tracker.**

It does one thing exceptionally well: help someone understand subscription health in seconds—**what I pay**, **what’s next**, **what I can do**—then get out of the way.

The layout is intentionally sparse: a precise monthly total, a short upcoming list, a few quiet actions, and a clear path to add. Charts, catalogs, and upsells live elsewhere. Empty, loading, error, and offline states are designed to feel honest and human, because trust is the product.

This is how we create a premium experience without flash: **restraint, accuracy, and emotional respect for money anxiety.** When Home feels like Apple-level quiet confidence, retention follows—and Premium becomes an invitation to go deeper, not a tax on basic clarity.

**Recommendation:** Approve this blueprint, then implement Home as a thin UI over cache-first summary + upcoming preview—no feature creep in the first viewport.

---

**Phase 7A complete (planning only).**  
No code generated. No repository files modified. Ready for approval before Home implementation.
