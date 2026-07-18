# zaid-portfolio - Product Requirements Document

## Vision

A personal portfolio site that positions Zaid Frazao as an **AI-accelerated product builder** — a senior fullstack developer who ships complete products fast by pairing deep engineering experience with AI-powered workflows. The site itself is Exhibit A: a web experience built on the _formal grammar_ of Wes Anderson's filmmaking (planimetric composition, compass-point camera movement, chaptering, meticulous craft) applied to honest portfolio content — never pastiche of his films' settings or props.

## Problem Statement

Freelance/contract clients choosing between developers see hundreds of interchangeable portfolio sites. A generic template proves nothing; a gimmicky "creative" site often buries the information a prospect needs. Zaid needs a site that (a) is unforgettable proof of UI/UX craft and delivery speed, and (b) still lets a busy prospect find his work, experience, and contact details in seconds. The tension between distinctiveness and usability is the core design problem this project exists to solve.

## The Design Thesis: Grammar, Not Props

This is the load-bearing principle for the whole project. What makes a Wes Anderson film _feel_ like Wes Anderson is separable from what his films depict:

**The grammar (we use this):**

1. **Planimetric composition** — camera perpendicular to flat planes; scenes read as staged tableaux/dioramas built from flat layers (foreground/midground/background), not naturalistic space.
2. **Compass-point movement** — motion only in cardinal directions. Lateral trucking _parallel_ to the action; whip pans in 90°/180° increments connecting locked-off compositions; tilts for vertical reveals; snap-zooms and slow push-ins for emphasis. Always smooth and mechanical — camera on rails, never handheld.
3. **Static tableau as resting state** — most "shots" are locked-off and symmetrical; movement is punctuation, not wallpaper.
4. **Dead-center symmetry** — centered subjects, mirrored balance, precision the viewer can feel.
5. **Chaptering** — intertitle cards, book-like structure, narrated framing.
6. **Disciplined palette** — one constrained palette for the whole "film," not "pastel everything."
7. **Overhead inserts & knolling** — top-down flat-lays of meticulously arranged objects.
8. **Deadpan restraint** — dry, precise labeling; sparse deliberate cuts; understatement.
9. **Foregrounded artifice, calibrated** — the constructedness is visible and is the pleasure, but "curated and strange enough to create distance, never so absurd you lose the emotional thread."
10. **Handmade texture** — crafted imagery (inline SVG scenes, later real photography) over generic slickness.

**The props (we never use these):** hotels, lobbies, concierges, trains, scout camps — any recognizable setting, character, or artifact from an Anderson film. Section names are honest portfolio sections (About, Experience, Projects, Contact), _staged_ cinematically. The prior "hotel rooms" concept (Lobby/Study/Gallery) is explicitly retired as too on-the-nose.

**Litmus test for any design decision:** "Would this read as Anderson-_esque_ to someone who has never seen his films (because it's composed, precise, and charming), rather than as a Grand Budapest Hotel homage to someone who has?"

## Target Users

### Primary Users

**Freelance/contract clients** — founders, product leads, agency principals, CTOs evaluating a contractor. Goals: quickly judge whether Zaid can build their product well and fast; find evidence (projects, experience) and a way to start a conversation. Pain points: sea of identical portfolios; creative sites that hide the substance; uncertainty about what "AI-accelerated" actually delivers.

### Secondary Users

- **Talent-marketplace vetters (Turing, gun.io, etc.)** — reviewing the portfolio as an application supplement; need experience, stack, and outcomes to check out quickly and credibly.
- **Recruiters / hiring managers** — need experience history, stack, and a resume PDF fast; the craft makes Zaid memorable among candidates.
- **Peers / the dev & design community** — potential sharers and referrers; the site as a calling card.

## Features

### Core Features (Must-Have)

#### Feature 1: Cinematic Navigation System (the camera)

**Description:** Navigation between sections is expressed as Anderson camera moves. Every settled state is a static, planimetric, symmetric tableau; transitions between sections/states use the compass-point vocabulary (lateral truck, whip pan, tilt, push-in). The input mechanic (scroll-driven, click-triggered, keyboard, or hybrid) is deliberately **not prescribed here** — it will be chosen by prototyping against feel and usability. Horizontal scrolling is not a commitment.
**User Value:** The site demonstrates UI/UX craft in its very mechanics; visitors _feel_ the filmmaking rather than being told about it.
**Acceptance Criteria:**

