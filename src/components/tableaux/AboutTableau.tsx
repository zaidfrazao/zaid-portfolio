import { Caption } from "@/components/Caption";
import { Label } from "@/components/Label";

import { PortraitMedallion } from "./art";
import styles from "./tableaux.module.css";

/**
 * AboutTableau — the About chapter scene (PORT-16, rough). Carries the
 * 10-second-path raw material (PRD Feature 4): the name and the positioning
 * line, high and centered, before any prose. The bio is first-person substance
 * (Brand Guide → Tone of Voice: the human sells the work); the medallion + Fig.
 * caption are the deadpan narrator's staging.
 *
 * Draft-real content sourced from docs/CONTENT_NOTES.md (career arc, the
 * pre-AI/AI-era pivot). Good-enough draft, not final copy.
 */
export function AboutTableau() {
  return (
    <div className={styles.tableau}>
      <PortraitMedallion className={styles.medallion} />
      <Caption figure={1} numeral="roman">
        The builder.
      </Caption>

      <h1 className={styles.name}>Zaid Frazao</h1>
      <Label as="p" className={styles.positioning}>
        AI-accelerated product builder
      </Label>

      <div className={`register-body ${styles.bio}`}>
        <p>
          I have been writing code since I was eleven and shipping it
          professionally since 2017. Across four ventures I have been the
          architect, the developer, the designer, the project manager, and the
          managing director — often at once. The through-line is ecommerce:
          internal systems for a family retail operation, a 200,000-SKU daily
          repricing engine, and now CatalogIQ, my own product.
        </p>
        <p>
          For most of that time I kept AI away from my code. I treated
          programming as a craft with particular rules, and I was a skeptic — the
          early tools earned it. Then someone I trust, and know to be meticulous,
          told me their team had gone all-in on Claude Code. I did the homework:
          MCP servers, skills, memory, agent orchestration. Now I delegate almost
          all the typing and spend my attention where it counts — planning,
          design, and testing. The work is more rigorous than it was in my
          craftsman years, not less.
        </p>
      </div>
    </div>
  );
}
