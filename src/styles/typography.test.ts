import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  fontFamily,
  registerClass,
  registers,
  remOf,
  type Register,
  type RegisterName,
} from "./typography";

/**
 * The Brand Guide is the spec (docs/BRAND_GUIDE.md → Typography → Registers &
 * Scale). These expectations are transcribed straight from the table; if the
 * guide changes, this test is where the change is ratified before the token
 * module and stylesheet may follow.
 */
const BRAND_GUIDE: Record<RegisterName, Register> = {
  // Register          desktop mobile  weight  tracking  treatment
  intertitleKicker: {
    desktop: 12,
    mobile: 12,
    weight: 500,
    tracking: 0.35,
    transform: "uppercase",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  intertitleTitle: {
    desktop: 40,
    mobile: 28,
    weight: 600,
    tracking: 0.12,
    transform: "uppercase",
    lineHeight: null,
    align: "center",
    maxWidth: null,
    color: null,
    family: "sans",
  },
  h1: {
    desktop: 44,
    mobile: 32,
    weight: 600,
    tracking: -0.01,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  h2: {
    desktop: 28,
    mobile: 24,
    weight: 600,
    tracking: null,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  h3: {
    desktop: 20,
    mobile: 18,
    weight: 500,
    tracking: null,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  body: {
    desktop: 17,
    mobile: 16,
    weight: 400,
    tracking: null,
    transform: "none",
    lineHeight: 1.65,
    align: null,
    maxWidth: "68ch",
    color: null,
    family: "sans",
  },
  label: {
    desktop: 11,
    mobile: 11,
    weight: 500,
    tracking: 0.22,
    transform: "uppercase",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: null,
    family: "sans",
  },
  caption: {
    desktop: 13,
    mobile: 13,
    weight: 400,
    tracking: null,
    transform: "none",
    lineHeight: null,
    align: null,
    maxWidth: null,
    color: "sepia",
    family: "sans",
  },
};

// Vitest runs from the repo root; resolve globals.css against it. Comments are
// stripped so assertions test the actual rules, not prose that happens to
// mention "justify" or a class name.
const globalsCss = readFileSync(
  resolve(process.cwd(), "src/app/globals.css"),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");

/** The stylesheet split into (selector, body) rules, media blocks flattened. */
const desktopBlock =
  globalsCss.match(/@media\s*\(min-width:\s*768px\)\s*\{([\s\S]*)\}/)?.[1] ?? "";
// Everything before the desktop media block is the mobile-first base layer.
const baseCss = globalsCss.slice(0, globalsCss.indexOf("@media"));

/** Extract the declaration body of `.register-x { ... }` from a stylesheet slice. */
function ruleBody(css: string, className: string): string {
  // Match a rule whose selector list contains `.className`, up to the first `}`.
  const re = new RegExp(
    `(^|[},])\\s*([^{}]*\\.${className}\\b[^{}]*)\\{([^}]*)\\}`,
    "m",
  );
  return re.exec(css)?.[3] ?? "";
}

describe("typography registers", () => {
  it("exposes exactly the 8 documented registers", () => {
    expect(Object.keys(registers).sort()).toEqual(
      Object.keys(BRAND_GUIDE).sort(),
    );
    expect(Object.keys(registers)).toHaveLength(8);
  });

  it("matches the Brand Guide table for every register", () => {
    expect(registers).toEqual(BRAND_GUIDE);
  });

  it("keeps JetBrains Mono out of every register (never headings or prose)", () => {
    for (const [name, r] of Object.entries(registers)) {
      expect(r.family, name).toBe("sans");
    }
    // Mono is still wired up — as a family token, not a register.
    expect(fontFamily.mono).toBe("var(--font-mono)");
    expect(fontFamily.sans).toBe("var(--font-jost)");
  });

  it("holds the body register's hard-specified reading metrics", () => {
    expect(registers.body.lineHeight).toBe(1.65);
    expect(registers.body.maxWidth).toBe("68ch");
  });

  it("uppercases the staged registers (kicker, intertitle title, label)", () => {
    expect(registers.intertitleKicker.transform).toBe("uppercase");
    expect(registers.intertitleTitle.transform).toBe("uppercase");
    expect(registers.label.transform).toBe("uppercase");
  });

  it("centers the intertitle title and nothing that reads as prose", () => {
    expect(registers.intertitleTitle.align).toBe("center");
    expect(registers.body.align).toBeNull();
    expect(registers.h1.align).toBeNull();
  });

  it("fixes the caption color to sepia", () => {
    expect(registers.caption.color).toBe("sepia");
  });
});

describe("CSS ↔ TS parity (globals.css)", () => {
  it("defines a utility class for every register carrying its mobile size + weight", () => {
    for (const name of Object.keys(registers) as RegisterName[]) {
      const spec = registers[name];
      const body = ruleBody(baseCss, registerClass[name]);
      expect(body, `${name}: base rule .${registerClass[name]}`).not.toBe("");
      expect(body, `${name}: font-size`).toContain(
        `font-size: ${remOf(spec.mobile)}`,
      );
      expect(body, `${name}: font-weight`).toContain(
        `font-weight: ${spec.weight}`,
      );
    }
  });

  it("places every desktop size that differs from mobile in the 768px block", () => {
    for (const name of Object.keys(registers) as RegisterName[]) {
      const spec = registers[name];
      if (spec.desktop === spec.mobile) continue;
      const body = ruleBody(desktopBlock, registerClass[name]);
      expect(body, `${name}: desktop rule in @media`).toContain(
        `font-size: ${remOf(spec.desktop)}`,
      );
    }
  });

  it("declares the body register's line-height and 68ch measure in CSS", () => {
    const body = ruleBody(baseCss, registerClass.body);
    expect(body).toContain("line-height: 1.65");
    expect(body).toContain("max-width: 68ch");
  });

  it("wires the mono family to code and stat readouts only", () => {
    // The mono family appears on code/pre/.register-stat, never on a register class.
    expect(globalsCss).toMatch(/\.register-stat\b/);
    expect(globalsCss).toContain("font-family: var(--font-mono)");
    for (const name of Object.keys(registers) as RegisterName[]) {
      const body = ruleBody(globalsCss, registerClass[name]);
      expect(body, `${name} must not use mono`).not.toContain("--font-mono");
    }
  });

  it("never justifies text (Brand Guide hard rule)", () => {
    expect(globalsCss).not.toMatch(/text-align:\s*justify/);
  });
});
