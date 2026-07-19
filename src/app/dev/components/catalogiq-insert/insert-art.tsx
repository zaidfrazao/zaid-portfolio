import type { SVGProps } from "react";

/**
 * Placeholder-grade SVG artifacts for the rough CatalogIQ knolled insert
 * (PORT-18). Deliberately crude, flat, axis-aligned stand-ins for the real
 * project screens and diagram — the point of the spike is the *arrangement*
 * (strict grid, equal gutters, every item labeled), not crafted imagery. Every
 * fill is a palette token (docs/BRAND_GUIDE.md → Color Palette); Mustard is the
 * single rare flourish (Hard Rule: under ~5% of a view) and appears exactly once
 * here, on the final pipeline node. Decorative by role — each glyph is described
 * by an adjacent `Label`/`Caption`, so all are `aria-hidden`.
 */

/** A flat overhead "screen" specimen: window chrome (a header band) over a few
 *  content lines. Uniform on purpose — knolled specimens read as a set; the
 *  five pipeline stages are told apart by their labels, not by decoration. */
export function ScreenGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 84" aria-hidden="true" focusable="false" {...props}>
      {/* screen ground */}
      <rect x="0" y="0" width="120" height="84" fill="var(--color-plate)" />
      {/* header band */}
      <rect x="0" y="0" width="120" height="16" fill="var(--color-teal)" />
      {/* content lines */}
      <rect x="12" y="30" width="72" height="6" fill="var(--color-rule)" />
      <rect x="12" y="44" width="96" height="6" fill="var(--color-rule)" />
      <rect x="12" y="58" width="52" height="6" fill="var(--color-rule)" />
      {/* hairline frame, drawn last so it sits above the fills */}
      <rect
        x="0.75"
        y="0.75"
        width="118.5"
        height="82.5"
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** The connective diagram fragment: five nodes on a rule joined left-to-right
 *  into an arrow — the ingest → enrich → match → QC → export flow. The terminal
 *  node is the lone Mustard flourish. */
export function PipelineGlyph(props: SVGProps<SVGSVGElement>) {
  const nodes = [40, 105, 170, 235, 300];
  return (
    <svg viewBox="0 0 320 40" aria-hidden="true" focusable="false" {...props}>
      {/* connecting rule behind the nodes */}
      <rect x="40" y="19" width="260" height="2" fill="var(--color-rule)" />
      {/* direction arrowhead, just before the terminal node */}
      <path d="M286 14 L296 20 L286 26 Z" fill="var(--color-sienna)" />
      {nodes.map((cx, i) => (
        <rect
          key={cx}
          x={cx - 10}
          y="10"
          width="20"
          height="20"
          fill={
            i === nodes.length - 1
              ? "var(--color-mustard)"
              : "var(--color-plate)"
          }
          stroke="var(--color-rule)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
