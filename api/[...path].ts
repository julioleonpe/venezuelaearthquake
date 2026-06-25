/**
 * Vercel serverless function — the PRODUCTION runtime for the Hub's read API.
 *
 * This catch-all matches every `/api/*` request (e.g. /api/news, /api/meta,
 * /api/resources?keyword=water) and delegates to the shared `handleRead` core in
 * `server/api.ts` — the exact same gate/routing/fault-injection code the local
 * dev server (`server/server.ts`) uses, so the two runtimes cannot drift.
 *
 * Because the SPA and these functions are served from the same Vercel domain,
 * the front-end's relative `/api/...` fetches reach here with no proxy and no
 * client changes. The visibility gate runs HERE, on Vercel's servers, so
 * pending/rejected records never leave the server — honoring the trust invariant
 * in production exactly as in dev.
 *
 * Uses the dependency-free Web Handler signature (Request → Response), supported
 * by Vercel's Node.js runtime.
 */

import { handleRead } from "../server/api.ts";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return json(405, { error: "method_not_allowed" });
  }

  const url = new URL(request.url);
  const { status, body } = await handleRead(url.pathname, url.searchParams);
  return json(status, body);
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Same-origin in prod, but harmless and useful if the API is ever called
      // cross-origin (e.g. a future admin tool).
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
