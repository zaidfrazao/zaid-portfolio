"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

import { Button } from "@/components/Button";
import { CHAPTERS } from "@/components/ChapterIndex";
import { Plate } from "@/components/Plate";
import { toRoman } from "@/lib/numerals";

import styles from "./NavCandidateA.module.css";

/**
 * NavCandidateA — PORT-13 spike, prototype candidate A of the input mechanic
 * (PRD Feature 1: the mechanic is chosen by prototyping, not prescribed).
 *
 * This candidate is CLICK + KEYBOARD ONLY — deliberately no scroll mechanic, to
 * judge it in isolation. Chapter changes are driven by the rough chapter index,
 * the prev/next controls, and the arrow / Home / End keys. Adjacent chapters are
 * joined by the Brand Guide's lateral truck (700–900ms, cardinal, no overshoot);
 * distant jumps truck straight through at the same tempo (option (a) from the
 * plan — one mechanic to judge, rather than switching to a whip-pan mid-spike).
 *
 * Throwaway quality by intent (docs/prototypes/PORT-13-candidate-a.md holds the
 * learnings). It composes the shipped design-system leaves — Button, Plate, the
 * CHAPTERS source of truth, the Roman-numeral helper — over gray-box tableaux.
 * It does NOT touch the shipped ChapterIndex, and the truck timing lives in
 * local CSS custom properties rather than global motion tokens (promoting those
 * with parity tests is Phase-3 work, flagged in the notes).
 */
export function NavCandidateA() {
  const [index, setIndex] = useState(0);
  const last = CHAPTERS.length - 1;

  const goTo = useCallback(
    (target: number) => {
      // Clamp instead of wrapping: a truck runs on rails and never overshoots
      // its ends (Brand Guide hard rule), so the boundaries are hard stops.
      setIndex((current) => {
        const next = Math.min(Math.max(target, 0), last);
        return next === current ? current : next;
      });
    },
    [last],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Don't hijack typing if focus is ever inside a field on this stage.
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

      {/* The camera viewport. overflow:hidden with no scroll-snap — nothing here
          responds to scroll; the track only moves on click/keyboard. */}
      <div className={styles.viewport}>
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
