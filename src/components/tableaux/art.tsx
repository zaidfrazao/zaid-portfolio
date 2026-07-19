import type { SVGProps } from "react";

/**
 * Placeholder-grade SVG imagery for the rough chapter tableaux (PORT-16). These
 * are deliberately crude, flat, symmetric stand-ins — not the crafted scenes of
 * later phases — so the walkthrough has real staged imagery instead of gray
 * boxes while the compositions are judged for alignment. Every fill is a palette
 * token (docs/BRAND_GUIDE.md → Color Palette); Mustard stays a rare flourish
 * (Hard Rule usage: under ~5% of a view). Decorative by role — each is described
 * by an adjacent `Caption`, so they are `aria-hidden`.
 */

/** A round "portrait" medallion — the About chapter's staged subject. The circle
 *  is the sanctioned radius exception (Brand Guide: perfect circles for the rare
 *  medallion). */
export function PortraitMedallion(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" {...props}>
      <defs>
        <clipPath id="tableau-medallion">
          <circle cx="60" cy="60" r="59" />
        </clipPath>
      </defs>
      <g clipPath="url(#tableau-medallion)">
        <circle cx="60" cy="60" r="59" fill="var(--color-plate)" />
        {/* shoulders */}
        <path d="M22 120 Q60 72 98 120 Z" fill="var(--color-teal)" />
        {/* head */}
        <circle cx="60" cy="50" r="21" fill="var(--color-sienna)" />
      </g>
      {/* hairline frame around the medallion */}
      <circle
        cx="60"
        cy="60"
        r="59"
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** An overhead knolled "insert" flat-lay stub — the Projects chapter's set-piece
 *  imagery (PRD Feature 3: each project opens as an overhead insert). Items on a
 *  strict grid with equal gutters, per the Brand Guide's knolling rule. */
export function InsertStub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" focusable="false" {...props}>
      <rect x="0" y="0" width="160" height="120" fill="var(--color-plate)" />
      <rect
        x="16"
        y="16"
        width="60"
        height="40"
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      <rect x="88" y="16" width="56" height="24" fill="var(--color-teal)" />
      <rect
        x="88"
        y="48"
        width="56"
        height="24"
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      <rect x="16" y="68" width="36" height="36" fill="var(--color-sienna)" />
      <rect
        x="60"
        y="68"
        width="36"
        height="36"
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      {/* the lone mustard flourish — small, decorative only */}
      <rect x="104" y="80" width="40" height="24" fill="var(--color-mustard)" />
    </svg>
  );
}
