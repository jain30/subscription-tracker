# Phase 7B — Home Screen UI Specification

**Status:** Planning only (official UI implementation specification)  
**Scope:** Home tab root screen visual & interaction spec  
**Depends on:** [`PHASE_7A_HOME_DASHBOARD_BLUEPRINT.md`](./PHASE_7A_HOME_DASHBOARD_BLUEPRINT.md) · Phase 3 UI blueprint · Phase 4 design tokens · Phase 5 components · Phase 6 shell  

**Purpose:** Any engineer can build the Home screen **without making design decisions**.

**Rules for implementers**

- Use Phase 4 theme tokens only — no raw hex, no magic spacing.
- Prefer existing Phase 5 components; build listed new components only when implementing Home UI.
- No charts, Premium banners, forms, or API wiring in this phase’s scope definition (this doc is UI-only).

---

## Locked product decisions (from Phase 7A)

These are **resolved** and must not be re-litigated during UI build:

| Decision | Lock |
|---|---|
| Upcoming preview | **3 default, max 5** rows; window = **next 30 days** |
| Due soon badge | Show when due in **≤ 3 days** (including today); always with date text |
| Yearly line | Progressive — show when it fits; hide under Dynamic Type / small height pressure; **never** clip monthly amount |
| Empty FAB | **Hide FAB** on empty state (EmptyState owns primary CTA) |
| Populated FAB | Show FAB; Quick Actions = **Templates** + **Reminders** only (no duplicate Add) |
| Relative dates | Today · Tomorrow · In X days · then absolute (e.g. 12 Aug) |
| Cards | No card grid; summary = one soft surface max; upcoming = list + dividers |

---

## 1. Screen Grid

### Safe area

| Edge | Behavior | Why |
|---|---|---|
| **Top** | Inset via `ScreenContainer` (`edges` include `top`) | Avoid status bar / Dynamic Island overlap |
| **Left / Right** | Safe area + horizontal padding | Notch / curved edges |
| **Bottom** | **Exclude** from `ScreenContainer` bottom inset | Tab bar owns bottom safe area; prevents double padding |
| **FAB** | Positioned above tab bar + bottom safe area | Thumb reach; never under home indicator |

Use: `ScreenContainer` with `edges={['top', 'left', 'right']}`.

### Horizontal padding

| Token | Value | Use | Why |
|---|---|---|---|
| `layout.screenPaddingX` / `spacing[5]` | **20** | Screen content left/right | Phase 3/4 standard; balances calm breathing room with usable content width on ~375pt phones |

**Do not** use 16 or 24 for Home page gutters unless a nested component’s internal padding requires `spacing[4]`.

### Vertical rhythm

Base unit: **4** (`spacing` scale).

| Zone | Token | Value | Why |
|---|---|---|---|
| Below `AppHeader` → context line | `spacing[2]` | 8 | Header already has vertical padding; keep context close but not cramped |
| Context → SummaryHeader | `spacing[4]` | 16 | Separates human greeting from money without a hard section jump |
| Inside SummaryHeader (label → amount) | `spacing[1]` | 4 | Tight stack: label owns the number |
| Amount → yearly line | `spacing[1]`–`spacing[2]` | 4–8 | Yearly is subordinate; stay optically attached |
| SummaryHeader → Upcoming section | `layout.sectionGap` / `spacing[8]` | **32** | Primary section break; eye resets before “what’s next” |
| Upcoming header → first row | `spacing[3]` | 12 | Section title binds to list |
| Between rows | divider only + row padding | — | Rhythm from row height, not large gaps |
| Upcoming list → Quick actions | `layout.sectionGap` / `spacing[8]` | **32** | Second major section break |
| Quick actions label → action row | `spacing[3]` | 12 | Same as Upcoming header→list |
| Scroll content bottom inset | `spacing[16]` + FAB clearance (~72+) | ≥64+ | Prevent last content hiding under FAB |
| Min section gap (compressed) | `layout.sectionGapMin` / `spacing[6]` | 24 | Only when Dynamic Type / small height requires compression |

### Spacing scale (Home usage)

