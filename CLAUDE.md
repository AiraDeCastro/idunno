# I Dunno

Spin-the-wheel restaurant picker. User sets loose constraints (cuisine, price, distance, minimum rating), the app pulls matching restaurants near them from Google Places, and a spinning wheel picks one — nudging people toward places they wouldn't have picked themselves. Full spec: PRD v0.2 (ask the user for the artifact link if it's not in this repo).

Core loop: **Locate → Filter → Spin → Decide.**

## Session workflow

- **Read [PLANNING.md](PLANNING.md) at the start of every new conversation** — it has the vision, architecture, and stack decisions this file assumes.
- **Check [TASKS.md](TASKS.md) before starting work** — pick up from the current milestone rather than guessing what's next.
- **Mark tasks complete in TASKS.md immediately** when finished, not batched at the end of a session.
- **Add newly discovered tasks to TASKS.md** as soon as they're found, under the milestone they belong to (or a new one if none fits) — don't just fix-and-forget or mention them in passing.

## Stack & architecture

- Responsive web app, mobile-first. No native app in v1.
- Restaurant data: Google Places API — Nearby Search for the candidate pool, Place Details for the full record (photo, hours, review breakdown) on the winning restaurant only.
- Location: browser Geolocation API, with a manual address/zip fallback (Geocoding API) when permission is denied.
- **Places API calls must be proxied through a server/edge function.** The API key never ships to the client.
- No accounts/auth in v1 — nothing here should assume a logged-in user or persist data server-side per-user.

## Google Places integration rules

- **Cuisine matching is per-cuisine, not uniform.** Use native Places `type` where Google has one (Italian, Chinese, Mexican, Japanese, Indian, Thai, Korean, Vietnamese, Mediterranean, American, French, Greek, …). Where there's no native type — Filipino, Canadian, and any others found during implementation — layer a keyword search on top of `type=restaurant` (e.g. `keyword="Filipino restaurant"`). Pick whichever produces the best matches for that cuisine; the method is invisible to the user.
- Price filter maps to Places `price_level` (0–4, shown to users as $–$$$$).
- **Caching is required, not optional**, to keep Places API cost sane:
  1. Round the user's location to a coarse grid cell (~½–1 km) before building a cache key, so nearby requests / GPS jitter share a cache entry.
  2. Cache key = grid cell + radius bucket + sorted cuisine set + sorted price set.
  3. Nearby Search returns up to 20 results; the wheel only shows 12 — one call should cover a full spin session unless filters change. Don't re-query on every respin.
  4. Fetch Place Details only for the restaurant the wheel lands on, never for all 12 segments up front.
  5. **Before picking a cache TTL, verify current Google Maps Platform terms on how long Places data may be cached** — don't assume a duration.
- Any UI showing Google ratings/photos needs visible Google attribution per their ToS.

## Non-goals (v1) — don't build these unless scope changes

- No reservations/ordering/delivery integration
- No in-app reviews, follows, or social features — ratings/counts are Google's
- No multi-stop trip planning
- No native app / accounts / saved favorites / "tried" history — these are Phase 2

## Design principles

- One accent color, spent deliberately — reserved for the wheel and the primary action. Everything else neutral.
- Filters live in a compact bar/drawer, not a form blocking the spin.
- The spin is the only animation that matters; no incidental motion elsewhere. Respect `prefers-reduced-motion` with an instant/simplified result reveal instead of the full spin.
- Mobile-first, one-handed reach: spin button and result actions within thumb range.
- Accessible by default: spin is keyboard-operable, result is announced to screen readers, price/cuisine are always labeled in text (never color-only).
- Light and dark mode both ship at launch, not as a follow-up.

## Key flows to preserve

- Filters default wide-open (all cuisines, all prices) so a first-time user can spin with zero setup.
- Show a live match count before the wheel populates, so users know if their filters are too narrow.
- Fewer than 3 matches → prompt to widen radius/loosen filters instead of spinning a near-empty wheel.
- Exactly 1 match → still play the spin animation, but the outcome is deterministic.
- Location permission denied → fall back to manual entry immediately, no dead end.
- Places API error/rate limit → friendly retry state, never a raw error or blank screen.
- Result actions: **Get Directions** (Google Maps deep link), **Spin Again** (new pull from same pool), **Exclude & Respin** (drops this restaurant from the pool for the session).

## Commit standards

