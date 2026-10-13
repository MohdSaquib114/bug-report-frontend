# BugDrop Design System

> The single source of truth for all UI in the BugDrop frontend.
> If a component or style isn't in this file, it doesn't exist yet — extend this file first, then the code.

Product: **BugDrop** — an embeddable bug reporting widget + a workspace to triage and manage the reports it collects.

Aesthetic north star: **rigorous developer tooling** in the vein of Linear, Vercel and Raycast.
Dark-first, precise, calm. Density over decoration. Real hierarchy, real motion, no theme-y color vomit.

---

## 1. Principles

1. **Restraint.** One accent color that means something; everything else is neutrals and semantics.
2. **Precision.** 1px borders, exact spacing scales, single-width focus rings. Every pixel is intentional.
3. **Calm.** Default surfaces sit on near-black. Nothing glows unless it's interactive or live.
4. **Motion is information.** Transitions state human changes (drags, opens, status flips) — never decorative loops.
5. **Dense, not cramped.** More content per screen than a consumer app. 13/14px UI type.
6. **Dark-first.** Dark is the default and primary experience. Light is a first-class but secondary variant.

---

## 2. Color

### 2.1 Brand

| Token | Dark | Light | Usage |
|---|---|---|---|
| `brand-500` | `#7C5CFF` | `#6D4AFF` | Primary actions, focus, active nav, links |
| `brand-400` | `#9B82FF` | `#8B6CFF` | Hover states, glows |
| `brand-600` | `#6A45F5` | `#5B3AED` | Pressed states |
| `brand-gradient` | `linear-gradient(180deg,#8B5CF6 0%,#6D4AFF 100%)` | same | Primary button fill |

Brand works best as a **fill + faint surface**, e.g. `bg-brand/10` with `text-brand-300`.

### 2.2 Accent (the "live" signal)

| Token | Value | Usage |
|---|---|---|
| `accent` | `#B8F24A` | Positive/live/online states, success, widget "recorded" moments |
| `accent-dim` | `#7BA320` | In light mode and on light fills |

### 2.3 Neutrals — dark (default)

| Token | Hex | Usage |
|---|---|---|
| `bg-0` | `#08080B` | App canvas / page background |
| `bg-1` | `#0E0E14` | Elevated canvas, app shell sidebar |
| `bg-2` | `#15151D` | Cards, inputs, panels |
| `bg-3` | `#1D1D27` | Hover fills, raised chips |
| `bg-hover` | `#1A1A23` | Row/card hover |
| `line-0` | `rgba(255,255,255,0.05)` | Hairlines on dark fills |
| `line-1` | `#23232E` | Default borders |
| `line-2` | `#2E2E3A` | Stronger borders (inputs, popovers) |
| `text-0` | `#F5F5F8` | Primary text |
| `text-1` | `#B4B4C2` | Secondary text |
| `text-2` | `#757584` | Muted / meta text |
| `text-3` | `#4C4C5A` | Disabled text |
| `text-inverse` | `#0A0A0F` | Text on brand/accent fills |

### 2.4 Neutrals — light

| Token | Hex |
|---|---|
| `bg-0` | `#F7F7F9` |
| `bg-1` | `#FFFFFF` |
| `bg-2` | `#FFFFFF` |
| `bg-3` | `#F1F1F5` |
| `line-0` | `rgba(0,0,0,0.045)` |
| `line-1` | `#E4E4EA` |
| `line-2` | `#D4D4DD` |
| `text-0` | `#101014` |
| `text-1` | `#565660` |
| `text-2` | `#8B8B98` |
| `text-3` | `#BCBCC6` |

### 2.5 Semantic

| Token | Dark | Light | Meaning |
|---|---|---|---|
| `danger` | `#F04438` | `#D92D20` | Errors, destructive, critical |
| `warning` | `#F5A524` | `#DC6803` | High priority, caution |
| `info` | `#4C8DFF` | `#2E7CF6` | In-progress, medium priority |
| `success` | use `accent` | use `accent-dim` | Resolved, success |

