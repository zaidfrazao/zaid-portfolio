# Content Notes — Raw Material

Working document of raw career/project material for the Experience chapter, case studies, and resume PDF. Not published as-is. Dates marked (?) need confirmation before publishing.

## Career Timeline

### Education

- **2012** — Graduated Northcliff High School
- **2013–2014** — Stellenbosch University, Electrical Engineering (steered there by career guidance despite programming being the known passion)
- **2015–2016** — Transferred to Computer Science, Stellenbosch; left before completing to found a startup

### Sportomatic — Co-founder (~2016/17 – ~2019 (?), ~3 years)

Sports management software suite targeting schools, helping them organize their sports programmes. Co-founded with Rich (later founder of Lakar) and 2 other high-school friends. Wound down after ~3 years when it wasn't working.

- Narrative value: chose the startup over the degree; long collaboration history with Rich predates Lakar.

### Zentraedi Online → EasyOnline — Software lead (~2018 – ~2021)

Family ecommerce business (dad's company); ~1–2 years at Zentraedi until it fell apart late 2019, then ~1–2 years at its successor EasyOnline (later Online Retail Management / ORM).

- Built internal process-management software across the operation.
- **Highlight: repricing engine** — robust, sophisticated tool managing a ~200k-SKU list daily: stock planning + competitive repricing. Strong case-study candidate for scale and business impact, and it seeds the ecommerce thread leading to CatalogIQ.
- **Showability constraint:** the ORM system is no longer family-owned. Screenshots exist but there's no explicit consent to publish them — do NOT use them. Case study must be an anonymized retelling with recreated visuals (architecture diagrams, stylized SVG recreations), which happens to fit the site's crafted-SVG imagery direction anyway.

### The Kalan Collective (TKC) — Founder & Managing Director (~2020 – ~2022 (?))

Founded as a software agency; in practice became the outsourcing arm of EasyOnline/ORM. Team: 2 managers + 5 permanent staff (copywriting, admin, photography) plus multiple freelancers. Over-reliant on ORM for cashflow; when ORM struggled, TKC collapsed — had to retrench staff (Zaid describes it as the hardest moment of his life).

- Narrative value: genuine founder scar tissue; management of a real team; honest failure story. **Zaid has approved using this story** — he credits it with hard lessons and an extreme work ethic and sees it helping recruitment. Belongs in the About/bio arc, not a case study.

### Independent work + ML study (~2022 (?))

Odd jobs between TKC and Lakar, including a **stock-management mobile app for a construction business** — tracking parts moving between sites (React Native presumably — confirm stack).

Also completed the **first two of Andrew Ng's ML courses** (Stanford/DeepLearning.AI via Coursera — almost certainly "Supervised Machine Learning: Regression and Classification" and "Advanced Learning Algorithms" from the Machine Learning Specialization; certificates held, confirm exact titles/dates from them). Covered ML fundamentals (gradient descent etc.) through building basic neural networks. Motivation: AI was rising and he didn't want to be left behind — interested in _building_ AI models/products, though pre-LLM-boom capabilities kept it exploratory. Notably this was while he still didn't use AI for programming at all.

### Lakar — Lead Developer / de facto CTO (~2023 – present)

Recruited by Rich (needing a lead developer, knowing Zaid's frontend strength) a few months after TKC. ~38 hrs/week, invoiced weekly, ~3 years. Manages a junior dev. Makes most technical decisions across all projects — functions as CTO in practice.

#### Project: LSA environmental-monitoring software suite (pre-AI era, hand-coded)

Client: LSA, maker of environmental monitoring devices; they outsourced their software (device configuration, data ingestion) and lacked data viz. Zaid built:

- **Config Manager** — Electron desktop app for creating device config files
- **Web Dashboard** — Next.js app; configurable dashboard of charts/widgets displaying device data via API
- (Rich built the **Data Logger** — device interaction + MongoDB storage — that both apps talk to)
- Entirely hand-coded, no AI assistance. Good demonstration of desktop + web + API breadth.
- Showability: Lakar client — needs Rich's permission to name/show, else anonymize ("environmental monitoring device manufacturer").

#### Project: VRP route-planning solver for Lofts (quarrying company)

NP-hard vehicle routing problem; custom **Google OR-Tools solver in Python** built through heavy research and many iterations. Constraint design was the hard part — systematizing the intuition of human route allocators:

- **Job sharing / fairness** — maximize how many drivers get work on a given day, not just minimize cost
- **Time windows**, and nuanced distance objectives (e.g., capping the _drive-home_ distance so drivers don't end the day an hour from home)
- Iterated against constant client feedback until the solver matched/encoded allocator intuition; then extended toward real-time re-planning
- **In production:** Lofts' client plans daily routes with it; Lakar is building an API to sell it to other businesses
- **The productization API exists and is verified** (repo `aa-api`, Dec 2025 – Jul 2026, 109 commits, ~46k LOC): FastAPI + OR-Tools + Celery/Redis async jobs, **OSRM for real road-distance matrices**, companion route-visualization frontend, Dockerized, Railway deploy. Engineering hygiene worth citing: strict mypy, ruff, pytest with unit/integration/e2e split and a 70% coverage floor, bandit+safety security scans, GitHub Actions CI.
- Strongest technical-depth story in the portfolio: hard CS problem + human-centered constraint modeling + production adoption + productization path
- Showability: Lakar client — needs permission to name Lofts, else anonymize ("quarrying logistics operator"). Visuals recreatable (route maps, constraint diagrams) without client data.

#### Product era (AI-agent SaaS)

AI-agent B2B SaaS (comparable to OpenClaw / Claude Cowork), differentiated on UX and organizational controls/oversight of AI usage. Details pending.

#### The AI era — the conversion and the workflow (headline material)

The arc, in Zaid's telling:

1. **Cursor first, reluctantly.** Used it as his IDE with AI features "here and there" for functions. Stayed particular and skeptical — the tools dragged him down unproductive rabbit holes and he wasted real time fixing their mistakes. (The skepticism was earned, not posture.)
2. **The credible witness.** A friend running a UK startup — someone Zaid knew to be _meticulous_ — said they'd gone exclusively Claude Code, citing a game-changing Anthropic model release that made Claude far more reliable. Meticulous person's endorsement was what moved him, not marketing.
3. **The deep dive.** Switched to Claude Code and did serious homework: MCP servers, skills, memory, agent orchestration — engineered a workflow rather than just adopting a tool.
4. **The result.** Nearly all programming is now delegated to AI; Zaid's attention goes to **planning, design, and testing**. His code quality is _better_ than in his craftsman era — because the workflow affords consistent testing and a rigorous process with him in the loop at every step. Explicitly NOT a "vibe coder"; the craft moved up a level of abstraction rather than being abandoned.

This is the bio's centerpiece and directly substantiates the "AI-accelerated product builder" positioning. Projects justifying the claim: dump in progress.

#### Transition-period projects (Cursor era, ~2x productivity)

**The Business Finder** (Lakar client; repo verified: Apr–Nov 2025, 1,646 commits, ~198k LOC, 572 source files — the biggest frontend build surveyed): founded by a broker whose personal vetting workflow made him unusually good at selling businesses; the system automates that workflow and opens it to other brokers so they can escape brokerages that take large commission cuts. Deal tracking, vendor/contact management, document & email templates, tasks, scheduling. Stack: Next.js 15 + TypeScript + Tailwind/shadcn, Firebase (Firestore/Functions/Storage) + NextAuth, BigQuery, Algolia search, Cronofy/Nylas calendar+email scheduling, SendGrid, PDF/Excel generation, Jest suite. Built with heavy Cursor assistance — Zaid's honest assessment: "a bit clumsy," but shipped. **This project is what convinced him he needed a properly engineered AI workflow** (good narrative beat: the low point that motivated the method).

- Showability: Lakar client — permission or anonymization needed.

**Contracts AI** (Lakar internal product, feeds The Business Finder): upload documents (e.g. contracts) → AI summarization + conversational agent over a document or document set. Broker-relevant (due diligence on businesses for sale).

- Zaid's first experience **integrating AI features into shipped products**: meaningful research into RAG, embeddings, and optimizing how documents are stored, indexed, and referenced by agents.
- Showability: Lakar internal — likely easier to show than client work; confirm with Rich. (No standalone repo found on this machine — confirm where it lives; possibly inside another repo.)

**Mentorship proof point — Tebza:** Zaid brought his junior dev into Lakar and trained him from complete novice (a single year-long coding course, no prior programming, no professional experience) to shipping quickly and reliably. Concrete, current evidence for the management/mentorship thread.

#### Full-workflow era projects (the receipts)

**Hirsch Wine Group — winery intake form** (repo `hwg-form` verified: first commit 2025-09-29, ~115-commit burst Sep–Oct 2025, then long maintenance trickle; 87 files, ~19k LOC): intake form for wineries to submit specs needed to run bottling orders. Reactive, mobile-friendly, dynamic conditional fields with a custom validation engine and error navigation; **monday.com integration** with smart item matching (search-by-email then create; board auto-updates on submit/revise); SendGrid email with local-download fallback; multi-variety/SKU switcher; a Gemini-powered "Outreach API" generating pre-populated forms; Jest tests, GitHub Actions. Stack: Next.js 16 + React 19 + Tailwind, Firebase + MongoDB.

- Zaid recalls the initial build as ~2 days with tweaks after; git shows the initial burst then months of small iterations. _Framing for the site: "first working version in days, iterated in production" — accurate and still impressive._
- Showability: Lakar client — permission or anonymization needed.

**Lakar Projects — AI-first project management suite** (repo `lakar-pm` verified: Jan–May 2026, 577 commits, ~98k LOC, 442 files): built because existing PM suites didn't fit an AI-heavy workflow (e.g. hour tracking was painful). React 19 + Vite frontend, Express 5 + TypeScript + Postgres/Drizzle backend, GitHub OAuth. Full PM feature set + **its own MCP server** (~42 tools: projects/phases/milestones/tasks/comments/time-logging/search — agents operate the PM tool natively; it's the very server this session is connected to) + frictionless time tracking + viz pages + meeting-transcript→sprint-tasks AI workflow. Testing rigor is a differentiator: Vitest + RTL, Playwright cross-browser E2E, MSW, **accessibility testing (axe)**, 80% coverage target, CI/CD with Codecov.

- Zaid recalls "~1 month to build"; git shows a steady Jan–Apr build (~4 months at high cadence alongside client work). _Framing for the site: "usable version in a month; full suite over a quarter, in daily production use" — verify which milestone the 1-month memory maps to._
- Strong case-study candidate: real workflow gap → complete dogfooded product with agent-native design.

**Tebza's meeting bot** (same window): Discord bot that joins meetings, records, transcribes, and suggests tasks — integrated into Lakar Projects. Evidence both of team velocity and of Zaid's training/leadership (a former novice shipped this).

**Project 007 — AI agent B2B SaaS** (repo verified: Apr 29 – Jul 17 2026 and active, 991 commits, ~250k LOC across an npm-workspaces monorepo of frontend/backend/ai/shared; Zaid + one junior): Mastra-based agent platform ("James"). Verified capabilities: agent memory + working-memory processors, Anthropic prompt-caching and thinking-replay processors, automatic model tiering/LLM routing (OpenRouter + Vercel AI SDK), deep-research pipeline with **sub-agent fan-out and approval gates**, browser automation (Browserbase + Stagehand + Playwright), Vercel Sandbox code execution, RAG (knowledge-base + integration embeddings), a large skills library (contract review, NDA triage, financial-statement analysis, docx/xlsx/pptx generation, meeting minutes…), an **evals harness with per-integration datasets**, Inngest automations, multi-channel delivery (web + Slack/Teams/WhatsApp chat adapters + push). **18+ verified integrations via Composio** (Gmail, Outlook, Google Calendar/Drive/Docs/Sheets/Slides/Meet/Tasks, Slack, Teams, Salesforce, HubSpot, SharePoint, OneDrive, Dropbox, GitHub, monday.com, Airtable, Todoist) plus org-level integration controls UI. Stack: Next.js 16 + React 19 + Tailwind v4, Neon Postgres + Drizzle, Clerk, QStash, Sentry. Flagship AI-era build; the "2–3 months" recall checks out (~3 months of 200–400 commits/month, still going).

- Showability: pre-launch internal product — confirm with Rich what can be shown/named publicly.

**Productivity claim:** Zaid estimates ~100x vs. his pre-AI solo output. _Editorial guidance for the site: let the concrete receipts carry this (2 days for an integrated client tool; 1 month for a full PM suite; 2–3 months for an agent platform with 20+ integrations, team of 2). Specific timelines are more credible than a multiplier — big-number claims invite skepticism from exactly the technical audience we want to impress. If a multiplier appears at all, frame it as felt experience, not measurement._

#### The pre-AI / AI-era pivot (key bio material)

Until this point in his career Zaid used **no AI for programming at all** — he was actively skeptical, regarding coding as his "art" to be done in very particular ways. Crucially though, the skepticism was specifically about AI _writing his code_ — his interest in AI itself predates the LLM boom (2022 ML coursework, ambitions to build AI products). So the arc is: studied the fundamentals early → kept AI away from his craft → the tools finally met his standards → now builds AI products AND builds with AI. A conversion story grounded in understanding, not hype-chasing. (AI-era dump pending.)

### Personal projects (AI-era, built alongside 50–60 hr/week Lakar commitment)

Context note for the bio: everything below (plus CatalogIQ) happened over the ~3 Lakar years while Zaid actually worked 50–60 hrs/week there ("because I care about what we're doing") — the side output is itself evidence of the workflow's leverage. _Facts below verified from the repos (git history, package manifests) 2026-07-18._

- **"Avoiding the Poverty" — personal finances app** (`~/personal/avoiding-the-poverty`; Feb–Jul 2026, 60 commits, ~13.5k LOC): replaced the daily spreadsheet ritual. Node/Express + Postgres backend, React 19 + Vite + Tailwind v4 frontend, Railway deploy config. No bank API available, so: **bookmarklet scrapes the logged-in bank pages** and POSTs transactions in (a pragmatic pivot from an originally-planned Playwright headless scraper — good engineering-judgment story). OpenAI-powered transaction categorization (batched, with a deterministic rules layer), dedup logic with its own design spec + tests, PDF statement parsing, budgets, debt tracking with projections, encrypted credential storage. **Two distinct UIs/personas:** a desktop "terminal" interface and a mobile UI with swipe-to-categorize triage. Demoable with a masked demo mode (to build).
- **fra-zao-workflow — the AI development workflow system itself** (`~/personal/fra-zao-workflow`; built in a 4-day burst, June 2026, 17 commits): Zaid's method, packaged as two installable Claude Code plugins — **`fra`** (project setup: guided PRD → Brand Guide → Testing Strategy before any code, then auto-generation of a phases/milestones/tasks PM structure) and **`zao`** (task execution: a gated lifecycle — fetch task → research → plan → **human plan-approval before coding** → implement → test gate → PR → merge, with PM statuses driven automatically). 25 commands, provider-aware PM integration (Lakar Projects or Note&Task via MCP), and a **non-technical user mode** — the feature that let his mom and sister use it. This repo IS the "rigorous, in-the-loop, not-vibe-coding" claim in artifact form; the portfolio itself is being built with it.
- **Game development** (4 Godot 4.7 projects, all GDScript, started June 2026 — much more than "a game"):
  - **Bonewright** — "Factorio for necromancers" roguelike auto-battler: playable vertical slice in an ~1-day burst (56 commits) with **69 headless tests green**, strict pure-logic/view separation (deterministic seeded sims, testable without rendering), procedurally generated assets.
  - **Space automation game** — the largest: ~12k LOC, 113 commits over ~2 weeks; chill "second-monitor" 2D automation game built as polished playable milestones with a "juice is a requirement" discipline and a documented design pivot (v2 GDD).
  - **Welcome to Samsera** — first-person psychological horror (smart mall, mannequins, survive to 6am) in pre-production: full concept/story-bible/gameplay-spec/art-pipeline docs plus a look-dev prototype; solo-dev constraints doc targeting an Oct 2026 Steam Scream Fest launch on <$500.
  - (Plus a Flappy Bird starter that established the Godot+WSL+testing tooling.)
  - Portfolio value: range beyond web/business apps; the _process artifacts_ (specs, GDDs, headless test suites) demonstrate the workflow generalizing to a brand-new domain.
- **Claude Code teaching site** — interactive slideshow website teaching his mom and sister (complete non-coders) to use Claude Code with his workflow to build small tools for their own work — _and they succeeded._ Doubles as a usability test of the workflow (see the workflow's non-technical mode above — the two artifacts corroborate each other). **Repo not yet located on this machine — ask Zaid where it lives.**
- **Sleep video app** — design-only feasibility study (React Native concept: phone-on-mattress accelerometer sleep detection pauses YouTube playback; honest analysis of what's technically impossible, e.g. loudness normalization inside the YouTube embed). Not shippable code; possible evidence of product-thinking/feasibility rigor.
- (Various other started-then-parked experiments — not portfolio material.)

### CatalogIQ — Founder (current, parallel to Lakar)

AI content generation for ecommerce listings, end-to-end; Takealot-focused, Amazon-ready. In production: 15,000+ listings for 1 client; conversion uplift beyond expectations (client cashflow strained by sales demand). **Anchor case study.**

Repo-verified (two repos under `~/catalog-iq/`):

- **Core system** (`orm-listing-onboarding-system`; Dec 2025 – Jul 2026, 428 commits at a steady ~80/month, ~116k LOC, 568 files): AI-powered bulk listing-preparation pipeline — ingest product data (CSV/Excel) → AI-enrich titles/descriptions/attributes → image matching with **perceptual hashing/dedup** (Sharp/exifr/imghash) → compliance/QC engine → **Takealot-compatible loadsheet export** with Takealot Seller API category/template sync. Stack: Fastify 5 + TypeScript backend in 22 domain modules, React 18 + Vite SPA, Postgres, **BullMQ/Redis background job queues**, S3/Cloudflare R2, **multi-provider AI orchestration** (Anthropic, OpenAI, Gemini, OpenRouter — configurable selection), Tavily search, Dropbox/Google Drive ingestion, role-based access with a super-admin portal, Vitest unit+integration tests, migration safety guardrails.
- **Waitlist landing** (`orm-catalogiq-landing`; May–Jun 2026, small): Next.js 16 + Postgres + Resend waitlist — evidence CatalogIQ is being productized beyond client #1.

**The business narrative (from Zaid, 2026-07-18):**

- **The pain, lived for years:** the family ecommerce model (Zentraedi/EasyOnline/ORM) was to find suppliers, bulk-onboard their products, and take a cut of sales revenue — hence hundreds of thousands of SKUs. The unfixable bottleneck was **content**: photography and copywriting were expensive and slow, and heavy admin went into loadsheets and estimating dimensions from supplier info. So the stores were huge but listings had poor supplier images and near-raw supplier copy → very low conversion rates, viable only through sheer breadth.
- **The insight:** AI could fix every piece — generate images, estimate dimensions via research, generate copy, and prepare the loadsheets — simultaneously hyper-accelerating supplier onboarding _and_ lifting conversion.
- **The execution:** built CatalogIQ; a former investor in his dad's business funded a pilot pushing ~15,000 SKUs through it.
- **Reported results (⚠️ ALL FIGURES NEED VERIFICATION before publishing — currently second-hand via Zaid's dad):**
  - Onboarding: what took the previous business ~a year was done in ~2 months
  - Conversion rates: ~5× higher than the previous business
  - Revenue: ~R1 million in sales in ~2 months, vs. over a year to reach that previously
- **Why this is the anchor case study:** it completes a decade-long arc — the repricing-engine builder who lived this exact bottleneck for years is uniquely credentialed to fix it with AI. Domain pain → AI-era solution → externally funded pilot → measured commercial results. No other project has all four beats.

## Cross-Cutting Themes (for About/bio + positioning)

- Coding since age 11; professional since ~2017; self-directed learner (left the degree, learned everything shipping).
- **Startup generalist:** has worn architect, developer, product manager, designer, and managing-director hats across four ventures.
- **Management thread in every role:** junior devs, freelancers, and a 7+ person permanent team at TKC; currently manages a junior at Lakar.
- **Ecommerce domain depth:** Zentraedi/EasyOnline internal systems → 200k-SKU repricing engine → CatalogIQ. A coherent specialization story.
- Long-standing collaboration with Rich: high school → Sportomatic → Lakar.

## Case Study Shortlist (3 needed for v1)

1. **CatalogIQ** — anchor; owned outright, real numbers. ✅ confirmed
2. **Candidates for slots 2–3:**
   - **VRP solver (Lofts)** — strongest technical-depth candidate: NP-hard, OR-Tools, human-centered constraints, in production, being productized (needs permission or anonymization; visuals recreatable)
   - **Project 007** — flagship AI-era build: agent platform, 20+ integrations, org controls, 2–3 months × 2 people (pending: pre-launch showability)
   - **Lakar Projects** — AI-first PM suite with MCP server, built in ~1 month, dogfooded daily (internal — likely easier permission)
   - LSA suite — breadth candidate: Electron + Next.js + API against hardware (needs permission or anonymization)
   - 200k-SKU repricing engine (no consent for real screenshots — anonymized retelling with recreated SVG/diagram visuals only)
   - Construction stock-management app (mobile/React Native representation)
   - Personal projects (dump pending)
   - **Velocity vignettes** (not full case studies, but a possible site element — a strip of small "shot on location in N days"-style receipts): Hirsch intake form (2 days), Tebza's meeting bot, etc.

## Repo-verified velocity receipts (the honest numbers table)

| Project                          | Window                           | Commits | Scale             | Team                 |
| -------------------------------- | -------------------------------- | ------- | ----------------- | -------------------- |
| The Business Finder (Cursor era) | Apr–Nov 2025                     | 1,646   | ~198k LOC         | Zaid + team          |
| HWG intake form                  | Sep–Oct 2025 burst + maintenance | 142     | ~19k LOC          | Zaid                 |
| VRP API (aa-api)                 | Dec 2025 – Jul 2026              | 109     | ~46k LOC          | Zaid                 |
| CatalogIQ core                   | Dec 2025 – Jul 2026              | 428     | ~116k LOC         | Zaid (side project!) |
| Lakar Projects (PM suite)        | Jan–May 2026                     | 577     | ~98k LOC          | Zaid + Tebza         |
| Project 007 (agent platform)     | Apr–Jul 2026, active             | 991     | ~250k LOC         | Zaid + Tebza         |
| Finances app                     | Feb–Jul 2026                     | 60      | ~13.5k LOC        | Zaid (personal)      |
| fra-zao-workflow                 | 4 days, Jun 2026                 | 17      | 25 commands       | Zaid                 |
| 3 Godot games + starter          | Jun–Jul 2026                     | 220+    | ~17k GDScript LOC | Zaid (personal)      |

Note the overlap: Dec 2025 – Jul 2026 has Zaid running aa-api + CatalogIQ + Lakar Projects + Project 007 + finances app + games + workflow system **concurrently**. That concurrency, with receipts, is the single most persuasive proof of the AI-accelerated claim.

### Candidate feature: "Production Slate" visualization (approved concept, for brand/design phase)

A timeline visualization of the AI era: projects as horizontal bars running concurrently, each labeled with honest stats (scope, window, team size, status). Reads like a film studio's production slate / festival program — planimetric, symmetric, on-grammar. The argument (one person, a full-time job, this many real systems in parallel) lands without stating a claim. Design decisions:

- **Commit counts are supporting texture only** (per-project sparklines at most), never the headline metric — commit-count-as-productivity reads as naive to senior engineers and AI workflows inflate it.
- **Data sourcing:** build-time script mining `git log` from local clones — no GitHub API, no auth, no live updates; static curated data fits the deliberateness thesis. Client project names anonymized pending permissions.
- **Caveat (from Zaid):** this is a new PC — not all repos are local. The receipts table above is a _floor_, not a full inventory. Older projects (LSA suite, original Lofts solver, Contracts AI, teaching slideshow, construction app, earlier personal work) likely live on the two GitHub profiles (personal + work) or older machines and would need cloning to be mined.

## Open Items

- [ ] Confirm exact years: Sportomatic start/end, TKC period, Lakar start (Zentraedi ~2018–late 2019, EasyOnline/ORM ~2019–2021 now roughed in)
- [ ] Inventory both GitHub profiles (personal + work) for repos missing from this new PC — teaching slideshow, Contracts AI, LSA suite, original Lofts solver, construction app, older personal projects — and clone whatever the production slate / case studies need
- [ ] Reconcile recalled vs. git timelines for HWG form ("2 days") and Lakar Projects ("1 month") — decide published framing
- [ ] Permission asks for Rich: name/show LSA? Lofts/aa-api? The Business Finder? Project 007 (pre-launch)? Lakar Projects?
- [ ] **Get exact CatalogIQ pilot figures** (onboarding time, conversion multiple, revenue milestone) from dad/investor — nothing publishes without verification; also confirm the client is OK being described (even anonymously)
- [ ] Lakar product: current state, Zaid's role specifics, what can be shown publicly
- [ ] CatalogIQ: build timeline, stack, AI workflow used to build it, publishable specifics
- [ ] Construction app: stack confirmation, any outcomes
- [ ] Locate Andrew Ng course certificates — confirm exact course titles + completion dates
- [ ] Domain name / professional handle for the site
