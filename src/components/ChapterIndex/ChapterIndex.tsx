import type { ComponentPropsWithRef } from "react";

import styles from "./ChapterIndex.module.css";

/**
 * ChapterIndex — the persistent chapter index (docs/BRAND_GUIDE.md →
 * Navigation): About · Experience · Projects · Contact, always visible, in the
 * Label register, with the current chapter marked in Sienna. It doubles as the
 * 10-second-path guarantee (PRD Feature 4) — Contact is one of the four
 * chapters, so the contact affordance is always one interaction away.
 *
 * This is the STATIC shell (PORT-12). It renders real `<a>` anchors at the
 * eventual chapter routes and marks `current` literally; Phase 3 wires the
 * active chapter to the router and adds the lateral-truck transitions. Nothing
 * about the markup or props needs to change for that — `current` simply becomes
 * a derived value.
 *
 * Like Label and Plate it is a structural, non-interactive leaf, so it stays a
 * Server Component: native `<a>` elements are keyboard-focusable in DOM order
 * with no client JS, and `ref`/`aria-*`/`data-*` forward as plain props.
 */

/** One chapter in the index. `id` is the stable key and the `current` match. */
export interface Chapter {
  /** Stable identifier, also matched against the `current` prop. */
  id: string;
  /** The chapter name, rendered in the Label register. */
  label: string;
  /** Destination route (a real anchor target, valid before the page exists). */
  href: string;
}

/**
 * The four canonical chapters, in narrative order (Brand Guide → Navigation).
 * Exported so consumers and tests share one source of truth rather than
 * restating the list.
 */
export const CHAPTERS: readonly Chapter[] = [
  { id: "about", label: "About", href: "/about" },
  { id: "experience", label: "Experience", href: "/experience" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

interface ChapterIndexOwnProps {
  /** The chapters to render. Defaults to the four canonical {@link CHAPTERS}. */
  chapters?: readonly Chapter[];
  /** `id` of the current chapter — marked in Sienna with `aria-current="page"`. */
  current?: string;
}

/** Own props plus the native `<nav>` props (own props win). */
export type ChapterIndexProps = ChapterIndexOwnProps &
  Omit<ComponentPropsWithRef<"nav">, keyof ChapterIndexOwnProps>;

export function ChapterIndex({
  chapters = CHAPTERS,
  current,
  className,
  ...rest
}: ChapterIndexProps) {
  const classes = [styles.nav, className].filter(Boolean).join(" ");

  return (
    <nav {...rest} aria-label="Chapters" className={classes}>
      <ul className={styles.list}>
        {chapters.map((chapter) => {
          const isCurrent = chapter.id === current;
          return (
            <li key={chapter.id} className={styles.item}>
              <a
                href={chapter.href}
                className={`register-label ${styles.link}`}
                aria-current={isCurrent ? "page" : undefined}
                data-current={isCurrent ? true : undefined}
              >
                {chapter.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
