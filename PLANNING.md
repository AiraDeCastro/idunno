# PLANNING — I Dunno

Companion to [CLAUDE.md](CLAUDE.md) (day-to-day rules) and the PRD (full product spec). This file covers the *why* and the *with what*: vision, architecture, stack, and what needs to be in place before code gets written.

## Vision

Deciding where to eat is a small decision that regularly stalls into "idk, you pick." I Dunno replaces the stall with a game: set a few loose constraints — cuisine, price, distance, minimum rating — and spin a wheel populated with real, nearby restaurants pulled live from Google Places. The wheel isn't just a tiebreaker; it's the mechanism that pushes people past their default three restaurants and into the place they've walked past fifty times but never tried.

Success looks like people spinning more than once per session, actually tapping through to directions, coming back within a week, and — over time — landing on a wider spread of cuisines than they'd pick on their own.

## Architecture

```
┌─────────────────┐        ┌──────────────────────┐        ┌───────────────────┐
│   Browser (SPA)  │ spin → │  Edge/Serverless API  │ ─────► │  Cache (KV/Redis)  │
│  wheel · filters │ ◄──── │  proxy + cache check   │ ◄───── │  geohash+filters   │
│  result card     │        │  (Places key lives     │        │  → place list      │
└────────┬─────────┘        │   here, never client)  │        └───────────────────┘
         │                  └──────────┬─────────────┘
         │ geolocation                 │ cache miss
         ▼                             ▼
┌──────────────────┐         ┌───────────────────────┐
│ Browser Geolocation│        │  Google Places API     │
│  / manual address  │        │  Nearby Search          │
└──────────────────┘         │  Place Details (winner) │
                              │  Geocoding (manual entry)│
                              └───────────────────────┘
```

**Request flow for one spin:**
1. Browser resolves location (Geolocation API, or manual address → Geocoding API) and sends it, plus the active filters, to the app's own API layer — never directly to Google.
2. The API layer builds a cache key (coarse location grid + radius bucket + sorted cuisine set + sorted price set) and checks the KV cache.
3. **Cache hit:** return the cached place list immediately.
4. **Cache miss:** call Places Nearby Search, cache the result, return it.
5. Browser renders up to 12 results as wheel segments and spins client-side (no network call for the spin itself).
6. On landing, the browser requests Place Details for *only* the winning restaurant (photo, hours, full rating) — the app layer caches that per `place_id`.
7. "Get Directions" is a plain deep link to Google Maps — no embedded map/SDK needed for v1.

**Why a server layer at all:** the Places API key must never reach the client, and caching (§ CLAUDE.md) is required to keep API cost sane — both need something between the browser and Google.

## Technology stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | React + Next.js | Co-locates the UI with serverless/edge API routes in one deployable app — no separate backend service to stand up for an MVP this size. |
| Styling | Tailwind CSS | Fast to keep visually consistent (one accent color, restrained neutrals) without hand-rolling a design system for v1. |
| Wheel rendering/animation | Hand-rolled SVG/Canvas + CSS transforms, no external wheel library | The wheel is the product's centerpiece — full control over segment styling, easing, and `prefers-reduced-motion` fallback matters more than a generic library's defaults. |
| Client state | React state/hooks (Context for filters) | App-wide state is small (location, filters, current pool, spin result) — no case for Redux/Zustand at this scope. |
| API/proxy layer | Next.js API routes (Edge or serverless functions) | Keeps the Places API key server-side; same deploy as the frontend. |
| Cache | Upstash Redis (or Vercel KV) | Serverless-friendly, low-ops, fits the geohash+filter cache-key strategy in CLAUDE.md. |
| External data | Google Places API (Nearby Search, Place Details), Google Geocoding API | Source of restaurant data, ratings, price, and manual-location fallback per the PRD. |
| Hosting | Vercel | Pairs directly with Next.js + edge functions + KV; minimal deploy config. |
| Analytics | Plausible or PostHog (lightweight, privacy-respecting) | Needed to actually track the PRD's success metrics — spins/session, Get Directions rate, 7-day return, cuisine spread — nothing here is derivable from Places data alone. |
| Testing | Vitest + React Testing Library, jsdom environment | Fast, native ESM, pairs cleanly with Vite-based tooling; no reason to reach for Jest's extra config surface at this scope. |
| Git hooks / commit standard | Husky + commitlint (`@commitlint/config-conventional`) | Enforces Conventional Commits and gates every commit on lint, security audit, tests, and a production build — see CLAUDE.md's Commit standards section for the exact gate order and rationale. |

Pinned versions as of the initial scaffold (2026-09-04): **Next.js 16.3.4, React 19, ESLint 9.39.5.** These aren't arbitrary — Next.js versions below 16.3.4 carry multiple unpatched high/critical CVEs (RSC DoS, cache poisoning, request smuggling), so anything older fails the security gate outright. ESLint is pinned to 9.x rather than the newer 10.x because `eslint-config-next@16.3.4`'s own bundled plugins (`eslint-plugin-react`, `-jsx-a11y`, `-import`) only support ESLint up to ^9 — installing 10 "resolves" via npm overriding a real peer conflict, not genuine compatibility. Don't bump either without checking whether upstream has actually caught up.

This is a concrete starting recommendation, not a locked contract — revisit if a constraint surfaces that argues otherwise, but don't re-litigate it without a reason.

## Required tools & accounts

Needed before implementation starts:

- [ ] **Google Cloud project** with **Places API (New)** and **Geocoding API** enabled, billing attached, and an API key restricted by HTTP referrer/IP.
- [ ] Google Maps Platform **current ToS reviewed** for Places-data caching duration (blocks picking a cache TTL — see CLAUDE.md open items).
- [ ] **Node.js** (LTS) + a package manager (npm or pnpm).
- [ ] **Git** + a remote repo (this directory isn't a git repo yet — `git init` needed before any commit history exists).
- [ ] **Upstash Redis** (or Vercel KV) account for the cache layer.
- [ ] **Vercel** account for hosting/preview deploys.
- [ ] **Analytics provider** account (Plausible or PostHog) wired in early enough to capture metrics from day one, not bolted on later.
- [ ] `.env.local` convention for the Places API key and cache credentials — never committed.

Nice-to-have, not blocking:
- Figma (or similar) if the wheel/result-card visuals get designed before being coded.
- Playwright or Vitest for the spin logic and filter-matching once there's code worth testing.
