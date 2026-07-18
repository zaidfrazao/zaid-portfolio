# zaid-portfolio - Testing Strategy

## Overview

This document defines the testing approach for **zaid-portfolio**, derived from the PRD (`docs/PRD.md`) and Brand Guide (`docs/BRAND_GUIDE.md`).

Two things make this project's testing unusual for a portfolio site:

1. **The site is itself a proof artifact.** The PRD positions the build as evidence of an AI-accelerated, rigorous workflow. A tested codebase is part of the pitch; a broken transition or contrast failure directly undermines the product being sold.
2. **The brand has machine-checkable hard rules.** "Resting states are fully static," "all motion in cardinal directions," "reduced motion = straight cuts with content parity," and the verified contrast table are not vibes — they are assertions. This strategy encodes them as tests wherever cheap, and as a manual checklist where automation can't reach (feel, frame rate, easing character).

## Testing Pyramid

```
        /\
       /  \      E2E Tests (critical user flows, a11y, visual)
      /----\
     /      \    Integration Tests (component interactions, routing)
    /--------\
   /          \  Unit Tests (logic, utilities, components)
  --------------
```

### Distribution Target
- **Unit Tests:** ~60% of test count
- **Integration Tests:** ~25% of test count
- **E2E Tests:** ~15% of test count — higher than a typical app because the PRD's launch gates (10-second path, reduced-motion parity, mobile grammar) are inherently end-to-end properties

## Testing Types

### Unit Testing

**Framework:** Vitest + React Testing Library (jsdom)
**Command:** `npm run test`

**What to Test:**
- Pure logic: navigation/chapter state machines, transition-selection logic (which camera move fires for which jump), content/data transforms
- Client components: chapter index, controls, contact form validation
- Synchronous Server Components (async Server Components are covered by E2E, per current Next.js App Router guidance)
- Utility functions (formatting, metadata/OG generation helpers)

**Coverage Target:** 70% (lines/branches), enforced in CI via `vitest --coverage`. Coverage is a floor, not a goal — the launch gates live in E2E.

**Conventions:**
- Test files: `*.test.ts(x)`, co-located with source
- Naming: `describe('ChapterIndex', () => { it('marks the current chapter in Sienna', ...) })`
- Mock `next/navigation` per established App Router patterns; use MSW if any fetch-dependent component appears

### Integration Testing

**Framework:** Vitest + React Testing Library (same runner; integration = multiple units composed)

**What to Test:**
- Chapter navigation state + URL sync (deep links resolve to the right chapter)
- Intertitle sequencing: skippable/interruptible behavior (PRD Feature 2)
- Contact form: validation on blur, summary on submit, deadpan success/error copy rendering
- Case-study switcher (prev/next, project entry/exit state)

**Key Integration Points (from PRD Technical Considerations):**
- Next.js App Router routing ↔ cinematic navigation layer (each chapter is a real URL)
- `prefers-reduced-motion` media query ↔ transition system (mocked `matchMedia` at this level; verified for real in E2E)
- Contact delivery (mailto or form endpoint) and resume PDF link

### End-to-End Testing

**Framework:** Playwright (Chromium, Firefox, WebKit + mobile emulation)
**Dev Server:** `npm run dev` on port `3000` (CI runs against `npm run build` + production server — animations and static generation must be tested as shipped)

**Critical User Flows to Test** (each traces to a PRD acceptance criterion):

1. **The 10-Second Path** (Feature 4 — launch gate)
   - Steps: Land on `/` → without scrolling or discovering any mechanic, locate name, positioning line, and a contact action → activate contact
   - Success Criteria: Name + positioning visible in initial viewport; contact action and resume PDF reachable in ≤ 2 interactions; assert from every chapter, not just landing

2. **Chapter Navigation — pointer, keyboard, touch** (Features 1, 2)
   - Steps: From landing, visit all four chapters via the persistent chapter index; repeat using only the keyboard; repeat on mobile emulation via touch
   - Success Criteria: All chapters reachable by visible UI controls alone (no scroll-dependent mechanic); focus order logical; current chapter marked in the index

3. **Deep Links & Social Cards** (Feature 2)
   - Steps: Load each chapter URL directly; inspect rendered `<title>`, meta description, and OG tags
   - Success Criteria: Each chapter renders correct content standalone with correct OG/social card metadata; sitemap includes all chapter URLs

4. **Case Study Entry** (Feature 3)
   - Steps: Land → reach each of the 3 case studies
   - Success Criteria: Each case study reachable in ≤ 2 interactions; contains role, stack, problem, approach, outcome, and imagery (assert on section presence, not copy)

5. **Reduced-Motion Parity** (Features 1, 5 — launch gate)
   - Steps: Run flows 1, 2, and 4 with `reducedMotion: 'reduce'` in the Playwright context
   - Success Criteria: All transitions are instant cuts (assert transition duration ≈ 0 / no intermediate animation frames, no blur frames); every piece of content reachable — full parity with the animated experience

