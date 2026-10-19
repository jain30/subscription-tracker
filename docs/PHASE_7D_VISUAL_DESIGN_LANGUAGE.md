# Phase 7D — Premium Visual Design Language

**Status:** Official Design Source of Truth (planning / language only)  
**Scope:** Entire application visual language  
**Depends on:** Phase 2 brand · Phase 3 UI blueprint · Phase 4 tokens · Phase 7A–7C Home  
**Does not:** Redesign product IA, invent new features, or prescribe code  

**North star**  
*Subscription Tracker should feel like a quiet, expensive instrument for money clarity—never a loud dashboard, never a toy, never a generic SaaS template.*

This document is the visual contract every future screen must obey. Product structure lives in earlier phases; **how things look and feel** lives here.

---

## How to use this document

| Role | Use |
|---|---|
| Designers | Gate every mock against Sections 1–28 |
| Engineers | Translate Phase 4 tokens through this language—never invent chrome |
| Reviewers | Reject PRs that violate anti-patterns even if “functional” |
| Future dark mode / brand work | Extend this language; do not fork a second personality |

**Relationship to tokens:** Phase 4 remains the technical token source. Phase 7D explains *why* and *how* those tokens create premium polish. If language and tokens ever conflict, update tokens via intentional PR—do not freestyle hex in UI.

---

## 1. Brand personality

### Character

Subscription Tracker is a **calm financial companion**: precise like Stripe, restrained like Apple, soft like Notion’s empties, focused like Linear, quietly confident like Arc’s craft—without copying any one of them.

### Personality traits (always on)

| Trait | Means in UI | Never means |
|---|---|---|
| **Calm** | Soft canvas, measured motion, quiet color | Anxiety red, urgency chrome |
| **Trustworthy** | Stable layouts, honest numbers, predictable patterns | Gimmicks, fake totals, dark patterns |
| **Modern** | Contemporary type, intentional teal, clean geometry | Retro skeuomorphism, neon glass |
| **Premium** | Restraint, material honesty, spacing as luxury | Gloss, badges everywhere, “PRO” stickers |
| **Minimal** | Few elements, one job per region | Widget soup |
| **Financially responsible** | Money first, shame never | Gamified savings confetti |
| **Elegant** | Alignment, optical balance, soft radii | Harsh corners + heavy shadows together |
| **Soft** | Washes, muted status fills, rounded strokes | Hard black borders, loud fills |
| **Spacious** | Whitespace as structure | Edge-to-edge density |
| **Expensive** | Fewer, better surfaces | More chrome to look “feature rich” |

### Voice–visual bond

Copy is a smart friend who respects time and money. Visuals must match: **no shouting type, no carnival color, no corporate brochure gradients.**

---

## 2. Design philosophy

### Core principles

1. **Quiet confidence** — Premium is what you remove, not what you add.  
2. **Money-first honesty** — Amounts and dates outrank decoration.  
3. **One job per surface** — Every block answers one question.  
4. **Typography over chrome** — Hierarchy comes from type and space, not boxes.  
5. **Surface + border before shadow** — Elevation is rare and purposeful.  
6. **Warmth without cuteness** — Human empties; adult money UI.  
7. **Motion with purpose** — Feedback and hierarchy only.  
8. **Accessible by default** — Contrast, targets, and Reduce Motion are part of beauty.  
9. **Premium without flash** — Capability, not glitter.  
10. **Consistency as craft** — Same rhythms on every screen beat “clever one-offs.”

### Craft inspirations (learn, don’t copy)

| Source craft | Borrow | Leave behind |
|---|---|---|
| Apple | Restraint, material clarity, status honesty | Hardware skeuomorphism |
| Linear | Precision, density-with-calm, decisive type | Dev-tool austerity everywhere |
| Stripe | Money trust, exact figures, quiet status | Dashboard sprawl |
| Arc | Soft atmosphere, considered detail | Playful browser chrome |
| Notion | Warm empties, content-led structure | Endless nested blocks |

### The “expensive” test

If removing a border, shadow, gradient, badge, or card does **not** hurt understanding or interaction—**remove it.** Expensive products look inevitable, not decorated.

