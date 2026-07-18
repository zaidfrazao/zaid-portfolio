# PORT-14 — Candidate B: scroll / swipe navigation with snap tableaux

**Spike deliverable.** The code under `src/app/dev/prototypes/nav-candidate-b/` is
throwaway; *these notes* are what carries forward into the alignment review and
the mechanic decision (PRD Feature 1 — the input mechanic is chosen by
prototyping, not prescribed). Candidate B is built as candidate A **plus one
variable**: scroll/swipe as an input. Everything else — the truck, the index,
prev/next, keyboard, the gray-box tableaux — is deliberately identical so the two
can be compared head-to-head.

- **Route:** `/dev/prototypes/nav-candidate-b` (noindex; run `npm run dev`)
- **Mechanic:** scroll drives the chapters, but it is **discrete and snapped, not
  free**. One wheel tick / trackpad swipe / touch swipe over the stage advances by
  **exactly one chapter**, then the stage **locks for one truck (800ms)** — extra
  momentum ticks during the move are swallowed. You can never rest between
  tableaux; there is no free-scrolling mid-state. Scroll is **additive** — the
  rough chapter index, prev/next, and keyboard are the full non-scroll path, so no
  mechanic relies on scroll alone (PRD F1). Wheel takes the dominant axis (mouse
  `deltaY` or trackpad `deltaX`); a horizontal swipe turns the page (swipe-left =
  forward). Boundaries **clamp** (no wrap) and, because a clamp moves nothing, it
  never locks — a scroll into a wall leaves the stage immediately responsive.
- **Transition:** the same Brand Guide lateral truck as candidate A —
  `transform: translateX`, **800ms**, `cubic-bezier(0.45, 0.05, 0.55, 0.95)`,
  cardinal (horizontal), no overshoot, hard-clamped ends. The 800ms input-lock is
  tied to this duration (mirrored as `TRUCK_MS` in the component).
- **Scroll hijack:** the stage calls `preventDefault` on `wheel`/`touchmove` and
  sets `touch-action: none` + `overscroll-behavior: contain` on the viewport, so
  the branded truck plays instead of native scrolling and the page behind the
  stage doesn't move. This hijack is **scoped to the viewport** — the rest of the
  page (header, legend) scrolls normally. The hijack is the crux of the mobile
  pitfall this spike exists to surface (see Usability).
- **Reduced motion:** `prefers-reduced-motion: reduce` → `transition: none`
  (straight cut, full content parity), and the input-lock shortens from 800ms to a
  ~140ms debounce so snapping stays responsive without a truck to wait for.

## Acceptance criteria — status

- [x] **Scroll advances between chapters with snap-to-tableau settling** — verified
  by driving the page: a `deltaY:120` wheel tick advanced About → Experience and
  the track settled to exactly `-100%`; a second tick *during* the 800ms lock was
  swallowed (stayed on Experience — no skip); after the lock released, the next
  tick advanced again. There is no resting state between tableaux.
- [x] **Same navigation fully possible via chapter index + keyboard** — index
  buttons + prev/next, and `←`/`→` (adjacent) / `Home`/`End` (first/last), all
  identical to candidate A. Verified: `Home` → About, `End` → Contact, boundary
  clamps hold, and an arrow key works immediately after a boundary clamp (proving
  the clamp never locks the stage). `aria-live` status announced
  "Chapter 3 of 4: Projects" on settle.
- [x] **Notes captured** — this document (feel, usability incl. mobile,
  implementation cost, risks).
- [x] **Demoable for the alignment review** — the `/dev` route is the demo
  surface; drive it with wheel, trackpad, swipe, and keyboard.

> **Verification note.** The behaviours above were confirmed by scripted wheel /
> keyboard dispatch against the running route (settled transforms, the lock
> swallowing a mid-truck tick, boundary clamps, the live-region text). The
> **subjective feel and real mobile-device behaviour are for Zaid to judge at the
> review** — that hands-on evaluation is the point of the spike, and the claims
> below are framed as such.

## Feel

- The **snap is the whole idea** and it lands: one gesture = one composed room,
  joined by the same deliberate 800ms truck as candidate A. Because the truck and
  tableaux are literally A's, the settled states are equally still — "movement is
  punctuation" holds. What B adds is that the *travel* now feels **provoked by the
  body** (a scroll/flick) rather than by pressing a control, which reads as more
  cinematic and immersive when it works.
- The discrete-snap model dodges the worst failure mode of scroll-driven
  navigation — the janky, free-scrubbing mid-state where you can park the camera
  half-way between two rooms. B can't do that by construction, which keeps it
  on-brand ("resting states are fully static").
- **The lock is a double-edged feel.** It guarantees you land on a tableau and
  can't fling past three chapters at once — good, on-brand. But an 800ms lock also
  means the mechanic is only as fast as the truck: a user who scrolls twice
  quickly feels the second input "eaten." On desktop with a notchy mouse wheel
  this reads as deliberate; with a high-momentum trackpad it can read as
  unresponsive. Threshold (`WHEEL_THRESHOLD = 40`) and lock length are the two
  tuning knobs if B is chosen.
