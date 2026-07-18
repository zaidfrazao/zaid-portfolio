# zaid-portfolio

Personal portfolio site for Zaid Frazao — an AI-accelerated product builder.
Built on the _formal grammar_ of Wes Anderson's filmmaking applied to honest
portfolio content ("grammar, not props"). See [`docs/PRD.md`](docs/PRD.md) for
the full vision and [`docs/BRAND_GUIDE.md`](docs/BRAND_GUIDE.md) for the design
system.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React
- TypeScript (strict mode)
- CSS Modules + CSS custom-property tokens
- Deployed on [Vercel](https://vercel.com)

## Requirements

- Node.js `>= 22` (see [`.nvmrc`](.nvmrc))

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the dev server on port 3000            |
| `npm run build`        | Production build                             |
| `npm run start`        | Serve the production build                   |
| `npm run lint`         | ESLint (`next/core-web-vitals` + TypeScript) |
| `npm run typecheck`    | Type-check with `tsc --noEmit`               |
| `npm run format`       | Format with Prettier                         |
| `npm run format:check` | Check formatting without writing             |
| `npm run test`         | Placeholder — test tooling lands later       |

## Project docs

- [`docs/PRD.md`](docs/PRD.md) — product requirements
- [`docs/BRAND_GUIDE.md`](docs/BRAND_GUIDE.md) — brand & UX guidelines
- [`docs/TESTING_STRATEGY.md`](docs/TESTING_STRATEGY.md) — testing approach
