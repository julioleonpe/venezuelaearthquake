# Venezuela Earthquake Hub — Frontend

A public, **bilingual (EN/ES)** earthquake-relief coordination Hub. Ships at **venezuelaearthquake2026.com**
as a **pure static SPA on Vercel — no backend**.

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
API call. The Seismic console fetches live data directly from public sources (USGS + the community damage
feed). For day-to-day work, **`npm run dev:web` is all you need** and matches production exactly.

A `server/` directory holds a zero-dep Node read service from an earlier (two-process) architecture.
`npm run dev` still spawns it alongside Vite, but the deployed static build does **not** use it — it's
kept only as a reference / backend-reuse target.

### Things to try

- **Single command center.** Everything lives in one view at `/` — News, the Relief Tools & Apps
  launcher, the Seismic console, and Donate. There are no drill-down pages; unknown paths fall back home.
- **Dual-layer seismic map.** Toggle the centerpiece between **Seismic** (live USGS epicenters, amber→red
  magnitude) and **Damage** (live community-reported buildings from terremotovenezuela.com, a distinct
  cool color ramp + legend + provenance line). Each layer fetches and degrades independently.
- **Language toggle** (EN/ES) — re-renders chrome in place, persists across navigation, never
  machine-translates curated record content (those keep a small `EN`/`ES` language indicator).
- **Graceful degradation** — append `?fail=news,donations` (any subset of `news`/`donations`/`resources`)
  to the URL. Those subsystems are marked unavailable *by name* while the rest keeps rendering (Req
  8.4/8.5).

> **Scope:** this is the **public, Visitor-facing** Hub.

## Architecture

One static SPA over a shared, trust-critical domain:

- **`src/` — React + TypeScript SPA (Vite).** Renders the bento command center.
- **`src/api/` — in-browser read API.** `store.ts` reads the published dataset (`published.ts`) and runs
  the pure domain gate over it; `published.ts` ships **only verified records**, so `pending` / `rejected`
  records never reach the bundle. Function signatures stay Promise-based so each subsystem fetches
  independently and maps a rejection to its "unavailable by name" notice.
- **`src/domain/{core,types}.ts` — pure, framework-free trust logic.** The single place the visibility
  gate, search, sort, donation-completeness, and source-host labeling live. No DB/HTTP/React deps.
- **Live external layers** (`src/lib/usgs.ts`, `src/lib/damage.ts`) are third-party feeds fetched
  directly from the browser. They are **deliberately outside the curated gate** and rendered as
  clearly-attributed external layers — never laundered into curated records.

See `CLAUDE.md` for the full set of architecture invariants.
