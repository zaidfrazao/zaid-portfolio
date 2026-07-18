# zaid-portfolio - Brand & UX Guide

Governed by the PRD's design thesis: **grammar, not props** (`docs/PRD.md`). Every rule below exists to make the site read as composed, precise, and charming to someone who has never seen a Wes Anderson film — and never as a film homage to someone who has.

## Brand Personality

### Core Attributes
- **Personality:** Composed · Precise · Deadpan-charming
- **Emotional Response:** Visitors should feel they are in the hands of someone who sweats details — delighted by the staging, reassured by the substance. "This person will build my product carefully and fast."
- **Brand Voice:** Dry, exact, understated. Numbers over adjectives. The site never says it is crafted; it demonstrates it.

### Inspiration
The formal grammar of Wes Anderson's filmmaking — planimetric composition, static symmetric tableaux, compass-point camera moves, chaptering, one disciplined palette, knolled overhead inserts, deadpan restraint — applied to honest portfolio content. Never his films' settings, characters, or artifacts.

**Litmus test (apply to every design decision):** "Would this read as Anderson-esque to someone who has never seen his films (because it's composed, precise, and charming), rather than as a Grand Budapest Hotel homage to someone who has?"

### Hard Rules (non-negotiable)
1. No film diegesis: no hotels, lobbies, concierges, trains, scout camps, character or film references, or themed copy.
2. Resting states are fully static. No ambient motion, parallax drift, shimmer, or floating elements — ever.
3. All motion travels in cardinal directions with mechanical easing. No bounce, overshoot, spring physics, or diagonal drift.
4. One palette. No dark mode, no theme toggle.
5. Symmetry is the default; asymmetry must be a deliberate, meaningful exception.
6. Do not replicate the *Royal Tenenbaums* title-card look (Futura Bold plates as-styled in the film). Our intertitles use our own plate system (below). The typeface is grammar; that specific styling is props.

## Visual Identity

### Color Palette — "the film stock"

Retro saturated bookish: a beloved 1970s hardcover monograph. Aged paper ground, burnt sienna and deep teal inks, mustard as the rare flourish.

#### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Sienna (Primary) | `#A64826` | Primary actions, links, chapter accents, frame lines. AA-verified 4.69:1 on Paper; Paper text on Sienna also 4.69:1 |
| Teal (Secondary) | `#1F5F5B` | Secondary actions, supporting accents, focus rings, intertitle plates. 5.90:1 on Paper |
| Mustard (Accent) | `#D9A62E` | Decorative only — dividers, ornaments, small fills. **Never text on Paper** (1.78:1). Umber text on Mustard passes (7.08:1) |

#### Semantic Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#456F41` | Form success, confirmation (4.66:1 on Paper) |
| Warning | `#8A6A1C` | Caution text if ever needed (darkened mustard family) |
| Error | `#9C3B22` | Validation errors, destructive states (5.48:1 on Paper) |
| Info | `#1F5F5B` | Reuses Teal — no separate info blue; discipline over convention |

#### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Paper (Background) | `#EFE5CF` | Page background — the aged-paper ground of every tableau |
| Plate (Surface) | `#F7F0DE` | Cards ("plates"), elevated panels, form fields |
| Rule (Border) | `#D6C7A4` | Hairline borders, dividers, frame lines (decorative weight) |
| Umber (Text Primary) | `#2B2118` | All body text (12.58:1 on Paper) |
| Sepia (Text Secondary) | `#6A5C47` | Captions, metadata, supporting text (5.19:1 on Paper) |

**Usage rules:**
- Sienna and Teal are inks, not floods: large fields of color are reserved for intertitle plates and deliberate set-piece moments; the default ground is always Paper.
- Mustard appears sparingly — think gold foil on a book spine. If mustard is on more than ~5% of a view, it's too much.
- All four case-study "sets" may each lean on one palette color for identity (e.g. a teal-dominant project plate), but only from these swatches — no per-project new colors.

### Typography — "the title cards"

One geometric sans across the entire site, differentiated by weight, tracking, and case — one voice, many registers.