6. **Mobile Grammar** (Feature 5)
   - Steps: Run flows 1–4 at 360px-wide viewport with touch
   - Success Criteria: All chapters, case studies, and the 10-second path fully functional; no horizontal overflow of the document

7. **Contact & Resume** (Feature 4)
   - Steps: From each chapter: activate contact (assert mailto href or submit form with mocked endpoint); download resume PDF
   - Success Criteria: ≤ 2 interactions from every chapter; PDF responds 200 with `application/pdf`

**Motion-Grammar Invariants (automated slice):**
Alongside the flows, a dedicated `motion.spec.ts` asserts the Brand Guide's machine-checkable hard rules:
- **Static resting state:** after a transition settles, two screenshots ~1s apart are pixel-identical (no ambient motion, shimmer, or drift)
- **Cardinal movement:** during a transition, tracked element positions change on one axis only (no diagonal drift)
- **No overshoot:** settled position is reached monotonically (sample positions near transition end; no bounce past the target)
- **Interruptibility:** intertitles can be skipped; navigation during a transition doesn't wedge the state machine

What stays manual: easing *character*, tempo-matched-to-meaning, and sustained 60fps on real hardware (see Performance and Manual Checklist).

### Visual Regression Testing

**Tool:** Playwright `toHaveScreenshot()` — no external service

The site's static-tableau resting states are ideal screenshot subjects: no ambient motion means no flake. Visual regression here guards the brand itself — symmetry, palette discipline, frame lines, typography registers.

**What to Capture:**
- Each chapter's settled tableau (desktop 1440px, mobile 375px)
- Each case-study insert (the knolled flat-lay) and case-study body
- Intertitle plates
- Component states: buttons (all variants), form fields (default/focus/error/success), empty states
- All captures run with `reducedMotion: 'reduce'` and fonts loaded, to eliminate animation/font flake

**Baseline Management:**
- Baselines committed to the repo under `e2e/__screenshots__/`
- Update via `npx playwright test --update-snapshots` in a dedicated commit, reviewed as a deliberate design change — an unexplained baseline diff is a bug by definition on a site with no ambient motion
- `maxDiffPixelRatio` kept strict (≤ 0.01); this site has no excuse for drift

### Accessibility Testing

**Standards Target:** WCAG 2.1 AA (PRD launch gate: zero critical issues)

**Automated Checks:**
- **Tool:** `@axe-core/playwright`, run against every chapter and case study within the E2E suite, in both motion modes
- **Contrast:** the Brand Guide's palette table is encoded as a small unit test asserting the documented ratios (Umber/Paper 12.58:1, Sienna/Paper 4.69:1, etc.) so a palette tweak can't silently break AA; axe verifies the rendered result
- **Semantic structure:** E2E asserts a clean heading outline and landmark structure per chapter — the "honest portfolio underneath the cinematic layer" requirement is a real DOM assertion

**Manual Checks Required:**
- Full keyboard walkthrough of every chapter and case study (visible 2px Teal focus ring, 2px offset, on all interactive elements)
- Screen reader pass (NVDA + VoiceOver) of the four chapters and one case study: content order must read as a coherent portfolio, transitions must not spam announcements
- 200% zoom readability
- Mustard-as-decoration audit: no text rendered in Mustard on Paper (1.78:1 — banned by the Brand Guide)

**Checklist:**
- [ ] All interactive elements keyboard accessible; no interaction relies on scroll alone
- [ ] Focus order follows the chapter's reading order
- [ ] Focus visible at all times (2px Teal outline, 2px offset)
- [ ] SVG scenes have appropriate roles/titles (or `aria-hidden` where decorative)
- [ ] Form inputs have programmatically associated labels; errors announced
- [ ] Sufficient contrast per the verified palette table (≥ 4.5:1 for text)
- [ ] Content readable at 200% zoom
- [ ] `prefers-reduced-motion` honored completely (verified automatically + manually)

### Performance Testing

**Requirements (PRD):** LCP < 2.5s on mid-range mobile, CLS < 0.1, 60fps transitions on mid-range devices; degrade to cuts before degrading to jank.

**Metrics to Track:**
- **LCP:** < 2.5s (mobile emulation, throttled)
- **CLS:** < 0.1 — doubly important here: layout shift in a symmetric tableau is both a metric failure and a visible brand failure
- **TBT:** < 200ms
- **Transition frame rate:** ≥ 55fps sustained during camera moves (measured via Chrome tracing on the heaviest transition, e.g. the case-study push-in)

**Tools:**
- **Lighthouse CI** (`@lhci/cli`) against the production build in CI, with budget assertions on LCP/CLS/TBT and bundle size
- **Chrome DevTools performance traces** for transition frame-rate audits (scripted where practical, manual on real hardware before launch)
- **Real-device pass** on a mid-range Android phone before launch — emulation does not settle the 60fps claim (PRD risk: "motion jank on low-end mobile undermines the craft claim")

