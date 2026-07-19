# PORT-19 — Rough push-in entry from the Projects chapter

**Spike deliverable.** The code (`CaseStudy.tsx`, `CaseStudy.module.css`, and
the PORT-19 additions to `NavCandidateC.tsx` / `NavCandidateC.module.css` under
`src/app/dev/prototypes/nav-candidate-c/`) is throwaway; *these notes* — what
the production transition engine needs from the push-in — are what carries
forward. The task: enter the CatalogIQ case study from the Projects tableau via
the Brand Guide push-in (900–1200ms, `cubic-bezier(0.25, 0.1, 0.25, 1)`, no
overshoot, "entering a project/case study"), and back out again.

- **Route:** `/dev/prototypes/nav-candidate-c` (noindex; run `npm run dev`),
  Projects chapter → "Enter the case study →". Coverage-excluded
  (`src/app/dev/**`), like every prior spike.
- **Verified in-browser:** computed transition on both layers is
  `transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)` with the offset opacity ramp;
  enter/exit/Esc/instant-cut/chapter-nav-cut all behave as below.

## The grammar: two layers, one camera

A push-in cannot be a single-element zoom — one layer scaling up alone reads as
a lightbox. The move that reads as *entering a set* is **two layers agreeing on
one camera direction**:

- **The outgoing layer** (the Projects panel) scales **1 → 1.7** toward the
  anchor-plate region and fades out over the *back* 600ms of the move — the
  camera dollying past the tableau.
- **The incoming layer** (the case-study set) starts at **scale 0.92,
  opacity 0** and resolves **up to 1** as the outgoing layer passes it, fading
  in over the same back 600ms. Starting small and settling up continues the
  same forward motion — the set is *approached*, not presented.
- **One tempo:** a single 1000ms duration and easing for both transforms; the
  opacity ramps are offset with a `transition-delay` (600ms fade, 400ms delay)
  rather than a second easing curve, so the whole move stays mechanical.
- **The pull-back is the exact mirror** and falls out of the same CSS: the
  base ruleset carries the entering-state transition, the `[data-open]` /
  `[data-depth]` ruleset carries the leaving-state one, so opacity resolves in
  the *first* 600ms on the way out. No second choreography to maintain.

Timing lives in local custom properties (`--push-duration/-ease/-fade/
-fade-delay/-scale`) beside the truck/whip ones; promoting all of these to
global motion tokens is Phase-3 work.

## The state model: depth is an axis, not a page

The engine finding with the longest reach: **depth composes with chapter
travel as a second orthogonal axis.** The harness now holds
`(chapterIndex, transit)` × `(caseMounted, caseOpen)`:

- `caseMounted` = the set is in the DOM; `caseOpen` = the settled pushed-in
  state. `mounted && !open` is the pull-back in flight (unmount lands with the
  camera, `PUSH_MS` later). Mount-fresh-per-entry means the set always opens
  at its head — no scroll reset logic.
