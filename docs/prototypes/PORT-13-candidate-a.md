# PORT-13 — Candidate A: click / keyboard navigation

**Spike deliverable.** The code under `src/app/dev/prototypes/nav-candidate-a/` is
throwaway; *these notes* are what carries forward into the alignment review and
the mechanic decision (PRD Feature 1 — the input mechanic is chosen by
prototyping, not prescribed).

- **Route:** `/dev/prototypes/nav-candidate-a` (noindex; run `npm run dev`)
- **Mechanic:** chapter changes on explicit input only — the rough chapter index,
  prev/next controls, and keyboard. **No scroll**, by design, so this candidate
  is judged in isolation.
- **Transition:** the Brand Guide lateral truck — `transform: translateX`,
  **800ms**, `cubic-bezier(0.45, 0.05, 0.55, 0.95)`, cardinal (horizontal), no
  overshoot. Distant jumps truck straight through at the same tempo (plan option
  (a) — one mechanic to judge). Ends are hard-clamped (no wrap → no overshoot).
- **Reduced motion:** `prefers-reduced-motion: reduce` → `transition: none`
  (straight cut, full content parity).

## Acceptance criteria — status

- [x] **All four chapters navigable by click and keyboard only** — index buttons +
  prev/next, and `←`/`→` (adjacent) / `Home`/`End` (first/last). Verified in
  browser: `End` jumped About → Contact, current marking and disabled-boundary
  states followed correctly.
- [x] **Adjacent transition ≈ truck timing (700–900 ms, no overshoot)** — 800 ms
  mid-band; the easing curve stays within [0,1] so it cannot overshoot; clamped
  ends mean the rail never bounces past a boundary.
- [x] **Notes captured** — this document (feel, usability, cost, risks).
- [x] **Demoable to Zaid** — the `/dev` route is the demo surface.

## Feel

- The truck reads as *deliberate and mechanical* — exactly the "camera on rails"
  intent. At 800 ms an adjacent move is unmistakably a **travel between two
  composed rooms**, not a UI state flip. This is the strongest thing the
  candidate has going for it.
- Settled states are genuinely still (no ambient motion), so "movement is
  punctuation" holds. The stillness *between* moves is what makes the move feel
  intentional.
- **Distant jumps are the weak spot.** About → Contact trucking through
  Experience + Projects at a fixed 800 ms travels three viewports fast — it
  reads as a blur-less whip rather than a truck. It's coherent, but it's *not the
  same gesture* as an adjacent move. The Brand Guide already anticipates this: a
  whip-pan (300–400 ms + brief blur) is the prescribed move for "quick jumps
  between distant sections". **Recommendation:** in any productionized version,
  branch on distance — adjacent → truck, non-adjacent → whip-pan.
- The faint per-chapter color washes (`color-mix` of Paper + each accent at
  ~8–10%) are intentionally subtle to keep Umber type legible. They barely read
  as distinct rooms in a still frame; the *label + Roman numeral* do most of the
  "where am I" work. Real tableaux with distinct composition will carry this far
  better than a wash can.

## Usability

- **Discoverability is high** because navigation is *visible controls*, not a
  hidden gesture. This is the candidate's core usability advantage over any
  scroll/novel-mechanic candidate and directly satisfies the PRD requirement that
  navigation never rely on scroll alone.
- **10-second-path (PRD Feature 4, launch gate):** Contact is always one click
  away in the index from any chapter, and the four chapters are legible on
  landing. A first-time visitor finds the contact affordance without discovering
  any novel mechanic — this candidate passes the 10-second-path cleanly. It is
  the *safe* candidate on the usability axis.
- **Keyboard model is conventional:** arrows = step, Home/End = jump. No learning
  cost. Boundaries are hard stops (Prev disabled on first, Next on last) so there
  is no confusing wrap-around.
- **Two nav surfaces (index + prev/next)** may be redundant on desktop; prev/next
  earns its place more on mobile / for sequential reading. Worth deciding whether
  both ship.

## Implementation cost

- **Low.** ~1 client component (state + a windowed `keydown` listener), one
  token-only CSS module, and a route. **No animation library** — pure CSS
  `transform` + `transition` does the whole truck. Composes existing leaves
  (`Button`, `Plate`, `CHAPTERS`, `toRoman`) with zero changes to shipped code.
- Typecheck + lint clean.
- The productionized version is a moderate step up, not a rewrite: derive the
  active chapter from the router (the shipped `ChapterIndex` already documents
  `current` becoming a derived value), promote the truck timing to real global
  motion tokens (`--duration-*` / `--ease-*`, mirrored into `globals.css` with a
  parity test — the same pattern as the color/spacing tokens), and add the
  whip-pan branch for distant jumps.

## Risks

- **Focus management is unhandled (known gap).** On chapter change, DOM focus
  stays on whatever was clicked/pressed; the new chapter's content isn't focused.
  An `aria-live="polite"` status line announces the settled chapter, but a
  production build needs a real focus target per chapter (e.g. move focus to the
  chapter heading) for keyboard/SR users. Low effort, must-do before ship.
- **Distant-jump gesture mismatch** (see Feel) — needs the whip-pan branch to
  stay on-brand.
- **`overflow: hidden` track + off-screen panels:** off-screen chapters are
  `aria-hidden` but still in the DOM and focusable-in-principle. Production should
  guard tab order (e.g. `inert` on non-current panels) so keyboard focus can't
  land in an off-screen room.
- **Low novelty risk (this is a feature, not a bug):** the candidate is charming
  but conventional. If the brief wants the navigation *itself* to feel
  distinctive, this candidate leans on the tableaux and the truck to carry that,
  not on the input mechanic. Weigh against the more novel candidates on the
  "would this read as Anderson-*esque*" litmus vs. the usability gate.

## Recommendation for the review

Candidate A is the **low-risk baseline**: cheap, accessible, passes the
10-second-path gate outright, and the adjacent truck already feels right. Its
ceiling is limited by being conventional. Take it as the usability floor every
other candidate must clear, and if it's chosen, invest in (1) the whip-pan for
distant jumps, (2) focus management, and (3) real tableaux over the gray boxes.
