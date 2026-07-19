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
- **Verified in-browser:** computed transition
  `transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)`; nothing fades during the
  push; the cut lands on the insert; enter/exit/Esc/instant-cut/chapter-nav
  behave as below.

## The headline finding: zoom is not a transition

The first pass built the move as a **zoom-crossfade**: the Projects panel
scaled up and faded out while the case-study set scaled up from 0.92 and faded
in — two layers, one camera, dissolving into each other mid-zoom. Mechanically
clean, and **rejected at the walkthrough (2026-07-19)**: Zaid read it as a
transition *effect*, not camera grammar. The diagnosis: **a push-in is an
emphasis move.** The camera is already in a scene and dollies toward a subject
to say "look at this." It is used on entry *of* a scene to emphasise
something — it is not the scene change itself. Scaling one scene into another
reads as a zoom transition (a slideware device), no matter how disciplined the
easing.

**The rule that carries forward: the zoom emphasizes; the cut transitions.**
Film grammar separates the two — dolly toward the doorway, *cut* to the next
room — and the recomposed move does the same:

- **The push (in-scene emphasis):** the Projects panel dollies toward the
  anchor-plate region — `scale 1 → 1.7` over the full 1000ms, **nothing
  fades**, no other layer visible. The scene stays itself; the camera simply
  commits to the plate.
- **The cut (the scene change):** when the push lands, a straight cut — the
  case-study set mounts over the held frame, already settled (opaque, scale 1,
  no transition of its own). The set opens **on the insert**, so the cut is a
  *match cut on the object* the camera was pushing toward: plate → flat-lay,
  the "overhead insert opens into the case study" pattern made literal.
- **The exit mirrors:** cut back (the set unmounts, revealing the tableau
  still holding its pushed-in frame), then the panel settles `1.7 → 1` over
  the same move — the emphasis releasing.

One consequence worth keeping: **the incoming layer needs no animation at
all.** All motion lives on the outgoing scene; the destination just *is* —
which is also what keeps it feeling like a place rather than a presented
surface.

## The state model: depth is an axis, not a page

Depth composes with chapter travel as a second orthogonal axis. The harness
holds `(chapterIndex, transit)` × `depth`, where
`depth: "tableau" | "pushing" | "case"`:

- `tableau → pushing` on explicit entry; a `PUSH_MS` timer fires the cut
  (`pushing → case`). Esc during `pushing` cancels the timer and the camera
  backs out from wherever it was — **the cut never happens if the push was
  abandoned.**
- `case → tableau` is the exit cut; the CSS settle-out runs from the held
  scale with no JS timer (the transition animates from the current computed
  value when `[data-depth]` drops).
- Mount-fresh-per-entry means the set always opens at its head — on the
  insert — with no scroll-reset logic.
- The production engine should model moves as `(from, to, move)` with truck,
  whip, and push-then-cut as vocabulary entries — branch on *what kind of
  edge* is traversed (adjacent chapter / distant chapter / depth), exactly as
  the distance branch already does for truck/whip. Multi-phase moves (push
  **then** cut) mean a move is a *sequence*, not a single CSS transition —
  the engine wants a small timeline, not more transition properties.

## Interaction rules chosen (and the open questions)

- **Entry is explicit** (progressive disclosure): a button,
  keyboard-reachable. For the spike it is harness-owned chrome below the
  tableau; **production wants the affordance on the CatalogIQ plate itself**
  (the plate as the doorway). That also mostly solves the aim problem below.
- **Exit:** "← Back to Projects" + Esc. Cut back, then settle.
- **Chapter travel while deep cuts depth closed instantly**, then runs the
  truck/whip; the panel's settle-out runs beneath the departing frame. *Open
  rhythm question:* cut (chosen — the chapter index stays a reliable
  10-second path), pull back first (stately, ~2s), or block until explicit
  exit.
- **The set is its own vertical scroll context** — inside, scroll walks the
  case study.
- Entering mid-truck/whip is possible; harmless here, but the engine should
  serialize moves — one camera, one move at a time.

## The aim problem (the production finding)

