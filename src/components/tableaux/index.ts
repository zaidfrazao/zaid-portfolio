/**
 * The four rough chapter tableaux (PORT-16), keyed by ChapterIndex `id` so a
 * consumer can render the scene for a given chapter. Portable, static, and
 * nav-agnostic: mounted into the candidate-C prototype harness now, promotable
 * to real chapter routes in Phase 3 unchanged.
 */
import type { ComponentType } from "react";

import { AboutTableau } from "./AboutTableau";
import { ContactTableau } from "./ContactTableau";
import { ExperienceTableau } from "./ExperienceTableau";
import { ProjectsTableau } from "./ProjectsTableau";

export { AboutTableau } from "./AboutTableau";
export { ContactTableau } from "./ContactTableau";
export { ExperienceTableau } from "./ExperienceTableau";
export { ProjectsTableau } from "./ProjectsTableau";

/** Chapter `id` (from ChapterIndex CHAPTERS) → its tableau component. */
export const TABLEAUX: Record<string, ComponentType> = {
  about: AboutTableau,
  experience: ExperienceTableau,
  projects: ProjectsTableau,
  contact: ContactTableau,
};