---

## 3. Color philosophy

### Emotional palette

| Family | Role | Feeling |
|---|---|---|
| **Cool fog neutrals** | Canvas & structure | Desk light, air, calm |
| **Deep teal** | Brand & primary action | Trust, ocean steadiness |
| **Near-ink** | Primary text & money | Seriousness without harsh black |
| **Warm amber accent** | Rare premium emphasis | Value, not alarm |
| **Mint / amber / coral** | Success / caution / danger | Clear, muted, never neon |

### Rules

- **Teal earns its place** — CTAs, selected nav, key links, soft brand washes. Not decorative fills on every tile.  
- **Accent amber is scarce** — Premium moments and rare highlights only. Never as default CTA.  
- **Danger is sacred** — Destructive / overdue only. Never “make it pop.”  
- **Status is muted + labeled** — Soft fills; text/icon always accompany color.  
- **Category pastels stay pastel** — Coding aid, not a rainbow UI.  
- **No purple-on-white**, no electric gradients, no pure `#000` on `#FFF` as brand voice.

### Semantic discipline

Always think in roles (`text.primary`, `brand.primary`, `bg.app`)—never in “that teal hex I remember.” Semantic color creates scalable polish across screens.

### Contrast as elegance

Premium is readable. Body contrast ≥ 4.5:1; large money ≥ 3:1. Washed-out gray-on-gray is not “soft”—it is unfinished.

---

## 4. Background philosophy

### App canvas

The app background is a **soft cool fog**—a quiet room, not a blank hospital wall and not a tinted mood board.

| Intent | Guidance |
|---|---|
| Default | Continuous `bg.app` behind content |
| Atmosphere | Optional very soft brand wash behind *one* hero money region |
| Forbidden | Full-screen loud gradients, photo wallpaper, mesh blobs, noise textures as default |

### Atmospheric layering (subtle)

Think **paper on desk**, not **cards floating in void**:

1. Canvas (`bg.app`)  
2. Soft wash or single surface for key summary  
3. Content (type, rows)  
4. Rare floating action  

### Brand wash

Used sparingly behind primary financial summary. It should feel like a **breath of teal mist**, not a colored card competing with white tiles. No second wash stacked beneath it.

---

## 5. Surface philosophy

### Surface types

| Surface | Use | Character |
|---|---|---|
| **Canvas** | Screen ground | Soft, continuous |
| **Wash** | One emphasis region (e.g. monthly spend) | Soft tint, no heavy border required |
| **True surface** | Sheets, inputs, rare contained groups | Clean white, quiet border |
| **Subtle** | Pressed states, grouped settings, banners | Recessed, calm |
| **Overlay** | Modal scrim | Soft ink at ~40%—focus without black void |

### Rules

- Prefer **flat content on canvas** over stacking white rectangles.  
- A surface must justify itself: interaction containment, sheet semantics, or optical grouping that lists cannot provide.  
- Surfaces never nest more than **one** level deep on content screens.  
- Do not tile the Home (or any calm screen) with competing white cards.

---

## 6. Elevation system

Elevation is a **privilege**, not a default.

| Level | Role | Visual language |
|---|---|---|
| **0** | Lists, most UI, summary wash | Flat; border or none |
| **1** | Rare interactive cards | Soft, barely-there lift |
| **2** | FAB, sticky utility bars | Clear but soft lift |
| **3** | Modals / sheets | Strongest lift; still no glow |

### Philosophy

Money apps that float everything feel **noisy and cheap**. Flat structure reads as clarity and trust. If you need elevation to “make it look designed,” the layout is wrong—fix spacing and type first.

---

## 7. Shadow system

### Character

Shadows are **cool-ink tinted**, low opacity, large blur, modest offset—never harsh black undercuts, never colored neon glows, never multi-layer “Instagram card” stacks.

| Level | Feel |
|---|---|
| 1 | Whisper: object rests on paper |
| 2 | Soft presence: FAB is reachable without shouting |
| 3 | Sheet above world: modal authority |

### Rules

