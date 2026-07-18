/**
 * Central UI copy constants — "the deadpan script".
 *
 * Every fixed UI string on the site lands here, in one module, for one reason:
 * the copy-lint (copy.test.ts) needs a single target. The Testing Strategy
 * (docs/TESTING_STRATEGY.md → Test Data Management) calls for a "cheap
 * lint-style check on UI copy constants" enforcing the Brand Guide's deadpan
 * Tone of Voice — no exclamation marks, no film-themed copy. Keeping the strings
 * here (not inline in components) means that guard has one place to look and new
 * copy is checked the moment it is added.
 *
 * The deadpan third-person narrator handles *staging* copy (figure labels,
 * intertitles, empty/feedback states); Zaid's first-person *substance* copy
 * (bio, case studies) is authored in content, not here. Seed values below are
 * the Brand Guide's own approved "Good" examples.
 */

export const copy = {
  /**
   * Museum-plate figure convention — "Fig. 3 — The repricing engine."
   * The Caption component composes `prefix + number + separator + body`; the
   * number itself is supplied per figure (Arabic, or Roman via lib/numerals).
   */
  figure: {
    /** The figure sigil that opens every plate. */
    prefix: "Fig.",
    /** Em-dash between the figure label and its caption body. */
    separator: "—",
  },

  /** Empty states — deadpan, never apologetic, never emoji. */
  emptyState: {
    default: "Nothing here yet. The next chapter is being written.",
  },

  /** Inline form feedback — understated, declarative. */
  feedback: {
    success: "Sent. Expect a reply within a day.",
    missingAtSign: "That email address is missing an @. One is required.",
  },
} as const;

export type Copy = typeof copy;
