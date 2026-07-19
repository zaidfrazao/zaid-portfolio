"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";

import { Button } from "@/components/Button";
import { CHAPTERS } from "@/components/ChapterIndex";
import { TABLEAUX } from "@/components/tableaux";
import { toRoman } from "@/lib/numerals";

import { CaseStudy } from "./CaseStudy";
import { INTERTITLES, Intertitle } from "./Intertitle";
import styles from "./NavCandidateC.module.css";

/**
 * NavCandidateC — PORT-15 spike, the HYBRID prototype of the input mechanic
 * (PRD Feature 1: the mechanic is chosen by prototyping, not prescribed). Built
 * last, to harvest what candidates A and B taught us:
 *
 * 1. DISTANCE-BRANCHED TRANSITIONS. Both A and B flagged the same unbuilt
 *    recommendation — a fixed-tempo truck through three viewports reads as a
 *    blur-less whip, not a truck. So chapter changes here branch on distance:
 *    an ADJACENT move (±1) is the Brand Guide lateral truck (800ms, no
 *    overshoot); a DISTANT jump (≥2) is a whip-pan (~350ms, snappier easing,
 *    with a brief blur pulse that resolves on settle). This is C's headline
 *    differentiator and the one move neither A nor B actually built.
 *
 * 2. SCROLL REPURPOSED, NOT HIJACKED. B's defining risk was mobile
 *    scroll-hijack — consuming a vertical-intent gesture to travel sideways
 *    (touch-action:none, invisible gesture). C resolves that tension by giving
 *    each axis its natural job: the HORIZONTAL axis (chapter-to-chapter) is
 *    explicit click/keyboard like A — discoverable, no hijack; the VERTICAL
 *    axis is NATIVE scroll WITHIN a chapter. Scroll does the vertical thing the
 *    body expects, so there is nothing to hijack and no mobile pitfall.
 *
 * Since PORT-19 the harness also carries a DEPTH axis, orthogonal to chapter
 * travel: an explicit "Enter the case study" control on the Projects chapter
 * enters the CatalogIQ set (./CaseStudy) as a STRAIGHT CUT that lands on the
 * insert (a match cut on the object), and Esc / "Back to Projects" cuts back.
 * The walkthrough rejected zoom in ANY transition role: v1's zoom-crossfade
 * read as a transition effect, and v2's push-then-cut still read as "zoom on
 * nothing" — a dolly on flat DOM is magnification, not camera travel. The
 * zoom idea is reserved for a future non-transition use; entry/exit are cuts
 * (docs/prototypes/PORT-19-push-in-entry.md holds the verdicts). Chapter
 * travel while deep cuts the depth axis closed first. A harness chrome toggle
 * previews the reduced-motion instant cut (truck/whip) without OS settings.
 *
 * Throwaway quality by intent — docs/prototypes/PORT-15-candidate-c.md holds the
 * learnings and the comparative A/B/C notes. It composes the shipped leaves
 * (Button, the CHAPTERS source of truth, the Roman-numeral helper) and, since
 * PORT-16, the four rough chapter tableaux (@/components/tableaux) as each
 * chapter's scrollable body — real draft content over the old gray-box
 * placeholders. It keeps the truck / whip-pan timing in local CSS custom
 * properties rather than global motion tokens (promoting those with parity
 * tests is Phase-3 work).
 */

// Whip-pan duration for distant jumps (Brand Guide: 300–400ms). Mirrors
// --whip-duration in NavCandidateC.module.css; also drives the blur-pulse timing.
const WHIP_MS = 350;
// A move of this many chapters or more is "distant" → whip-pan instead of truck.
const DISTANT = 2;

type Transit = "truck" | "whip";

/**
 * The depth axis (PORT-19), orthogonal to chapter travel: at the chapter
 * surface, or inside the case-study set. Both directions are straight cuts,
 * so there is no in-flight state.
 */
type Depth = "tableau" | "case";

// prefers-reduced-motion as an external store (render-time consumers: the
// CaseStudy layer's focus timing and the motion-toggle label; reducedRef
// mirrors it for stable callbacks).
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(REDUCED_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MQ).matches;
const getReducedMotionServer = () => false;