- [ ] Every settled view is a locked-off, symmetric, planimetric composition (no drifting/ambient motion in the resting state)
- [ ] All transitions move in cardinal directions with smooth, mechanical easing (no bounce, no handheld wobble, no diagonal drift)
- [ ] At least two distinct camera moves from the vocabulary are used, each matched to meaning (e.g. lateral truck between chapters, push-in to enter a project, whip pan for quick jumps)
- [ ] Navigation is fully possible via visible UI controls and keyboard — no mechanic relies on scroll alone
- [ ] `prefers-reduced-motion` replaces all camera moves with straight cuts (instant transitions); content parity is total

#### Feature 2: Chaptered Content Structure

**Description:** The site is structured as chapters with intertitle treatment: **About** (bio + the AI-accelerated positioning), **Experience** (career since 2017), **Projects** (selected work), **Contact** (socials, email, resume). Honest names, cinematic staging.
**User Value:** A prospect always knows where they are and what exists; the chaptering is both wayfinding and grammar.
**Acceptance Criteria:**

- [ ] All four chapters present with real (non-placeholder) content at launch
- [ ] A persistent, always-visible chapter index allows direct jump to any chapter from anywhere
- [ ] Each chapter is deep-linkable (own URL) and renders correct OG/social cards
- [ ] Intertitle treatment introduces chapters without adding a mandatory wait (skippable/interruptible)

#### Feature 3: Project Case Studies with Insert Treatment

**Description:** ~3 selected projects, each opening as an overhead "insert" — a knolled flat-lay of the project's artifacts (screens, stack, diagrams) — followed by a concise case study: problem, approach (including how AI workflows accelerated delivery), outcome.
**User Value:** This is the evidence a client hires on; the insert treatment makes each project a memorable set piece.
**Acceptance Criteria:**

- [ ] 3 case studies at launch, each with: role, stack, problem, approach, outcome, imagery
- [ ] **CatalogIQ** is the anchor case study — Zaid's own AI content-generation product for ecommerce listings (Takealot-focused, Amazon-ready): end-to-end build, in production, 15,000+ listings generated, conversion uplift beyond client expectations. Fully showable; concrete numbers cited
- [ ] Remaining case studies drawn from: Lakar product work (AI agent B2B SaaS — UX + organizational AI oversight focus), showable/anonymized Lakar client projects (pending permission), or personal projects
- [ ] Each case study reachable in ≤ 2 interactions from landing

#### Feature 4: The 10-Second Path (prospect fast lane)

**Description:** However cinematic the experience, the commercial essentials are never more than a moment away: who Zaid is, what he offers, how to reach him, and a resume PDF.
**User Value:** No prospect or recruiter ever bounces because the site was "too clever to use."
**Acceptance Criteria:**

- [ ] A first-time visitor can find name + positioning + a contact action within 10 seconds of landing, without discovering any novel mechanic
- [ ] Contact action (email/link) and resume PDF download are reachable from every chapter in ≤ 2 interactions
- [ ] Resume PDF is a real, current, well-typeset document consistent with the site's brand

#### Feature 5: Responsive Grammar Adaptation

**Description:** Mobile (where most first visits from shared links happen) receives the same grammar — tableau framing, symmetry, intertitles, compass-point transitions — with mechanics adapted to the device (e.g. vertical rhythm; Anderson tilts and pans vertically too). Not a stripped-down consolation version.
**User Value:** The first impression is the full impression, on any device.
**Acceptance Criteria:**

- [ ] All chapters, case studies, and the 10-second path fully functional on mobile viewports (≥ 360px wide)
- [ ] Mobile transitions use the same camera vocabulary (adapted axis permitted); no layout is a generic vertical scroll with the grammar removed
- [ ] Touch, mouse, and keyboard input all supported

### Nice-to-Have Features

- **Cinematic dressing:** film grain, letterbox framing on select moments, aspect-ratio shifts between content types
- **Slow-motion closing vignette:** an "ensemble walk" moment as a finale/outro flourish
- **Split-screen treatment** for before/after or comparison content in case studies
- **Analytics** (privacy-friendly) on the funnel: land → reach chapter → contact click / PDF download
- **Writing/notes chapter** for essays on AI-accelerated development (audience-building)
- **Real photography/screenshots** replacing initial crafted SVG imagery over time

### Non-Goals

- **No film diegesis or cosplay** — no hotel, no rooms named after Anderson settings, no character/film references, no themed copywriting ("concierge," "lobby," etc.)
- **No CMS or admin panel** — content lives in the repo; Zaid is the only editor
- **No blog at launch** — writing is a post-v1 candidate
- **No commitment to horizontal scrolling** — it's one candidate mechanic, to be validated or discarded in prototyping
- **No dark mode** — one disciplined palette is the brand; a theme toggle would dilute it
- **Not a template** — no off-the-shelf portfolio themes or component kits for the visible experience

