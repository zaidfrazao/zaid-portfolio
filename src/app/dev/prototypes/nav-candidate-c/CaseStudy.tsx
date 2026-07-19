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
 * ENTRY IS A STRAIGHT CUT and this layer does not animate (walkthrough
 * verdicts, 2026-07-19): v1's zoom-crossfade read as a transition effect, and
 * v2's push-then-cut still felt like "zoom on nothing" — a dolly on flat DOM
 * has no depth cues (no parallax, no focus pull), so it reads as page
 * magnification, not camera travel. The zoom idea is RESERVED for some future
 * non-transition use; the scene change is a cut to close-up: this component
 * mounts opening on the insert, so the cut reads as a match cut on the object
 * the tableau's plate was holding. See the notes doc.
 *
 * The content is draft-real, pulled from what the repo already records: the
 * PORT-18 knolled insert as the opening figure (imported directly — dev→dev,
 * both coverage-excluded), and section stubs derived from the ProjectsTableau
 * anchor copy. Enough depth that the set's scroll axis is real; final copy is
 * Phase-4 work.
 */

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
  /** Cut back out to the Projects tableau (the harness runs the pull-back). */
  onExit: () => void;
}

export function CaseStudy({ onExit }: CaseStudyProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The mount IS the cut, so focus moves to the set's heading immediately.
  // Keyboard/SR users land inside the set instead of on a now-covered tableau
  // (the harness marks the track inert while the set is up, and returns focus
  // to the entry trigger on exit). preventScroll: the heading sits below the
  // insert, and the default scroll-into-view would drag the set past it —
  // the cut must land on the insert (the match-cut object), not mid-set.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={styles.set}>
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

        {/* The opening figure FIRST: the cut lands on the PORT-18 knolled
            flat-lay — a match cut from the tableau plate's insert stub to the
            real insert, not a cut to a fresh page header. */}
        <CatalogIQInsert />

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
