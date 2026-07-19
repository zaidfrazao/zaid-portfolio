import type { SVGProps } from "react";

/**
 * Placeholder-grade SVG artifacts for the rough CatalogIQ knolled insert
 * (PORT-18, second pass). The first pass drew UI chrome (browser-window tiles)
 * and read as a card grid, not a flat-lay — the carry-forward finding in
 * docs/prototypes/PORT-18-catalogiq-insert.md. These glyphs instead depict
 * *objects seen from directly above*, lying on a surface: paper sheets, a
 * printed listing card, a loadsheet stack, and the arranger's tools. The
 * overhead read comes from the object silhouettes, not from the grid alone.
 *
 * Every object is an honest CatalogIQ artifact ("grammar, not props" — no
 * decorative stationery): the paperwork, a generated product photo, the export.
 * Every fill is a palette token (docs/BRAND_GUIDE.md → Color Palette); sheets
 * are Paper-on-Plate so the tray reads as the surface beneath them. Mustard is
 * the single rare flourish (Hard Rule: under ~5% of a view) and appears exactly
 * once — the product in the photo print. Decorative by role — each glyph is
 * described by an adjacent `Label`/`Caption`, so all are `aria-hidden`.
 */

/** The raw supplier data, as received: a ruled card with ragged lines and an
 *  empty image box — the messy input the pipeline exists to fix. */
export function SupplierCardGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 112" aria-hidden="true" focusable="false" {...props}>
      {/* the sheet, lying on the tray */}
      <rect
        x="0.75"
        y="0.75"
        width="158.5"
        height="110.5"
        fill="var(--color-paper)"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      {/* the missing product photo */}
      <rect
        x="12"
        y="12"
        width="44"
        height="36"
        fill="none"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      <rect x="30" y="29" width="8" height="2" fill="var(--color-rule)" />
      {/* ragged supplier copy — uneven line lengths on purpose */}
      <rect x="64" y="14" width="84" height="6" fill="var(--color-rule)" />
      <rect x="64" y="26" width="52" height="6" fill="var(--color-rule)" />
      <rect x="64" y="38" width="72" height="6" fill="var(--color-rule)" />
      <rect x="12" y="60" width="120" height="6" fill="var(--color-rule)" />
      <rect x="12" y="72" width="88" height="6" fill="var(--color-rule)" />
      <rect x="12" y="84" width="132" height="6" fill="var(--color-rule)" />
      <rect x="12" y="96" width="56" height="6" fill="var(--color-rule)" />
    </svg>
  );
}

/** The generated listing: the finished card, portrait — the bento hero. A real
 *  product photo, tidy uniform copy, a price block. The before/after against
 *  the supplier card is the product story told as two objects. */
export function ListingCardGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 208" aria-hidden="true" focusable="false" {...props}>
      <rect
        x="0.75"
        y="0.75"
        width="158.5"
        height="206.5"
        fill="var(--color-paper)"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      {/* the generated product photo */}
      <rect x="12" y="12" width="136" height="88" fill="var(--color-teal)" />
      <rect x="65" y="42" width="30" height="24" fill="var(--color-sienna)" />
      {/* tidy title lines */}
      <rect x="12" y="112" width="120" height="6" fill="var(--color-rule)" />
      <rect x="12" y="124" width="88" height="6" fill="var(--color-rule)" />
      {/* tidy body copy — uniform, fully justified */}
      <rect x="12" y="142" width="136" height="4" fill="var(--color-rule)" />
      <rect x="12" y="151" width="136" height="4" fill="var(--color-rule)" />
      <rect x="12" y="160" width="136" height="4" fill="var(--color-rule)" />
      <rect x="12" y="169" width="96" height="4" fill="var(--color-rule)" />
      {/* the price block */}
      <rect x="12" y="186" width="32" height="10" fill="var(--color-sienna)" />
    </svg>
  );
}

/** One AI-generated product photo, printed as a specimen — a print with a
 *  margin, the photo inside, the product itself the lone Mustard element. */
export function PhotoPrintGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 132" aria-hidden="true" focusable="false" {...props}>
      {/* the print */}
      <rect
        x="0.75"
        y="0.75"
        width="118.5"
        height="130.5"
        fill="var(--color-paper)"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      {/* the photo — deeper bottom margin, like a mounted print */}
      <rect x="8" y="8" width="104" height="100" fill="var(--color-teal)" />
      {/* the product — the single mustard element in the insert */}
      <rect x="46" y="46" width="28" height="24" fill="var(--color-mustard)" />
    </svg>
  );
}

/** The Takealot-ready loadsheet: a spreadsheet sheet on a slight stack (a
 *  second sheet peeks out behind it) — the export, as paperwork. */
export function LoadsheetGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 112" aria-hidden="true" focusable="false" {...props}>
      {/* the sheet beneath, offset — a stack, expressed flat (no shadow) */}
      <rect
        x="10"
        y="0.75"
        width="148.5"
        height="103"
        fill="var(--color-paper)"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      {/* the top sheet */}
      <rect
        x="0.75"
        y="8"
        width="148.5"
        height="103"
        fill="var(--color-paper)"
        stroke="var(--color-rule)"
        strokeWidth="1.5"
      />
      {/* header row */}
      <rect x="0.75" y="8" width="148.5" height="14" fill="var(--color-teal)" />
      {/* column rules */}
      <rect x="38" y="22" width="1" height="89" fill="var(--color-rule)" />
      <rect x="76" y="22" width="1" height="89" fill="var(--color-rule)" />
      <rect x="114" y="22" width="1" height="89" fill="var(--color-rule)" />
      {/* row rules */}
      <rect x="0.75" y="38" width="148.5" height="1" fill="var(--color-rule)" />
      <rect x="0.75" y="54" width="148.5" height="1" fill="var(--color-rule)" />
      <rect x="0.75" y="70" width="148.5" height="1" fill="var(--color-rule)" />
      <rect x="0.75" y="86" width="148.5" height="1" fill="var(--color-rule)" />
    </svg>
  );
}