#### Font Families
- **Display & Body:** **Jost** (variable, SIL OFL, self-hosted) — screen-optimized Futura descendant. Upgrade path: licensed **Futura PT** is a sanctioned drop-in replacement post-launch; no other typeface substitutions.
- **Monospace:** **JetBrains Mono** — strictly functional: code snippets, stat readouts/data tables (e.g. the velocity receipts). Never for headings or prose.

#### Registers & Scale (desktop / mobile, base 16px)
| Register | Size | Weight | Treatment | Usage |
|----------|------|--------|-----------|-------|
| Intertitle kicker | 12px | 500 | ALL CAPS, tracking 0.35em | "CHAPTER TWO" line on chapter cards |
| Intertitle title | 40/28px | 600 | ALL CAPS, tracking 0.12em, centered | Chapter names on intertitle plates |
| H1 | 44/32px | 600 | Sentence case, tracking −0.01em | Page/chapter titles in content |
| H2 | 28/24px | 600 | Sentence case | Section headers |
| H3 | 20/18px | 500 | Sentence case | Subsections, card titles |
| Body | 17/16px | 400 | Line-height 1.65, max 68ch | Prose — bio, case studies |
| Label | 11px | 500 | ALL CAPS, tracking 0.22em | Buttons, nav, figure labels, chips |
| Caption | 13px | 400 | Sepia color | Figure captions, metadata |

- Centered text is the default for staged elements (intertitles, tableau headings, figure labels); left-aligned for reading prose. Never justify.
- Figure captions follow the deadpan convention: `Fig. 3 — The repricing engine. 200,000 SKUs. Daily.`

### Spacing & Layout

- **Base unit:** 8px
- **Density:** Spacious — tableaux breathe; generous symmetric margins are part of the composition
- **Border radius:** 0 (sharp). Frames, plates, and buttons are rectangular like film frames and book plates. Exception: perfect circles for the rare medallion/ornament.
- **Max content width:** 68ch for prose; tableaux may use full stage width but compose symmetrically about the vertical centerline
- **Frame lines:** key tableaux carry an inset hairline frame (1.5px, Sienna or Rule) — the "proscenium." Use deliberately, not on every container.
- **Grid discipline:** odd column counts and mirrored layouts preferred (1-, 3-, 5-column); the vertical centerline of the viewport is the compositional axis.
- **Knolling:** overhead insert layouts arrange items on a strict grid with equal gutters, every item labeled.

## Component Patterns

### Buttons
- **Primary:** Sienna fill, Paper label (Label register). Rectangular, generous horizontal padding. One primary action per tableau.
- **Secondary:** 1.5px Teal outline, Teal label, transparent fill.
- **Tertiary/Ghost:** Umber label with underline offset; for inline/low-emphasis actions.
- **Destructive:** Error fill — unlikely to appear; included for completeness.
- Hover states are restrained: slight darkening + underline, 120–180ms. No lift, no scale, no shadow growth.

### Forms (contact only)
- **Input style:** Plate fill, 1.5px Rule border (Teal when focused), sharp corners, roomy padding
- **Validation approach:** Inline on blur; summary on submit
- **Label position:** Above, Label register (small caps, letterspaced)

### Cards & Containers ("plates")
- **Elevation:** Flat. **No drop shadows anywhere** — planimetric scenes are built from flat layers, not simulated depth. Layering is expressed by color (Plate on Paper) and hairline rules.
- **Borders:** 1px Rule hairline, or the 1.5px frame-line treatment for featured plates

### Navigation
- **Primary navigation:** The chapter index — persistent, always visible, all four chapters (About · Experience · Projects · Contact), Label register, current chapter marked in Sienna. Doubles as the 10-second-path guarantee.
- **Secondary navigation:** In-chapter controls (project switcher, prev/next) styled as film-adjacent indexing (Roman numerals, "Fig." numbering) without film references.
- Contact action and resume PDF reachable from every chapter in ≤ 2 interactions (PRD Feature 4).

## Interaction Patterns