- Entering: mount at the un-pushed state, flip `open` a double-rAF later so
  the transition actually runs (the intertitle's ease-in pattern). Under an
  instant cut, mount already-settled — no first frame at 0.92.
- The production engine should model moves as `(from, to, move)` where truck,
  whip, and push are vocabulary entries with their own duration/easing —
  branch on *what kind of edge* is being traversed (adjacent chapter / distant
  chapter / depth), exactly as the distance branch already does for truck/whip.

## Interaction rules chosen (and the open questions)

- **Entry is explicit** (progressive disclosure): a button, keyboard-reachable.
  For the spike it is harness-owned chrome below the tableau; **production
  wants the affordance on the CatalogIQ plate itself** (the plate as the
  doorway — tableau accepts an `onEnter` or the plate becomes the control).
  That keeps "the overhead insert opens into the case study" literal.
- **Exit:** "← Back to Projects" + Esc. Both run the full pull-back.
- **Chapter travel while pushed in cuts depth closed instantly**, then runs
  the truck/whip from the tableau. *Open rhythm question for the walkthrough:*
  should it pull back first (stately, but 2s of travel), cut (chosen — cheap,
  and the chapter index stays a reliable 10-second path), or be blocked until
  explicit exit (safest read, most friction)?
- **The set is its own vertical scroll context** — inside, scroll walks the
  case study, same contract as within-chapter scroll.
- Entering mid-truck/whip is possible (the button is clickable during travel);
  harmless here but the engine should serialize moves — one camera, one move
  at a time.

## The origin problem (the real production finding)

`transform-origin` is fixed at `50% 42%` of the *viewport-sized panel box*
(scroll-independent — the transform sits on the scroll container, not the tall
inner column). But the walkthrough capture showed the camera pushing toward
whatever occupies that region: with the panel scrolled to the entry button,
that's the supporting-projects row, **not the CatalogIQ plate**. For a spike
the read survives (the move still dollies); for production:

- **The engine must aim the camera**: measure the anchor plate's on-screen
  rect at entry time (`getBoundingClientRect` against the viewport) and set
  the origin (and possibly a small translate) from it — "push toward the thing
  being entered" is part of the move's meaning, per "tempo matched to meaning".
- If the plate is off-screen when entry triggers, scroll it into frame first
  or fall back to center — undecided; depends on where the production
  affordance lives (on the plate, this mostly solves itself).

## Layering & accessibility contract

- **z-order (bottom→top):** track (chapter panels) → case-study set (`z: 1`) →
  intertitle plate (`z: 2`). Intertitles stay above depth: entering a chapter
  and its plate must never be occluded by a stale set.
- **The track goes `inert` while the set is open** — the covered tableau must
  not stay tabbable/readable. Released the moment the pull-back starts.
  Corollary the engine must own: **anything focused inside an inert subtree
  fails silently** — return focus *after* the re-render that lifts `inert`
  (the harness does it in an unmount effect), never synchronously in the exit
  handler.
- **Focus follows the camera:** into the set's heading (`tabIndex={-1}`) once
  the move settles — immediately on a cut; back to the entry trigger when the
  exit lands. A chapter-nav cut does *not* steal focus (it stays on the nav
  control that caused it).
- The existing aria-live status line announces the depth state ("Case study:
  CatalogIQ, within chapter 3, Projects."); the set's ground is opaque Paper,
  so the chapter wash disappearing is part of the "different room" read.

## Reduced motion

- `prefers-reduced-motion` collapses the push to a **straight cut both ways**
  — same destinations, zero travel, content parity (transition: none on both
  layers; the JS branch also skips the rAF dance and the unmount/focus
  delays).
- The AC's fallback demo is a harness chrome toggle ("Motion: full / instant
  cut") that forces the same CSS branch via `data-reduced` — so the
  walkthrough can compare side by side without OS settings. It applies to
  truck and whip too, like the real setting. OS-on wins over the toggle and
  the label says so. *Worth keeping in the production dev gallery.*

## Acceptance criteria — status

- [x] **Push-in and reverse demonstrated** — enter via button, exit via
  button/Esc, both directions the mirrored two-layer move.
- [x] **Timing/easing within spec; reads as entering a set** — 1000ms,
  `cubic-bezier(0.25, 0.1, 0.25, 1)`, verified computed; the two-layer
  grammar is what earns the "set, not page swap" read. Final judgment is
  Zaid's at the walkthrough.
- [x] **Instant-cut fallback shown** — real `prefers-reduced-motion` support
  plus the preview toggle.
- [x] **Notes for the production transition engine** — this document.

## Implementation cost

- **Low-medium.** One set component + CSS module, ~120 lines of depth wiring
  in the harness, push CSS beside the truck/whip rules. **Zero changes to
  shipped code** (`src/components/**` untouched); the PORT-18 insert is
  imported dev→dev as the set's opening figure. No new dependency.
- **No automated tests** (spike; `src/app/dev/**` coverage-excluded). On
  promotion the depth state machine wants real tests: enter/exit focus
  round-trip, Esc, the chapter-nav cut, and reduced-motion branches are all
  assertable without judging the feel.

## Risks / notes

- **The feel is judged, not measured** — scale 1.7, the 42% origin, and the
  600/400 fade split are felt values; the walkthrough may retune all three.
- **Mid-move legibility:** both layers are readable at the crossover (~500ms).
  It reads as a dissolve-under-motion; if the walkthrough finds it busy, the
  fix is a shorter fade (not a faster move).
- **Mobile is untested** in this spike; the Brand Guide says the vocabulary
  survives with the axis adapted — whether a push-in *feels* right at 360px
  (and what it does to the fixed 68vh stage) is unexamined.
- **The set's content is stub-grade** — real case-study structure is Phase-4;
  the pilot figures inside the imported insert stay flagged
  pending-verification (CONTENT_NOTES rule).
