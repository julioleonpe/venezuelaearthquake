/**
 * Local dev REST server — a thin node:http wrapper around the shared read core
 * in `server/api.ts`.
 *
 * This is the DEV runtime only. In production on Vercel the same `handleRead`
 * core is invoked by the serverless function in `api/[...path].ts` instead — so
 * the gate, routing, and fault injection are physically the same code in both
 * places and cannot drift. See README → "Deploying to Vercel".
 *
 * Zero runtime dependencies: Node 24 native TypeScript + the built-in http server.
 *
 * Run:  npm run server   (or via the combined launcher: npm run dev)
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { handleRead } from "./api.ts";

const PORT = Number(process.env.PORT ?? 5181);
/**
 * Bind IPv4 explicitly. On Windows "localhost" resolves dual-stack (::1 and
 * 127.0.0.1); binding only one family while clients reach for the other causes
 * intermittent connection hangs. The Vite dev proxy targets 127.0.0.1 to match.
 */
const HOST = process.env.HOST ?? "127.0.0.1";

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    // Dev convenience: the Vite dev server proxies /api, but allow direct calls too.
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  handleRead(url.pathname, url.searchParams)
    .then(({ status, body }) => sendJson(res, status, body))
    .catch(() => sendJson(res, 500, { error: "internal_error" }));
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`[hub-api] read service listening on http://${HOST}:${PORT}`);
});
