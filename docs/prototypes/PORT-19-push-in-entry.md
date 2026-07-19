# PORT-19 — Rough push-in entry from the Projects chapter

**Spike deliverable.** The code (`CaseStudy.tsx`, `CaseStudy.module.css`, and
the PORT-19 additions to `NavCandidateC.tsx` under
`src/app/dev/prototypes/nav-candidate-c/`) is throwaway; *these notes* — what
the walkthrough decided about the push-in and what the production transition
engine needs — are what carries forward. The task as written: enter the
CatalogIQ case study from the Projects tableau via the Brand Guide push-in
(900–1200ms, `cubic-bezier(0.25, 0.1, 0.25, 1)`), and back out again.

**The spike's outcome is a rejection of its own premise** — that is the
finding. Three passes were built and judged (2026-07-19):

- **v1 — zoom-crossfade:** the tableau scaled up and faded while the set
  scaled up beneath it. *Rejected:* reads as a transition effect (slideware),
  not camera grammar. A push-in emphasizes something in a scene; it is not a
  scene change.
- **v2 — push-then-cut:** the tableau dollied toward the plate (scale only,
  nothing fading), then a straight cut to the set. *Rejected:* "zoom on
  nothing" — zooming for its own sake. A dolly on flat DOM has no depth cues
  (no parallax, no focus pull, no revealed detail), so even a well-aimed,
  well-timed scale reads as page magnification, not camera travel.
- **v3 — straight cut (shipped in the spike):** entry and exit are cuts; the
  film grammar lives in *what the cut lands on* (below).

- **Route:** `/dev/prototypes/nav-candidate-c` (noindex; run `npm run dev`),
  Projects chapter → "Enter the case study →". Coverage-excluded
  (`src/app/dev/**`), like every prior spike.

## The headline finding: zoom is not a transition — at all

Two independent reasons, one per rejected pass:

1. **Grammar:** a push-in is an emphasis move *within* a scene. Scene changes
   are cuts. Gluing the two together ("push as the doorway") still subordinates
   the zoom to a transition, and it dies there.
2. **Medium:** a browser "dolly" is a transform on a flat surface. Real
   camera moves read because space has depth — parallax, focus, occlusion. A
   scaled DOM has none, so the eye reports *magnification*. Zooming toward
   text especially is zooming toward nothing: no detail is revealed that
   wasn't already legible.

**The zoom idea is reserved for a future non-transition use.** Where it could
be honest: pushing into a *photograph or dense artifact* that actually holds
detail at higher scale — e.g. the insert's interactive specimens (PORT-18
production direction: clickable sample photos opening a gallery). Zooming into
a photo reveals real detail the way a camera move does; zooming into a layout
does not. That exploration is its own task, not this one.

**Brand Guide impact:** the motion table row "Push-in · 900–1200ms · Entering
a project/case study" is now contradicted by the walkthrough. The vocabulary
needs a `/fra:update-brand` pass: depth entry becomes a cut; push-in either
leaves the table or is re-scoped to in-artifact emphasis.

## What entry actually is: a match cut on the object

The film grammar that *survived* the walkthrough is in the destination, not
the travel. Entry is a straight cut, and the set opens **on the insert** — the
tableau's plate holds the insert stub, the cut lands on the real knolled
flat-lay filling the frame: a cut to close-up on the same object. Exit is the
mirror cut back to the tableau. The incoming layer never animates; the
destination just *is* — which is also what keeps it a place, not a presented
surface.

Practical corollary found in-browser: the set's focus target (the heading)
sits below the insert, and programmatic focus **must use
`focus({ preventScroll: true })`** or the default scroll-into-view drags the
set past the match-cut object. The engine owns this rule: focus never re-aims
a landed frame.

## The state model: depth is an axis, not a page

Depth composes with chapter travel as a second orthogonal axis. With both
directions cuts, it collapses to `depth: "tableau" | "case"` — no in-flight
state, no timers. The general engine lesson stands from the v2 build:

- Model moves as `(from, to, move)` with the vocabulary (truck, whip, cut) as
  data — branch on *what kind of edge* is traversed, as the distance branch
  already does for truck/whip.
- v2's push-then-cut showed a move can be a *sequence* (two phases, one
  intention). If a multi-phase move ever earns its place, the engine wants a
  small timeline, not more CSS transition properties.