- One shadow system app-wide (Phase 4 elevation).  
- Never combine thick border + strong shadow + gradient on the same element.  
- No outer glow, no inner bevel, no skeuomorphic drop.  
- Prefer border-only for rows and dividers.

---

## 8. Corner radius system

Radius expresses **soft modernity**—friendly, not bubbly; precise, not sharp.

| Scale | Character | Typical use |
|---|---|---|
| **sm** | Controlled soft | Inputs, chips |
| **md** | Default interactive | Buttons, pressable rows of chrome, quick actions |
| **lg** | Contained region | Summary wash, true cards, tiles |
| **xl** | Large containers | Sheets |
| **full** | Circle only when shape demands | Avatars, circular FAB |

### Rules

- **Do not pill-everything.** Stadium pills as default read as consumer-social, not financial calm.  
- Primary buttons use **md**, not full pill by default.  
- FAB is the intentional circle exception.  
- Keep radius consistent within a component family—mixed radii in one row look accidental.

---

## 9. Border system

### Philosophy

Borders are **structure**, not decoration.

| Use | Guidance |
|---|---|
| Dividers | Hairline, `border` color, between list rows |
| Inputs | 1px; brand on focus; danger on error |
| Flat surfaces | Optional 1px when wash is not used |
| Nested frames | Avoid double borders |

### Rules

- Prefer a **single hairline divider** over boxed rows.  
- Never use 2–3px heavy rules as “premium.”  
- Never use dashed carnival borders.  
- Separators align to content columns—optical continuity beats random inset boxes.

---

## 10. Typography philosophy

### Pairing

| Role | Face | Spirit |
|---|---|---|
| **Display** | Soft serif (Fraunces) | Human warmth—rare: onboarding, empty titles |
| **UI / money** | Geometric sans (Plus Jakarta Sans) | Modern product clarity |
| **Amounts** | Same sans + tabular figures | Statement precision |

### Principles

- **Type creates hierarchy**; boxes do not.  
- Display is a **spice**, not a meal—overuse destroys premium.  
- Money must never feel casual: semibold tabular amounts, stable alignment.  
- Avoid Inter / Roboto / Arial / system UI as brand voice.  
- Line length stays comfortable; on wide canvases, constrain measure—do not stretch sentences edge-to-edge on tablets.

### Optical hierarchy (always)

1. Primary amount / primary title  
2. Section titles  
3. Row identities  
4. Secondary meta  
5. Tertiary context / footnotes  

If two elements share the same weight and size, the screen has no hierarchy—fix it.

---

## 11. Visual hierarchy

### Law of one focal point

Every viewport has **one** primary focal point. On Home: monthly amount. On Detail: identity + amount. On Lists: the list itself—not a competing hero chart.

### Scan path

Premium UIs are readable in a **Z / vertical scan**:

1. Place (header)  
2. Primary answer (money or title)  
3. Secondary structure (section)  
4. Actionable list  
5. Peripheral utilities (FAB, quick actions)

### Weight tools (in order of preference)

1. Size  
2. Weight  
3. Color (primary vs secondary vs tertiary)  
4. Position / spacing  
5. *Only then* surface or elevation  

### Forbidden hierarchy hacks

- Red labels to force attention  
- Badges on everything  
- Bold + color + shadow + animation stacked  
- Multiple “hero” totals competing  

---

## 12. White-space philosophy

Whitespace is **not empty**—it is the primary premium material.

| Rhythm | Intent |
|---|---|
| Micro (4–8) | Related items belong together |
| Small (12–16) | Label owns its value; section title owns its list |
| Section (24–32) | Eye resets between jobs |
| Dramatic (40–64) | Empty states, rare breathing |

### Rules

- Prefer **32** between major Home sections; compress to 24 only under Dynamic Type / short viewports.  
- Never fill whitespace with tips, promos, or “helpful” widgets.  
- Crowding is the fastest way to look cheap.  
- Align columns (especially money) so space feels intentional, not random gaps.

### The calm density balance

Linear teaches that density can still be calm—**aligned, consistent, quiet.** Notion teaches that emptiness can still be warm. We sit between: **spacious first viewport, precise lists.**

