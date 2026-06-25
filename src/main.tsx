import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { I18nProvider } from "./i18n/I18nProvider";
import { router } from "./router";
import "./styles/global.css";
import "./styles/pages.css";

// Vercel Analytics: privacy-friendly, cookieless pageview tracking. The component
// auto-detects React Router client-side navigations, so all four routes (/, /news,
// /donate, /resources) are counted without per-route wiring. Custom engagement
// events (e.g. donate_click) are fired via `track()` at the relevant chokepoints.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
      <Analytics />
    </I18nProvider>
  </StrictMode>,
);
