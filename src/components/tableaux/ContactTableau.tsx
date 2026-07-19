import { Button } from "@/components/Button";

import styles from "./tableaux.module.css";

/**
 * ContactTableau — the Contact chapter scene (PORT-16, rough). The commercial
 * essentials, centered: availability, a single primary action (email), the
 * resume, and socials. Satisfies the 10-second path's guarantee that contact is
 * always close (PRD Feature 4). Deadpan staging + first-person availability.
 *
 * NOTE (drafts, from CONTENT_NOTES "Open Items"): the email is Zaid's current
 * address — confirm the public contact address before promotion; the resume PDF
 * does not exist yet (placeholder link); the LinkedIn URL is a placeholder.
 * GitHub is real (github.com/zaidfrazao).
 */
export function ContactTableau() {
  return (
    <div className={`${styles.tableau} ${styles.contact}`}>
      <p className={`register-body ${styles.availability}`}>
        Available for about 20 hours a week, immediately, alongside my Lakar
        work. If you are building something and want it built carefully and
        fast, start here.
      </p>

      <div className={styles.actions}>
        <Button href="mailto:zaidfrazao@gmail.com" variant="primary">
          Email Zaid
        </Button>
        {/* TODO(PORT-16): real resume PDF once written — placeholder link. */}
        <Button href="#" variant="secondary">
          Résumé (PDF)
        </Button>
      </div>

      <div className={styles.socials}>
        <Button href="https://github.com/zaidfrazao" variant="tertiary">
          GitHub
        </Button>
        {/* TODO(PORT-16): real LinkedIn URL — placeholder link. */}
        <Button href="#" variant="tertiary">
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