---

## 13. Card philosophy

### Default: no cards

Cards are allowed **only** when interaction or semantics need containment.

| Allowed | Not allowed |
|---|---|
| Soft summary wash as *one* region | Card grid dashboards |
| Sheet / modal surfaces | Card-per-list-row |
| True interactive tile that is the control | Nested cards in cards |
| Settings group surfaces when platform pattern needs them | Marketing feature cards on Home |

### Card visual recipe (when used)

- Radius **lg**  
- Prefer flat wash or surface + optional hairline  
- Elevation **0–1** only  
- Padding generous (`spacing[4]`)  
- One purpose inside  

### Test

If a list + divider communicates the same thing, **do not use a card.**

---

## 14. List philosophy

Lists are the **honest form** for subscriptions and money chronologies.

### Character

- Flat rows on canvas  
- Hairline dividers  
- Leading identity, trailing amount column  
- Meta in secondary/tertiary type  
- Min height comfortable for touch (56–64)  

### Premium list tells

- Tabular trailing amounts align like a statement  
- Due language is precise (`Today`, `Tomorrow`, `In n days`)  
- Status chips are rare and labeled  
- Pressed state is a soft subtle fill—not a bounce  

### Never

- Alternating loud row colors  
- Heavy row shadows  
- Multi-line essay meta  
- More than one badge family fighting in a row  

---

## 15. Floating Action Button philosophy

### Role

The FAB is the **single persistent create** affordance on list/habit surfaces—not a mascot, not a menu launcher.

### Character

- Circle, brand primary fill  
- Soft level-2 elevation  
- Lucide-style Plus, on-brand icon color  
- Clear of tab bar and home indicator  
- Hidden when another primary CTA owns the view (e.g. empty state)  

### Rules

- **One** FAB action—no speed-dial fan-outs on calm screens  
- Do not duplicate the same primary in Quick Actions when FAB is visible  
- Do not place multiple FABs  
- Do not restyle FAB as a pill banner  

### Premium feel

The FAB should feel **inevitable and quiet**—a tool within reach—not a promotional sticker.

---

## 16. Navigation philosophy

### Bottom tabs

- 3–4 items max  
- Outline icons default; **filled when selected**  
- Selected color = brand primary; unselected = secondary text  
- Labels use caption rhythm—legible, not shouty  
- Surface tab bar with hairline top border—not floating island by default  

### Stack / sheets

- Custom headers stay typographically quiet  
- Sheets use large radius and soft scrim  
- Back is clear; never hide navigation behind gestures alone without affordance  

### Chrome discipline

Navigation chrome is **servant**, not hero. Brand moments happen in content (onboarding, empty), not in a loud tab bar.

---

## 17. Iconography

### Style

- Rounded stroke, optical weight ~1.75–2  
- Soft corners—not sharp geometry, not bubbly toys  
- One family only (Lucide / SF-like strokes)  
- Grid: 24 default; 20 dense; 16 meta; 32 rare emphasis  

### Behavior

| State | Treatment |
|---|---|
| Default | Outline |
| Selected tab / active | Filled (same hue) |
| Decorative empty | Hidden from accessibility tree |

### Forbidden

- Emoji as chrome  
- Multicolor skeuomorphic icons in navigation  
- Mixing icon packs on one screen  
- Oversized illustrative icons competing with money  

---

## 18. Motion language

### Signature vocabulary (only)

1. **Enter** — short fade + slight upward settle (~8–12px, ~250ms, decelerate)  
2. **Value change** — restrained crossfade (~200ms)  
3. **Success** — compact confirmation (≤300ms), never confetti  

### Supporting micro-motion

- Press: opacity / soft fill / scale ~0.98 — 100–150ms  
- Banner: fade or soft slide ~250ms  
- Skeleton shimmer: low-contrast; static if Reduce Motion  

### Character of motion

Premium motion is **inevitable and brief**—like a well-hinged drawer, not a cartoon. If motion is noticeable as “animation,” it is probably too much.

### Rules

- Never delay task completion for delight  
- Never bounce money  
- Never loop decorative Lottie on Home  
- Always honor Reduce Motion (opacity/instant)  

