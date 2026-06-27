import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Route-level code-splitting is handled in the router via React.lazy, protecting
// the 3-second navigation budget (Req 1.5) and the above-the-fold budget (Req 8.1).
// `/api/*` is proxied to the local REST read service (server/server.ts) so the
// SPA fetches verified-only data over HTTP in dev exactly as it will in prod.
const API_PORT = process.env.API_PORT ?? "5181";

/**
 * Dev-only stand-in for the `api/donate-clicks.ts` Vercel function. Vite doesn't
 * run the serverless functions in `api/`, and the local read server doesn't know
 * this route — so without this the click counter would be invisible in dev. This
 * keeps an in-memory tally (resets on restart) so the feature is fully exercisable
 * locally. Its middleware runs before the `/api` proxy, so it wins for this exact
 * path; in production the real KV-backed function handles it instead.
 */
function donateClicksDevPlugin(): Plugin {
  // Matches the BASELINE the prod function self-seeds in KV (api/donate-clicks.ts),
  // so dev shows the same starting number; real prod count lives in KV.
  let total = 33;
  return {
    name: "donate-clicks-dev",
    configureServer(server) {
      server.middlewares.use("/api/donate-clicks", (req, res) => {
        const send = () => {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify({ total }));
        };
        if (req.method === "POST") {
          req.on("data", () => {}); // drain + ignore body
          req.on("end", () => {
            total += 1;
            send();
          });
          return;
        }
        send(); // GET
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), donateClicksDevPlugin()],
  server: {
    port: 5180,
    open: true,
    proxy: {
      "/api": {
        // 127.0.0.1, not "localhost": on Windows "localhost" resolves dual-stack
        // (::1 + 127.0.0.1) and the proxy can pick the address the server isn't
        // serving, causing intermittent hangs. Pin to IPv4 to match the server.
        target: `http://127.0.0.1:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
