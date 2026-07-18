# PORT-15 — Candidate C: hybrid (distance-branched jumps + scroll-within)

**Spike deliverable.** The code under `src/app/dev/prototypes/nav-candidate-c/` is
throwaway; *these notes* are what carries forward into the alignment review and
the mechanic decision (PRD Feature 1 — the input mechanic is chosen by
prototyping, not prescribed). Candidate C is built **last, to harvest what A and
B taught us**, and combines two ideas neither of them shipped:

1. **Distance-branched transitions.** Both A and B flagged the *same* unbuilt
   recommendation — a fixed-tempo 800ms truck through three viewports reads as a
   blur-less whip, not a truck. C branches on distance: **adjacent (±1) →
   lateral truck**, **distant (≥2) → whip-pan** (~350ms, snappier easing, brief
   blur that resolves on settle). This is the one move neither A nor B built.
2. **Scroll repurposed, not hijacked.** B's defining risk was mobile
   scroll-hijack (consuming a vertical-intent gesture to travel sideways,
   `touch-action:none`, invisible gesture). C gives each axis its natural job:
   the **horizontal** axis (chapter-to-chapter) is explicit click/keyboard like
   A — discoverable, no hijack; the **vertical** axis is **native scroll within a
   chapter**. Scroll does the vertical thing the body expects, so there is
   nothing to hijack and no mobile pitfall.

