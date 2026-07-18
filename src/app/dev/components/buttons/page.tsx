import type { Metadata } from "next";

import { Button, type ButtonVariant } from "@/components/Button";

import styles from "./page.module.css";

/**
 * Button component gallery — the render surface for the Button visual-regression
 * baselines (e2e/buttons.spec.ts). Every variant is shown in its default and
 * disabled states, plus the tertiary variant rendered as a link, so the whole
 * matrix from the Testing Strategy (component states) is captured in one page.
 *
 * This is a development/QA surface, not a chapter of the site — kept out of
 * search indexes and never linked from navigation. The primary/default button
 * is first in the DOM so a single Tab lands keyboard focus on it for the
 * focus-visible capture.
 */
export const metadata: Metadata = {
  title: "Button gallery — component states",
  robots: { index: false, follow: false },
};

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "destructive",
];

export default function ButtonGallery() {
  return (
    <main className={styles.stage}>
      <h1>Buttons</h1>

      <div className={styles.grid}>
        {VARIANTS.map((variant) => (
          <section key={variant} className={styles.group}>
            <p className={`register-label ${styles.groupLabel}`}>{variant}</p>
            <div className={styles.cell} data-testid={`cell-${variant}-default`}>
              <Button variant={variant} data-testid={`button-${variant}-default`}>
                {variant}
              </Button>
            </div>
            <div className={styles.cell} data-testid={`cell-${variant}-disabled`}>
              <Button variant={variant} disabled>
                {variant}
              </Button>
            </div>
          </section>
        ))}
      </div>

      <section className={styles.group}>
        <p className={`register-label ${styles.groupLabel}`}>tertiary as link</p>
        <div className={styles.cell}>
          <Button variant="tertiary" href="#resume">
            Download résumé
          </Button>
        </div>
      </section>
    </main>
  );
}
