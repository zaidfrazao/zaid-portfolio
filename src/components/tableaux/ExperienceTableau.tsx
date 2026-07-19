import { Plate } from "@/components/Plate";

import styles from "./tableaux.module.css";

/**
 * ExperienceTableau — the Experience chapter scene (PORT-16, rough). A symmetric
 * timeline down the vertical centerline: each role a centered Plate with mono
 * dates, company, role, and one deadpan line. Draft-real content from
 * docs/CONTENT_NOTES.md → Career Timeline.
 *
 * NOTE: several dates are still rough (marked "~") and flagged for confirmation
 * in CONTENT_NOTES "Open Items" — fine for a spike walkthrough, verify before
 * this is promoted to a real route. Client work is described, not named, per the
 * showability constraints in the notes.
 */

interface Role {
  /** Rough span; "~" flags a date still pending confirmation. */
  dates: string;
  company: string;
  title: string;
  line: string;
}

/** Newest first — the site opens on where Zaid is now. */
const ROLES: readonly Role[] = [
  {
    dates: "2023 – present",
    company: "Lakar",
    title: "Lead developer · de-facto CTO",
    line: "Most technical decisions across the product line for an Australian startup; I manage a junior developer I trained from scratch.",
  },
  {
    dates: "~2020 – 2022",
    company: "The Kalan Collective",
    title: "Founder & managing director",
    line: "A software agency of seven. It collapsed when its main client's cashflow failed and I had to let the team go — the hardest thing I have done, and the most instructive.",
  },
  {
    dates: "~2018 – 2021",
    company: "Zentraedi → EasyOnline",
    title: "Software lead",
    line: "Internal systems for a family ecommerce operation, including a robust 200,000-SKU daily repricing and stock-planning engine.",
  },
  {
    dates: "~2016 – 2019",
    company: "Sportomatic",
    title: "Co-founder",
    line: "Sports-management software for schools, built with the friends I would go on to build with for the next decade.",
  },
  {
    dates: "2013 – 2016",
    company: "Stellenbosch University",
    title: "Electrical engineering → computer science",
    line: "Left before finishing to found a company. I have learned everything since by shipping.",
  },
];

export function ExperienceTableau() {
  return (
    <div className={styles.tableau}>
      <ol className={styles.timeline}>
        {ROLES.map((role) => (
          <li key={role.company}>
            <Plate as="article" border="rule" className={styles.role}>
              <p className={`register-stat ${styles.dates}`}>{role.dates}</p>
              <h3>{role.company}</h3>
              <p className={`register-label ${styles.roleTitle}`}>
                {role.title}
              </p>
              <p className={`register-body ${styles.roleLine}`}>{role.line}</p>
            </Plate>
          </li>
        ))}
      </ol>
    </div>
  );
}