| Token | Value | Home usage |
|---|---|---|
| `spacing[1]` | 4 | Label/amount micro-gap; badge internal pad |
| `spacing[2]` | 8 | Icon–label in quick actions; header→context |
| `spacing[3]` | 12 | Section title→content; stacked CTA gap |
| `spacing[4]` | 16 | Summary internal padding; context→summary |
| `spacing[5]` | 20 | Screen horizontal padding |
| `spacing[6]` | 24 | Compressed section gap |
| `spacing[8]` | 32 | Default section gap |
| `spacing[10]` | 40 | Empty-state vertical breathing (via EmptyState) |
| `spacing[12]` | 48 | Rare — empty illustration margin if needed |
| `spacing[16]` | 64 | Scroll bottom padding / dramatic empty |

### Content width

| Rule | Spec | Why |
|---|---|---|
| Phone portrait | Full width minus `2 × 20` padding | Single-column calm layout |
| Max readable measure (tablet / wide) | Content column **max 560** centered optional | Prevent over-stretched rows; keep money scannable |
| Summary / rows | Stretch to content column | Consistent alignment of amounts |

### Section spacing

- **Major sections** (Summary ↔ Upcoming ↔ Quick actions): `spacing[8]` (32)  
- **Why:** Whitespace is hierarchy. 32pt creates calm without looking sparse on 667–844pt heights.

### Card spacing

- Home **does not** use a card grid.  
- If SummaryHeader uses a soft surface: **no** gap between “cards” — there is only one surface.  
- Do not introduce `spacing[3]` gutters between fake card tiles.

### Row spacing

| Element | Spec | Why |
|---|---|---|
| Row min height | `layout.listRowMinHeight` **56** | Touch + two-line meta |
| Comfortable height | `layout.listRowHeight` **64** | Preferred when Dynamic Type is 100% |
| Divider | `AppDivider` hairline, spacing `none` between rows | Separation without chunky gaps |
| Horizontal row padding | `0` extra beyond screen pad (full-bleed divider) **or** inset `0` with content aligned to screen pad | Align name/amount to summary text column |

**Why these values exist:** They come from Phase 4 layout tokens chosen for financial calm (predictable 4pt grid, readable money, HIG/Material targets). Inventing new gaps breaks rhythm across the app.

---

## 2. Visual Hierarchy

Complete visual weight order (highest → lowest):

| Rank | Element | Importance | Font / token | Size | Weight | Color token | Alignment |
|---|---|---|---|---|---|---|---|
| 1 | **Monthly amount** | Primary answer | `typography.amountLg` | 32 | Semibold | `colors.text.primary` | Leading (LTR) |
| 2 | **Subscription row amount** | Money scan | `typography.amountMd` | 18 | Semibold | `colors.text.primary` | Trailing |
| 3 | **AppHeader title “Home”** | Wayfinding | `typography.title3` | 18 | Medium | `colors.text.primary` | Leading in header |
| 4 | **Upcoming section title** | Section job | `typography.title2` | 22 | Semibold | `colors.text.primary` | Leading |
| 5 | **Subscription name** | Identity | `typography.title3` | 18 | Medium | `colors.text.primary` | Leading |
| 6 | **Monthly spend label** | Anchors amount | `typography.subhead` | 14 | Medium | `colors.text.secondary` | Leading |
| 7 | **See all** | Secondary nav | `typography.subhead` | 14 | Medium | `colors.brand.primary` | Trailing |
| 8 | **Row secondary meta** | Due + cycle | `typography.footnote` | 13 | Regular | `colors.text.secondary` | Leading |
| 9 | **Due soon badge label** | Status (with text) | `typography.caption` | 12 | Medium | `colors.warning` on soft fill | Inline trailing / below meta |
| 10 | **Yearly total** | Context | `typography.footnote` | 13 | Regular | `colors.text.tertiary` | Leading |
| 11 | **Context date / greeting** | Arrival | `typography.footnote` | 13 | Regular | `colors.text.tertiary` | Leading |
| 12 | **Quick actions label** | Section | `typography.subhead` | 14 | Medium | `colors.text.secondary` | Leading |
| 13 | **Quick action labels** | Utility | `typography.caption` | 12 | Medium | `colors.text.secondary` | Center under icon |
| 14 | **FAB icon** | Persistent create | Lucide `Plus` | `icons.size.lg` (24) | Stroke 1.75 | `colors.text.onBrand` | Center in FAB |
| 15 | **Dividers** | Structure | — | hairline | — | `colors.border` | Full content width |

