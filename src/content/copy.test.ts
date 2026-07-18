import { describe, expect, it } from "vitest";

import { copy } from "./copy";

/**
 * The copy-lint (Testing Strategy → Test Data Management). Every UI string in
 * the central copy module must hold the Brand Guide's deadpan Tone of Voice:
 * no exclamation marks and no film-themed lobby copy. This walks the whole
 * `copy` object so the guard covers strings added later, not just today's.
 *
 * It deliberately targets the copy CONSTANTS, not rendered output — copy lives
 * centrally precisely so this check has a single, cheap target.
 */

/** Collect every string leaf as `[dotted.path, value]`, recursing into objects. */
function stringLeaves(
  value: unknown,
  path = "",
): ReadonlyArray<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      stringLeaves(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

const LEAVES = stringLeaves(copy);

/**
 * Film-lobby vocabulary the Brand Guide's Tone → Don't list bans ("now
 * showing," "ticket," "concierge") plus close siblings. The formal grammar of
 * the films is welcome; their *settings and artifacts* are not.
 */
const FILM_PHRASES: readonly string[] = [
  "now showing",
  "now playing",
  "showtime",
  "box office",
  "matinee",
  "ticket",
  "concierge",
];

describe("copy-lint — deadpan Tone of Voice", () => {
  it("has strings to lint", () => {
    // Guard the guard: an empty copy object would make every assertion below
    // pass vacuously.
    expect(LEAVES.length).toBeGreaterThan(0);
  });

  it.each(LEAVES)("%s carries no exclamation mark", (_path, text) => {
    expect(text).not.toContain("!");
  });

  it.each(LEAVES)("%s uses no film-themed copy", (_path, text) => {
    const haystack = text.toLowerCase();
    const hit = FILM_PHRASES.find((phrase) => haystack.includes(phrase));
    expect(hit, `"${text}" contains banned film copy: ${hit}`).toBeUndefined();
  });
});
