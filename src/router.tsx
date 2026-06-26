/**
 * Route table. The Hub is a single, self-contained Command Center — the curated
 * subsystems (news, donations, relief tools) all live in that one view. The only
 * drill-down is /stakeholders: an informational reference index of responding
 * organizations that is too large for a bento tile and is not trust-gated content.
 * Any unknown path falls back to the Command Center.
 */

import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { RouteError } from "./components/RouteError";
import { LoadingBlock } from "./components/primitives";

const CommandCenter = lazy(() => import("./pages/CommandCenter"));
const StakeholderMap = lazy(() => import("./pages/StakeholderMap"));

function withSuspense(node: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="container page">
          <LoadingBlock />
        </div>
      }
    >
      {node}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <AppShell />, // keeps chrome; the child error renders within
    children: [
      { index: true, element: withSuspense(<CommandCenter />), errorElement: <RouteError /> },
      // The one drill-down: the stakeholder/relief-organization reference index.
      { path: "stakeholders", element: withSuspense(<StakeholderMap />), errorElement: <RouteError /> },
      // Any other path falls back to the Command Center.
      { path: "*", element: withSuspense(<CommandCenter />) },
    ],
  },
]);
