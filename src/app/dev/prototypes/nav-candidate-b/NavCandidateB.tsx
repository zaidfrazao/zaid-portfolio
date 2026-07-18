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

import styles from "./NavCandidateB.module.css";

/**
 * NavCandidateB — PORT-14 spike, prototype candidate B of the input mechanic
 * (PRD Feature 1: the mechanic is chosen by prototyping, not prescribed).
 *
 * This candidate adds SCROLL / SWIPE as an input over candidate A's otherwise
 * identical skeleton — deliberately the only variable that changes, so the
 * alignment review can compare the two mechanics head-to-head. Scroll never
 * free-scrolls: a wheel tick or swipe advances by exactly ONE chapter and then
 * the stage LOCKS until the lateral truck settles. That lock is the "snap" — you
 * can never rest between tableaux, and momentum ticks during a move are
 * swallowed. Scroll is additive: the visible index, prev/next, and keyboard are
 * the full, mandatory non-scroll path (no mechanic relies on scroll alone).
 *
 * The scroll is hijacked (preventDefault on wheel/touchmove over the stage) so
 * the branded truck plays instead of native scrolling — which is exactly the
 * mobile pitfall this spike exists to surface; see docs/prototypes/
 * PORT-14-candidate-b.md for the evidence. Throwaway quality by intent: it
 * composes the shipped leaves (Button, Plate, the CHAPTERS source of truth, the
 * Roman-numeral helper) over gray-box tableaux, touches no shipped component, and
 * keeps the truck timing in local CSS custom properties.
 */

// Mirrors --truck-duration in NavCandidateB.module.css: the lock is held for one
// truck so a fast scroll can't skip past a tableau.
const TRUCK_MS = 800;
// Accumulated |wheel delta| before a snap fires — a mouse notch is ~100, so this
// takes a deliberate tick rather than a twitch.
const WHEEL_THRESHOLD = 40;
// Horizontal travel (px) before a swipe counts as a page turn.
const SWIPE_THRESHOLD = 48;

export function NavCandidateB() {
  const [index, setIndex] = useState(0);
  const last = CHAPTERS.length - 1;

  // Refs the native (non-passive) scroll/touch listeners read, so their closures
  // never go stale between renders.
  const indexRef = useRef(index);
  const lockedRef = useRef(false); // true while a truck is settling
  const wheelAccumRef = useRef(0);
  const touchStartXRef = useRef<number | null>(null);
  const reducedRef = useRef(false);
  const lockTimerRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (target: number) => {
      // Clamp instead of wrapping: a truck runs on rails and never overshoots its
      // ends (Brand Guide hard rule), so the boundaries are hard stops.
      setIndex((current) => {
        const next = Math.min(Math.max(target, 0), last);
        return next === current ? current : next;
      });
    },
    [last],
  );

  // One scroll/swipe = one chapter, then lock. Reads/writes the index via refs so
  // it is stable for the native listeners. Boundaries move nothing (and so never
  // lock — otherwise a scroll into a wall would freeze the stage for a truck).
  const lockStep = useCallback(
    (dir: 1 | -1) => {
      const current = indexRef.current;
      const next = Math.min(Math.max(current + dir, 0), last);
      if (next === current) return; // clamped at a boundary — nothing to do
      lockedRef.current = true;
      setIndex(next);
      // Release after one truck. Under reduced motion the transition is instant,
      // so only a short debounce is needed to eat a single gesture's momentum.
      const lockMs = reducedRef.current ? 140 : TRUCK_MS;
      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = window.setTimeout(() => {
        lockedRef.current = false;
        wheelAccumRef.current = 0;
        lockTimerRef.current = null;
      }, lockMs);
    },
    [last],
  );

  // Keep the ref the native listeners read in sync with rendered state.
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Track prefers-reduced-motion so the lock matches the (instant) transition.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onChange = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Wheel input, hijacked. Non-passive so preventDefault can stop the page behind
  // the stage from scrolling; scoped to the viewport so the rest of the page
  // scrolls normally.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function onWheel(event: WheelEvent) {
      event.preventDefault(); // the hijack — consume scroll over the stage
      if (lockedRef.current) return; // mid-truck: swallow momentum ticks

      // Trackpads report deltaX on a two-finger horizontal swipe; a mouse wheel
      // reports deltaY. Take whichever axis dominates so both feel natural.
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      // Reset the accumulator when the scroll direction flips.
      if (Math.sign(delta) !== Math.sign(wheelAccumRef.current)) {
        wheelAccumRef.current = 0;
      }
      wheelAccumRef.current += delta;

      if (Math.abs(wheelAccumRef.current) < WHEEL_THRESHOLD) return;

      const dir: 1 | -1 = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      lockStep(dir);
    }

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [lockStep]);

  // Touch input, hijacked. A horizontal swipe turns the page; touchmove is
  // suppressed so the browser doesn't pan/scroll mid-gesture.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function onTouchStart(event: TouchEvent) {
      touchStartXRef.current = event.touches[0]?.clientX ?? null;
    }
    function onTouchMove(event: TouchEvent) {
      event.preventDefault(); // suppress native scroll during the swipe
    }
    function onTouchEnd(event: TouchEvent) {
      const startX = touchStartXRef.current;
      touchStartXRef.current = null;
      if (startX === null || lockedRef.current) return;
      const endX = event.changedTouches[0]?.clientX ?? startX;
      const travel = endX - startX;
      if (Math.abs(travel) < SWIPE_THRESHOLD) return;
      // Swipe left (negative travel) advances forward, like turning a page.
      lockStep(travel < 0 ? 1 : -1);
    }

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
    };
  }, [lockStep]);

  // Keyboard — identical to candidate A (the mandatory non-scroll path). Not
  // locked: explicit input may interrupt a truck, matching A for comparability.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          goTo(index + 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          goTo(index - 1);
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
  }, [goTo, index, last]);

  // Clear a pending lock timer on unmount.
  useEffect(
    () => () => {
      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
    },
    [],
  );

  const current = CHAPTERS[index];

  return (
    <div className={styles.prototype}>
      {/* Controls: the rough chapter index + prev/next. Buttons, not anchors —
          this candidate changes local state rather than routing. */}
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

      {/* The camera viewport. Scroll/swipe over it is hijacked and snapped to one
          chapter per gesture; touch-action:none / overscroll-behavior:contain
          keep the browser from panning the page underneath (see CSS). */}
      <div ref={viewportRef} className={styles.viewport}>
        {/* aria-live announces the settled chapter for keyboard/SR users. Focus
            management on chapter change is a known gap — see the notes. */}
        <p className={styles.srStatus} role="status" aria-live="polite">
          Chapter {index + 1} of {CHAPTERS.length}: {current.label}
        </p>

        <div
          className={styles.track}
          style={{ "--truck-i": index } as CSSProperties}
        >
          {CHAPTERS.map((chapter, i) => (
            <section
              key={chapter.id}
              className={styles.panel}
              data-chapter={chapter.id}
              aria-hidden={i !== index}
            >
              <p className={`register-kicker ${styles.kicker}`}>
                Chapter {toRoman(i + 1)}
              </p>
              <h2 className={`register-intertitle ${styles.title}`}>
                {chapter.label}
              </h2>
              <Plate border="frame" empty className={styles.tableau} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