### Animation & Motion — "the camera"
- **Overall feel:** Mechanical and smooth — camera on rails. Tempo matched to meaning; the move's speed is part of its vocabulary.
- **Vocabulary & timing:**

| Move | Duration | Easing | Meaning |
|------|----------|--------|---------|
| Whip pan | 300–400ms | `cubic-bezier(0.7, 0, 0.3, 1)` + brief blur frame | Quick jumps between distant sections |
| Lateral truck | 700–900ms | `cubic-bezier(0.45, 0.05, 0.55, 0.95)` | Adjacent chapter transitions |
| Push-in | 900–1200ms | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Entering a project/case study |
| Tilt | 600–800ms | as truck | Vertical reveals (primary axis on mobile) |
| Micro UI (hover/focus) | 120–180ms | `ease-out` | Buttons, links, controls |

- Easing curves must never overshoot (no spring/bounce libraries' defaults).
- Movement is punctuation, not wallpaper: between moves, everything is perfectly still.
- Mobile keeps the same vocabulary with the axis adapted (tilts and vertical trucks dominate).

### Feedback Patterns
- **Loading states:** Static placeholder frames (empty plates with rules). **No skeleton shimmer** — shimmer is ambient motion.
- **Success feedback:** Inline, deadpan (e.g. "Sent. Expect a reply within a day.")
- **Error handling:** Inline beneath the field, Error color, matter-of-fact phrasing with the fix stated plainly

### Progressive Disclosure
- **Approach:** Chaptered — the chapter index always shows the whole map; depth (case-study detail) revealed by explicit entry (push-in), never hidden behind novel mechanics
- **Patterns used:** Chapters/intertitles, figure-numbered sections; no accordions or drawers in v1

## Accessibility

### Standards
- **Target:** WCAG 2.1 AA
- **Color contrast:** All combinations verified ≥ 4.5:1 for text (values documented in the palette tables). Mustard is decorative-only by rule.

### Requirements
- Full keyboard navigation of every chapter and case study; visible focus indicator (2px Teal outline, 2px offset) on all interactive elements
- Semantic HTML document structure beneath the cinematic layer — screen readers get a clean, honest portfolio
- `prefers-reduced-motion`: **every** camera move becomes a straight cut (instant transition, blur frames removed); content parity is total
- Touch, mouse, and keyboard input all supported; no interaction relies on scroll alone

## Tone of Voice

### Writing Style
- **Formality:** Dry-precise; professional but never stiff
- **Perspective:** **Hybrid.** The deadpan third-person narrator handles *staging* — intertitles, figure captions, labels. Zaid speaks first-person in *substance* — bio prose, case-study narrative, contact. The narrator stages the scenes; the human sells the work.

### Content Guidelines
- **Do:** understate; let concrete numbers and shipped systems carry claims; use precise nouns and dates; keep sentences short and declarative; caption everything like museum plates
- **Don't:** exclaim (no exclamation marks in UI copy); use hype adjectives ("blazing," "passionate," "cutting-edge"); use film-themed copy ("now showing," "ticket," "concierge"); lead with the ~100× multiplier (receipts over multipliers — specific timelines beat big numbers); apologize theatrically in errors

### UI Copy Examples
| Context | Good | Avoid |
|---------|------|-------|
| Intertitle | "Chapter One, in which the builder is introduced." | "🎬 Now showing: About Me!" |
| Figure caption | "Fig. 3 — The repricing engine. 200,000 SKUs. Daily." | "My awesome repricing tool!" |
| Bio prose (first person) | "I built CatalogIQ because I'd lived this exact bottleneck for years." | "Z. Frazao is a passionate, cutting-edge developer." |
| Empty state | "Nothing here yet. The next chapter is being written." | "Oops! Looks like this page is empty 😅" |
| Error message | "That email address is missing an @. One is required." | "Whoops! Something went wrong!" |
| Success message | "Sent. Expect a reply within a day." | "🎉 Woohoo! Message sent successfully!!!" |

## Document History
- **Created:** 2026-07-18
- **Last Updated:** 2026-07-18
