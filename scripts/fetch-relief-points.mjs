/**
 * Relief-points refresh — snapshots the community acopios/refugios feed into a
 * bundled JSON file the SPA ships statically.
 *
 * We deliberately do NOT fetch this feed live from the browser anymore:
 *   - the upstream (a Google Apps Script Web App) 302-redirects cross-origin,
 *     tripping the browser's CORS check on a direct fetch, and
 *   - the serverless proxy that worked around that kept failing on Vercel
 *     ("live relief-point data is temporarily unavailable").
 *
 * Instead this script (run server-side, where there is no CORS) pulls the feed
 * and writes src/data/relief-points.json. The SPA imports that snapshot, so the
 * map renders instantly and can never be "unavailable". Re-run to refresh:
 *
 *   npm run relief:refresh   # then commit src/data/relief-points.json + deploy
 *
 * The rows are stored verbatim (upstream Spanish keys); the pure normalizer in
 * src/lib/acopios.ts (normalizeReliefRows) still applies the moderation gate and
 * shapes them at import time, so the trust logic stays in one tested place.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const UPSTREAM =
  "https://script.google.com/macros/s/AKfycbzKAcMzH739iu1nL6ztBmm3uymajUy6V0lPEQmbQeBjABUJ84odAxEnv0QD9Cjy5pP0Tw/exec";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data");
const OUT_FILE = join(OUT_DIR, "relief-points.json");

async function main() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  let rows;
  try {
    // Node follows the 302 → script.googleusercontent.com server-side (no CORS).
    const res = await fetch(UPSTREAM, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`upstream responded ${res.status}`);
    rows = await res.json();
  } finally {
    clearTimeout(timer);
  }

  if (!Array.isArray(rows)) {
    throw new Error(`expected a JSON array, got ${typeof rows}`);
  }

  const acopios = rows.filter((r) => (r?.tipo ?? "").toLowerCase() === "acopio").length;
  const refugios = rows.filter((r) => (r?.tipo ?? "").toLowerCase() === "refugio").length;

  const snapshot = {
    // Provenance + freshness, surfaced in the UI so the snapshot is never
    // mistaken for a live feed.
    generatedAt: new Date().toISOString(),
    source: "https://acopios-refugios.vercel.app/",
    count: rows.length,
    rows,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

  console.log(
    `Wrote ${rows.length} relief points (${acopios} acopios, ${refugios} refugios) ` +
      `to src/data/relief-points.json\n` +
      `Snapshot time: ${snapshot.generatedAt}\n` +
      `Next: commit src/data/relief-points.json and redeploy.`,
  );
}

main().catch((err) => {
  console.error(`relief:refresh failed — ${err.message}`);
  console.error("Kept the existing snapshot; try again later.");
  process.exit(1);
});
