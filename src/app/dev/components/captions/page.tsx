import type { Metadata } from "next";

import { Caption, type CaptionNumeral } from "@/components/Caption";

import styles from "./page.module.css";

/**
 * Caption component gallery — the render surface for the Caption
 * visual-regression baselines. A plain caption plus the museum-plate figure
 * convention in both Arabic and Roman numerals, so the Sepia register and the
 * `Fig. N —` format are captured in one page.
 *
 * A development/QA surface, not a chapter of the site — kept out of search
 * indexes and never linked from navigation.
 */
export const metadata: Metadata = {
  title: "Caption gallery — component states",
  robots: { index: false, follow: false },
};

// [gallery label, figure?, numeral?]
const CASES: ReadonlyArray<[string, number | undefined, CaptionNumeral?]> = [
  ["plain caption", undefined],
  ["figure — arabic", 3, "arabic"],
  ["figure — roman", 3, "roman"],
];

export default function CaptionGallery() {
  return (
    <main className={styles.stage}>
      <h1>Captions</h1>

      <div className={styles.grid}>
        {CASES.map(([label, figure, numeral]) => (
          <section key={label} className={styles.group}>
            <p className={`register-label ${styles.groupLabel}`}>{label}</p>
            <Caption
              figure={figure}
              numeral={numeral}
              data-testid={`caption-${figure ? numeral : "plain"}`}
            >
              The repricing engine. 200,000 SKUs. Daily.
            </Caption>
          </section>
        ))}
      </div>
    </main>
  );
}