**Empty state hierarchy (when shown):** EmptyState title (`title2`) > description (`callout`) > primary button > secondary ghost — decorative illustration has **no** text weight.

---

## 3. Exact Screen Layout

### ASCII wireframe — populated state

Reading order numbered. Spacing annotations use tokens.

```
┌──────────────────────────────────────────┐
│ ░ status bar / safe top ░                │
│                                          │
│  [AppHeader: Home                    ]   │  (1)
│       ↕ spacing[2]                       │
│  Tuesday, 4 Aug                          │  (2)  footnote / tertiary
│       ↕ spacing[4]                       │
│  ┌─ SummaryHeader (soft wash) ─────────┐ │
│  │  Monthly spend                      │ │  (3)  subhead / secondary
│  │       ↕ spacing[1]                  │ │
│  │  $184.47                            │ │  (4)  ★ amountLg / primary
│  │       ↕ spacing[1]                  │ │
│  │  ≈ $2,213.64 / year                 │ │  (5)  footnote / tertiary
│  │  padding: spacing[4]                │ │
│  └─────────────────────────────────────┘ │
│       ↕ spacing[8]  (section gap)        │
│  Upcoming                    See all ›   │  (6)(7) title2 + brand subhead
│       ↕ spacing[3]                       │
│  Netflix                      $15.99     │  (8)  name + amountMd
│  Tomorrow · Monthly     [Due soon]       │      footnote + badge
│  ─ divider ───────────────────────────── │
│  iCloud+                       $2.99     │  (9)
│  In 3 days · Monthly                     │
│  ─ divider ───────────────────────────── │
│  Adobe                        $59.99     │  (10)
│  In 12 days · Monthly                    │
│       ↕ spacing[8]                       │
│  Quick actions                           │  (11) subhead / secondary
│       ↕ spacing[3]                       │
│  [ Templates ]     [ Reminders ]         │  (12)(13)  max 2 on populated
│       ↕ spacing[16]+ FAB clearance       │
│                                   ( ⊕ )  │  (14) FAB
│ ░ tab bar + home indicator ░             │
└──────────────────────────────────────────┘
```

### Why the eye moves naturally

1. **Header** establishes place.  
2. **Tertiary date** is skipped by foveal scan but softens entry.  
3. **Amount** dominates (size + weight + contrast) — first 5-second answer.  
4. **Yearly** is optically quiet — peripheral context.  
5. **32pt gap** forces a clean reset before Upcoming.  
6. **Section title + See all** set the second job; rows are a vertical time list (Calendar craft).  
7. **Trailing amounts** form a money column the eye can skim.  
8. **Quick actions** sit after comprehension — control without competing with the total.  
9. **FAB** is persistent peripheral affordance — not in the reading column.

### Empty state wireframe

```
┌──────────────────────────────────────────┐
│  [AppHeader: Home]                       │
│                                          │
│         [ illustration ]                 │
│                                          │
│       Nothing tracked yet                │
│   Add a subscription to see your         │
│   monthly total and next charge.         │
│                                          │
│      [ Add subscription ]                │
│      [ Browse templates ]                │
│                                          │
│  (no FAB)                                │
│ ░ tab bar ░                              │
└──────────────────────────────────────────┘
```

---

## 4. Summary Header Specification

### Label

| Property | Spec |
|---|---|
| Copy | `Monthly spend` |
| Token | `typography.subhead` |
| Color | `colors.text.secondary` |
| Alignment | Leading |

### Amount

| Property | Spec |
|---|---|
| Content | Formatted money in user currency (tabular nums via `amountLg`) |
| Token | `typography.amountLg` |
| Color | `colors.text.primary` |
| Alignment | Leading |
| A11y | Announce as e.g. “One hundred eighty-four dollars and forty-seven cents per month” (or locale equivalent) — amount + currency + period |

### Currency

