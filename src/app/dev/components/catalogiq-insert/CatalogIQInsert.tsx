import { Caption } from "@/components/Caption";
import { Label } from "@/components/Label";
import { Plate } from "@/components/Plate";

import {
  ListingCardGlyph,
  LoadsheetGlyph,
  PencilGlyph,
  RulerGlyph,
  SupplierCardGlyph,
} from "./insert-art";
import styles from "./CatalogIQInsert.module.css";

/**
 * CatalogIQInsert — a rough overhead "insert" for CatalogIQ (PORT-18 spike,
 * second pass): a knolled flat-lay of the project's artifacts on a strict grid
 * with equal gutters, every item labeled (Brand Guide → Knolling; grammar #7 —
 * overhead inserts; PRD Feature 3).
 *
 * The first pass arranged uniform UI tiles in bands and read as a generic
 * summary — the finding (docs/prototypes/PORT-18-catalogiq-insert.md) is that
 * the overhead read comes from *object silhouettes on a surface*, not from a
 * grid alone. So this pass lays real-shaped objects on the tray, one 3×3 master
 * grid, symmetric about the centreline:
 *
 *   supplier card   ·  generated listing  ·  loadsheet stack
 *   one pencil      ·  the stack, chips   ·  one ruler
 *   tag: LOC        ·  tag: commits       ·  tag: listings
 *
 * Row one is the product story as before/after paperwork; row two is the
 * arranger's tools flanking the stack (deadpan-labeled like everything else);
 * row three is the numbers as punched specimen tags. Repo-verified figures are
 * shown plainly; the second-hand pilot figure is flagged "pending verification"
 * per docs/CONTENT_NOTES.md's verify-before-publish rule.
 */

const CARDS = [
  { label: "01 · Supplier data", Glyph: SupplierCardGlyph },
  { label: "02 · Generated listing", Glyph: ListingCardGlyph },
  { label: "03 · Loadsheet", Glyph: LoadsheetGlyph },
] as const;

/** The stack, laid out as labeled swatch chips. */
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
      {/* The tray: an inset hairline frame is the surface the objects lie on. */}
      <Plate border="frame" className={styles.tray}>
        {/* Row 1 — the paperwork: raw input, finished output, the export. */}
        {CARDS.map(({ label, Glyph }) => (
          <div key={label} className={styles.item}>
            <Glyph className={styles.card} />
            <Label className={styles.itemLabel}>{label}</Label>
          </div>
        ))}

        {/* Row 2 — the arranger's tools flank the stack. */}
        <div className={styles.item}>
          <PencilGlyph className={styles.tool} />
          <Label className={styles.itemLabel}>One pencil</Label>
        </div>
        <div className={styles.item}>
          <div className={styles.chips}>
            {STACK.map((tech) => (
              <Label key={tech} chip>
                {tech}
              </Label>
            ))}
          </div>
          <Label className={styles.itemLabel}>The stack</Label>
        </div>
        <div className={styles.item}>
          <RulerGlyph className={styles.tool} />
          <Label className={styles.itemLabel}>One ruler</Label>
        </div>

        {/* Row 3 — the numbers, as punched specimen tags. */}
        {STATS.map((stat) => (
          <div key={stat.unit} className={styles.item}>
            <div className={styles.tag}>
              <span className={styles.tagHole} aria-hidden="true" />
              <span className={`register-h3 register-stat ${styles.statValue}`}>
                {stat.value}
                {stat.pending ? <span className={styles.dagger}>†</span> : null}
              </span>
              <Label className={styles.itemLabel}>{stat.unit}</Label>
            </div>
          </div>
        ))}
      </Plate>

      <Caption as="figcaption" figure={1} numeral="roman">
        CatalogIQ, knolled: the input, the output, the tools, the numbers.
      </Caption>
      <p className={`register-caption ${styles.footnote}`}>
        † Pilot figure is second-hand; pending verification before publish.
      </p>
    </figure>
  );
}
