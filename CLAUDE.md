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

## Open items to flag if touched

- Google Maps Platform caching-terms verification is still outstanding — flag it rather than assuming an answer if a caching TTL needs to be picked.
- "Open now" filter was raised as a possible v1 addition but isn't committed scope — confirm with the user before adding it.