Semantic colors ship with a **soft fill** for badges: `bg-danger/10 text-danger`, etc. Base opacity `10%`, border `20%`.

### 2.6 Status & priority system (stable mapping)

| Entity | Value | Surface | Token(s) |
|---|---|---|---|
| Bug status | `open` | gray dot | `text-1` / `bg-1` |
| Bug status | `in_progress` | pulsing amber dot | `info` + pulse |
| Bug status | `resolved` | lime dot | `accent` |
| Bug status | `closed` | muted strikethrough | `text-2` |
| Priority | `low` | neutral chip | `text-2` |
| Priority | `medium` | blue chip | `info` |
| Priority | `high` | amber chip | `warning` |
| Priority | `critical` | red chip + line | `danger` |
| Role | `owner` | violet chip | `brand` |
| Role | `maintainer` | blue chip | `info` |
| Role | `contributor` | lime chip | `accent` |
| Role | `viewer` | neutral chip | `text-2` |

---

## 3. Typography

Font: **Geist Sans** (UI) + **Geist Mono** (code). Weights: 400 / 500 / 600 / 700.

| Scale | Size / Lh / Tracking | Use |
|---|---|---|
| `display` | 64 / 1.0 / -0.04em | Marketing hero only |
| `h1` | 32 / 1.15 / -0.03em | Page titles (# / docs) |
| `h2` | 24 / 1.2 / -0.02em | Section headers |
| `h3` | 18 / 1.3 / -0.015em | Card / panel titles |
| `title` | 15 / 1.4 / -0.01em | App: dialog/board titles |
| `body` | 14 / 1.55 / 0 | Default UI text |
| `sm` | 13 / 1.45 / 0 | Meta text, badges, table cells |
| `xs` | 12 / 1.4 / 0 | Captions, timestamps |
| `code` | 13 mono / 1.5 | Inline code, keys, values |
| `code-sm` | 12 mono / 1.5 | Code annotations |

Max line length for prose: **68ch**. Numbers use tabular figures (`font-feature-settings "tnum"`).

---

## 4. Spacing

Base unit `4px`. Scale: `2 4 6 8 10 12 16 20 24 32 40 48 64 80 96 128`.

Conventions:
- Cards: padding `20` (p-5), inner gaps `12`.
- Forms: field gap `16`, label→input gap `6`.
- Lists/tables: row height `40`, cell padding `12`x`16`.
- Kanban columns: gap `10`, card padding `12`, column padding `8`.
- App shell: sidebar `240px` (collapsed `64px`), topbar height `56px`.
- Marketing sections: `py-24` / `py-32`, max width `1120px`.

---

## 5. Radius

| Token | Value | Use |
|---|---|---|
| `radius-sm` | `6px` | Chips, in-cell controls |
| `radius-md` | `8px` | Buttons, inputs, badges |
| `radius-lg` | `12px` | Cards, panels, kanban cards |
| `radius-xl` | `16px` | Dialogs, popovers, side sheets |
| `radius-full` | `999px` | Pills, avatar, dots |

**Rule:** radius never exceeds `16px` on functional surfaces. Prefer small, crisp corners.

---

## 6. Elevation & shadow

Dark shadows are **subtle + layered**, never blurry-black blobs.

| Token | Value | Use |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgb(0 0 0 / .4)` | Inputs, chips |
| `shadow-md` | `0 2px 8px rgb(0 0 0 / .35), 0 1px 2px rgb(0 0 0 / .4)` | Cards on hover |
| `shadow-lg` | `0 8px 24px rgb(0 0 0 / .45), 0 2px 6px rgb(0 0 0 / .3)` | Dropdowns, popovers |
| `shadow-xl` | `0 24px 64px rgb(0 0 0 / .55), inset 0 1px 0 rgb(255 255 255 / .06)` | Dialogs |
| `ring-brand` | `0 0 0 1px var(--brand-500), 0 0 0 3px rgb(124 92 255 / .25)` | Focus |

Elevation order (who paints over whom):
1. Page canvas `bg-0`
2. Panels/sidebar `bg-1`
3. Cards/inputs `bg-2`
4. Hover/popovers `bg-3` + `shadow-lg`
5. Dialogs `bg-2` + `shadow-xl` + overlay

Overlay scrim: `rgba(0,0,0,0.6)` + `backdrop-blur-sm`.

---

## 7. Motion

Framer Motion is the only animation engine. Durations from a fixed scale; never invent new ones.

| Token | ms | Default easing | Use |
|---|---|---|---|
| `fast` | `120ms` | `easeOut` | Hover, ring, color |
| `base` | `180ms` | `cubic-bezier(0.2,0,0,1)` (Linear ease) | Toggles, status flips, reveals |
| `slow` | `280ms` | `cubic-bezier(0.2,0,0,1)` | Modals, popovers, side sheets |
| `expressive` | `500-800ms` | `cubic-bezier(0.16,1,0.3,1)` | Hero, page-level entrances |

Principles:
- **Enter** components: `opacity + y/scale (from)` with a `stagger`.
- **Layout**: use `layout` + `layoutId` for shared-element transitions (hover rings, accordions, board cards).
- **Drag & drop**: the dragged card scales to `1.03`, other cards animate out of the way via `layout`. Commit the status change optimistically on drop, roll back on error.
- Reduce motion: respect `prefers-reduced-motion`; everything still works without animation.

---

## 8. Focus & accessibility

- Focus ring: `ring-brand` (1px brand + outer soft halo) applied with `:focus-visible` only.
- Min touch target: `32px`; interactive controls at `32–36px` height.
- Contrast: `text-2` is the floor for readable content on `bg-0`; `text-3` is never used for essential info.
- Color is never the only signal: statuses carry a glyph (dot/text), priorities a label or signal icon.
- Live region for toasts; `aria-live="polite"` on loading and drag status.

---

## 9. Component specifications

### 9.1 Button
- Radii: sm→`6`, md→`8`. Heights: sm `32`, md `36`, lg `44`. Padding: md `12/16`.
- Variants:
  - **primary**: `brand-gradient` fill, `text-white` (`text-inverse` on accent), subtle top highlight `inset 0 1px 0 rgb(255 255 255/.25)`.
  - **secondary**: `bg-2`, `line-2` border, `text-0`; hover `bg-3`.
  - **outline**: transparent, `line-1` border, `text-0`; hover `bg-1` + `line-2`.
  - **ghost**: transparent; hover `bg-3`.
  - **danger**: `danger` border/text; hover `danger/10`.
- Loading: right-side spinner in same width (do NOT change width). Disabled: `opacity-50 grayscale`.
- Icons: `16px`, gap `8`. Icon-only width = height.

### 9.2 Input / Textarea / Select
- Height `36` (input/select), Textarea min `96px`.
- Surface `bg-2`, border `line-2`, radius `8`. Focus: `ring-brand`.
- Placeholder: `text-2`. Label: `text-1 / 13px / weight 500`. Helper: `text-2 / 12px`. Error: danger text + border.
- Prefix/suffix slots (icons), e.g. search, email, chevron.

### 9.3 Badge / Chip
- Height `20–24`, radius `full` (status/priority) or `6` (data chips), padding `8/10`.
- Soft fills: `bg-{token}/10` + `text-{token}` + optionally a `6px` dot or signal icon.
- Priorities: `low` neutral / `medium` info / `high` warning / `critical` danger with `AlertTriangle`-style icon on critical.

### 9.4 Card
- Surface `bg-2`, border `line-1`, radius `lg` (12), padding `20`.
- Hover: raise `border line-2` + `shadow-md`; optional `whileHover y:-2`. Never scale.
- Card header: title (`h3`-lite 15 `weight 600`) + actions slot; divider `line-0`.

### 9.5 Dialog / Drawer
- Dialog: `max-w-md` body width by default, radius `xl`, `shadow-xl`, scrim `rgba(0,0,0,.6)`+blur. Enter: opacity 0→1 (scrim) + scale `.98→1` + y `8→0` (panel), `slow`.
- Drawer (side sheets): slides along its edge with `slow`; used for bug compose.
- Header `16px` padding, title `title` weight 600, X button `ghost` icon-only. Close on `Esc` + scrim click. Trap focus.

### 9.6 Dropdown menu
- Popover: surface `bg-3` (raised), radius `md`, `shadow-lg`, max-h `320px` scroll.
- Item: height `32`, padding `8/12`, radius `6`, hover `bg-hover`; selected = `brand` text + check.
- Separator `line-0`; section labels `xs text-2 uppercase tracking-wider`.
- Anchored; closes on outside click / Esc.

### 9.7 Tabs
- Underline style: inactive `text-2`, active `text-0` + `layoutId` brand underline (2px, radius full).
- Email-tab padding `4/6`, gap `2`. Optional count in an `bg-3` chip.

### 9.8 Avatar
- Radius full; size `20/24/32/36`. Initials 1–2 chars `weight 600`.
- Deterministic tint from a fixed palette (brand/info/accent/warning/danger rotation) keyed by name hash. No images by default.

### 9.9 Tooltip
- Delay `400ms`, `xs` text, surface `bg-0` + border `line-2`, radius `6`, offset `6`. Arrow optional. Never essential info.

### 9.10 Switch
- Track `32×18`, knob `14`. On: `brand`. Motion on knob `fast`.

### 9.11 Empty state
- Icon in a `40px` `bg-3` rounded square, title `title w600`, body `sm text-2`, optional single primary action.
- No cartoon illustration, no emoji, no confetti.

### 9.12 Skeleton
- Fill `bg-3`, radius matches target, shimmer sweep `1200ms` at low opacity. Blocks over text.

### 9.13 Toast
- Bottom-right stack, width `360`, radius `lg`, surface `bg-3`, border `line-2`, shadow `lg`.
- Icons: success `accent CheckCircle2`, error `danger AlertCircle`, info `info Info`, loading spinner.
- Enter: y `12→0` + opacity, exit reverse. Duration: info `4s`, error stays until dismissed.

### 9.14 App shell
- Sidebar `240px` `bg-1`, footer `border-t line-0`. Nav item: height `32`, `text-sm`, icon `16`; active = `bg-2` + `text-0` + 2px brand marker or `text-brand` icon. Section labels `xs text-2`.
- Topbar: `56px`, breadcrumb left, actions right (create button, theme, avatar).

---

## 10. Copy & empty-state voice

- CTA verbs over nouns: *"Invite member"* not *"Membership"*. *"Report a bug"* not *"Bug report tool"*.
- Empty states explain **why** then **how**: "This project has no bugs yet. Embed the widget to start collecting reports in seconds."
- Never: "Oops!", "Something went wrong", "404!". Use specific, calm copy.

---

## 11. Implementation notes

- Tokens live in `src/app/globals.css` via Tailwind v4 `@theme` and CSS variables; `darkMode` is handled by a `.light` override on `<html>` (no OS-only switching).
- Reusable primitives live in `src/components/ui/*.tsx`, one component per file, typed with `React.forwardRef`.
- Icons: `lucide-react` only. Animation: `framer-motion` only. Never hand-roll CSS animation for UI.
- All interactive components ship with `aria-label`s and full keyboard support.
- `cn()` from `src/lib/utils.ts` for class merging — never template-literal class strings.

---

*Boundaries: this system covers the BugDrop product UI and marketing site. The bug-widget-library is a separate, independently-styled library and is intentionally NOT governed by this file.*