`transform-origin` is fixed at `50% 42%` of the viewport-sized panel box
(scroll-independent — the transform sits on the scroll container, not the tall
inner column). But the camera pushes toward whatever occupies that region:
with the panel scrolled to the entry button, that's below the CatalogIQ plate.
For the spike the read survives; for production, **the engine must aim the
camera** — measure the anchor plate's on-screen rect at entry
(`getBoundingClientRect`) and derive the origin (and possibly a small
translate) from it. "Push toward the thing being entered" is part of the
move's meaning. With the affordance on the plate itself, the plate is
necessarily in frame when entry triggers.

## Layering & accessibility contract

- **z-order (bottom→top):** track (chapter panels) → case-study set (`z: 1`)
  → intertitle plate (`z: 2`). Intertitles stay above depth.
- **The track goes `inert` while `depth === "case"`** — the covered tableau
  must not stay tabbable/readable. Released at the exit cut so the settling
  tableau is immediately interactive.
- **Focus follows the camera:** into the set's heading (`tabIndex={-1}`) at
  the cut — with **`focus({ preventScroll: true })`**: the heading sits below
  the insert, and the default scroll-into-view dragged the set past the
  match-cut object (a real bug caught in-browser; the engine must own this
  rule — programmatic focus must never re-aim the landed frame). Focus
  returns to the entry trigger on explicit exit — *after* the re-render that
  lifts `inert`; focusing inside a still-inert subtree fails silently. A
  chapter-nav cut does not steal focus.
- The aria-live status line announces the depth state ("Case study:
  CatalogIQ, within chapter 3, Projects."); the set's ground is opaque Paper —
  the chapter wash disappearing is part of the "different room" read.

## Reduced motion

- `prefers-reduced-motion` skips the push entirely — **straight to the cut**,
  both ways (the destination was already a cut, so the fallback is the same
  grammar minus the dolly; content parity is exact).
- The AC's fallback demo is a harness chrome toggle ("Motion: full / instant
  cut") forcing the same branch via `data-reduced`, so the walkthrough can
  compare side by side without OS settings. Applies to truck and whip too. OS
  wins over the toggle and the label says so. *Worth keeping in the
  production dev gallery.*

## Acceptance criteria — status

- [x] **Push-in and reverse demonstrated** — push-then-cut in, cut-then-settle
  out, via button/Esc.
- [x] **Timing/easing within spec; reads as entering a set** — 1000ms,
  `cubic-bezier(0.25, 0.1, 0.25, 1)`, verified computed. The v1
  zoom-crossfade *failed* this criterion at the walkthrough and was
  recomposed; the push-then-cut earns the read by keeping the zoom as
  emphasis and letting the cut change the scene. Final judgment is Zaid's.
- [x] **Instant-cut fallback shown** — real `prefers-reduced-motion` support
  plus the preview toggle.
- [x] **Notes for the production transition engine** — this document.

## Implementation cost

- **Low.** One non-animating set component + CSS, ~100 lines of depth wiring
  in the harness, one scale transition beside the truck/whip rules. **Zero
  changes to shipped code** (`src/components/**` untouched); the PORT-18
  insert is imported dev→dev as the match-cut object. No new dependency. The
  rejected v1 was *more* code (two-layer choreography, double-rAF mount
  dance, offset fade ramps) — the corrected grammar simplified the build.
- **No automated tests** (spike; coverage-excluded). On promotion the depth
  machine wants real tests: enter/cut timing, Esc-mid-push abandon,
  focus round-trip (incl. preventScroll), chapter-nav cut, reduced-motion
  branches — all assertable without judging feel.

## Risks / notes

- **The feel is judged, not measured** — scale 1.7, the 42% origin, and the
  1000ms push are felt values; the walkthrough may retune. The hard cut
  itself is the biggest bet: it should feel like film punctuation, not a
  glitch — if it reads abrupt, the candidate fix is a 2–3 frame hold at full
  push before the cut, *not* a fade.
- **Mobile is untested**; whether the push reads at 360px (and what it does
  to the fixed 68vh stage) is unexamined.
- **The set's content is stub-grade** — real case-study structure is Phase-4;
  the pilot figures inside the imported insert stay flagged
  pending-verification (CONTENT_NOTES rule).
- **WSL2 dev-server caveat** (tooling, not product): file-watcher misses
  meant a running `next dev` served stale code during verification — restart
  the dev server before judging motion changes in the walkthrough.
