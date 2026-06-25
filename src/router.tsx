/**
 * Route table. Subsystem pages are lazy-loaded (route-level code-splitting) to
 * keep each route's above-the-fold payload small and protect the 3s navigation
 * budget (Req 1.5, 8.1). A shared Suspense fallback + RouteError handle the
 * pending and failure cases (Req 1.6, 8.2).
 */

import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { RouteError } from "./components/RouteError";
import { LoadingBlock } from "./components/primitives";

const CommandCenter = lazy(() => import("./pages/CommandCenter"));
const NewsFeedPage = lazy(() => import("./pages/NewsFeedPage"));
const DonationsPage = lazy(() => import("./pages/DonationsPage"));
const ResourceDirectoryPage = lazy(() => import("./pages/ResourceDirectoryPage"));

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
      { path: "news", element: withSuspense(<NewsFeedPage />), errorElement: <RouteError /> },
      { path: "donate", element: withSuspense(<DonationsPage />), errorElement: <RouteError /> },
      { path: "resources", element: withSuspense(<ResourceDirectoryPage />), errorElement: <RouteError /> },
      { path: "*", element: <RouteError /> },
    ],
  },
]);
