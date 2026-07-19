import { Caption } from "@/components/Caption";
import { Label } from "@/components/Label";
import { Plate } from "@/components/Plate";

import { PipelineGlyph, ScreenGlyph } from "./insert-art";
import styles from "./CatalogIQInsert.module.css";

/**
 * CatalogIQInsert — a rough overhead "insert" for CatalogIQ (PORT-18 spike):
 * a knolled flat-lay of the project's artifacts on a strict grid with equal
 * gutters, every item labeled. It reads top-down — objects laid on a tray and
 * photographed from above — not as a card grid, because it is composed as bands
 * sharing one gutter rhythm inside an inset hairline frame (the tray edge), flat
 * and axis-aligned (Brand Guide: Knolling; grammar #7 — overhead inserts).
 *
 * Placeholder-grade art (see insert-art.tsx), real arrangement discipline. The
 * concept is what is being judged; the SVG is throwaway. Draft-real content is
 * from docs/CONTENT_NOTES.md → CatalogIQ. Repo-verified figures (LOC, commits)
 * are shown plainly; the pilot listing count is second-hand and marked
 * "pending verification" per the same notes' verify-before-publish rule.
 *
 * Design notes and the carry-forward questions for the production insert-layout
 * system live in docs/prototypes/PORT-18-catalogiq-insert.md.
 */

/** The product pipeline, laid out left-to-right as five screen specimens. */
const STAGES: readonly string[] = [
  "Ingest",
  "Enrich",
  "Match",
  "QC",
  "Export",
];

/** The stack, as self-labeling register chips (one labeled specimen tile). */
const STACK: readonly string[] = [
  "Fastify",
  "TypeScript",
  "Postgres",
  "BullMQ",
  "Multi-model AI",
];

interface Stat {
  value: string;
  unit: string;
  /** Second-hand figure — carried, but flagged not-yet-verified. */
  pending?: boolean;
}

const STATS: readonly Stat[] = [
  { value: "≈116k", unit: "Lines of code" },
  { value: "428", unit: "Commits" },
  { value: "15,000+", unit: "Listings, pilot", pending: true },
];

export function CatalogIQInsert() {
  return (
    <figure className={styles.insert}>
      {/* The tray: an inset hairline frame holds the whole flat-lay. */}
      <Plate border="frame" className={styles.tray}>
        {/* Band 1 — the pipeline, five screen specimens on a strict grid. */}
        <div className={styles.stages}>
          {STAGES.map((stage, i) => (
            <div key={stage} className={styles.item}>
              <ScreenGlyph className={styles.screen} />
              <Label className={styles.itemLabel}>
                {String(i + 1).padStart(2, "0")} · {stage}
              </Label>
            </div>
          ))}
        </div>

        {/* Band 2 — the connective diagram, spanning the tray. */}
        <div className={styles.item}>
          <PipelineGlyph className={styles.pipeline} />
          <Label className={styles.itemLabel}>Pipeline</Label>
        </div>

        {/* Band 3 — the stack, one labeled specimen of register chips. */}
        <div className={styles.item}>
          <div className={styles.chips}>
            {STACK.map((tech) => (
              <Label key={tech} chip>
                {tech}
              </Label>
            ))}
          </div>
          <Label className={styles.itemLabel}>Stack</Label>
        </div>

        {/* Band 4 — the numbers, three stat specimens on a strict grid. */}
        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.unit} className={styles.stat}>
              <span className={`register-h2 register-stat ${styles.statValue}`}>
                {stat.value}
                {stat.pending ? <span className={styles.dagger}>†</span> : null}
              </span>
              <Label className={styles.itemLabel}>{stat.unit}</Label>
            </div>
          ))}
        </div>
      </Plate>

      <Caption as="figcaption" figure={1} numeral="roman">
        CatalogIQ, laid out overhead: the pipeline, the stack, the numbers.
      </Caption>
      <p className={`register-caption ${styles.footnote}`}>
        † Pilot figure is second-hand; pending verification before publish.
      </p>
    </figure>
  );
}
