"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { Button } from "@/components/Button";
import { CHAPTERS } from "@/components/ChapterIndex";
import { Plate } from "@/components/Plate";
import { toRoman } from "@/lib/numerals";

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
 * Throwaway quality by intent — docs/prototypes/PORT-15-candidate-c.md holds the
 * learnings and the comparative A/B/C notes. It composes the shipped leaves
 * (Button, Plate, the CHAPTERS source of truth, the Roman-numeral helper) over
 * gray-box tableaux with stacked placeholder plates (so the vertical axis has
 * something to scroll), touches no shipped component, and keeps the truck /
 * whip-pan timing in local CSS custom properties rather than global motion
 * tokens (promoting those with parity tests is Phase-3 work).
 */

// Whip-pan duration for distant jumps (Brand Guide: 300–400ms). Mirrors
// --whip-duration in NavCandidateC.module.css; also drives the blur-pulse timing.
const WHIP_MS = 350;
// A move of this many chapters or more is "distant" → whip-pan instead of truck.
const DISTANT = 2;

type Transit = "truck" | "whip";

export function NavCandidateC() {
  const [index, setIndex] = useState(0);
  // How the LAST move travelled, so CSS can pick truck vs whip timing/easing.
  const [transit, setTransit] = useState<Transit>("truck");
  // Drives the blur pulse during a whip (up now, down at mid-transit).
  const [blurring, setBlurring] = useState(false);
  const last = CHAPTERS.length - 1;

  // Refs so callbacks stay stable and closures never read stale state.
  const indexRef = useRef(index);
  const reducedRef = useRef(false);
  const blurTimerRef = useRef<number | null>(null);
  // Each chapter is its own vertical scroll context; we reset the incoming one
  // to its head on entry so you always arrive at the top of a room.
  const panelsRef = useRef<(HTMLElement | null)[]>([]);

  const clearBlurTimer = useCallback(() => {
    if (blurTimerRef.current !== null) {
      window.clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }, []);

  const goTo = useCallback(
    (target: number) => {
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
      if (mode === "whip" && !reducedRef.current) {
        setBlurring(true);
        blurTimerRef.current = window.setTimeout(
          () => setBlurring(false),
          Math.round(WHIP_MS / 2),
        );
      } else {
        setBlurring(false);
      }
    },
    [clearBlurTimer, last],
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

  // Track prefers-reduced-motion so the whip runs without a blur pulse.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onChange = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, last]);

  // Clear a pending blur timer on unmount.
  useEffect(() => clearBlurTimer, [clearBlurTimer]);

  const current = CHAPTERS[index];

  return (
    <div className={styles.prototype}>
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
        {/* aria-live announces the settled chapter for keyboard/SR users. Focus
            management on chapter change is a known gap — see the notes. */}
        <p className={styles.srStatus} role="status" aria-live="polite">
          Chapter {index + 1} of {CHAPTERS.length}: {current.label}
        </p>

        <div
          className={styles.track}
          data-transit={transit}
          data-blurring={blurring ? true : undefined}
          style={{ "--truck-i": index } as CSSProperties}
        >
          {CHAPTERS.map((chapter, i) => (
            <section
              key={chapter.id}
              ref={(el) => {
                panelsRef.current[i] = el;
              }}
              className={styles.panel}
              data-chapter={chapter.id}
              aria-hidden={i !== index}
            >
              {/* The vertical axis: real stacked content so scroll has somewhere
                  to go. Placeholder plates stand in for a chapter's figures. */}
              <div className={styles.panelInner}>
                <p className={`register-kicker ${styles.kicker}`}>
                  Chapter {toRoman(i + 1)}
                </p>
                <h2 className={`register-intertitle ${styles.title}`}>
                  {chapter.label}
                </h2>
                <p className={`register-caption ${styles.scrollHint}`}>
                  Scroll within this chapter — the vertical axis is native, only
                  the horizontal (chapter-to-chapter) axis is a branded move.
                </p>
                <Plate border="frame" empty className={styles.tableau} />
                <Plate border="rule" empty className={styles.tableau} />
                <Plate border="rule" empty className={styles.tableau} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
