# PORT-18 — Rough CatalogIQ knolled flat-lay insert

**Spike deliverable.** The code under
`src/app/dev/components/catalogiq-insert/` (`CatalogIQInsert.tsx`,
`insert-art.tsx`, the CSS modules and the gallery `page.tsx`) is throwaway;
*these notes* — what the production insert-layout system needs — are what carries
forward. The task is a rough overhead "insert" for CatalogIQ: a knolled flat-lay
of the project's artifacts (screens, stack chips, a diagram fragment, numbers) on
a strict grid with equal gutters, every item labeled — placeholder-grade SVG,
real arrangement discipline (PRD Feature 3; Brand Guide → Knolling; grammar #7 —
overhead inserts).

- **Route:** `/dev/components/catalogiq-insert` (noindex; run `npm run dev`).
  Coverage-excluded (`src/app/dev/**`), like the nav candidates and the PORT-17
  intertitle spike.
- **Two framings shown:** the insert standalone, and dropped onto a Plate ground
  the way a Projects-chapter tableau would host it.

## The one real decision: a DOM knolling grid, not one big SVG

The precedent overhead insert — `InsertStub` in
`src/components/tableaux/art.tsx`, still used by the shipped `ProjectsTableau` —
fakes the flat-lay as a **single SVG** of anonymous rects. That is fine as a
thumbnail but it cannot answer the question this spike exists to de-risk: the
*insert-layout system*. So the flat-lay here is a **real DOM grid** —
`display: grid`, token gutters, one `<Label>` per specimen — with only the
individual artifact glyphs as placeholder SVG. That makes the grid, the gutters,
and the labeling model inspectable and directly promotable, instead of frozen
inside a viewBox.

**Left intact:** the shipped `ProjectsTableau`/`InsertStub` is untouched. This
spike lives entirely in the dev layer; wiring a real insert into the Projects
chapter is Phase-3/4 work.

## What makes it read overhead (not a card grid)

Knolling is objects laid on a surface and shot from directly above. The read
comes from a few disciplines, all cheap:

- **One shared gutter rhythm.** Every band (screens, diagram, stack, numbers)
  and the gaps *between* bands use the same `--space-2` gutter, so the whole
  thing reads as one grid, not stacked cards.
- **Uniform specimens.** The five pipeline screens are identical glyphs told
  apart only by their tags (`01 · Ingest` … `05 · Export`). Uniformity reads as
  a flat-lay; per-tile decoration would read as cards.
- **A tray edge.** The inset hairline frame (`Plate border="frame"`, the
  "proscenium") is the surface the objects sit on — flat layering by frame, not
  shadow (Hard Rule 1: no shadows anywhere).
- **Museum tags.** Each item carries a Label-register tag beneath it; the whole
  insert carries a Roman `Fig.` caption (the Fig-caption convention,
  `src/content/copy.ts → copy.figure`).

## Content — draft-real, with the unverified figure flagged

From `docs/CONTENT_NOTES.md → CatalogIQ`:

- **Pipeline (5 screens):** Ingest → Enrich → Match → QC → Export.
- **Stack chips:** Fastify · TypeScript · Postgres · BullMQ · Multi-model AI.
- **Numbers:** `≈116k` LOC and `428` commits are **repo-verified** (safe to
  show); `15,000+` listings is the **second-hand pilot figure** — carried but
  marked `†` with a "pending verification before publish" footnote, honoring the
  verify-before-publish rule. The production insert must keep a first-class way
  to mark a stat unverified; numbers live in the tags/caption, never inside the
  SVG.

## Acceptance criteria — status

- [x] **Flat-lay grid, equal gutters, items axis-aligned, all labeled** — one
  shared `--space-2` gutter across every band; each specimen has a Label, the
  insert a Fig-caption.
- [x] **Reads top-down/overhead, not a generic card grid** — uniform specimens +
  shared gutter + tray frame + specimen tags (see the 1440px capture). The read
  is strongest on desktop; see the mobile caveat below.
- [x] **Enough CatalogIQ-real artifacts to judge** — the real pipeline, real
  stack, and three real numbers (two verified, one flagged).
- [x] **Notes on what the production insert system needs** — this document.

## What the production insert-layout system needs (the carry-forward)

1. **A master grid, not hand-placed bands (headline).** The rough version is
   four bands that merely *share* a gutter token. A production system wants a
   single named/columned master grid so items with different footprints
   (a wide screen, a square stat, a full-width diagram) align to one rhythm and
   compose symmetrically about the centreline without per-band CSS. This is the
   real 5-point Phase-4 task; the spike deliberately stops short of it.
2. **A specimen primitive.** Every item is the same shape — `art + tag`. That
   wants to be one small component (an `<InsertItem art label span?>`), so an
   insert is authored as data (a list of specimens with grid spans), not markup.
3. **An artifact taxonomy.** Screens, stat tiles, chip clusters, and diagram
   fragments are the recurring kinds; each needs a token-only placeholder glyph
   and a real-asset slot for later. Screens especially need a real-screenshot
   path (redaction/consent aware — see CONTENT_NOTES on client-work permission).
4. **Responsive collapse is the weak point.** A knolled grid is inherently
   overhead; on mobile it collapses to a vertical stack of labeled specimens and
   loses much of the top-down read (see the 360px capture). Options to decide in
   Phase 4: keep 2-up specimen columns on mobile rather than 1-up; or accept a
   "contact sheet" stack on small screens and reserve the true flat-lay for
   ≥768px. Either way the mobile story needs a deliberate call, not the default
   1fr collapse used here.
5. **Accessibility of a labeled flat-lay.** Here every glyph is `aria-hidden` and
   the meaning is carried by visible `<Label>`s + one `<figcaption>`. For
   production, decide the semantic container (a `<figure>` per insert is used
   here) and whether the specimen tags should be a real description list
   (`<dl>`/`<dt>`) so the artifact→label pairing is programmatic, not just
   visual.
6. **Unverified-figure treatment as a system feature.** The `†` + footnote is
   ad-hoc. Productionise it as a first-class "provisional stat" state so nothing
   second-hand can ship unmarked.

## Implementation cost

- **Low.** Two placeholder SVG glyphs, one data-driven grid component, one
  token-only CSS module, one gallery page. **Zero changes to shipped code** and
  no new dependency. No animation.
- **No automated tests** (spike; everything is under `src/app/dev/**`, which is
  coverage-excluded — consistent with the nav candidates and the intertitle
  spike). When the insert is promoted into `src/components/**` in Phase 3/4 it
  gains a smoke test for the 70% function-coverage gate, plus a Playwright visual
  baseline at 360/1440.

## Risks / notes

- **Mobile read** — the biggest open question (point 4 above); the rough 1fr
  collapse is a placeholder, not a decision.
- **Screens are anonymous** — the glyphs are uniform rectangles; real CatalogIQ
  screenshots (with any needed redaction) will change the composition's weight
  and want a re-judge.
- **Pilot numbers stay provisional** — `15,000+` and the other pilot figures are
  second-hand via Zaid's dad and must not publish unmarked until verified
  (CONTENT_NOTES).
