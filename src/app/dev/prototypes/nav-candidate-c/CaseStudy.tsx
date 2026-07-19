"use client";

import { useEffect, useRef } from "react";

import { CatalogIQInsert } from "@/app/dev/components/catalogiq-insert/CatalogIQInsert";
import { Button } from "@/components/Button";
import { Plate } from "@/components/Plate";

import styles from "./CaseStudy.module.css";

/**
 * CaseStudy — PORT-19 spike. The rough CatalogIQ case-study "set" that the
 * push-in camera move enters from the Projects tableau (Brand Guide → Animation
 * & Motion: push-in, 900–1200ms, `cubic-bezier(0.25, 0.1, 0.25, 1)`, meaning
 * "entering a project/case study"; PRD Feature 3 — the overhead insert opens
 * into the case study).
 *
 * Throwaway by intent — the learnings live in
 * docs/prototypes/PORT-19-push-in-entry.md. It is an OVERLAY layered over the
 * Projects panel inside the harness viewport, not a route: the spike is about
 * the camera move, so entry/exit are local state in NavCandidateC. The layer is
 * its own vertical scroll context (a set you can walk around once inside), and
 * it mounts fresh on every entry, so you always arrive at the head of the set.
 *
 * The content is draft-real, pulled from what the repo already records: the
 * PORT-18 knolled insert as the opening figure (imported directly — dev→dev,
 * both coverage-excluded), and section stubs derived from the ProjectsTableau
 * anchor copy. Enough depth that the set's scroll axis is real; final copy is
 * Phase-4 work.
 */

/**
 * Push-in duration (Brand Guide band: 900–1200ms; mid-ish). Mirrors
 * `--push-duration` in NavCandidateC.module.css — keep in lockstep. Also drives
 * the harness's exit-unmount timer and the settle-then-focus timer below.
 */
export const PUSH_MS = 1000;

/** Rough section stubs so the set is tall enough to scroll. Draft-real copy. */
const SECTIONS: readonly { title: string; line: string }[] = [
  {
    title: "The problem",
    line: "Suppliers hand over ragged spreadsheets and no photography; Takealot wants finished listings. The gap between the two is manual work nobody enjoys.",
  },
  {
    title: "The build",
    line: "A Fastify/TypeScript pipeline: ingest raw supplier data, generate titles, copy, and imagery across multiple models, queue the heavy work through BullMQ, and export Takealot-ready loadsheets from Postgres.",
  },
  {
    title: "The numbers",
    line: "≈116k lines of code and 428 commits, repo-verified. 15,000+ listings generated for the pilot client — second-hand figure, pending verification before publish.",
  },
];

interface CaseStudyProps {
  /**
   * The settled depth state — true once the camera should be (or has finished)
   * pushing in. The harness mounts the layer first, then flips this a frame
   * later so the CSS transition runs (or in the same tick under an instant cut).
   */
  open: boolean;
  /** Instant-cut mode: OS prefers-reduced-motion OR the harness preview toggle. */
  reduced: boolean;
  /** Pull the camera back out to the Projects tableau. */
  onExit: () => void;
}

export function CaseStudy({ open, reduced, onExit }: CaseStudyProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the set's heading once the camera settles — immediately under
  // an instant cut. Keyboard/SR users land inside the set instead of on a
  // now-covered tableau (the harness marks the track inert while open, and
  // returns focus to the entry trigger on exit).
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(
      () => headingRef.current?.focus(),
      reduced ? 0 : PUSH_MS,
    );
    return () => window.clearTimeout(timer);
  }, [open, reduced]);

  return (
    <div className={styles.set} data-open={open || undefined}>
      <div className={styles.setInner}>
        {/* Explicit exit — the reverse move is as discoverable as the entry
            (progressive disclosure: depth by explicit entry, never trapped). */}
        <div className={styles.backRow}>
          <Button variant="secondary" onClick={onExit}>
            ← Back to Projects
          </Button>
          <span className={`register-caption ${styles.escHint}`}>
            or press Esc
          </span>
        </div>

        <p className={`register-kicker ${styles.kicker}`}>Case study</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className={`register-intertitle ${styles.title}`}
        >
          CatalogIQ
        </h2>
        <p className={styles.line}>
          In which one product is examined at close range.
        </p>

        {/* The opening figure: the PORT-18 knolled flat-lay, now literally the
            thing the push-in lands on. */}
        <CatalogIQInsert />

        {SECTIONS.map((section) => (
          <Plate
            key={section.title}
            as="section"
            border="rule"
            className={styles.section}
          >
            <h3>{section.title}</h3>
            <p className="register-body">{section.line}</p>
          </Plate>
        ))}
      </div>
    </div>
  );
}
