# Venezuela Earthquake Hub — Frontend

A public, **bilingual (EN/ES)** earthquake-relief coordination Hub. Ships at **venezuelaearthquake2026.com**
on Vercel — **static-first** (curated content renders in the browser with no backend), with a small set
of Vercel serverless functions in `api/` for the few things that need a server (e.g. the donation
click counter, backed by Vercel KV).

The aesthetic is the **"Seismograph Console"** — an instrument-grade civic coordination utility,
deliberately *not* an emotional campaign or a scam clone. Cool light-slate base, monospace data readings,
a seismic amber→red magnitude accent, and a thin Venezuela tricolor as a recurring civic marker
(Fraunces · IBM Plex Sans · IBM Plex Mono).

## Run it

```bash
npm install
npm run dev:web    # Vite dev server (SPA only) — matches production
npm run dev        # also spawns the legacy server/ read service (see note)
npm run build      # tsc --noEmit + vite production build
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
```

The Hub is a static SPA: curated content (News / Donations / Resources) is read **in the browser** from
the published dataset (`src/api/published.ts`) and filtered through the pure domain gate — there is no
API call. The relief map reads a public community source (the acopios & refugios feed) from a bundled
static snapshot (`src/data/relief-points.json`); refresh it with `npm run relief:refresh`, then commit
and redeploy. For day-to-day work, **`npm run dev:web` is all you need** and matches production exactly.

A `server/` directory holds a zero-dep Node read service from an earlier (two-process) architecture.
`npm run dev` still spawns it alongside Vite, but the deployed static build does **not** use it — it's
kept only as a reference / backend-reuse target.

### Things to try

- **Single command center.** Everything lives in one view at `/` — News, the Relief Tools & Apps
  launcher, the relief map, and Donate. There are no drill-down pages; unknown paths fall back home.
- **Relief map.** Filter the centerpiece by **All / Acopios / Refugios** — community-reported
  donation **collection centers** (amber squares) and **shelters** (teal circles) from
  acopios-refugios.vercel.app, with a legend, a snapshot-date line, and an always-on provenance line that
  refers you there to report new points. Unverified ("sin verificar") acopios are flagged as such and
  never shown as vetted.
- **Language toggle** (EN/ES) — re-renders chrome in place, persists across navigation, never
  machine-translates curated record content (those keep a small `EN`/`ES` language indicator).
- **Graceful degradation** — append `?fail=news,donations` (any subset of `news`/`donations`/`resources`)
  to the URL. Those subsystems are marked unavailable *by name* while the rest keeps rendering (Req
  8.4/8.5).

> **Scope:** this is the **public, Visitor-facing** Hub.

## Architecture

A static-first SPA over a shared, trust-critical domain, plus a few serverless functions:

- **`src/` — React + TypeScript SPA (Vite).** Renders the bento command center.
- **`src/api/` — in-browser read API.** `store.ts` reads the published dataset (`published.ts`) and runs
  the pure domain gate over it; `published.ts` ships **only verified records**, so `pending` / `rejected`
  records never reach the bundle. Function signatures stay Promise-based so each subsystem fetches
  independently and maps a rejection to its "unavailable by name" notice.
- **`src/domain/{core,types}.ts` — pure, framework-free trust logic.** The single place the visibility
  gate, search, sort, donation-completeness, and source-host labeling live. No DB/HTTP/React deps.
- **External layer** (`src/lib/acopios.ts`) is a third-party feed read from a bundled static snapshot
  (`src/data/relief-points.json`, refreshed via `npm run relief:refresh`). It is **deliberately outside
  the curated gate** and rendered as a clearly-attributed external layer, preserving the source's own
  moderation state (unverified acopios stay flagged) — never laundered into curated records.
- **`api/` (root) — Vercel serverless functions.** `api/[...path].ts` is a read API mirroring `src/api`
  (present for parity; the SPA no longer calls it). `api/donate-clicks.ts` is a tiny counter of donation
  links opened, backed by **Vercel KV** — kept entirely separate from the curated read path (engagement
  telemetry, never curated content). It degrades to a hidden count when KV isn't configured (local dev /
  previews), so the Hub never depends on it. The relief map no longer needs a proxy — its points ship as
  a bundled static snapshot refreshed at build time by `scripts/fetch-relief-points.mjs`, so the browser
  never hits the upstream's cross-origin redirect at all.

See `CLAUDE.md` for the full set of architecture invariants.