## Technical Considerations

- **Stack:** Next.js (App Router) deployed on Vercel; static generation/export wherever possible. React — Zaid's home turf.
- **Animation:** technique chosen per need during prototyping — CSS scroll-driven animations, Framer Motion, or GSAP are all candidates; the requirement is the grammar (smooth, mechanical, cardinal), not the library.
- **Imagery:** crafted inline SVG scenes for v1 (per the established direction: real imagery over CSS boxes), upgradeable to photography/screenshots without structural change.
- **Performance:** the cinematic layer must not cost the first impression — LCP < 2.5s on mid-range mobile, CLS < 0.1, 60fps transitions on mid-range devices; animation degrades gracefully rather than jank.
- **Accessibility:** WCAG 2.1 AA; full keyboard navigation; semantic HTML document structure underneath the cinematic layer (screen readers get a clean, honest portfolio); `prefers-reduced-motion` honored completely.
- **SEO/sharing:** per-chapter URLs, meta/OG cards, sitemap — shared links must unfurl well, since sharing is a success channel.
- **Integrations:** none required at launch beyond contact (mailto or simple form) and resume PDF hosting. Analytics as nice-to-have.

## Success Metrics

| Metric                     | Target                                                       | How Measured                                  |
| -------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| Qualified client inquiries | ≥ 2/month by month 3 post-launch                             | Contact-form/email leads referencing the site |
| Site as pitch asset        | Used in every proposal/pitch; Zaid confident leading with it | Self-report; prospect feedback                |
| Visitor → substance        | ≥ 50% of visitors reach a case study or contact/PDF          | Analytics funnel (once added)                 |
| Performance                | LCP < 2.5s mobile, 60fps transitions                         | Lighthouse/CrUX, device testing               |
| Accessibility              | WCAG 2.1 AA, zero critical issues                            | axe audit + keyboard/screen-reader pass       |
| Launch                     | Lean v1 live within weeks, not months                        | Ship date                                     |

## Assumptions

- Zaid writes/supplies real content (bio, work history since 2017, 3 case studies) early enough not to block launch
- CatalogIQ (Zaid's own product) carries the AI-accelerated claim with real numbers; no third-party permission needed for it
- Some Lakar client work can be shared with permission (Rich, Lakar's founder) or anonymized; if neither, CatalogIQ + Lakar product work + personal projects still cover the 3 case studies
- Zaid is **immediately available for ~20 hrs/week** of contract work alongside the Lakar engagement — the contact CTA can state availability plainly
- The portfolio doubles as a supplement to applications on vetted talent marketplaces (Turing, gun.io), so their reviewers are an audience: the site must scan credibly in a quick vetting pass (experience, stack, real outcomes), not only as an experience
- Crafted SVG imagery is achievable at sufficient quality for v1; photography can come later
- The freelance positioning ("AI-accelerated product builder") is the durable headline; full-time-role appeal is served by the same content plus resume PDF
- Most first visits arrive on mobile via shared links
- Detailed aesthetic specification (palette, type, motion curves, imagery style) will be defined in the Brand Guide (`docs/BRAND_GUIDE.md`), governed by this PRD's "grammar, not props" thesis

## Risks

| Risk                                                      | Likelihood | Impact | Mitigation                                                                                                                            |
| --------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Pastiche/cheese — site reads as a Wes Anderson theme park | M          | H      | "Grammar, not props" rule + litmus test applied to every design decision; honest section names; brand guide encodes hard rules        |
| Cinematic mechanics hurt usability for prospects          | M          | H      | Feature 4 (10-second path) is a launch gate; visible nav always available; mechanic chosen by prototype testing, not aesthetics alone |
| Animation perfectionism delays launch                     | H          | M      | Lean v1 scope is fixed (5 core features); polish and nice-to-haves are explicitly post-launch                                         |
| Novel mechanic (e.g. horizontal scroll) tests badly       | M          | M      | Mechanic is uncommitted by design; prototype 2–3 candidates and keep whichever passes both feel and usability                         |
| Motion jank on low-end mobile undermines the craft claim  | M          | H      | Performance budget in Technical Considerations; test on real mid-range devices; degrade to cuts before degrading to jank              |
| Content (case studies, resume) lags behind the build      | M          | M      | Content drafting starts alongside development, not after                                                                              |
| Permission to show Lakar client work is declined          | M          | L      | CatalogIQ + Lakar product work + personal projects suffice; anonymized retellings as fallback                                         |

## Document History

- **Created:** 2026-07-18
- **Last Updated:** 2026-07-18