| Property | Spec |
|---|---|
| Source | User preference (future); default from locale until prefs exist |
| Display | Embedded in formatted amount (e.g. `$184.47` or `₹184.47`) — **not** a separate competing glyph |
| Never | Raw unformatted floats; clipped strings at large Dynamic Type |

### Yearly total

| Property | Spec |
|---|---|
| Copy pattern | `≈ {formattedYearly} / year` |
| Token | `typography.footnote` |
| Color | `colors.text.tertiary` |
| Visibility | Hide if vertical space / Dynamic Type would force clipping of monthly amount |
| Alignment | Leading |

### Background

| Property | Spec |
|---|---|
| Fill | `colors.bg.brandWash` **or** `colors.brand.soft` at very low visual weight — prefer `colors.bg.brandWash` |
| Alternate | `colors.bg.surface` + `colors.border` 1px if wash feels too strong on a device |
| Elevation | **None** (`elevation.none`) |
| Nested cards | **Forbidden** |

### Corner radius

| Property | Spec |
|---|---|
| Radius | `radius.lg` (**16**) |
| Why | Soft containment without pill/chrome |

### Padding

| Edge | Token |
|---|---|
| All sides | `spacing[4]` (**16**) |

### Tap behavior

| State | Behavior |
|---|---|
| Default (MVP UI) | Optional `onPress` → Insights when route exists; until then **no-op or omit press** |
| Pressed | Background shift to `colors.bg.subtle` · `motion.duration.press` (120ms) |
| Disabled | N/A |
| Hints | If tappable, `accessibilityRole="button"` + hint “Shows spending insights” |

### Accessibility

- Combine label + amount + yearly into a concise accessibility label when focused as one block.  
- Min hit area if tappable: full summary surface (≥ `touchTargetComfortable` height effectively via padding).  
- Status not applicable here.

### Loading state

- `LoadingSkeleton` variant approximating: short bar (label) + wide tall bar (amount) + optional short bar (yearly).  
- Place inside same padding box to avoid layout jump.  
- No fake dollar amounts.

### Empty state

- SummaryHeader **not shown** when subscription count is 0 — EmptyState replaces dashboard body.  
- Do **not** show `$0.00` as a “healthy” dashboard for first-run empty.

### Offline state

- Show last cached amount if available.  
- Optional footnote under yearly/amount: `Updated earlier` / relative time — `typography.caption` / `colors.text.tertiary`.  
- Pair with OfflineBanner (Section 15).

### Future scalability

- Single-line insight teaser **under** yearly only (max one line) — never charts.  
- Soft “Deeper insights” text button may appear later — `typography.footnote` / `colors.brand.primary` — not a banner.

---

## 5. Upcoming List Specification

### Section chrome

| Element | Spec |
|---|---|
| Title | `Upcoming` · `typography.title2` · `colors.text.primary` |
| Trailing | `See all` · `typography.subhead` · `colors.brand.primary` · min 44×44 hit |
| Gap title→list | `spacing[3]` |

### SubscriptionRow — layout

```
[ Left column (flex)          ] [ Right column ]
  Name (title3)                 Amount (amountMd)
  Meta line (footnote)          Badge (optional)
```

Horizontal: full content width; vertical padding to reach **min 56** height (`layout.listRowMinHeight`).

### Left content

| Line | Content | Token | Color |
|---|---|---|---|
| Primary | Subscription name (1 line, ellipsis) | `title3` | `text.primary` |
| Secondary | `{relativeDue} · {cycle}` | `footnote` | `text.secondary` |

**Relative due copy:** `Today` | `Tomorrow` | `In {n} days` | else absolute short date.

**Cycle copy:** `Weekly` | `Monthly` | `Yearly` | custom label later.

### Right content

| Element | Spec |
|---|---|
| Amount | `typography.amountMd` · `colors.text.primary` · trailing · tabular nums |
| Badge | Optional below or beside amount stack — see badge placement |

### Primary text

Name — highest weight in the row after amount.

### Secondary text

Due + cycle — never omit due date in favor of vague “soon”.

### Amount alignment

- Trailing edge aligned across rows (column).  
- Why: scannable money like a statement.

### Badge placement