### Security Testing

Minimal attack surface (static-first site, no auth, no CMS, at most a contact form). Proportionate measures:

- **Dependency scanning:** `npm audit` in CI; Dependabot enabled
- **Contact form (if a form rather than mailto):** input validation, spam mitigation, no user input reflected unsanitized
- **Headers:** sensible defaults via Vercel/Next config (CSP if feasible, `X-Content-Type-Options`, referrer policy)

## Test Data Management

No user accounts, roles, or database — content lives in the repo (PRD non-goal: no CMS).

- **Unit/Integration:** fixture content objects (a fake chapter, a fake case study) so tests don't break on copy edits
- **E2E:** runs against real repo content; assertions target structure and invariants (sections present, links resolve) rather than exact copy, except where copy is itself a requirement (e.g. no exclamation marks in UI strings — a cheap lint-style check on UI copy constants)
- **Contact form:** submissions mocked at the network layer in E2E; one manual real-delivery check before launch

## CI/CD Integration

### Commands Reference
From `.claude/project.yaml`:
- **Lint:** `npm run lint`
- **Type Check:** `npm run typecheck`
- **Build:** `npm run build`
- **Test:** `npm run test`
- **Dev Server:** `npm run dev` (port 3000)

To be added as the suite lands: `test:coverage`, `test:e2e` (Playwright), `lhci` (Lighthouse CI).

### Pipeline Stages

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────────────────┐
│    Lint     │ → │ Unit + Int. │ → │    Build    │ → │  E2E + a11y + visual │
│  & Types    │   │  (Vitest)   │   │  (next)     │   │     (Playwright)     │
└─────────────┘   └─────────────┘   └─────────────┘   └──────────────────────┘
                                                                 ↓
                                                        ┌──────────────────┐
                                                        │  Lighthouse CI   │
                                                        └──────────────────┘
```

### When Tests Run
- **On every PR:** lint, typecheck, unit + integration with coverage gate, build, Playwright (Chromium + mobile emulation) including axe and visual regression, Lighthouse CI budgets
- **On merge to main:** full Playwright matrix (Chromium, Firefox, WebKit)
- **Pre-launch (manual gate):** real-device pass, screen-reader pass, full manual checklist below

No nightly suite — a portfolio site with repo-only content doesn't drift while unattended.

### Failure Handling
- PRs blocked on any red stage; visual diffs block until the baseline is deliberately updated in a reviewed commit
- Flaky-test policy: with static resting states and mocked network there is little excuse for flake — a flaky test is quarantined *and* ticketed the same day, and quarantine must be empty at launch

## Manual Testing Checklist

For each milestone/release, manually verify:

### Functional
- [ ] All PRD acceptance criteria met (Features 1–5)
- [ ] All internal links, contact action, and resume PDF work
- [ ] Error and empty states render in the deadpan voice (no exclamation marks, no film-themed copy)

### Grammar & Feel (cannot be automated)
- [ ] Every settled view reads as a locked-off, symmetric, planimetric tableau
- [ ] Each camera move's tempo matches its meaning (whip 300–400ms, truck 700–900ms, push-in 900–1200ms, tilt 600–800ms)
- [ ] No easing overshoots or feels springy; movement feels mechanical, on rails
- [ ] Between moves, everything is perfectly still
- [ ] The litmus test: does it read as composed/precise/charming rather than as a film homage?

### Cross-Browser
- [ ] Chrome, Firefox, Safari, Edge (latest)
- [ ] iOS Safari and Android Chrome on real devices

### Devices & Performance
- [ ] Desktop 1920×1080 and 1440×900; tablet 768px; mobile 375px and 360px
- [ ] 60fps transitions on a real mid-range Android device; no jank on the heaviest transition
- [ ] LCP/CLS spot-check on throttled mobile

### Accessibility (manual portion)
- [ ] Full keyboard-only walkthrough
- [ ] Screen reader pass (VoiceOver + NVDA)
- [ ] OS-level reduced-motion produces straight cuts everywhere
- [ ] 200% zoom

## Test Documentation

### Test Case Format
Each E2E spec documents in a header comment:
- **Linked Requirement:** PRD feature/acceptance criterion or Brand Guide hard rule
- **Preconditions:** build type, viewport, motion mode
- **Expected Result:** the invariant asserted

### Bug Report Format
- **Summary:** one line
- **Steps to Reproduce:** numbered
- **Expected / Actual behavior**
- **Environment:** browser, device, viewport, motion preference
- **Screenshots/video** where visual

## Document History
- **Created:** 2026-07-18
- **Last Updated:** 2026-07-18
- **Derived From:** PRD (2026-07-18), Brand Guide (2026-07-18)
