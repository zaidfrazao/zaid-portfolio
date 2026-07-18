import type { Metadata } from "next";

import { NavCandidateA } from "./NavCandidateA";

import styles from "./page.module.css";

/**
 * PORT-13 spike surface — prototype candidate A of the navigation input mechanic
 * (click + keyboard only, lateral-truck transitions). A throwaway /dev route for
 * the alignment demo with Zaid, not a chapter of the site: kept out of search
 * indexes and never linked from navigation. The evaluation write-up lives in
 * docs/prototypes/PORT-13-candidate-a.md.
 */
export const metadata: Metadata = {
  title: "Nav candidate A — click / keyboard (PORT-13 spike)",
  robots: { index: false, follow: false },
};

export default function NavCandidateAPage() {
  return (
    <main className={styles.stage}>
      <header className={styles.head}>
        <p className={`register-kicker ${styles.kicker}`}>PORT-13 · Candidate A</p>
        <h1>Click / keyboard navigation</h1>
        <p className={styles.lede}>
          Chapters change only on explicit input — click the index or prev/next,
          or use the keyboard. Adjacent chapters are joined by a lateral truck
          (~800ms, no overshoot). No scroll mechanic, by design.
        </p>
        <p className={`register-caption ${styles.keys}`}>
          Keys: <kbd>←</kbd> / <kbd>→</kbd> prev / next · <kbd>Home</kbd> /{" "}
          <kbd>End</kbd> first / last
        </p>
      </header>

      <NavCandidateA />
    </main>
  );
}