---

## 19. Lighting direction

### Mental model

Light comes from **above-front**, cool and soft—like north-facing daylight on paper.

| Implication | Practice |
|---|---|
| Shadows fall slightly downward | Positive Y offset, soft blur |
| Surfaces don’t self-glow | No neon edges |
| Washes feel ambient | Mist teal, not spotlight cones |
| Text sits on paper | High legibility, no etched-light gimmicks |

### Forbidden lighting

- Colored rim lights  
- Dramatic stage spotlights  
- Fake glossy speculars on buttons  
- Dark-mode neon outlines as brand (until a true dark language exists)

---

## 20. Blur usage

### Philosophy

Blur is **atmospheric rarity**, not frosting on everything.

| Allowed (future, sparingly) | Not allowed |
|---|---|
| Soft scrim alternatives behind sheets if platform-appropriate | Blurred photo heroes behind money |
| Rare sticky chrome on scroll (if ever justified) | Blur to hide weak layout |
| | iOS-style blur everywhere as “premium default” |

### Rule

If blur is required to make a layer readable, the layering is wrong—simplify first.

**MVP stance:** Prefer solid soft scrim (`overlay`) over blur. Introduce blur only with an explicit design amendment.

---

## 21. Glass usage

### Philosophy

**No glassmorphism as brand.** Frosted panels, refractive borders, and “liquid glass” stacks read as trend demo—not financial trust.

| Stance | Detail |
|---|---|
| Default | Opaque surfaces + soft wash |
| Exception | None for MVP content screens |
| Future | Only if a platform sheet pattern truly requires it—and still muted |

Glass tries to look expensive; restraint *is* expensive.

---

## 22. Gradient usage

### Philosophy

Gradients are **atmospheric whispers**, not identity.

| Allowed | Not allowed |
|---|---|
| Near-invisible canvas mist (fog → soft teal mist) on splash / rare brand moments | Purple–indigo SaaS gradients |
| | Button gradient fills |
| | Chart candy gradients on Home |
| | Mesh / aurora backgrounds |

### Rule

If you can see the gradient as a “design flex,” tone it down until it disappears into calm.

---

## 23. Empty states

### Character

Warm, adult, inviting—**Airbnb hospitality without whimsy overload.**

| Element | Guidance |
|---|---|
| Illustration | One family; teal + sand + one accent; quiet desk / calendar / receipt metaphors |
| Title | Clear, non-shaming |
| Body | One sentence stating the value unlocked next |
| Actions | One primary, optional ghost secondary |
| Layout | Centered breathing room; no fake dashboards |

### Rules

- No `$0.00` “healthy” fake dashboards for first-run empty  
- No jokes about being broke  
- No Premium upsell as the empty primary  
- Illustration is decorative (a11y hidden)

---

## 24. Loading states

### Character

**Skeleton over spinner walls.** Layout-faithful placeholders preserve trust and prevent jumpiness.

| Guidance | Detail |
|---|---|
| Shape | Match final summary + rows |
| Motion | Soft shimmer; static under Reduce Motion |
| Timing | Brief; cache-first content preferred |
| Forbidden | Full-screen brand spinners as default, fake numbers, skeleton forever |

Loading should feel like the UI is **arriving**, not like the app is **stalling**.

---

## 25. Error states

### Character

Calm recovery—**Linear clarity + human warmth.**

| Guidance | Detail |
|---|---|
| Copy | Precise, blame-free (“Couldn’t refresh right now”) |
| Action | Retry always; Help optional |
| Visual | Quiet; danger color only if truly destructive context |
| Data | Prefer keep last good UI + banner over wiping |

### Offline

Offline is not an error carnival. Banner + cached truth + optional Retry. No fake “live” pulses.

---

## 26. Premium polish checklist

Use before shipping any screen:

### Presence

- [ ] One clear focal point in the first viewport  
- [ ] Hierarchy readable in 5 seconds  
- [ ] Whitespace feels intentional, not accidental  

### Material

- [ ] Canvas + surfaces follow Sections 4–5  
- [ ] Elevation rare and correct  
- [ ] No competing card grid  

