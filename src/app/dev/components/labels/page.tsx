import type { Metadata } from "next";

import { Label } from "@/components/Label";

import styles from "./page.module.css";

/**
 * Label component gallery — the render surface for the Label visual-regression
 * baselines. Both treatments (bare label, bordered chip) are shown so the
 * register (ALL CAPS, 0.22em tracking) and the chip's hairline edge are captured
 * in one page.
 *
 * A development/QA surface, not a chapter of the site — kept out of search
 * indexes and never linked from navigation. Cells sit on the Paper ground so the
 * chip's Plate fill reads as a distinct layer (color, not depth).
 */
export const metadata: Metadata = {
  title: "Label gallery — component states",
  robots: { index: false, follow: false },
};

// [gallery label, chip?]
const CASES: ReadonlyArray<[string, boolean]> = [
  ["bare label", false],
  ["chip", true],
];

export default function LabelGallery() {
  return (
    <main className={styles.stage}>
      <h1>Labels</h1>

      <div className={styles.grid}>
        {CASES.map(([label, chip]) => (
          <section key={label} className={styles.group}>
            <p className={`register-label ${styles.groupLabel}`}>{label}</p>
            <Label chip={chip} data-testid={`label-${chip ? "chip" : "bare"}`}>
              Founder
            </Label>
          </section>
        ))}
      </div>
    </main>
  );
}
