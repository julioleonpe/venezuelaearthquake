/**
 * SeismicConsole — the centerpiece module: a live USGS updates feed on the left
 * and the Leaflet epicenter map on the right (matching the reference console).
 *
 * The feed is the accessible source of truth (a keyboard-navigable list of
 * events); the map mirrors it. Selecting a row focuses its epicenter on the map.
 * Data is live from USGS; failure degrades to a notice while the rest of the
 * command center keeps working.
 */

import { lazy, Suspense, useEffect, useState } from "react";
import { DAMAGE_MAP_URL } from "../config";
import { useI18n } from "../i18n/I18nProvider";
import { fetchRegionalQuakes, magnitudeBand, relativeTime, type Quake } from "../lib/usgs";
import { ExternalIcon } from "./icons";

// Leaflet (+ its CSS) is only loaded when the console mounts — keeps it off the
// critical path and out of drill-down routes that don't need it.
const SeismicMap = lazy(() =>
  import("./SeismicMap").then((m) => ({ default: m.SeismicMap })),
);

type FeedState =
  | { status: "loading" }
  | { status: "ready"; quakes: Quake[] }
  | { status: "error" };

export function SeismicConsole() {
  const { t } = useI18n();
  const [state, setState] = useState<FeedState>({ status: "loading" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchRegionalQuakes({ days: 30, limit: 60 })
      .then((quakes) => {
        if (!cancelled) setState({ status: "ready", quakes });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const quakes = state.status === "ready" ? state.quakes : [];

  return (
    <div className="console">
      {/* Live updates feed */}
      <div className="console__feed">
        <header className="console__feed-head">
          <span className="console__feed-title">
            <span className="live-dot" aria-hidden="true" />
            {t("seismic.title")}
          </span>
          <span className="console__feed-src">{t("seismic.source")}</span>
        </header>

        <div className="console__feed-body" role="list" aria-label={t("seismic.title")}>
          {state.status === "loading" && (
            <div className="console__msg">
              <span className="spinner" aria-hidden="true" /> {t("loading.label")}
            </div>
          )}
          {state.status === "error" && (
            <div className="console__msg console__msg--err" role="alert">
              {t("seismic.unavailable")}
            </div>
          )}
          {state.status === "ready" && quakes.length === 0 && (
            <div className="console__msg">{t("seismic.empty")}</div>
          )}
          {state.status === "ready" &&
            quakes.map((q) => (
              <QuakeRow
                key={q.id}
                q={q}
                selected={q.id === selectedId}
                onSelect={() => setSelectedId(q.id)}
              />
            ))}
        </div>
      </div>

      {/* Epicenter map */}
      <div className="console__map">
        <Suspense
          fallback={
            <div className="console__map-fallback">
              <span className="spinner" aria-hidden="true" />
            </div>
          }
        >
          {state.status === "ready" && quakes.length > 0 ? (
            <SeismicMap quakes={quakes} selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <div className="console__map-fallback" aria-hidden="true">
              <span className="console__map-grid" />
            </div>
          )}
        </Suspense>
        <span className="console__map-tag">{t("seismic.mapHint")}</span>
        <a
          className="console__map-link"
          href={DAMAGE_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("nav.damageMap")} <ExternalIcon size={12} />
        </a>
      </div>
    </div>
  );
}

function QuakeRow({ q, selected, onSelect }: { q: Quake; selected: boolean; onSelect: () => void }) {
  const band = magnitudeBand(q.magnitude);
  return (
    <button
      type="button"
      role="listitem"
      className={`quake-row quake-row--${band} ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className={`quake-row__dot quake-dot--${band}`} aria-hidden="true" />
      <span className="quake-row__body">
        <span className="quake-row__place">{q.place}</span>
        <span className="quake-row__meta">
          {relativeTime(q.time)} · {q.depthKm.toFixed(0)} km deep
        </span>
      </span>
      <span className={`quake-row__mag quake-mag--${band}`}>
        <span className="quake-row__mag-k">M</span> {q.magnitude.toFixed(1)}
      </span>
    </button>
  );
}