| Rule | Spec |
|---|---|
| When | Due in ≤ 3 days |
| Component | `AppBadge` `variant="warning"` label `Due soon` |
| Placement | Trailing column under amount **or** end of meta line if width tight — prefer trailing column under amount on phones ≥360pt width |
| Never | Color-only urgency without label |

### Divider

- `AppDivider` between rows, `spacing="none"`.  
- Color `colors.border`.  
- No divider after last row.

### Touch target

- Entire row pressable.  
- Min height 56; comfortable 64.  
- `accessibilityRole="button"`.  
- Label: `"{name}, {amount}, {due}"`.

### Pressed state

- Background `colors.bg.subtle` · 100–120ms (`motion.duration.press`).  
- No scale bounce.

### Loading skeleton

- Section title skeleton optional.  
- **3** `LoadingSkeleton` `variant="row"`.  
- Match row height 56–64.

### Empty state (upcoming only)

When user has subscriptions but none in next 30 days:

- Quiet message: `Nothing due in the next 30 days`  
- Token: `typography.callout` · `colors.text.secondary`  
- No illustration required  
- Keep SummaryHeader visible  

### Offline state

- Show cached rows.  
- Dim or footnote sync pending only if row dirty (future) — MVP: cached as normal + screen OfflineBanner.

### Error state

- If upcoming fails but summary cached: keep summary; show inline error text under Upcoming header + Retry text button.  
- If both fail and no cache: full `ErrorState` for screen.

---

## 6. Quick Actions Specification

### Number of actions

| Screen state | Count | Actions (priority order) |
|---|---|---|
| **Empty** | 0 in bar | CTAs live in `EmptyState` only |
| **Populated** | **2** | 1) Templates 2) Reminders |
| Absolute max | **3** | Never exceed (Phase 7A) |

**Why not Add here when populated:** FAB is the primary create; duplicating Add violates one-primary-CTA and Phase 7A dual-create mitigation.

### Priority order

1. **Templates** — faster add / activation completeness  
2. **Reminders** — retention & trust after value exists  
3. *(Reserved)* — only if FAB removed in a future experiment; not MVP  

### Why these belong on Home

They are **post-comprehension controls** that support the Home jobs (completeness + calm anticipation) without opening Settings chrome or adding marketing tiles.

### Layout

- Horizontal equal-weight items.  
- Each item: icon above label, centered.  
- Container: full content width; items share space evenly.  
- Not a scrolling marketing carousel.

### Icon size

| Property | Spec |
|---|---|
| Size | `icons.size.lg` (**24**) |
| Stroke | `icons.strokeWidth.default` (**1.75**) |
| Color | `colors.brand.primary` (default) / `colors.text.tertiary` when disabled |
| Icons | Templates → e.g. Lucide `LayoutGrid`; Reminders → `Bell` (single family) |

### Label size

| Property | Spec |
|---|---|
| Token | `typography.caption` |
| Color | `colors.text.secondary` |

### Spacing

| Property | Spec |
|---|---|
| Icon→label | `spacing[2]` (8) |
| Between actions | flexible; min `spacing[4]` (16) |
| Hit area per action | min **48×48** (`touchTargetComfortable`) |

### Press behavior

- Background soft fill `colors.brand.soft` on press · 120ms.  
- Radius `radius.md`.  
- Navigate / present: Templates picker · Reminder education / notification settings (future).

### Disabled behavior

- Opacity 0.5; no press; explain via a11y state.  
- Example: Reminders disabled offline if permission flow requires network — optional.

### Future scalability

- Swap labels, don’t add a 4th.  
- If a third is required, remove or relocate another.  
- Never convert into a promo strip.

---

## 7. Floating Action Button

