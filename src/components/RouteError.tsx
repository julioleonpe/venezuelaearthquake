/**
 * RouteError — shown when a route fails to load/render (e.g. a lazy chunk fails),
 * satisfying Req 1.6: display an error indicating the subsystem is unavailable
 * while keeping the Visitor able to return. It also serves the not-found case.
 */

import { Link, useRouteError } from "react-router-dom";
import { AlertIcon } from "./icons";
import { useI18n } from "../i18n/I18nProvider";

export function RouteError() {
  const { t } = useI18n();
  const error = useRouteError();

  return (
    <div className="container page">
      <div className="card" style={{ maxWidth: 540, margin: "40px auto", padding: 32, textAlign: "center" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: "var(--danger-bg)",
            color: "var(--danger-fg)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 18px",
          }}
          aria-hidden="true"
        >
          <AlertIcon size={26} />
        </div>
        <h1 style={{ fontSize: "1.5rem", marginBottom: 10 }}>{t("error.navTitle")}</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 22 }}>{t("error.navBody")}</p>
        <Link to="/" className="btn btn-primary">
          {t("nav.home")}
        </Link>
        {import.meta.env?.DEV && error ? (
          <pre
            style={{
              marginTop: 22,
              textAlign: "left",
              fontSize: "0.78rem",
              color: "var(--ink-faint)",
              whiteSpace: "pre-wrap",
            }}
          >
            {String((error as Error)?.message ?? error)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
