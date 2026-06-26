import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { I18nProvider } from "./i18n/I18nProvider";
import { router } from "./router";
import "./styles/global.css";
import "./styles/pages.css";

// Vercel Analytics: privacy-friendly, cookieless pageview tracking. The Hub is a
// single command-center view (no drill-down routes), so this mainly counts the
// home pageview; custom engagement events (e.g. donate_click) are fired via
// `track()` at the relevant chokepoints.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
      <Analytics />
    </I18nProvider>
  </StrictMode>,
);