- **Every commit message must follow [Conventional Commits](https://www.conventionalcommits.org/)** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, etc.) — enforced by commitlint via a `commit-msg` hook. A non-conforming message is rejected, not just warned about.
- **A pre-commit hook (Husky) gates every commit on, in order:**
  1. `npm run lint` — ESLint, zero warnings tolerated (`--max-warnings=0`)
  2. `npm audit --audit-level=high` — blocks on high/critical vulnerabilities. Threshold is deliberately `high`, not `moderate`: moderate advisories in dev-tooling transitive deps are extremely common and often unfixable without dropping the tool, so blocking on them would make the gate impossible to satisfy in practice. High/critical is the real bar.
  3. `npm test` — full Vitest suite
  4. `npm run build` — full production build (`next build`)
  Order is cheapest-check-first so a broken commit fails fast rather than waiting through a full build first.
- **If tests don't exist yet for something the hook needs to pass, write them — don't weaken the gate.** The hook assumes a real test suite exists; skipping or stubbing it defeats the point.
- Don't loosen the audit threshold, drop a gate step, or downgrade a pinned dependency to make a commit pass — fix the actual lint/test/build/vulnerability, or ask the user if the gate itself seems wrong.

## Open items to flag if touched

- Google Maps Platform caching-terms verification is still outstanding — flag it rather than assuming an answer if a caching TTL needs to be picked.
- "Open now" filter was raised as a possible v1 addition but isn't committed scope — confirm with the user before adding it.

## Session log

### 2026-09-04
- Wrote the PRD (v0.2): vision, target users, core flow, features, design principles, and technical approach. Resolved two open items during review — cuisine matching (native `type` where Google has one, keyword fallback where it doesn't, e.g. Filipino/Canadian) and the Places API cost/caching strategy (coarse-grid cache keys, deferred Place Details, TTL pending Google ToS verification) — both are now written into this file.
- Created this file, PLANNING.md, and TASKS.md from the PRD.
- Added the Session workflow section above (read PLANNING.md at session start; check, complete, and add to TASKS.md as work happens).
- Completed Milestone 0, task 1 (`git init`, initial commit, remote repo): installed `gh` via winget, user authenticated it themselves, then created the public repo and pushed — [github.com/AiraDeCastro/idunno](https://github.com/AiraDeCastro/idunno). Marked done in TASKS.md.
- Scaffolded the Next.js app (Milestone 0, task 2) to have something real for tooling to check, then implemented the pre-commit standards the user asked for: Husky pre-commit hook (lint → audit → test → build) and commitlint enforcing Conventional Commits. Added the Commit standards section above.
  - Had to correct course twice on version choices, both documented in PLANNING.md: started on Next 14 as the "safe stable" pick, but `npm audit` showed the whole Next 9–16.3.0 range carries unpatched high/critical CVEs — moved to Next 16.3.4 (patched), which pulled in React 19 and ESLint 9 flat config.
  - Tried bumping ESLint to the newer 10.x line to clear a deprecation notice; reverted after finding `eslint-config-next@16.3.4`'s bundled plugins only really support ESLint ^9 — npm was overriding a genuine peer conflict, not resolving a compatible one.
  - `next lint` no longer exists in Next 16 (removed CLI subcommand) — lint script calls `eslint .` directly.
  - `eslint-config-next` now ships native flat-config arrays (`eslint-config-next/core-web-vitals`) rather than a legacy shareable config — the `FlatCompat` wrapper pattern from older Next versions caused a circular-JSON crash; fixed by importing the flat config directly.
  - Wrote a real smoke test (`tests/page.test.tsx`) for the home page since no tests existed yet, per the user's "build tests first if none exist" instruction.
  - Verified all four gates pass (lint, audit at 0 vulnerabilities, tests, build) before wiring them into the hook.

### 2026-09-06
- Built Milestone 1 (Location & filters) in full: `useGeolocation` hook, `LocationContext` (geolocation + manual entry + session persistence, `LocationGate` UI), a server-side `/api/geocode` route proxying Google Geocoding, and `FiltersContext` with cuisine/price/radius/min-rating filter components (`ChipGroup`, `RadiusFilter`, `MinRatingFilter`, `FilterBar`). Also closed the leftover Milestone 0 env-var task (`.env.local.example`, README.md) and added `.claude/launch.json` for `preview_start`.
- `GOOGLE_MAPS_API_KEY` is documented and the route is fully implemented, but there's still no real key — that's blocked on the user creating the Google Cloud project (Milestone 0 task, needs their account/billing). Verified the route's error handling (missing key, zero results, upstream failure) with mocked tests and confirmed in-browser that a missing key fails gracefully rather than crashing.
- Hit a real ESLint error mid-build: `eslint-config-next`'s newer `react-hooks` rule flagged `setState` synchronously inside a `useEffect` (the sessionStorage-hydration pattern). Fixed properly with `useSyncExternalStore` instead of suppressing the rule — the textbook-correct API for reading an external store without triggering that anti-pattern.
- Caught a design-principle violation in the browser, not just in code review: with every cuisine/price chip selected by default, filling each one in the accent color turned the whole screen rose, violating "one accent, spent deliberately." Fixed by flipping the visual language — inclusion is now the neutral default look, exclusion (muted, strikethrough) is the state that stands out — and moved the mi/km toggle and minimum-rating switch to neutral styling too, leaving rose reserved for genuine primary actions (Use my location, Find it).
- All four pre-commit gates verified passing (23 tests across 6 files, 0 vulnerabilities, clean lint, clean build) before commit.