- **Route:** `/dev/prototypes/nav-candidate-c` (noindex; run `npm run dev`)
- **Transitions:** adjacent — `translateX`, **800ms**, `cubic-bezier(0.45, 0.05,
  0.55, 0.95)`, no overshoot, hard-clamped ends (candidate A's truck verbatim).
  Distant — `translateX`, **350ms**, `cubic-bezier(0.7, 0, 0.3, 1)`, with a blur
  pulse (`filter: blur` ramps to ~5px over half the whip, then resolves to 0 as
  the frame settles). Timing lives in local CSS custom properties (`--truck-*` /
  `--whip-*`); `WHIP_MS` mirrors `--whip-duration` for the blur timer.
- **Vertical axis:** each chapter panel is its own native `overflow-y` scroll
  context; entering a chapter resets it to its head. No `preventDefault`, no
  `touch-action:none` — scroll physics stay native. Placeholder stacked plates
  give the axis somewhere to travel (no real chapter content authored yet).
- **Non-scroll path:** chapter index + prev/next, and `←`/`→` (adjacent) /
  `Home`/`End` (first/last) — **identical to A and B**, so the three candidates
  compare head-to-head and nothing relies on a gesture (PRD F1).
- **Reduced motion:** `prefers-reduced-motion: reduce` → truck *and* whip become
  straight cuts (`transition: none`), blur suppressed (also guarded in JS), full
  content parity. Native within-chapter scroll is unaffected.

## Acceptance criteria — status

- [x] **Hybrid mechanic demonstrated across all four chapters** — verified by
  driving the running route: adjacent moves branch to **truck** (transition
  `0.8s`, no blur), distant moves (About→Contact, `End`) branch to **whip**
  (transition `0.35s`) with the blur pulse toggling on and decaying back to 0;
  the index/prev-next/keyboard all drive the horizontal axis; each panel scrolls
  vertically (active panel `scrollHeight 1281 > clientHeight 626`) independent of
  the horizontal track, and resets to top on chapter entry. Boundary clamps hold
  (`End` then `→` stays on Contact) and never lock (`←` responds immediately
  after a clamp). `aria-live` announced "Chapter 4 of 4: Contact" on settle.
- [x] **Notes captured** — this document (feel, usability, cost, risks).
- [x] **Comparative notes against A and B** — the table and per-moment notes
  below.
- [x] **Demoable for the alignment review** — the `/dev` route is the demo
  surface; drive the horizontal axis with the index/keys and the vertical axis
  with scroll/swipe.

> **Verification note.** The behaviours above were confirmed by scripted
> click / keyboard dispatch and DOM/CSS sampling against the running route
> (branch-on-distance timing, the blur-pulse toggle, scroll independence and
> reset, boundary clamps, the live-region text) plus a visual check of a settled
> tableau. The **subjective feel and real mobile-device behaviour are for Zaid to
> judge at the review** — that hands-on evaluation is the point of the spike, and
> the claims below are framed as such.

## Feel

- **The distance branch is the payoff.** Adjacent moves keep A's deliberate
  "camera on rails" truck; distant jumps now read as a genuine **whip-pan** — a
  fast, slightly-blurred sweep — instead of A/B's blur-less 3-viewport blur. This
  is exactly the fix both prior docs asked for, and having it *in the hand* (not
  just on paper) is the single most useful thing C brings to the review.
- **Two axes, two jobs, and they don't fight.** Because horizontal travel is a
  branded move and vertical travel is native scroll, the mental model is clean:
  *sideways = change chapter, down = read this chapter.* Nothing about a scroll
  gesture is surprising, which is the opposite of B's core tension.
- **The blur pulse is a tuning knob, not a fixed value.** ~5px over half the
  whip settling to 0 reads as motion blur without smearing type illegibly; it is
  a starting point. Too much blur or too long and it calls attention to itself;
  the current values are conservative.
- **Settled states stay perfectly still** — the only horizontal motion is the
  track transform, and vertical is native scroll the user drives. "Movement is
  punctuation" still holds between chapters; within a chapter, stillness is the
  user's to break.

## Usability

- **No mobile scroll-hijack — the headline win over B.** C never calls
  `preventDefault` on scroll and never sets `touch-action:none`. A phone user's
  down-swipe scrolls the chapter (as expected); chapter changes are the visible
  index / prev-next. C therefore **sidesteps the exact risk B exists to
  surface**, at the cost of the marquee gesture-to-travel *feel* B had.
- **10-second path still passes (PRD Feature 4).** The index + keyboard path is
  A verbatim: Contact is one click from any chapter, four chapters legible on
  landing, no novel mechanic to discover. C inherits A's usability floor.
- **Discoverability is high** on the horizontal axis (visible controls) and
  **natural** on the vertical (scroll is the web's default). The only thing a
  first-timer must intuit — that scrolling reads *within* a chapter rather than
  *between* chapters — matches platform default behaviour, so it needs no
  teaching.
- **Distinct-move legibility.** Adjacent vs distant now *feel* different, which
  helps orientation on distant jumps ("that was a big move") in a way A/B's
  single-tempo truck could not.

## Implementation cost

- **Low–Medium.** ~1 client component (A's state model + a distance check, a
  two-phase blur timer, and a per-panel scroll-reset effect), one token-only CSS
  module, and a route. **No animation library** — pure CSS `transform` +
  `filter` transitions; the branch is a `[data-transit]` attribute swapping
  `--dur`/`--ease`, and the blur is `[data-blurring]` toggling a `filter`. Zero
  changes to shipped code; composes the existing leaves (`Button`, `Plate`,
  `CHAPTERS`, `toRoman`).
- **Cheaper than B's input layer.** No non-passive wheel/touch listeners, no
  accumulator/threshold, no input-lock state machine — because scroll is *not*
  intercepted. The genuinely new bits over A are the distance branch (trivial)
  and the blur pulse (a single mid-transit timer).
- Typecheck + lint clean. No automated tests (spike, consistent with A and B). A
  productionised C would want e2e coverage of the distance branch (adjacent vs
  distant picks the right transition) and the scroll-reset-on-entry behaviour.

## Risks

- **Blur legibility / performance.** A `filter: blur` on the whole track during a
  whip is GPU-cheap on desktop but worth checking on low-end mobile; and blur
  must stay light enough not to smear type. Reduced-motion already suppresses it.
- **Two-phase blur timer is time-based, not transition-event-based.** The blur
  releases on a `setTimeout(WHIP_MS/2)`, so it assumes the CSS whip duration and
  the JS constant stay in lockstep (documented in both files). A productionised
  version should derive one from the other (or promote both to a shared motion
  token) so they can't drift.
- **Focus management is unhandled** (same known gap as A and B). On chapter
  change, DOM focus stays put; an `aria-live` status announces the settled
  chapter, but production needs a real focus target per chapter. Low effort,
  must-do before ship.
- **Within-chapter scroll region is pointer-driven in the spike.** Vertical keys
  (`↑`/`↓`/PageUp/Space) are deliberately left native and untouched, but the
  scroll region isn't a focusable landmark, so keyboard-only vertical scrolling
  needs a focusable/`tabindex` region in production (kept out of the spike to
  preserve an identical key model to A/B for comparison). `Home`/`End` are bound
  to first/last chapter here, which a production build must reconcile with any
  in-region scroll-to-top/bottom expectation.
- **`overflow: hidden` track + off-screen panels** are `aria-hidden` but still in
  the DOM and focusable-in-principle; production should guard tab order (`inert`
  on non-current panels). Same as A/B.

## Comparative notes — A vs B vs C

| Axis | A (click/keyboard) | B (scroll-snap) | C (hybrid) |
|---|---|---|---|
| **Chapter input** | Explicit controls only | Scroll/swipe (+ controls) | Explicit controls only |
| **Adjacent move** | Truck 800ms | Truck 800ms | Truck 800ms |
| **Distant move** | Truck 800ms (reads as blur-less whip — weak spot) | Truck 800ms (same weak spot) | **Whip-pan 350ms + blur** ✓ |
| **Vertical scroll** | Unused | *Hijacked* → horizontal travel | **Native → within-chapter** ✓ |
| **Mobile risk** | None (no gesture) | **High** (scroll-hijack) | None (no gesture hijack) |
| **Novelty of input** | Low (conventional) | High (gesture-to-travel) | Low–Medium (novel *transitions*, conventional input) |
| **10-second path** | Passes | Passes (inherits A) | Passes (inherits A) |
| **Impl. cost** | Low | Low–Medium (input layer) | Low–Medium (branch + blur, no input layer) |

**Which mechanic serves which moment best:**

- **Adjacent chapter step** — a wash. All three use the same truck; the move
  already feels right (A established this).
- **Distant jump (e.g. About → Contact)** — **C wins.** Its whip-pan is the
  on-brand move A/B only recommended on paper. If the review wants that jump to
  feel intentional rather than like a fast blur, C is the only candidate that
  demonstrates it.
- **Reading a long chapter** — **C wins.** C is the only candidate with a real
  vertical axis; A/B treat a chapter as a single locked frame. When real chapter
  content lands, C's native scroll is the natural home for it.
- **A visitor who wants the navigation itself to feel distinctive** — **B wins**
  on raw novelty (the body-provoked travel), if its mobile hijack is acceptable.
  C's novelty is in the *transitions*, not the *input*; A has the least.
- **First visit on a phone (most traffic)** — **A or C.** Neither hijacks scroll;
  C additionally makes the vertical scroll *do* something useful per chapter.

## Recommendation for the review

Candidate C is best understood as **candidate A with the two upgrades A and B
both asked for, and none of B's risk**: the distance-branched whip-pan (built,
not just recommended) and a real, un-hijacked vertical axis. It keeps A's
usability floor (index + keyboard verbatim → 10-second-path pass, no mobile
hijack) and adds cinematic distinction *in the transitions* rather than *in the
input*.

Framing for the decision: **if the review liked A's safety but wanted the
distant jump and long-chapter reading solved, C is the pick — it's A plus those
two things.** The trade C makes against B is deliberate: it gives up B's
gesture-to-travel novelty (and its mobile liability) in exchange for a clean
two-axis model. If the review's priority is a *distinctive input mechanic*, weigh
B (on the phone); if it's a *coherent, low-risk cinematic feel that scales to
real content*, C is the strongest of the three. A stays the floor both must
clear.
