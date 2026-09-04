# TASKS — I Dunno

Build order for the MVP defined in the PRD, grounded in the stack/architecture in [PLANNING.md](PLANNING.md) and the rules in [CLAUDE.md](CLAUDE.md). Milestones are sequential — each one assumes the previous is working, not just started.

## Milestone 0 — Project & infra setup

Goal: an empty app that deploys, with every external account it'll need already provisioned.

- [ ] `git init`, initial commit, remote repo
- [ ] Scaffold Next.js app with Tailwind CSS
- [ ] Connect repo to Vercel for preview deploys
- [ ] Create Google Cloud project; enable Places API (New) + Geocoding API; generate an API key restricted by HTTP referrer/IP
- [ ] Provision Upstash Redis (or Vercel KV) instance
- [ ] Establish `.env.local` convention; document required env vars in the README
- [ ] Set up analytics provider (Plausible or PostHog) skeleton, even with no events yet

## Milestone 1 — Location & filters

Goal: user can tell the app where they are and what they want, with no restaurant data involved yet.

- [ ] Geolocation API request flow, with permission-rationale copy shown before the prompt
- [ ] Manual address/zip fallback via Geocoding API for denied/unavailable location
- [ ] Persist last-used location for the session (not account-tied)
- [ ] Cuisine multi-select filter (chips), default: all selected
- [ ] Price multi-select filter ($–$$$$), default: all selected
- [ ] Radius slider with mi/km toggle, default 5 mi
- [ ] Minimum-rating toggle, default 3.5★ and up
- [ ] Central filter state (Context) that the data layer can read from

## Milestone 2 — Places data layer & caching

Goal: filters return a real, cached pool of nearby restaurants.

- [ ] Server-side API route proxying Nearby Search (key never reaches the client)
- [ ] Per-cuisine matching table: native `type` where Google has one, keyword search on `type=restaurant` where it doesn't (Filipino, Canadian, etc.)
- [ ] Cache-key builder: coarse location grid + radius bucket + sorted cuisine set + sorted price set
- [ ] Cache read/write against Redis (TTL placeholder until Google's caching terms are verified — see Milestone 6)
- [ ] Live match-count display before the wheel populates
- [ ] Fewer-than-3-matches handling: prompt to widen radius/loosen filters instead of spinning a near-empty wheel
- [ ] Friendly retry UI for Places API errors/rate limits

## Milestone 3 — The wheel

Goal: the core mechanic works end to end on a mock or real pool.

- [ ] Wheel visual: up to 12 segments, SVG/Canvas, styled to the accent palette
- [ ] Weighted-random segment selection logic
- [ ] Spin animation: physics-based deceleration, 2.5–4s
- [ ] `prefers-reduced-motion` fallback: instant/simplified result reveal, no full spin
- [ ] Exactly-1-match case: animation still plays, landing is deterministic
- [ ] Keyboard-operable spin trigger; result announced to screen readers

## Milestone 4 — Result & actions

Goal: landing on a restaurant leads somewhere useful.

- [ ] Result card: photo, name, cuisine tag, price tier, rating, distance, full address
- [ ] Server-side Place Details fetch for the winning restaurant only, cached per `place_id`
- [ ] Get Directions — deep link to Google Maps
- [ ] Spin Again — new pull from the existing cached pool
- [ ] Exclude & Respin — drop this restaurant from the session's pool, respin
- [ ] Visible Google attribution wherever ratings/photos are shown

## Milestone 5 — Design & accessibility polish

Goal: the app matches the "clean, minimal, beautiful" bar, not just the functional spec.

- [ ] One-accent-color pass across the whole UI — confirm nothing else is competing for attention
- [ ] Light and dark theme, both fully styled (not just inverted)
- [ ] Mobile-first responsive pass; confirm spin button and result actions sit in one-handed thumb reach
- [ ] Full keyboard-navigation pass across filters, spin, and result actions
- [ ] Confirm price/cuisine are always labeled in text, never color-only
- [ ] Cross-device/browser QA (mobile Safari, mobile Chrome, desktop)

## Milestone 6 — Metrics & compliance

Goal: the app can be trusted with real traffic.

- [ ] Analytics events: spins/session, Get Directions clicks, 7-day return, cuisine distribution over time
- [ ] Verify current Google Maps Platform terms on Places-data caching duration; finalize the cache TTL from Milestone 2
- [ ] Google attribution/ToS compliance review
- [ ] Location-permission privacy copy reviewed for clarity

## Milestone 7 — Launch readiness

Goal: ship it.

- [ ] End-to-end QA against every edge case in the PRD (denied location, sparse-result area, API failure, 1-match spin)
- [ ] Performance pass: location → populated wheel under 2s, spin holds 60fps
- [ ] Production deploy + smoke test
- [ ] Revisit the "open now" filter as a possible fast-follow (flagged in the PRD, not committed scope — decide before or explicitly after launch)
