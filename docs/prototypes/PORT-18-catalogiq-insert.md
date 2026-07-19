# PORT-18 — Rough CatalogIQ knolled flat-lay insert

**Spike deliverable.** The code under
`src/app/dev/components/catalogiq-insert/` (`CatalogIQInsert.tsx`,
`insert-art.tsx`, the CSS modules and the gallery `page.tsx`) is throwaway;
*these notes* — what the production insert-layout system needs — are what carries
forward. The task is a rough overhead "insert" for CatalogIQ: a knolled flat-lay
of the project's artifacts on a strict grid with equal gutters, every item
labeled — placeholder-grade SVG, real arrangement discipline (PRD Feature 3;
Brand Guide → Knolling; grammar #7 — overhead inserts).

- **Route:** `/dev/components/catalogiq-insert` (noindex; run `npm run dev`).
  Coverage-excluded (`src/app/dev/**`), like the nav candidates and the PORT-17
  intertitle spike.
- **Two framings shown:** the insert standalone, and dropped onto a Plate ground
  the way a Projects-chapter tableau would host it.

## The headline finding: the grid alone does not produce the overhead read

The first pass arranged uniform UI tiles (browser-window glyphs) in bands on a
strict equal-gutter grid, every item labeled — the knolling *mechanics* — and it
**failed the walkthrough test immediately**: Zaid read it as "a standard
summary," not a flat-lay. Diagnosis:

1. **Screens drawn face-on are elevation views.** Window chrome points at the
   camera; nothing reads as *lying on a surface*.
2. **Uniform repeated rectangles read as a table.** Real knolling is
   heterogeneous objects — different silhouettes and sizes — squared to a grid.
   Identical tiles in a row are a data row.
3. **It depicted information, not objects.** "Pipeline / Stack / Numbers" is a
   summary's information architecture, not a tray of artifacts.

**The rule that carries forward: the overhead read comes from object
silhouettes on a surface; the grid and labels only discipline it.** Layout
mechanics cannot rescue art drawn from the wrong camera.

## The second pass: objects on a tray

The rebuilt insert depicts CatalogIQ's artifacts as *things seen from directly
above*, on one 3×3 master grid (odd count, symmetric about the centreline):

| | | |
|---|---|---|
| supplier data card | generated listing card | loadsheet stack |
| one pencil | the stack, as chips | one ruler |
| tag: ≈116k LOC | tag: 428 commits | tag: 15,000+ listings † |

- **Row 1 — the paperwork tells the product story as before/after objects:**
  the ragged supplier card with an empty photo box (the lived pain), the
  finished listing with photo/copy/price (the output), and the Takealot
  loadsheet as a spreadsheet sheet on a slight stack (the export). No UI chrome
  anywhere.
- **Row 2 — the arranger's tools** flank the stack chips: a pencil (the lone
  Mustard flourish) and a ruler, deadpan-labeled "One pencil" / "One ruler" —
  the knolling wink that someone squared all this up.
- **Row 3 — the numbers as punched specimen tags** (a square punched hole —
  circles stay reserved for the medallion), not KPI boxes.
- **Surface layering by fill, not shadow:** Paper-fill objects on the
  Plate-fill tray, hairline edges, the frame-line as the tray edge; the
  loadsheet "stack" is an offset second sheet, flat.
- Every item labeled in the Label register; the whole insert is a `<figure>`
  with a Roman `Fig.` caption (the Fig-caption convention,
  `src/content/copy.ts → copy.figure`).

## Content — draft-real, with the unverified figure flagged

From `docs/CONTENT_NOTES.md → CatalogIQ`: the supplier→listing→loadsheet
paperwork is the real pipeline told as objects; stack chips are the real stack
(Fastify · TypeScript · Postgres · BullMQ · Multi-model AI); `≈116k` LOC and
`428` commits are **repo-verified**; `15,000+` listings is the **second-hand
pilot figure** — carried but marked `†` with a "pending verification before
publish" footnote. The production insert must keep a first-class way to mark a
stat unverified; numbers live in DOM text (tags/caption), never inside the SVG.

## Acceptance criteria — status

- [x] **Flat-lay grid, equal gutters, items axis-aligned, all labeled** — one
  3×3 master grid, one gutter token, a Label per specimen, a Fig-caption on the
  whole.
- [x] **Reads top-down/overhead, not a generic card grid** — the first pass
  failed this and was rebuilt; the second pass earns the read through top-down
  object silhouettes (see the finding above). Final judgment is Zaid's at the
  walkthrough.
- [x] **Enough CatalogIQ-real artifacts to judge** — the real before/after
  paperwork story, the real stack, three real numbers (two verified, one
  flagged).
- [x] **Notes on what the production insert system needs** — this document.

## What the production insert-layout system needs (the carry-forward)

1. **Object glyphs before layout system (headline, from the failed first
   pass).** Budget Phase-4 effort accordingly: the artifact *drawings* — each
   project's objects, drawn top-down — are what sell the insert; the grid is
   the cheap part. A taxonomy of top-down object forms (paper sheets/cards,
   stacks, tools, tags, swatches) beats a taxonomy of content types (screens,
   stats) — same information, different camera.
2. **A master grid.** One odd-columned grid per insert with per-object spans,
   symmetric about the centreline — not hand-placed bands. The 3×3 here is the
   smallest version of it.
3. **A specimen primitive.** Every item is `object + museum tag`; wants to be
   one small component so an insert is authored as data (a list of specimens
   with spans), not markup.
4. **Real screenshots need an "objectifying" treatment.** When actual CatalogIQ
   captures replace the paper-sheet glyphs, they must be staged as *printed
   specimens* (a sheet edge, a slight stack, consistent trim) or the elevation
   problem returns. Consent/redaction per CONTENT_NOTES still applies.
5. **Mobile: stack the tray, keep the objects.** Below 768px the insert is a
   single centred column — a tall tray of labeled objects — because the fixed
   registers (11px labels, mono stats) can't survive a 3-up squeeze; with
   object silhouettes the stacked tray still reads as a flat-lay strip, which
   the v1 uniform tiles did not. Open Phase-4 alternative: render the still at
   fixed proportion and scale it (art-only, labels outside).
6. **Accessibility model.** Glyphs are `aria-hidden`; meaning is carried by
   visible Labels + one `figcaption`. Production should consider a `<dl>` so
   the object→tag pairing is programmatic, and decide whether "One pencil"-type
   ornament labels are noise to a screen reader.
7. **Provisional-stat state.** The `†` + footnote is ad-hoc; make it a
   first-class state so nothing second-hand ships unmarked.

## Implementation cost

- **Low.** Five top-down object glyphs, one data-driven 3×3 grid component, two
  token-only CSS modules, one gallery page. **Zero changes to shipped code**
  (the `ProjectsTableau`/`InsertStub` still uses its old single-SVG stub), no
  new dependency, no animation.
- **No automated tests** (spike; `src/app/dev/**` is coverage-excluded —
  consistent with the nav candidates and the intertitle spike). On promotion in
  Phase 3/4 it gains a smoke test for the 70% function-coverage gate plus
  Playwright visual baselines at 360/1440.

## Risks / notes

- **The read is judged, not measured** — "does it read overhead" was falsified
  once already by a human look; the second pass needs the same walkthrough
  judgment before the pattern is trusted for Phase 4.
- **Placeholder art flatters the concept** — crude glyphs are uniform in style;
  real screenshots are visually noisy and will strain the tray composition
  (point 4 above).
- **Pilot numbers stay provisional** — `15,000+` and the other pilot figures
  are second-hand via Zaid's dad and must not publish unmarked until verified
  (CONTENT_NOTES).
