import type { Metadata } from "next";

import { NavCandidateC } from "./NavCandidateC";

import styles from "./page.module.css";

/**
 * PORT-15 spike surface — the HYBRID prototype of the navigation input mechanic.
 * Chapter-to-chapter travel is explicit (click / keyboard) and branches on
 * distance — adjacent chapters truck, distant chapters whip-pan — while native
 * scroll drives progress WITHIN a chapter. A throwaway /dev route for the
 * alignment demo with Zaid, not a chapter of the site: kept out of search
 * indexes and never linked from navigation. The evaluation write-up (with the
 * comparative A/B/C notes) lives in docs/prototypes/PORT-15-candidate-c.md.
 */
export const metadata: Metadata = {
  title: "Nav candidate C — hybrid (distance-branch + scroll-within) (PORT-15 spike)",
  robots: { index: false, follow: false },
};

export default function NavCandidateCPage() {
  return (
    <main className={styles.stage}>
      <header className={styles.head}>
        <p className={`register-kicker ${styles.kicker}`}>PORT-15 · Candidate C</p>
        <h1>Hybrid — distance-branched jumps + scroll-within-chapter</h1>
        <p className={styles.lede}>
          The chosen mechanic, now walked end to end with rough draft content in
          all four chapters (PORT-16). Chapter-to-chapter travel is explicit and
          branches on distance: an adjacent move trucks (~800ms), a distant jump
          whip-pans (~350ms, with a brief blur). Scroll is not hijacked — it
          drives progress <em>within</em> the current chapter. The chapter index
          and keyboard are the full horizontal path, so nothing relies on a
          gesture.
        </p>
        <p className={`register-caption ${styles.keys}`}>
          Horizontal (chapters): index / prev-next · <kbd>←</kbd> / <kbd>→</kbd>{" "}
          adjacent (truck) · <kbd>Home</kbd> / <kbd>End</kbd> first / last (whip) ·
          Vertical (within a chapter): scroll / swipe
        </p>
      </header>

      <NavCandidateC />
    </main>
  );
}
