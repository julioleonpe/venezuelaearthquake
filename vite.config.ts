import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Route-level code-splitting is handled in the router via React.lazy, protecting
// the 3-second navigation budget (Req 1.5) and the above-the-fold budget (Req 8.1).
// `/api/*` is proxied to the local REST read service (server/server.ts) so the
// SPA fetches verified-only data over HTTP in dev exactly as it will in prod.
const API_PORT = process.env.API_PORT ?? "5181";

export default defineConfig({
  plugins: [react()],
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
