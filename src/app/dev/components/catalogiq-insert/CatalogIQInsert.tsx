import { Caption } from "@/components/Caption";
import { Label } from "@/components/Label";
import { Plate } from "@/components/Plate";

import {
  ListingCardGlyph,
  LoadsheetGlyph,
  PhotoPrintGlyph,
  SupplierCardGlyph,
} from "./insert-art";
import styles from "./CatalogIQInsert.module.css";

/**
 * CatalogIQInsert — a rough overhead "insert" for CatalogIQ (PORT-18 spike):
 * a knolled flat-lay of the project's artifacts on a strict grid with equal
 * gutters, every item labeled (Brand Guide → Knolling; grammar #7 — overhead
 * inserts; PRD Feature 3).
 *
 * Two findings shape this pass (docs/prototypes/PORT-18-catalogiq-insert.md):
 * the overhead read comes from *object silhouettes on a surface* (the first
 * pass's uniform UI tiles read as a summary), and a homogeneous grid of equal
 * cells reads as a table — so the tray is a bento: one 6-column master grid,
 * mixed footprints on one gutter rhythm, roughly mirrored about the centreline:
 *
 *   supplier (2c)      │ listing (2c,     │ loadsheet (2c)
 *   tag LOC │ tag 428  │  2 rows, hero)   │ photo │ tag 15k†
 *   ───────────── the stack, swatch rail (6c) ─────────────
 *
 * Every object is an honest CatalogIQ artifact ("grammar, not props" — the
 * earlier pencil/ruler ornaments are gone): the ragged supplier card, the
 * finished portrait listing (hero), the loadsheet stack, one AI-generated
 * product photo printed as a specimen (the lone Mustard), the numbers as
 * punched tags, the stack as a swatch rail. Repo-verified figures are shown
 * plainly; the second-hand pilot figure is flagged "pending verification" per
 * docs/CONTENT_NOTES.md's verify-before-publish rule.
 *
 * Source order is the mobile order (single-column tray): the paperwork story,
 * the photo, the stack, then the numbers.
 */

/** The stack, laid out as a swatch rail of labeled chips. */
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
  /** Bento cell (CSS grid-area class) for the tag. */
  area: string;
  /** Second-hand figure — carried, but flagged not-yet-verified. */
  pending?: boolean;
}

const STATS: readonly Stat[] = [
  { value: "≈116k", unit: "Lines of code", area: styles.areaTagLoc },
  { value: "428", unit: "Commits", area: styles.areaTagCommits },
  {
    value: "15,000+",
    unit: "Listings, pilot",
    area: styles.areaTagListings,
    pending: true,
  },
];

export function CatalogIQInsert() {
  return (
    <figure className={styles.insert}>
      {/* The tray: an inset hairline frame is the surface the objects lie on. */}
      <Plate border="frame" className={styles.tray}>
        {/* The paperwork: raw input, finished output (hero), the export. */}
        <div className={`${styles.item} ${styles.areaSupplier}`}>
          <SupplierCardGlyph className={styles.sheet} />
          <Label className={styles.itemLabel}>01 · Supplier data</Label>
        </div>
        <div className={`${styles.item} ${styles.areaListing}`}>
          <ListingCardGlyph className={styles.hero} />
          <Label className={styles.itemLabel}>02 · Generated listing</Label>
        </div>
        <div className={`${styles.item} ${styles.areaLoadsheet}`}>
          <LoadsheetGlyph className={styles.sheet} />
          <Label className={styles.itemLabel}>03 · Loadsheet</Label>
        </div>

        {/* One generated product photo, printed as a specimen. */}
        <div className={`${styles.item} ${styles.areaPhoto}`}>
          <PhotoPrintGlyph className={styles.photo} />
          <Label className={styles.itemLabel}>One product photo</Label>
        </div>

        {/* The stack, as a swatch rail across the tray. */}
        <div className={`${styles.item} ${styles.areaChips}`}>
          <div className={styles.chips}>
            {STACK.map((tech) => (
              <Label key={tech} chip>
                {tech}
              </Label>
            ))}
          </div>
          <Label className={styles.itemLabel}>The stack</Label>
        </div>

        {/* The numbers, as punched specimen tags. */}
        {STATS.map((stat) => (
          <div key={stat.unit} className={`${styles.item} ${stat.area}`}>
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
        CatalogIQ, knolled: the input, the output, the numbers.
      </Caption>
      <p className={`register-caption ${styles.footnote}`}>
        † Pilot figure is second-hand; pending verification before publish.
      </p>
    </figure>
  );
}
