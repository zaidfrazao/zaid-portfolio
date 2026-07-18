import type { Metadata } from "next";

import { NavCandidateB } from "./NavCandidateB";

import styles from "./page.module.css";

/**
 * PORT-14 spike surface — prototype candidate B of the navigation input mechanic
 * (scroll / swipe drives the chapters, but every settled state snaps to a
 * locked-off tableau). A throwaway /dev route for the alignment demo with Zaid,
 * not a chapter of the site: kept out of search indexes and never linked from
 * navigation. The evaluation write-up lives in
 * docs/prototypes/PORT-14-candidate-b.md.
 */
export const metadata: Metadata = {
  title: "Nav candidate B — scroll + snap tableaux (PORT-14 spike)",
  robots: { index: false, follow: false },
};

export default function NavCandidateBPage() {
  return (
    <main className={styles.stage}>
      <header className={styles.head}>
        <p className={`register-kicker ${styles.kicker}`}>PORT-14 · Candidate B</p>
        <h1>Scroll / swipe navigation with snap tableaux</h1>
        <p className={styles.lede}>
          Scroll or swipe over the stage to travel between chapters — each gesture
          advances exactly one chapter and snaps to a locked-off tableau, joined
          by a lateral truck (~800ms, no overshoot). There is no free-scrolling
          mid-state. The chapter index and keyboard do the same job, so nothing
          relies on scroll alone.
        </p>
        <p className={`register-caption ${styles.keys}`}>
          Gesture: scroll wheel / trackpad / swipe over the stage · Keys:{" "}
          <kbd>←</kbd> / <kbd>→</kbd> prev / next · <kbd>Home</kbd> / <kbd>End</kbd>{" "}
          first / last
        </p>
      </header>

      <NavCandidateB />
    </main>
  );
}
