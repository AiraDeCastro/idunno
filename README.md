# I Dunno

Spin the wheel. Try somewhere new.

A restaurant picker: set a few loose constraints (cuisine, price, distance, minimum rating) and spin a wheel populated with real, nearby restaurants from Google Places.

See [PLANNING.md](PLANNING.md) for the vision/architecture/stack, [TASKS.md](TASKS.md) for build progress, and [CLAUDE.md](CLAUDE.md) for the project's working rules.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Required for | Where to get it |
|---|---|---|
| `GOOGLE_MAPS_API_KEY` | Manual address lookup (`/api/geocode`); Places search in a later milestone | A Google Cloud project with the Places API (New) and Geocoding API enabled, key restricted by HTTP referrer/IP. See PLANNING.md's "Required tools & accounts". |

```bash
npm run dev
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm test` | Vitest suite |

Every commit runs lint, a security audit, the test suite, and a production build via a pre-commit hook — see CLAUDE.md's "Commit standards" for the exact gate order and rationale. Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/).
