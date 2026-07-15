/**
 * ReliefConsole — the map centerpiece. A single live map of community relief
 * points with a list-of-truth on the left and a type filter above it:
 *
 *  - "all":     collection centers + shelters together.
 *  - "acopio":  donation collection centers (amber squares).
 *  - "refugio": shelters (teal circles).
 *
 * The data is COMMUNITY-REPORTED and pulled live from acopios-refugios.vercel.app
 * (see lib/acopios.ts). It is clearly attributed, kept out of the Hub's
 * verification gate, and each point preserves its source moderation state
 * (unverified acopios are flagged "sin verificar"). The console also refers people
 * to the source site to report new points. A single fetch degrades the whole
 * module gracefully (the rest of the command center keeps rendering).
 */

import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ACOPIOS_MAP_URL } from "../config";
import { useI18n } from "../i18n/I18nProvider";
import {
  fetchReliefPoints,
  tallyRelief,
  RELIEF_SNAPSHOT_AT,
  type ReliefPoint,
  type ReliefTally,
} from "../lib/acopios";
import { formatDateTime } from "../lib/datetime";
import { ExternalIcon } from "./icons";
import type { ReliefFilter } from "./ReliefMap";

// Leaflet (+ its CSS) is only loaded when the console mounts — keeps it off the
// critical path and out of routes that don't need it.
const ReliefMap = lazy(() =>
  import("./ReliefMap").then((m) => ({ default: m.ReliefMap })),
);

type Loadable<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error" };

const FILTERS: ReliefFilter[] = ["all", "acopio", "refugio"];

export function ReliefConsole() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<ReliefFilter>("all");
  const [state, setState] = useState<Loadable<ReliefPoint[]>>({ status: "loading" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchReliefPoints()
      .then((data) => !cancelled && setState({ status: "ready", data }))
      .catch(() => !cancelled && setState({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  const points = state.status === "ready" ? state.data : [];
  const tally = state.status === "ready" ? tallyRelief(points) : null;
  const shown = useMemo(
    () => (filter === "all" ? points : points.filter((p) => p.type === filter)),
    [filter, points],
  );

  return (
    <div className="console">
      {/* Live points feed */}
      <div className="console__feed">
        <header className="console__feed-head">
          <span className="console__feed-title">{t("relief.title")}</span>
          <a
            className="console__feed-src console__feed-src--link"
            href={ACOPIOS_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("relief.source")} <ExternalIcon size={10} />
          </a>
        </header>

        {/* Snapshot freshness — this is a daily bundled snapshot, not a live feed,
            so we state when it was pulled rather than implying real-time data. */}
        <p className="console__feed-snapshot">
          {t("relief.snapshot")} {formatDateTime(RELIEF_SNAPSHOT_AT, lang)}
        </p>

        {/* Type filter (segmented control) */}
        <div className="console__layers" role="tablist" aria-label={t("relief.filter.aria")}>
          {FILTERS.map((f) => (
            <FilterTab key={f} active={filter === f} onClick={() => setFilter(f)}>
              {t(FILTER_KEY[f])}
              {tally && <span className="console__layers-count">{countFor(f, tally)}</span>}
            </FilterTab>
          ))}
        </div>

        <div className="console__feed-body" role="list" aria-label={t("relief.title")}>
          <ReliefFeed
            state={state}
            shown={shown}
            selectedId={selectedId}
            onSelect={setSelectedId}
            emptyMsg={t("relief.empty")}
            errorMsg={t("relief.unavailable")}
            loadingMsg={t("loading.label")}
          />
        </div>
      </div>

      {/* Map */}
      <div className="console__map">
        <Suspense
          fallback={
            <div className="console__map-fallback">
              <span className="spinner" aria-hidden="true" />
            </div>
          }
        >
          {points.length > 0 ? (
            <ReliefMap
              filter={filter}
              points={points}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ) : (
            <div className="console__map-fallback" aria-hidden="true">
              <span className="console__map-grid" />
            </div>
          )}
        </Suspense>

        <span className="console__map-tag">{t("relief.mapHint")}</span>

        <ReliefLegend tally={tally} />

        {/* Provenance + refer-out — always present so the community-reported,
            third-party nature is unambiguous and people can add points there. */}
        <a
          className="console__map-attrib"
          href={ACOPIOS_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("relief.attribution")} <ExternalIcon size={11} />
        </a>
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`console__layer-tab ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const FILTER_KEY: Record<ReliefFilter, "relief.filter.all" | "relief.filter.acopio" | "relief.filter.refugio"> = {
  all: "relief.filter.all",
  acopio: "relief.filter.acopio",
  refugio: "relief.filter.refugio",
};

function countFor(f: ReliefFilter, tally: ReliefTally): number {
  if (f === "acopio") return tally.acopio;
  if (f === "refugio") return tally.refugio;
  return tally.all;
}

/* ── Feed ─────────────────────────────────────────────────────────────────── */

function ReliefFeed({
  state,
  shown,
  selectedId,
  onSelect,
  emptyMsg,
  errorMsg,
  loadingMsg,
}: {
  state: Loadable<ReliefPoint[]>;
  shown: ReliefPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyMsg: string;
  errorMsg: string;
  loadingMsg: string;
}) {
  if (state.status === "loading") {
    return (
      <div className="console__msg">
        <span className="spinner" aria-hidden="true" /> {loadingMsg}
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="console__msg console__msg--err" role="alert">
        {errorMsg}
      </div>
    );
  }
  if (shown.length === 0) return <div className="console__msg">{emptyMsg}</div>;
  return (
    <>
      {shown.map((p) => (
        <ReliefRow key={p.id} p={p} selected={p.id === selectedId} onSelect={() => onSelect(p.id)} />
      ))}
    </>
  );
}

function ReliefRow({ p, selected, onSelect }: { p: ReliefPoint; selected: boolean; onSelect: () => void }) {
  const { t } = useI18n();
  const where = [p.state, p.address].filter(Boolean).join(", ");
  const detail = p.type === "acopio" ? p.needs : p.capacity;
  return (
    <button
      type="button"
      role="listitem"
      className={`quake-row relief-row relief-row--${p.type} ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className={`quake-row__dot relief-dot--${p.type}`} aria-hidden="true" />
      <span className="quake-row__body">
        <span className="quake-row__place">{p.name}</span>
        <span className="quake-row__meta">{[where, detail].filter(Boolean).join(" · ") || "—"}</span>
      </span>
      <span className="relief-row__tags">
        <span className={`relief-row__badge relief-badge--${p.type}`}>{t(TYPE_LABEL[p.type])}</span>
        {!p.verified && (
          <span className="relief-row__unv">{t("relief.unverified")}</span>
        )}
      </span>
    </button>
  );
}

const TYPE_LABEL: Record<ReliefPoint["type"], "relief.type.acopio" | "relief.type.refugio"> = {
  acopio: "relief.type.acopio",
  refugio: "relief.type.refugio",
};

/* ── Legend ───────────────────────────────────────────────────────────────── */

function ReliefLegend({ tally }: { tally: ReliefTally | null }) {
  const { t } = useI18n();
  return (
    <div className="console__legend" aria-hidden="true">
      <span className="console__legend-item">
        <span className="console__legend-swatch relief-dot--acopio" />
        {t("relief.type.acopio")}
        {tally && <span className="console__legend-count">{tally.acopio}</span>}
      </span>
      <span className="console__legend-item">
        <span className="console__legend-swatch console__legend-swatch--round relief-dot--refugio" />
        {t("relief.type.refugio")}
        {tally && <span className="console__legend-count">{tally.refugio}</span>}
      </span>
    </div>
  );
}
