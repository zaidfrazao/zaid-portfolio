"use client";

import { useEffect, useRef } from "react";

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

/** How long the plate holds before self-dismissing (rough — judged in the walkthrough). */
const DWELL_MS = 1400;

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
  // Guard so the dwell timer and an input dismiss can't both fire onDismiss.
  const dismissedRef = useRef(false);

  useEffect(() => {
    const dismiss = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      onDismiss();
    };

    // Any input skips the plate at once (PRD Feature 2). Listeners only dismiss —
    // no preventDefault — so an ArrowRight still navigates and the first scroll
    // gesture still reaches the panel underneath.
    const timer = window.setTimeout(dismiss, DWELL_MS);
    window.addEventListener("pointerdown", dismiss);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchstart", dismiss, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [onDismiss]);

  return (
    <div className={styles.plate} aria-hidden="true">
      <p className={`register-kicker ${styles.kicker}`}>{kicker}</p>
      <h2 className={`register-intertitle ${styles.title}`}>{title}</h2>
      <p className={styles.line}>{line}</p>
    </div>
  );
}
