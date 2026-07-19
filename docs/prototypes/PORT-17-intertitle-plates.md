# PORT-17 — Rough intertitle plates between chapters

**Spike deliverable.** The code under `src/app/dev/prototypes/nav-candidate-c/`
(`Intertitle.tsx` / `Intertitle.module.css` and the wiring in `NavCandidateC`)
is throwaway; *these notes* — the rhythm and tone judgments — are what carries
forward. The task is a rough intertitle treatment introducing each chapter
(kicker + title on a Teal plate) inserted into the walkthrough to judge rhythm
and tone (PRD Feature 2; grammar #5 — chaptering). It must be skippable even at
prototype fidelity.

- **Route:** `/dev/prototypes/nav-candidate-c` (noindex; run `npm run dev`) — the
  intertitle rides on the winning candidate-C harness (PORT-15/16).
- **Form:** a Teal plate (`--color-teal`) with Paper text (`--color-paper`, the
  5.90:1 pairing already verified in `palette.contrast.test.ts`), centered, all
  in the intertitle registers (`register-kicker` + `register-intertitle`) with a
  hairline Paper frame set in from the edge. Flat, sharp-cornered, no shadow —
  **our own plate system, not the _Royal Tenenbaums_ Futura title card**
  (Brand Guide Hard Rule 6).

## The one real decision: overlay, not a track panel

The plate is a **dismissible overlay held over the entering chapter**, not an
extra panel inserted into the horizontal track. This is the whole design, and it
falls straight out of the hard acceptance criterion — *skippable / interruptible,
no mandatory wait* (PRD Feature 2):

- A leading **track panel** would force the visitor to travel **through** the
  intertitle to reach the chapter — a mandatory step, exactly the wait the PRD
  forbids.
- An **overlay** sits above a chapter that is already mounted and interactive
  beneath it. **Any** input dismisses it at once — pointer, key, wheel, touch —
  and otherwise it self-dismisses after a short dwell. On dismiss the parent
  stops rendering it, so it never blocks the tableau.

Mechanics that keep it honest:

- **First-visit-only.** The plate appears the first time each chapter is entered
  and not on return (a ref-backed `Set` of seen chapter ids, ref not state so it
  survives StrictMode's dev double-effect). Re-showing on every back-and-forth
  would feel naggy and reintroduce a wait. *Whether* first-visit-only is the
  right rule is the headline rhythm question below.
- **Never steals the nav.** The overlay's window listeners only call `onDismiss`
  — no `preventDefault`, no `stopPropagation` — so an `ArrowRight` pressed over
  the plate still navigates, and the first scroll gesture still reaches the panel
  underneath.
- **aria-hidden.** The harness already owns an `aria-live` status line that
  announces the settled chapter, so the plate is decorative staging for sighted
  users; it does not re-announce or trap.
- **Eases both ways (walkthrough tuning).** First pass hard-cut on dismiss (the
  plate just unmounted) and entered in ~220ms — it read as too sudden. Now both
  directions are opacity transitions: ~600ms ease in, hold perfectly still
  (Hard Rule 2), then ~500ms ease out before it unmounts. The exit duration and
  the JS unmount timer are kept in lockstep (`--exit-ms` / `EXIT_MS`).
- **Reduced motion.** Under `prefers-reduced-motion: reduce` both directions are
  straight cuts (no fade) and the exit is immediate (no wait); content parity is
  total.

## Draft copy (deadpan narrator; no film references)

Rough placeholder wording for the spike — final copy is a walkthrough question.
The narrator stages ("Chapter One, in which the builder is introduced." — Brand
Guide Tone of Voice), so the plate keeps a consistent "In which…" grammar and
spells the ordinal out ("Chapter One") to distinguish the intertitle voice from
the panel heading's Roman "Chapter I".

| Chapter | Kicker | Line |
|---|---|---|
| About | Chapter One | In which the builder is introduced. |
| Experience | Chapter Two | In which the work is accounted for, since 2017. |
| Projects | Chapter Three | In which a few things that shipped are examined. |
| Contact | Chapter Four | In which the reader is invited to write. |

## Acceptance criteria — status

- [x] **Intertitle plate renders before each chapter with kicker + title** — the
  Teal plate mounts on first entry to each of the four chapters, carrying the
  spelled-out kicker, the chapter title, and the narrator line.
- [x] **Skippable / interruptible — no mandatory wait** — the chapter is live
  beneath the plate; any input dismisses immediately and the plate otherwise
  clears itself after the dwell. It is never a step in the travel path.
- [x] **Copy in the narrator voice, no film references** — deadpan "In which…"
  staging, no exclamation, no "now showing / ticket / concierge" language.
- [~] **Rhythm judged in the walkthrough — notes captured** — the design
  decisions and the open questions are captured here; the *subjective* rhythm
  call (dwell length, first-visit-only vs always, copy) is for Zaid to make
  hands-on at the walkthrough. That judgment is the point of the spike.

## Rhythm & tone — the questions for the walkthrough

These are deliberately left open; the spike exists to answer them by feel.

1. **Re-show rule (headline).** First-visit-only (current), always-on-entry, or
   only-on-forward-progress (show going deeper, silent on return)? First-visit
   keeps nav fast but means a chapter you loop back to never re-announces.
2. **Hold length.** ~3s of fully-settled reading time (the fade-in is separate,
   so it counts from when the plate is legible; any input dismisses sooner). Too
   slow (in the way) or too fast (unreadable) for a plate the visitor mostly
   skips anyway?
3. **Auto-dwell at all?** Should it hold until *any* input and never auto-clear,
   or is the timed self-dismiss the right "it moves on if you don't" feel?
4. **Copy.** Is the "In which…" grammar the right register across all four, or
   does it wear thin by Chapter Four? Is spelled-out "Chapter One" better than
   the panel's Roman "Chapter I", or should they match?
5. **Enter move.** A soft opacity resolve vs a hard straight cut for everyone —
   which reads more like "our plate system" and less like a fade-y web modal?
6. **Visible skip affordance.** None is present (any input skips). Does the plate
   need a "skip" hint, or is that clutter for something that clears on its own?

## Implementation cost

- **Low.** One small client component (a dwell timer + window input listeners
  that only dismiss) and one token-only CSS module; the harness wiring is a
  first-visit `Set`, one state value, an entry effect, and a keyed render. No
  animation library — a single CSS opacity keyframe. **Zero changes to shipped
  code** and no change to the `CHAPTERS` source of truth: the copy map is local
  to the prototype (promotion to real chapter routes is Phase-3 work).
- No automated tests (spike, consistent with the nav candidates; `src/app/dev/**`
  is coverage-excluded). Skippability becomes an integration test in Phase 3.

## Risks / notes for productionising

- **Scroll-to-dismiss hands off mid-gesture.** The first `wheel`/`touchstart`
  dismisses synchronously and subsequent events scroll the panel underneath —
  fine for a spike, but a production version should confirm the handoff feels
  continuous rather than a dropped first flick.
- **No focus target.** Same known gap as the harness: on chapter change focus
  stays put. The overlay is `aria-hidden`, so it does not make this worse, but a
  productionised intertitle should coordinate with a real per-chapter focus
  target.
- **Copy is a placeholder.** The table above is draft staging, not final; the
  narrator lines want a pass once the chapters carry real content.
