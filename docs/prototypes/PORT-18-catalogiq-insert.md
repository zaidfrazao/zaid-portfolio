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

## The second finding: equal cells read as a table — bento, not a lattice

The first rebuild placed the objects on a uniform 3×3 (every cell a similar
footprint) and Zaid flagged it as still too homogeneous. Real knolling packs
*mixed* footprints — a big sheet, a small tag, a long rail — onto one gutter
rhythm. And a second piece of walkthrough feedback: the pencil/ruler ornaments
borrowed from knolling culture were **props, not artifacts** — "grammar, not
props" applies *inside* the insert too. Every object on the tray must be
something the project actually produces.

## The current pass: a bento of honest artifacts

One 6-column master grid (named areas), mixed footprints, roughly mirrored
about the centreline:

```
supplier (2c)      │ listing (2c,     │ loadsheet (2c)
tag LOC │ tag 428  │  2 rows, hero)   │ photo │ tag 15k†
───────────── the stack, swatch rail (6c) ─────────────
```

- **The paperwork tells the product story as before/after objects:** the ragged
  supplier card with an empty photo box (the lived pain), the finished listing
  as a *portrait* card — the bento hero (the output), and the Takealot
  loadsheet as a spreadsheet sheet on a slight stack (the export). No UI chrome
  anywhere.
- **One AI-generated product photo, printed as a specimen** — a print with a
  margin, deadpan-labeled "One product photo." It replaces the pencil/ruler:
  image generation is literally the product, and the product in the photo is
  now the lone Mustard flourish.
- **The numbers as punched specimen tags** (a square punched hole — circles
  stay reserved for the medallion), not KPI boxes; **the stack as a swatch
  rail** underlining the tray.
- **Surface layering by fill, not shadow:** Paper-fill objects on the
  Plate-fill tray, hairline edges, the frame-line as the tray edge; the
  loadsheet "stack" is an offset second sheet, flat.
- Every item labeled in the Label register; the whole insert is a `<figure>`
  with a Roman `Fig.` caption (the Fig-caption convention,
  `src/content/copy.ts → copy.figure`).
- **Gallery framings:** "standalone" is the insert on the Paper page ground;
  "on a plate ground" wraps it in a Plate the way a Projects-chapter card
  would host it — it exists to judge the fill-on-fill layering, since the site
  layers by color, not shadow.

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

## The production direction (Zaid, at the walkthrough): real artifacts, real size, interactive

The end-state for the CatalogIQ insert, agreed 2026-07-19:

- **Real content, generated by the product.** Zaid can run supplier data
  through CatalogIQ and generate the actual artifacts — product images, copy,
  loadsheets — and the flat-lay shows *those*, not recreations. The portfolio
  piece becomes a live specimen board of the product's output: the strongest
  possible proof. Using demo/owned products for generation sidesteps the pilot
  client's consent question entirely (CONTENT_NOTES); pilot *figures* still
  need verification regardless.
- **Real-world object sizes on desktop.** Objects lie on the tray at true
  relative scale — the loadsheet at A4 proportions, product photos at print
  size — which is what makes the tray read as photographed physical objects.
  Desktop-only; mobile keeps the stacked-tray treatment.
- **Interactive specimens.** Sample photos on the tray are clickable and open
  the full image gallery (and by extension: the loadsheet could open the real
  sheet, copy could expand). Static at rest per Hard Rule 2 — interaction is
  navigation into detail, not ambient motion. This is the "overhead insert
  opens into the case study" pattern (PRD Feature 3) made literal.
- **Supporting elements stay, staged more interestingly.** The stack, the
  numbers, and similar meta-content still belong on the tray, but as *objects*,
  not rows — e.g. the stack as a fanned deck of printed swatch cards rather
  than a straight chip rail, the numbers as a printed till-slip/receipt strip
  (honest for ecommerce, and deadpan) rather than three identical tags. Rule of
  thumb: if an element is laid out the way a dashboard would lay it out, restage
  it as printed matter someone placed on the tray.

## What the production insert-layout system needs (the carry-forward)

1. **Object glyphs/assets before layout system (headline, from the failed
   first pass).** The artifact *objects* — each project's output, staged
   top-down — are what sell the insert; the grid is the cheap part. A taxonomy
   of top-down object forms (paper sheets/cards, stacks, prints, tags,
   swatches) beats a taxonomy of content types (screens, stats) — same
   information, different camera.
2. **Honest artifacts only — "grammar, not props" applies inside the insert.**
   The pencil/ruler knolling ornaments were cut at the walkthrough: every
   object on the tray must be something the project actually produces. The
   deadpan register lives in the labels ("One product photo"), not in staged
   stationery.
3. **A bento master grid (prototyped here).** One 6-column grid with named
   areas and per-object spans, mixed footprints on one gutter rhythm, roughly
   mirrored about the centreline. Equal cells read as a table — the uniform
   3×3 was flagged as still too homogeneous. Production wants the same grid
   with real-size-derived spans (see direction above).
4. **A specimen primitive.** Every item is `object + museum tag`; wants to be
   one small component so an insert is authored as data (a list of specimens
   with spans), not markup. Production adds an interactive variant (a button
   specimen that opens a gallery/detail).
5. **Real captures need an "objectifying" treatment.** Real photos/sheets must
   be staged as *printed specimens* (a print margin, a sheet edge, a slight
   stack, consistent trim) or the elevation problem returns.
6. **Mobile: stack the tray, keep the objects.** Below 768px the insert is a
   single centred column — a tall tray of labeled objects — because the fixed
   registers (11px labels, mono stats) can't survive narrow columns; with
   object silhouettes the stacked tray still reads as a flat-lay strip, which
   the v1 uniform tiles did not. Real-world sizing is desktop-only.
7. **Accessibility model.** Glyphs are `aria-hidden`; meaning is carried by
   visible Labels + one `figcaption`. Production should consider a `<dl>` so
   the object→tag pairing is programmatic; interactive specimens become real
   buttons with full labels ("View the generated gallery").
8. **Provisional-stat state.** The `†` + footnote is ad-hoc; make it a
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