| Property | Spec |
|---|---|
| **Diameter** | **56** |
| **Corner radius** | `radius.full` for circular FAB **or** `radius.lg` (16) if squircle preferred — **lock: circle via `radius.full`** with equal width/height 56 |
| **Shadow** | `elevation.raised` (level 2) |
| **Icon** | Lucide `Plus` · size `icons.size.lg` · stroke 1.75 · color `colors.text.onBrand` |
| **Fill** | `colors.brand.primary` |
| **Pressed fill** | `colors.brand.primaryPressed` |
| **Elevation** | Level 2 only — do not use modal level 3 |
| **Position** | Absolute; trailing; above tab bar |
| **Margins** | End: `spacing[5]` (20); Bottom: tab bar height + safe area + `spacing[3]` (12) |
| **Safe area** | Must clear home indicator + tab bar |
| **Scroll behavior** | MVP: always visible when populated; optional hide-on-scroll later (do not implement unless specified) |
| **Empty** | **Hidden** |
| **Accessibility** | `accessibilityRole="button"` · label `Add subscription` · min hit 56×56 |
| **Future expansion** | Single action only — **no** speed-dial fan-out on Home |

---

## 8. Typography Mapping

Every visible text → Phase 4 token (no hardcoded font sizes):

| UI element | Typography token |
|---|---|
| AppHeader “Home” | `title3` |
| Context date / greeting | `footnote` |
| “Monthly spend” | `subhead` |
| Monthly amount | `amountLg` |
| Yearly line | `footnote` |
| “Upcoming” | `title2` |
| “See all” | `subhead` |
| Subscription name | `title3` |
| Row meta (due · cycle) | `footnote` |
| Row amount | `amountMd` |
| Badge “Due soon” | `caption` (via AppBadge) |
| “Quick actions” | `subhead` |
| Quick action labels | `caption` |
| Upcoming-only empty message | `callout` |
| EmptyState title | `title2` (component default) |
| EmptyState body | `callout` |
| Offline / error banner text | `footnote` |
| ErrorState title/body | EmptyState-equivalent tokens via ErrorState |
| Retry controls | `button` / `buttonSm` via AppButton |

---

## 9. Color Mapping

Every visible color → semantic token (no raw hex in Home UI):

| Surface / element | Token | Why |
|---|---|---|
| Screen canvas | `colors.bg.app` | Calm desk-light canvas |
| Summary wash | `colors.bg.brandWash` | Soft brand presence without alarm |
| Summary alt surface | `colors.bg.surface` | If wash disabled |
| Row / header backgrounds default | transparent on `bg.app` | Flat, trustworthy |
| Row pressed | `colors.bg.subtle` | Quiet feedback |
| Primary text / amounts | `colors.text.primary` | Maximum trust contrast |
| Secondary labels / meta | `colors.text.secondary` | Hierarchy without washout |
| Tertiary context / yearly | `colors.text.tertiary` | Recedes so monthly wins |
| See all / brand icons | `colors.brand.primary` | Actionable calm teal |
| FAB fill | `colors.brand.primary` | Primary create |
| FAB pressed | `colors.brand.primaryPressed` | Tactile |
| FAB icon | `colors.text.onBrand` | Contrast on teal |
| Dividers | `colors.border` | Soft structure |
| Due soon badge fill | `colors.status.dueSoon` (via AppBadge warning) | Caution without panic red |
| Due soon badge text | `colors.warning` | Paired with label |
| Offline banner | `colors.bg.subtle` + `text.secondary` | Persistent, non-alarmist |
| Error emphasis | `colors.danger` sparingly in ErrorState actions only | Reserved |

---

## 10. Motion Specification

Use Phase 4 `motion` tokens. Ease: decelerate enters; accelerate exits.

| Animation | Behavior | Duration | Reduce Motion |
|---|---|---|---|
| **Screen entrance** | Fade + translateY `motion.enter.translateY` (10) | `motion.enter.duration` **250ms** | Opacity only or instant |
| **Summary fade / amount change** | Crossfade value | `motion.valueChange.duration` **200ms** | Instant swap |
| **Rows enter** | Stagger optional max 30ms/row; or single fade with screen | ≤250ms total | No stagger |
| **Row press** | Background flash | `motion.duration.press` **120ms** | Instant |
| **FAB press** | Opacity/scale 0.98 | 100–120ms | Opacity only |
| **FAB show** (empty→populated) | Fade in | `motion.duration.normal` **200ms** | Instant |
| **Pull to refresh** | Native tint `brand.primary`; on complete amount crossfade | ≤200ms | No decorative spin beyond OS |
| **Loading shimmer** | Skeleton opacity loop ~1.2s | — | Static placeholder at ~0.72 opacity |
| **Error appear** | Fade | 200ms | Instant |
| **Offline banner** | Slide from top under header or fade | 250ms | Fade / instant |
| **Success after add** (returning to Home) | Optional amount settle | ≤250ms | Instant |