- Mount-fresh-per-entry means the set always opens at its head — on the
  insert — with no scroll-reset logic.

## Interaction rules chosen (and the open questions)

- **Entry is explicit** (progressive disclosure): a button,
  keyboard-reachable. For the spike it is harness-owned chrome below the
  tableau; **production wants the affordance on the CatalogIQ plate itself**
  (the plate as the doorway) — which also makes the match cut literal: you
  click the insert stub, you land on the insert.
- **Exit:** "← Back to Projects" + Esc, the mirror cut.
- **Chapter travel while deep cuts depth closed first**, then runs the
  truck/whip. *Open rhythm question:* cut (chosen — the chapter index stays a
  reliable 10-second path) vs. block until explicit exit.
- **The set is its own vertical scroll context** — inside, scroll walks the
  case study.

## Layering & accessibility contract

- **z-order (bottom→top):** track (chapter panels) → case-study set (`z: 1`)
  → intertitle plate (`z: 2`). Intertitles stay above depth.
- **The track goes `inert` while `depth === "case"`** — the covered tableau
  must not stay tabbable/readable. Released at the exit cut.
- **Focus follows the cut:** into the set's heading (`tabIndex={-1}`,
  `preventScroll`) on entry; back to the entry trigger on explicit exit —
  *after* the re-render that lifts `inert` (focusing inside a still-inert
  subtree fails silently). A chapter-nav cut does not steal focus.
- The aria-live status line announces the depth state ("Case study:
  CatalogIQ, within chapter 3, Projects."); the set's ground is opaque Paper —
  the chapter wash disappearing is part of the "different room" read.

## Reduced motion

Depth entry/exit is already a cut, so it is identical under
`prefers-reduced-motion` — the fallback and the design converged, which is a
point in the cut's favor. The harness chrome toggle ("Motion: full / instant
cut") remains for previewing the truck/whip cuts side by side without OS
settings; OS wins over the toggle and the label says so. *Worth keeping in
the production dev gallery.*

## Acceptance criteria — status

- [x] **Push-in and reverse demonstrated** — built twice (v1 crossfade, v2
  push-then-cut), judged, and rejected; the spike's demonstrations are what
  produced the verdict.
- [x] **Timing/easing within spec; reads as entering a set** — v1/v2 ran the
  spec'd 1000ms `cubic-bezier(0.25, 0.1, 0.25, 1)` (verified computed) and
  still failed the *reads-as* half. The shipped v3 earns the read with a
  match cut on the insert instead of travel.
- [x] **Instant-cut fallback shown** — the design converged with the
  fallback: entry is a cut for everyone; the toggle still previews truck/whip
  cuts.
- [x] **Notes for the production transition engine** — this document.

## Implementation cost

- **Low, and it shrank with each verdict.** Final state: one non-animating
  set component + CSS, ~60 lines of depth wiring, zero transition CSS for
  depth. **Zero changes to shipped code** (`src/components/**` untouched);
  the PORT-18 insert is imported dev→dev as the match-cut object. Each
  rejected pass was *more* code than its replacement — the corrected grammar
  kept simplifying the build.
- **No automated tests** (spike; coverage-excluded). On promotion the depth
  machine wants real tests: enter/exit cuts, focus round-trip (incl.
  preventScroll), chapter-nav cut, inert release — all assertable without
  judging feel.

## Risks / notes

- **The bare cut is undressed.** v3 is a hard cut with no staging. If the
  walkthrough finds it too abrupt, the candidate dressing is the intertitle
  treatment (a brief held plate, like chapter entries) — *not* motion.
- **The zoom's future home is unproven.** "Reserved for non-transition use"
  is a hypothesis; pushing into a real photograph (insert specimen → gallery)
  is the first candidate to test, once real CatalogIQ imagery exists
  (PORT-18 production direction).
- **Mobile is untested**; the cut itself is axis-free so should survive, but
  the 68vh stage and the set's density at 360px are unexamined.
- **The set's content is stub-grade** — real case-study structure is Phase-4;
  the pilot figures inside the imported insert stay flagged
  pending-verification (CONTENT_NOTES rule).
- **WSL2 dev-server caveat** (tooling, not product): file-watcher misses mean
  a running `next dev` can serve stale code — restart the dev server before
  judging motion changes in a walkthrough.
