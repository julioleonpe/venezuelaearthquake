import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Route-level code-splitting is handled in the router via React.lazy, protecting
// the 3-second navigation budget (Req 1.5) and the above-the-fold budget (Req 8.1).
//
// The Hub is fully static: every tile reads bundled data in the browser (curated
// content from src/api/published.ts through the pure gate; relief points from the
// daily src/data/relief-points.json snapshot). There is no `/api`, no dev proxy,
// and no serverless function — so nothing here can report "unavailable" in prod.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    open: true,
  },
});