**Never:** confetti, bouncing currency, layout-delaying animation, >400ms page motion.

---

## 11. Responsive Behavior

### Small phones (≤375pt width, short height)

- Keep horizontal pad 20.  
- Upcoming **3** rows default.  
- Hide yearly if vertical pressure.  
- Quick actions may sit below fold — OK.  
- FAB clearances mandatory.

### Large phones

- Default wireframe.  
- Upcoming up to 5 if data exists.  
- Yearly visible.

### Tablets

- Optional max content width **560** centered.  
- Do not switch to multi-column dashboard.  
- Do not add sidebar widgets on Home.

### Landscape

- Prefer still single column.  
- Ensure FAB does not cover Quick actions; increase bottom content inset.  
- Accept scroll; do not cram charts into empty space.

### Dynamic Type

- Amount must reflow / wrap if needed — **never clip**.  
- Row height grows with meta text.  
- Drop yearly before compressing monthly.  
- Test 100%, 150%, 200%.

---

## 12. Accessibility Specification

| Area | Requirement |
|---|---|
| **Screen readers** | Logical order: Header → Context → Summary → Upcoming header/See all → Rows → Quick actions → FAB (if visible) |
| **VoiceOver / TalkBack** | Amount includes currency + “per month”; rows combine name, amount, due; FAB “Add subscription”; illustration hidden |
| **Touch targets** | ≥44 iOS / ≥48 Android; rows ≥56; FAB 56; See all ≥44 |
| **Contrast** | Body ≥4.5:1; large amount ≥3:1; badge text readable on soft fill |
| **Reading order** | Match visual hierarchy; don’t focus decorative wash |
| **Dynamic Type** | Honored; money unclipped |
| **Focus order** | Same as reading order; banner (if any) announced when appearing (`accessibilityLiveRegion`) |
| **Reduced motion** | Per Section 10 |
| **Color blindness** | Due soon = badge **label** + date text; never color alone |
| **Tabs** | Selected tab already handled by shell; Home content independent |

---

## 13. Performance Specification

| Topic | Spec |
|---|---|
| **Renders immediately** | Shell, header, cached summary + cached upcoming (if any) |
| **Waits** | Network revalidation; templates prefetch; noncritical analytics |
| **Cache-first** | Paint last-known Home; reconcile quietly |
| **Skeleton timing** | Cold only; replace within ~1–1.5s perceived; **<300ms** when cache warm |
| **Maximum render budget** | Interaction ready **<1s** mid-tier with cache |
| **Scroll performance** | Only preview rows mounted (≤5); no heavy images in rows |
| **Never block UI** | On fetch, illustration decode, logging |

---

## 14. UX Rules

Future developers **MUST** follow:

1. **Never** add charts to Home.  
2. **Never** add Premium banners, timers, or paywall embeds to Home.  
3. **Never** show more than **5** upcoming rows.  
4. **Never** replace whitespace with widgets, tip carousels, or stat strips.  
5. **Never** hardcode spacing — use `theme.spacing` / `theme.layout`.  
6. **Never** hardcode colors — use `theme.colors`.  
7. **Never** hardcode typography — use `theme.typography`.  
8. **Always** preserve financial calm — no shame, panic, or gamification.  
9. **Never** use color alone for due/overdue.  
10. **Never** show `$0.00` dashboard for true first-run empty — use EmptyState.  
11. **Hide FAB** on empty; **don’t** duplicate Add in Quick Actions when FAB is visible.  
12. **One primary CTA** per view state.  
13. Prefer list + dividers over card grids.  
14. Prefer skeletons over spinner walls.  
15. Keep OfflineBanner honest — never fake “live” data.  
16. Do not implement search, filters, or full catalog on Home.  
17. Do not put Settings shortcuts clusters on Home.  
18. Animations must honor Reduce Motion and never delay task completion.

