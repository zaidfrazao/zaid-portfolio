import type { Metadata } from "next";

import { Plate, type PlateBorder } from "@/components/Plate";

import styles from "./page.module.css";

/**
 * Plate component gallery — the render surface for the Plate visual-regression
 * baselines. Every border treatment is shown (bare, 1px Rule, 1.5px frame in
 * both Sienna and Rule inks) plus the static empty/loading placeholder, so the
 * whole matrix from the Testing Strategy is captured in one page.
 *
 * A development/QA surface, not a chapter of the site — kept out of search
 * indexes and never linked from navigation. Cells sit on the Paper ground so the
 * Plate fill reads as a distinct layer in the capture (color, not depth).
 */
export const metadata: Metadata = {
  title: "Plate gallery — component states",
  robots: { index: false, follow: false },
};

// [label, border, frameColor?]
const CASES: ReadonlyArray<
  [string, PlateBorder, ("sienna" | "rule")?]
> = [
  ["bare", "none"],
  ["rule border", "rule"],
  ["frame — sienna", "frame", "sienna"],
  ["frame — rule", "frame", "rule"],
];

export default function PlateGallery() {
  return (
    <main className={styles.stage}>
      <h1>Plates</h1>

      <div className={styles.grid}>
        {CASES.map(([label, border, frameColor]) => (
          <section key={label} className={styles.group}>
            <p className={`register-label ${styles.groupLabel}`}>{label}</p>
            <Plate
              border={border}
              frameColor={frameColor}
              className={styles.demo}
              data-testid={`plate-${border}${frameColor ? `-${frameColor}` : ""}`}
            >
              <h3>Plate</h3>
              <p className="register-caption">
                Flat surface, sharp corners, no shadow.
              </p>
            </Plate>
          </section>
        ))}

        <section className={styles.group}>
          <p className={`register-label ${styles.groupLabel}`}>empty (loading)</p>
          <Plate
            border="rule"
            empty
            className={styles.demo}
            data-testid="plate-empty"
          >
            {/* children are suppressed by the empty state */}
            <p>should not render</p>
          </Plate>
        </section>
      </div>
    </main>
  );
}
