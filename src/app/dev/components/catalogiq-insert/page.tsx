import type { Metadata } from "next";

import { Plate } from "@/components/Plate";

import { CatalogIQInsert } from "./CatalogIQInsert";
import styles from "./page.module.css";

/**
 * CatalogIQ knolled-insert gallery (PORT-18 spike) — the render surface for
 * judging the rough overhead insert by eye. Two framings are shown: the insert
 * on its own (how it composes standalone) and dropped onto the Paper ground the
 * way a Projects-chapter tableau would host it, so the tray-on-page read can be
 * judged too.
 *
 * A development/QA surface, not a chapter of the site — kept out of search
 * indexes and never linked from navigation. Coverage-excluded (src/app/dev/**).
 */
export const metadata: Metadata = {
  title: "CatalogIQ insert — knolled flat-lay (rough)",
  robots: { index: false, follow: false },
};

const CASES: readonly string[] = [
  "standalone",
  "on a plate ground",
];

export default function CatalogIQInsertGallery() {
  return (
    <main className={styles.stage}>
      <h1>CatalogIQ knolled insert</h1>
      <p className={`register-body ${styles.note}`}>
        Rough spike (PORT-18). Placeholder-grade art, real arrangement
        discipline — judging whether the overhead flat-lay reads top-down. Notes:
        docs/prototypes/PORT-18-catalogiq-insert.md.
      </p>

      <div className={styles.cases}>
        {CASES.map((label) => (
          <section key={label} className={styles.case}>
            <p className={`register-label ${styles.caseLabel}`}>{label}</p>
            {label === "on a plate ground" ? (
              <Plate className={styles.ground}>
                <CatalogIQInsert />
              </Plate>
            ) : (
              <CatalogIQInsert />
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