---

## 15. Future Component Mapping

### Existing components (Phase 5) — use as-is

| Section | Component |
|---|---|
| Screen shell | `ScreenContainer` |
| Title | `AppHeader` |
| All text | `AppText` |
| Separators | `AppDivider` |
| Due soon | `AppBadge` |
| Empty CTAs / Retry | `AppButton` |
| Loading | `LoadingSkeleton` |
| Zero subscriptions | `EmptyState` |
| Optional summary containment | `AppCard` **only if** SummaryHeader isn’t built yet — prefer dedicated SummaryHeader |

### New reusable components (implement with Home UI later)

| Component | Responsibility |
|---|---|
| **`SummaryHeader`** | Label, amount, yearly, wash, optional press, a11y aggregation |
| **`SubscriptionRow`** | Name, meta, amount, badge, press, a11y label |
| **`QuickActionBar`** | Max 3 tonal actions; icon+label; disabled states |
| **`FloatingActionButton`** | 56 circular primary create; elevation.raised |
| **`OfflineBanner`** | Persistent offline / stale notice; optional Retry |
| **`ErrorState`** | Full-page recoverable error; Retry (+ optional Help) |

### Composition sketch (informational only — not code)

`ScreenContainer` → `AppHeader` → (Banner?) → `SummaryHeader` → Upcoming header → `SubscriptionRow`×N → `QuickActionBar` → `FloatingActionButton`  
OR Empty: `ScreenContainer` → `AppHeader` → `EmptyState`  
OR Error: `ScreenContainer` → `AppHeader` → `ErrorState`

---

## 16. Implementation Checklist

Engineer must satisfy **all** before Home UI is complete:

### Visual consistency

- [ ] Matches ASCII wireframe reading order  
- [ ] Populated / empty / loading / error / offline states implemented per this spec  
- [ ] No charts, Premium chrome, search, or stat strips  

### Spacing

- [ ] Horizontal padding = `layout.screenPaddingX` (20)  
- [ ] Section gaps = `spacing[8]` (or `spacing[6]` only when compressed)  
- [ ] Row min height ≥ 56  
- [ ] No magic numbers outside tokens  

### Theme usage

- [ ] All colors from `theme.colors`  
- [ ] All type from `theme.typography`  
- [ ] Radii / elevation / icons from theme  
- [ ] Zero raw hex in Home files  

### Accessibility

- [ ] Screen reader labels for summary, rows, FAB, See all  
- [ ] Touch targets ≥ 44/48  
- [ ] Due soon not color-only  
- [ ] Dynamic Type: amount never clipped  
- [ ] Reduce Motion honored  

### Motion

- [ ] Entrance / press / refresh / banner per Section 10  
- [ ] No decorative blocking animation  

### Performance

- [ ] Cache-first paint path defined  
- [ ] ≤5 upcoming rows mounted  
- [ ] Skeletons only on cold load  

### Offline / loading / empty / error

- [ ] Empty: Phase 7A copy; no FAB  
- [ ] Loading: summary + 3 row skeletons  
- [ ] Offline: banner + cached content when available  
- [ ] Error: retry path; no data wipe on transient failure  

### Responsive

- [ ] Small phone / large phone verified  
- [ ] Tablet: no multi-column widget dashboard  
- [ ] FAB clears tab bar + home indicator  

### Type safety

- [ ] Strict TypeScript  
- [ ] Props typed for new components  
- [ ] No `any` for UI props  

### Definition of Done

- [ ] Phase 7A product rules respected  
- [ ] This Phase 7B spec respected  
- [ ] Uses Phase 5 components where mapped  
- [ ] No API/backend required for pure UI stub with mock props (if UI ships before data)  
- [ ] Lint / `tsc` clean for touched files  
- [ ] Financial calm preserved in copy and visuals  

---

## Document control

| Field | Value |
|---|---|
| Official UI SoT for Home | **This document** |
| Product SoT | Phase 7A |
| Tokens SoT | Phase 4 theme |
| Next engineering step | Implement Home UI against this spec (components + screen composition) |

**Phase 7B complete (planning only).**  
Only this documentation file is in scope for creation.
