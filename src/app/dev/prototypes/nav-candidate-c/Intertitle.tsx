"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./Intertitle.module.css";

/**
 * Intertitle — PORT-17 spike. The rough intertitle plate that introduces a
 * chapter: a deadpan kicker + the chapter title on a Teal plate, held over the
 * entering chapter for a beat, then gone (docs/BRAND_GUIDE.md → Typography;
 * Hard Rule 6 — our OWN plate system, not the Tenenbaums Futura title-card).
 *
 * Prototype-scoped and throwaway by intent (learnings + rhythm notes live in
 * docs/prototypes/PORT-17-intertitle-plates.md). It is an OVERLAY, not a panel
 * in the horizontal track: the chapter is already mounted and interactive
 * beneath it, so the plate never becomes a mandatory wait (PRD Feature 2 —
 * skippable/interruptible). Any input dismisses it immediately; otherwise it
 * self-dismisses after a short dwell. On dismiss the parent unmounts it, so it
 * never blocks the tableau underneath.
 *
 * It is aria-hidden: the harness already owns an aria-live status line that
 * announces the settled chapter, so the plate is decorative staging for sighted
 * users and must not re-announce or trap. Its window listeners only call
 * onDismiss (no preventDefault / stopPropagation), so the harness's own
 * keyboard chapter-nav keeps working through it.
 */

/** How long the plate holds, fully settled, before it starts to leave (rough). */
const DWELL_MS = 1400;
/**
 * Fade-out duration on dismiss. The plate eases away rather than hard-cutting to
 * nothing — a straight cut reads as jarring here. Keep in lockstep with
 * `--exit-ms` in Intertitle.module.css (this drives the unmount timer). Under
 * reduced motion the exit is instant (no fade, no wait).
 */
const EXIT_MS = 500;

/** The narrator's staging copy for one chapter (deadpan; no film references). */
export interface IntertitleCopy {
  /** Spelled-out chapter line, e.g. "Chapter One" (narrator voice). */
  kicker: string;
  /** The "In which…" narrator line under the title. */
  line: string;
}

/**
 * Draft intertitle copy per chapter id (Brand Guide → Tone of Voice: deadpan
 * third-person narrator staging; "Chapter One, in which the builder is
 * introduced."). Rough placeholder wording for a spike — final copy is a
 * walkthrough question. Kept local to the prototype: the shipped CHAPTERS
 * source of truth is untouched (promotion is Phase-3 work).
 */
export const INTERTITLES: Record<string, IntertitleCopy> = {
  about: { kicker: "Chapter One", line: "In which the builder is introduced." },
  experience: {
    kicker: "Chapter Two",
    line: "In which the work is accounted for, since 2017.",
  },
  projects: {
    kicker: "Chapter Three",
    line: "In which a few things that shipped are examined.",
  },
  contact: {
    kicker: "Chapter Four",
    line: "In which the reader is invited to write.",
  },
};

interface IntertitleProps {
  /** Spelled-out chapter line ("Chapter One"). */
  kicker: string;
  /** The chapter title (all-caps intertitle register). */
  title: string;
  /** The narrator's "In which…" line. */
  line: string;
  /** Called when the plate dismisses — the parent then unmounts it. */
  onDismiss: () => void;
}

export function Intertitle({ kicker, title, line, onDismiss }: IntertitleProps) {
  // `false` until the enter frame flips it: the plate mounts at opacity 0, then
  // eases in (see the CSS transition). On exit it flips back to false to ease
  // out before the parent unmounts. Both directions are transitions, not cuts.
  const [visible, setVisible] = useState(false);
  // Guard so the dwell timer and an input dismiss can't both start the exit twice.
  const dismissedRef = useRef(false);
  const reducedRef = useRef(false);

  // Ease the plate in: mount at opacity 0, then flip `visible` on a later frame so
  // the browser paints the 0 state first and the opacity change actually
  // transitions (a single rAF can be too early — double it).
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let exitTimer = 0;
    // Start leaving: fade out, then let the parent unmount once the fade lands.
    // Under reduced motion there is no fade — dismiss at once (content parity).
    const beginExit = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      if (reducedRef.current) {
        onDismiss();
        return;
      }
      setVisible(false);
      exitTimer = window.setTimeout(onDismiss, EXIT_MS);
    };

    // Any input skips the plate (PRD Feature 2). Listeners only begin the exit —
    // no preventDefault — so an ArrowRight still navigates and the first scroll
    // gesture still reaches the panel underneath.
    const dwellTimer = window.setTimeout(beginExit, DWELL_MS);
    window.addEventListener("pointerdown", beginExit);
    window.addEventListener("keydown", beginExit);
    window.addEventListener("wheel", beginExit, { passive: true });
    window.addEventListener("touchstart", beginExit, { passive: true });

    return () => {
      window.clearTimeout(dwellTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("pointerdown", beginExit);
      window.removeEventListener("keydown", beginExit);
      window.removeEventListener("wheel", beginExit);
      window.removeEventListener("touchstart", beginExit);
    };
  }, [onDismiss]);

  return (
    <div className={styles.plate} data-visible={visible} aria-hidden="true">
      <p className={`register-kicker ${styles.kicker}`}>{kicker}</p>
      <h2 className={`register-intertitle ${styles.title}`}>{title}</h2>
      <p className={styles.line}>{line}</p>
    </div>
  );
}