### Type & money

- [ ] Tokenized type only  
- [ ] Tabular amounts; trailing money columns align  
- [ ] No clipped currency at large text sizes  

### Color

- [ ] Semantic tokens only  
- [ ] Status never color-only  
- [ ] Teal used with restraint; amber scarce; danger sacred  

### Chrome

- [ ] Icons one family; outline/fill rules respected  
- [ ] FAB policy correct for the view state  
- [ ] Borders hairline and purposeful  

### Motion & states

- [ ] Motion within language; Reduce Motion honored  
- [ ] Empty / loading / error / offline feel designed  
- [ ] No gamification or fake urgency  

### Craft

- [ ] Optical alignment (baselines, columns, section gaps)  
- [ ] No magic visual one-offs that break system rhythm  
- [ ] Screen still looks premium in grayscale (structure holds)

### The expensive test

- [ ] Removing extra chrome does not reduce clarity—because extra chrome was never added  

---

## 27. Anti-patterns (never allowed)

### Visual

1. Purple / indigo “AI SaaS” gradients  
2. Neon accents, glow shadows, cyber borders  
3. Glassmorphism stacks  
4. Heavy multi-layer shadows on lists  
5. Card grids pretending to be dashboards  
6. Pill-everything UI  
7. Emoji icons in chrome  
8. Mixed icon families  
9. Busy backgrounds (mesh, noise, stock photos behind money)  
10. Hard black / pure white as brand personality  

### Product-feeling

11. Gamification (streaks, confetti money, achievement spam)  
12. Shame / panic copy and red-first layouts  
13. Fake urgency timers and “limited offer” strips on calm screens  
14. Fake sample balances that train distrust  
15. Premium paywall as Home decoration  

### Hierarchy & layout

16. Multiple competing heroes  
17. Charts on Home  
18. Tip carousels filling whitespace  
19. Stat strips (“12 active · 3 trials · 2 canceled”) as first viewport noise  
20. Nested cards and borders-on-borders  

### Motion & feedback

21. Bouncy spring spam  
22. Looping decorative animation  
23. Blocking spinners when skeletons suffice  
24. Color-only status  

### Process

25. Raw hex / magic spacing / one-off radii in feature UI  
26. “Just this screen” exceptions without amending this document  

---

## 28. Future scalability rules

### How the language grows without decaying

| Rule | Practice |
|---|---|
| **Amend, don’t fork** | New patterns update this SoT |
| **Tokens first** | New colors/radii/type enter Phase 4 tokens, then language |
| **Replace, don’t stack** | New chrome must remove or relocate old chrome |
| **Screen jobs stay pure** | Analytics depth → Insights; catalog → List; account → Settings |
| **Dark mode** | Requires a full dual language (surfaces, elevation, hairlines)—not inversion |
| **Brand evolution** | Teal/ink/fog personality remains; seasonal campaigns never hijack core UI |
| **Illustration** | One family forever; new scenes, same DNA |
| **Motion** | Keep the three signatures; add only with Reduce Motion stories |
| **Platform trends** | Adopt platform conventions under our calm constraints—never chase trends that break trust |

### Three-year guardrails

- Home remains sparse even as the product gains power.  
- Power features progressive-disclose; they do not colonize the first viewport.  
- “Premium” visual treatment means **clearer capability**, not gold chrome.  
- If a proposal needs more cards, more glow, or more badges to “feel premium,” reject it.

### Governance question (ask on every PR)

> Does this make the product feel calmer, clearer, and more trustworthy—or merely busier?

Only the first path ships.

---

## Document control

| Field | Value |
|---|---|
| Title | Phase 7D — Premium Visual Design Language |
| Role | **Design Source of Truth** for visual craft |
| Complements | Phase 2 personality · Phase 3 blueprint · Phase 4 tokens · Phase 7A–7B Home specs |
| Non-goals | Code, CSS, components, API, IA redesign |
| Next step | Apply this language in visual polish passes and all future screens |

**Phase 7D complete.**  
This document is the official Premium Visual Design Language for Subscription Tracker.