- Same distant-jump caveat as candidate A applies to the *index* path (a 3-viewport
  truck at fixed 800ms reads as a blur-less whip); B doesn't change that and the
  same whip-pan-for-distant-jumps recommendation carries over.

## Usability

- **Mobile scroll-hijack is the headline risk, and B leans right into it** — by
  design, because surfacing that evidence is the task. Consequences to weigh:
  - **Vertical intent vs horizontal travel.** On a phone the instinct is to scroll
    *down*; B consumes that gesture to truck *sideways*. Even mapped to swipe,
    hijacking the page's native scroll on a horizontal deck is the exact pattern
    users find disorienting on mobile, and it fights the platform's scroll
    physics/inertia.
  - **`touch-action: none` disables native panning/zoom over the stage.** That is
    what makes the branded truck possible, but it also removes affordances users
    expect and can trip accessibility expectations (pinch-zoom over that region).
  - **Discoverability of the gesture is low.** Unlike candidate A (visible
    controls only), B's marquee input is invisible; the on-page legend and the
    always-present index/prev-next are what stop a first-timer being stranded.
- **The non-scroll path saves it against PRD F1 / Feature 4.** Because the index +
  keyboard are identical to A, the **10-second path still passes**: Contact is one
  click away from any chapter and no novel mechanic must be discovered to use the
  site. B is A's usability floor *plus* an optional, higher-risk input — it never
  drops below A on the usability axis, it only adds surface area to get wrong.
- **Desktop is the comfortable case.** Wheel/trackpad → snap feels natural and the
  hijack is contained to the viewport, so the rest of the page still scrolls. If B
  were adopted, a defensible stance is *scroll-as-enhancement on desktop, swipe
  optional on mobile, index/keyboard as the guaranteed baseline everywhere.*

## Implementation cost

- **Low–Medium.** ~1 client component (candidate A's state model + three native
  listener effects: wheel, touch, keyboard), one token-only CSS module, and a
  route. **No animation library** — pure CSS `transform` + `transition`, same as A.
  Composes existing leaves (`Button`, `Plate`, `CHAPTERS`, `toRoman`) with zero
  changes to shipped code.
- The genuinely fiddly part over candidate A is the **input layer**: non-passive
  listeners (so `preventDefault` works), a wheel accumulator with a threshold and
  direction-reset, the transition lock (with a reduced-motion-aware duration and a
  no-move/no-lock rule at boundaries), and swipe delta handling. All of it is
  hand-rolled and would need real-device tuning (trackpad momentum, threshold
  feel) before it could ship.
- Typecheck + lint clean. No automated tests (spike, consistent with A); a
  productionized B would want e2e coverage of the lock/skip guarantee and the
  boundary-clamp behaviour, which unit tests can't easily assert.

## Risks

- **Mobile hijack** (see Usability) is the defining risk and could sink the
  candidate outright on real devices — that is the evidence to gather at the
  review.
- **Focus management is unhandled** (same known gap as candidate A). On chapter
  change, DOM focus stays put; an `aria-live="polite"` status announces the
  settled chapter, but a production build needs a real focus target per chapter.
  Low effort, must-do before ship.
- **`overflow: hidden` track + off-screen panels** are `aria-hidden` but still in
  the DOM and focusable-in-principle; production should guard tab order (`inert`
  on non-current panels) so focus can't land in an off-screen room. Same as A.
- **Scroll-hijack accessibility:** disabling native scroll/zoom over a region can
  conflict with assistive tech and user zoom; needs an audit if B is chosen.
- **Lock tuning is load-bearing for feel:** too long reads as unresponsive, too
  short lets a momentum flick skip a room. The current 800ms/40-delta values are a
  starting point, not a validated setting.

## Recommendation for the review

Candidate B is **candidate A plus an optional, more cinematic input** whose upside
is real (gesture-driven travel feels more immersive than pressing a control) and
whose downside is concentrated almost entirely on **mobile scroll-hijack**. Its
safety net is that the index + keyboard path is A verbatim, so it inherits A's
10-second-path pass and never drops below A on usability — the scroll is additive,
not load-bearing.

Suggested framing for the decision: **judge B on the phone, not the laptop.** On
desktop it will feel good and low-risk; the real question is whether the mobile
hijack (vertical-intent-to-horizontal-travel, `touch-action: none`, invisible
gesture) is acceptable given most first visits arrive on mobile. If the review
likes the *feel* but not the *hijack*, the natural next step is a variant that
keeps snap tableaux but uses native CSS scroll-snap on mobile (no hijack,
non-branded easing) while reserving the branded truck for desktop wheel/keyboard —
noted here rather than built, to keep this spike a clean single-variable
comparison against candidate A.
