import type { Metadata } from "next";

import { ChapterIndex } from "@/components/ChapterIndex";

import styles from "./page.module.css";

/**
 * ChapterIndex gallery — the render surface for the chapter-index visual-
 * regression baselines (e2e/chapter-index.spec.ts). Shows the nav shell with the
 * first chapter (About) current, so the Sienna current-marking and the resting
 * chapters are captured together, at both the 1440 and 360 viewports.
 *
 * A development/QA surface, not a chapter of the site — kept out of search
 * indexes and never linked from navigation. The chapter index is the first (and
 * only) interactive element, so a single Tab lands keyboard focus on its first
 * link for the focus-visible capture.
 */
export const metadata: Metadata = {
  title: "Chapter index gallery — component states",
  robots: { index: false, follow: false },
};

export default function ChapterIndexGallery() {
  return (
    <main className={styles.stage}>
      <h1>Chapter index</h1>

      <section className={styles.group}>
        <p className={`register-label ${styles.groupLabel}`}>about current</p>
        <div className={styles.cell}>
          <ChapterIndex current="about" />
        </div>
      </section>
    </main>
  );
}
