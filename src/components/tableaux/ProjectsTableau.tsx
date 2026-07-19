import { Caption } from "@/components/Caption";
import { Label } from "@/components/Label";
import { Plate } from "@/components/Plate";

import { InsertStub } from "./art";
import styles from "./tableaux.module.css";

/**
 * ProjectsTableau — the Projects chapter scene (PORT-16, rough). CatalogIQ is
 * the anchor (PRD Feature 3), framed and full width above two supporting
 * projects in a mirrored row. Each project opens on an overhead "insert" stub,
 * then a one-line pitch and stack chips. Draft-real content from
 * docs/CONTENT_NOTES.md → Case Study Shortlist.
 *
 * NOTE: CatalogIQ's pilot figures are second-hand and flagged
 * "verify-before-publish" in CONTENT_NOTES — shown here as draft on a noindex
 * prototype, with the caption marking them unverified. Client work (the VRP
 * operator) is described, not named, pending permission.
 */

interface Project {
  fig: number;
  name: string;
  line: string;
  stack: readonly string[];
  /** Optional deadpan caption note, e.g. a stat still pending verification. */
  note?: string;
}

const ANCHOR: Project = {
  fig: 1,
  name: "CatalogIQ",
  line: "AI content generation for ecommerce listings, end to end: it ingests raw supplier data, generates titles, copy, and imagery, and exports Takealot-ready loadsheets. My own product, in production.",
  stack: ["Fastify", "TypeScript", "Postgres", "BullMQ", "Multi-model AI"],
  note: "15,000+ listings generated for the pilot client (figures pending verification).",
};

const SUPPORTING: readonly Project[] = [
  {
    fig: 2,
    name: "Route-planning solver",
    line: "An NP-hard vehicle-routing solver for a quarrying logistics operator that encodes human dispatchers' fairness intuition, not just least cost. In daily production; now a productized API.",
    stack: ["Python", "OR-Tools", "FastAPI", "OSRM"],
  },
  {
    fig: 3,
    name: "Agent platform",
    line: "An AI-agent platform with working memory, deep-research fan-out, browser automation, and 18+ integrations. ~250,000 lines in three months, a team of two.",
    stack: ["Next.js", "Mastra", "Postgres", "Composio"],
  },
];

function ProjectPlate({
  project,
  featured,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Plate
      as="article"
      border={featured ? "frame" : "rule"}
      className={styles.project}
    >
      <InsertStub className={styles.insert} />
      <Caption figure={project.fig} numeral="roman">
        {project.name}
        {project.note ? `. ${project.note}` : "."}
      </Caption>
      <h3>{project.name}</h3>
      <p className={`register-body ${styles.projectLine}`}>{project.line}</p>
      <div className={styles.chips}>
        {project.stack.map((tech) => (
          <Label key={tech} chip>
            {tech}
          </Label>
        ))}
      </div>
    </Plate>
  );
}

export function ProjectsTableau() {
  return (
    <div className={styles.tableau}>
      <div className={styles.projects}>
        <ProjectPlate project={ANCHOR} featured />
        <div className={styles.projectRow}>
          {SUPPORTING.map((project) => (
            <ProjectPlate key={project.name} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
