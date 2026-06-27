/**
 * Donation-link click counter — a tiny, self-contained Vercel serverless endpoint.
 *
 *   GET  /api/donate-clicks  → { total: number | null }
 *   POST /api/donate-clicks  (body: { id?: string }) → { total: number | null }
 *
 * This is deliberately SEPARATE from the read API core (`server/api.ts`): a click
 * tally is engagement telemetry, NOT curated content, so it must never touch the
 * visibility gate or the curated store. Keeping it in its own function keeps that
 * boundary physical.
 *
 * Storage is Vercel KV (Upstash Redis), reached over its REST API with `fetch` so
 * we add NO npm dependency (consistent with the dependency-free function next door).
 * It reads the standard Vercel KV env vars (`KV_REST_API_URL` + `KV_REST_API_TOKEN`),
 * which Vercel injects once you attach a KV store to the project.
 *
 * Graceful degradation: if KV isn't configured (local `dev:web`, a preview without
 * the store attached), every call returns `{ total: null }` with HTTP 200 — the UI
 * simply hides the number rather than erroring. The Hub never depends on this count.
 *
 * Trust note: this is a best-effort public vanity metric, not an audited figure.
 * It counts *clicks on donation links*, never donations or funds — the Hub still
 * never sees money (see CLAUDE.md). The number is inherently inflatable by anyone
 * POSTing here; treat it as directional engagement, not a financial total.
 */

const TOTAL_KEY = "donate:clicks:total";
/**
 * Starting display value in production. The counter self-seeds to this the first
 * time it's touched (via SET ... NX — only if the key doesn't exist yet), then
 * INCRs up from there as real clicks arrive. Changing this does NOT reset a count
 * that already exists in KV.
 */
const BASELINE = 33;
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

/** Per-recipient breakdown is bucketed under a safe, bounded id. */
function channelKey(id: string): string | null {
  const clean = id.trim().toLowerCase();
  if (!/^[a-z0-9_-]{1,64}$/.test(clean)) return null;
  return `donate:clicks:ch:${clean}`;
}

const kvConfigured = Boolean(KV_URL && KV_TOKEN);

/** One Upstash REST command, e.g. ["INCR", key] → its numeric result (or null). */
async function kv(command: (string | number)[]): Promise<number | null> {
  if (!kvConfigured) return null;
  try {
    const res = await fetch(KV_URL as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    return typeof data.result === "number" ? data.result : Number(data.result) || 0;
  } catch {
    return null; // never let telemetry break the request
  }
}

/** Seed the total to BASELINE only if it doesn't exist yet (idempotent). */
async function ensureSeeded(): Promise<void> {
  // SET key value NX → no-op once a real count exists, so clicks are never lost.
  await kv(["SET", TOTAL_KEY, BASELINE, "NX"]);
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") {
    await ensureSeeded();
    const total = await kv(["GET", TOTAL_KEY]);
    return json(200, { total });
  }

  if (request.method === "POST") {
    await ensureSeeded();
    // Optionally attribute the click to a recipient channel (best-effort).
    let id: string | undefined;
    try {
      const body = (await request.json()) as { id?: unknown };
      if (typeof body?.id === "string") id = body.id;
    } catch {
      /* empty / non-JSON body is fine — we still bump the total */
    }

    // Increment per-channel (fire-and-forget) and the headline total.
    if (id) {
      const key = channelKey(id);
      if (key) void kv(["INCR", key]);
    }
    const total = await kv(["INCR", TOTAL_KEY]);
    return json(200, { total });
  }

  return json(405, { error: "method_not_allowed" });
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