export function NavCandidateC() {
  const [index, setIndex] = useState(0);
  // How the LAST move travelled, so CSS can pick truck vs whip timing/easing.
  const [transit, setTransit] = useState<Transit>("truck");
  // Drives the blur pulse during a whip (up now, down at mid-transit).
  const [blurring, setBlurring] = useState(false);
  // The chapter id whose intertitle plate is currently held over the viewport
  // (PORT-17), or null when none is showing.
  const [intertitleId, setIntertitleId] = useState<string | null>(null);
  // The depth axis (PORT-19): a straight cut in, a straight cut out.
  const [depth, setDepth] = useState<Depth>("tableau");
  // Manual instant-cut preview (the AC's reduced-motion fallback demo) — ORed
  // with the OS prefers-reduced-motion setting everywhere motion branches.
  const [manualReduced, setManualReduced] = useState(false);
  // OS reduced-motion, subscribed as an external store (see module scope).
  const osReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const last = CHAPTERS.length - 1;

  // Refs so callbacks stay stable and closures never read stale state.
  const indexRef = useRef(index);
  const reducedRef = useRef(false);
  const blurTimerRef = useRef<number | null>(null);
  // Each chapter is its own vertical scroll context; we reset the incoming one
  // to its head on entry so you always arrive at the top of a room.
  const panelsRef = useRef<(HTMLElement | null)[]>([]);
  // Chapters whose intertitle plate has already been shown — the plate appears
  // only on the FIRST entry to each chapter (see the entry effect below). A ref,
  // not state: it must survive StrictMode's dev double-effect without a re-render.
  const seenRef = useRef<Set<string>>(new Set());
  // Depth-axis refs (PORT-19): the current depth for stable callbacks, the
  // entry trigger for focus return, and whether that return is owed (explicit
  // exit only — a chapter-move cut keeps focus on the nav control that caused
  // it).
  const depthRef = useRef<Depth>("tableau");
  const enterButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(
    null,
  );
  const returnFocusRef = useRef(false);
  const manualReducedRef = useRef(false);

  // Dismiss the intertitle plate — the parent unmounts it (Intertitle calls this
  // on any input or after its dwell).
  const dismissIntertitle = useCallback(() => setIntertitleId(null), []);

  const clearBlurTimer = useCallback(() => {
    if (blurTimerRef.current !== null) {
      window.clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }, []);

  // Effective reduced-motion: the OS setting OR the manual preview toggle.
  const isReduced = useCallback(
    () => reducedRef.current || manualReducedRef.current,
    [],
  );

  // Enter: a straight cut — the set mounts already settled, opening on the
  // insert (the match cut). No motion, so reduced-motion needs no branch here.
  const enterCase = useCallback(() => {
    if (depthRef.current !== "tableau") return;
    depthRef.current = "case";
    setDepth("case");
  }, []);

  // Exit: the mirror cut. Focus returns to the entry trigger via the depth
  // effect below — it can't be focused here, the track is still inert until
  // the re-render.
  const exitCase = useCallback(() => {
    if (depthRef.current === "tableau") return;
    depthRef.current = "tableau";
    setDepth("tableau");
    returnFocusRef.current = true;
  }, []);

  const goTo = useCallback(
    (target: number) => {
      // Depth is orthogonal to chapter travel: any chapter move first cuts the
      // depth axis closed, so the truck/whip starts from the tableau. Whether
      // it should block instead is a rhythm question for the walkthrough; see
      // the PORT-19 notes doc.
      if (depthRef.current !== "tableau") {
        depthRef.current = "tableau";
        setDepth("tableau");
      }

      const current = indexRef.current;
      // Clamp instead of wrapping: truck and whip both run on rails and never
      // overshoot their ends (Brand Guide hard rule), so boundaries are hard stops.
      const next = Math.min(Math.max(target, 0), last);
      if (next === current) return;

      // The one new variable over A/B: branch the transition on distance.
      const mode: Transit = Math.abs(next - current) >= DISTANT ? "whip" : "truck";
      setTransit(mode);
      setIndex(next);

      // Brief blur pulse for the whip only, and never under reduced motion. The
      // filter transitions up now and back down at mid-transit (see the CSS ramp),
      // so it reads as motion blur that resolves as the frame settles.
      clearBlurTimer();
      if (mode === "whip" && !isReduced()) {
        setBlurring(true);
        blurTimerRef.current = window.setTimeout(
          () => setBlurring(false),
          Math.round(WHIP_MS / 2),
        );
      } else {
        setBlurring(false);
      }
    },
    [clearBlurTimer, isReduced, last],
  );

  // Keep the ref the stable callbacks read in sync with rendered state.
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Enter each chapter at its head: reset the incoming panel's vertical scroll.
  useEffect(() => {
    const panel = panelsRef.current[index];
    if (panel) panel.scrollTop = 0;
  }, [index]);

  // Show the intertitle plate the FIRST time each chapter is entered (PORT-17,
  // fires on mount for the opening chapter too). First-visit-only keeps
  // back-and-forth nav fast and adds no mandatory wait — whether it should
  // re-show on return is the walkthrough's rhythm question (see the notes doc).
  useEffect(() => {
    const id = CHAPTERS[index].id;
    if (!seenRef.current.has(id)) {
      seenRef.current.add(id);
      setIntertitleId(id);
    }
  }, [index]);

  // Mirror the subscribed OS reduced-motion value into the ref that stable
  // callbacks read (the whip's blur pulse, the push-in's cut branch).
  useEffect(() => {
    reducedRef.current = osReduced;
  }, [osReduced]);

  // Keep the manual instant-cut toggle readable from stable callbacks.
  useEffect(() => {
    manualReducedRef.current = manualReduced;
  }, [manualReduced]);

  // Return focus to the entry trigger after an explicit exit. Runs post-render
  // so the track's inert flag is already off — calling focus() inside exitCase
  // would silently fail against a still-inert subtree.
  useEffect(() => {
    if (depth === "tableau" && returnFocusRef.current) {
      returnFocusRef.current = false;
      enterButtonRef.current?.focus();
    }
  }, [depth]);

  // Keyboard — the mandatory non-scroll path, identical to A and B so the three
  // candidates compare head-to-head. Arrows step (adjacent → truck); Home/End
  // jump to first/last (distant → whip). Vertical keys (↑/↓/PageUp/PageDown/
  // Space) are deliberately NOT touched, so native within-chapter scroll keeps
  // them.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          goTo(indexRef.current + 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          goTo(indexRef.current - 1);
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(last);
          break;
        case "Escape":
          // The depth axis's keyboard exit (PORT-19). exitCase no-ops when the
          // case study isn't open, so no guard needed here.
          exitCase();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitCase, goTo, last]);

  // Clear a pending blur timer on unmount.
  useEffect(() => clearBlurTimer, [clearBlurTimer]);

  const current = CHAPTERS[index];
  // The chapter the currently-held intertitle introduces (id → chapter), or
  // undefined when no plate is showing.
  const intertitle = intertitleId
    ? CHAPTERS.find((chapter) => chapter.id === intertitleId)
    : undefined;

  return (
    <div
      className={styles.prototype}
      data-reduced={manualReduced ? true : undefined}
    >
      {/* Controls: the rough chapter index + prev/next — the discoverable,
          hijack-free horizontal path (candidate A's model). Buttons, not
          anchors: this spike changes local state rather than routing. */}
      <div className={styles.controls}>
        <nav aria-label="Chapters (prototype)" className={styles.index}>
          <ul className={styles.indexList} role="list">
            {CHAPTERS.map((chapter, i) => {
              const isCurrent = i === index;
              return (
                <li key={chapter.id}>
                  <button
                    type="button"
                    className={`register-label ${styles.indexLink}`}
                    aria-current={isCurrent ? "page" : undefined}
                    data-current={isCurrent ? true : undefined}
                    onClick={() => goTo(i)}
                  >
                    {chapter.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.prevNext}>
          <Button
            variant="secondary"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous chapter"
          >
            ← Prev
          </Button>
          <Button
            variant="secondary"
            onClick={() => goTo(index + 1)}
            disabled={index === last}
            aria-label="Next chapter"
          >
            Next →
          </Button>
          {/* PORT-19: preview the reduced-motion instant cut without flipping
              OS settings — for the walkthrough's side-by-side judgment. Applies
              to the moving moves (truck, whip; depth is already a cut), like
              the real setting. When the OS already asks for reduced motion,
              that wins and this reads so. */}
          <Button
            variant="secondary"
            onClick={() => setManualReduced((value) => !value)}
            aria-pressed={manualReduced}
          >
            Motion: {osReduced || manualReduced ? "instant cut" : "full"}
          </Button>
        </div>
      </div>

      {/* The camera viewport. overflow:hidden horizontally — the track only moves
          on click/keyboard (no scroll-hijack). data-transit picks truck vs whip
          timing; data-blurring drives the whip blur pulse (see CSS). */}
      <div
        className={styles.viewport}
        data-transit={transit}
        data-blurring={blurring ? true : undefined}
      >
        {/* aria-live announces the settled chapter for keyboard/SR users — and,
            since PORT-19, the depth state too. Focus management on chapter
            change is a known gap — see the notes. */}
        <p className={styles.srStatus} role="status" aria-live="polite">
          {depth === "case"
            ? "Case study: CatalogIQ, within chapter 3, Projects."
            : `Chapter ${index + 1} of ${CHAPTERS.length}: ${current.label}`}
        </p>

        {/* The intertitle plate (PORT-17): held over the entering chapter, above
            the track, dismissed on any input or after its dwell. Keyed by chapter
            id so it remounts (fresh dwell) per chapter. It never blocks the
            tableau — on dismiss the parent stops rendering it. */}
        {intertitle ? (
          <Intertitle
            key={intertitle.id}
            kicker={INTERTITLES[intertitle.id].kicker}
            title={intertitle.label}
            line={INTERTITLES[intertitle.id].line}
            onDismiss={dismissIntertitle}
          />
        ) : null}

        {/* inert while inside the set (PORT-19): the tableau beneath the
            opaque overlay must not stay tabbable/readable. Released at the
            exit cut. */}
        <div
          className={styles.track}
          data-transit={transit}
          data-blurring={blurring ? true : undefined}
          inert={depth === "case" || undefined}
          style={{ "--truck-i": index } as CSSProperties}
        >
          {CHAPTERS.map((chapter, i) => {
            const Tableau = TABLEAUX[chapter.id];
            const isProjects = chapter.id === "projects";
            return (
              <section
                key={chapter.id}
                ref={(el) => {
                  panelsRef.current[i] = el;
                }}
                className={styles.panel}
                data-chapter={chapter.id}
                aria-hidden={i !== index}
              >
                {/* The vertical axis: the chapter's real (rough) tableau, tall
                    enough that native scroll has somewhere to go (PORT-16). The
                    kicker + title are the chaptered heading the harness owns;
                    intertitle plates between chapters are PORT-17. */}
                <div className={styles.panelInner}>
                  <p className={`register-kicker ${styles.kicker}`}>
                    Chapter {toRoman(i + 1)}
                  </p>
                  <h2 className={`register-intertitle ${styles.title}`}>
                    {chapter.label}
                  </h2>
                  {Tableau ? <Tableau /> : null}
                  {isProjects ? (
                    // PORT-19: the explicit entry into depth (progressive
                    // disclosure — push-in on explicit entry, never a novel
                    // mechanic). Harness-owned chrome below the tableau for the
                    // spike; production wants the affordance on the CatalogIQ
                    // plate itself (see the notes doc).
                    <Button
                      ref={enterButtonRef}
                      variant="secondary"
                      onClick={enterCase}
                    >
                      Enter the case study →
                    </Button>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>

        {/* The case-study set (PORT-19), layered over the track: mounting IS
            the entry cut (fresh per entry, so it always opens at its head —
            on the insert); unmounting is the exit cut. */}
        {depth === "case" ? <CaseStudy onExit={exitCase} /> : null}
      </div>
    </div>
  );
}
