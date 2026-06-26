/**
 * SeismicConsole — the centerpiece module. A single map with two switchable
 * layers, each with its own list-of-truth on the left:
 *
 *  - "seismic": live USGS epicenters (amber→red magnitude scale).
 *  - "damage":  live COMMUNITY-REPORTED damaged buildings from terremotovenezuela.com
 *               (a distinct cool color ramp + square glyph), clearly labelled as
 *               unverified third-party data — never mixed into the Hub's verified
 *               records, never routed through the visibility gate.
 *
 * The two sources are fetched independently and degrade independently (Req 8.4/8.5):
 * if one is down the other still renders, and the feed names the unavailable layer.
 * A segmented control swaps both the feed and the active map layer; selecting a
 * row focuses its marker. The feed list remains the accessible source of truth.
 */

import { lazy, Suspense, useEffect, useState } from "react";
import { DAMAGE_MAP_URL } from "../config";
import { useI18n } from "../i18n/I18nProvider";
import { fetchRegionalQuakes, magnitudeBand, relativeTime, type Quake } from "../lib/usgs";
import { fetchDamageReports, tallyDamage, type DamageLevel, type DamageReport, type DamageTally } from "../lib/damage";
import { ExternalIcon } from "./icons";
import type { MapLayer } from "./SeismicMap";

// Leaflet (+ its CSS) is only loaded when the console mounts — keeps it off the
// critical path and out of drill-down routes that don't need it.
const SeismicMap = lazy(() =>
  import("./SeismicMap").then((m) => ({ default: m.SeismicMap })),
);

type Loadable<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error" };

export function SeismicConsole() {
  const { t } = useI18n();
  const [layer, setLayer] = useState<MapLayer>("seismic");
  const [seismic, setSeismic] = useState<Loadable<Quake[]>>({ status: "loading" });
  const [damage, setDamage] = useState<Loadable<DamageReport[]>>({ status: "loading" });
  // Selection is namespaced per layer so a quake id and a building id never collide.
  const [selected, setSelected] = useState<{ seismic: string | null; damage: string | null }>({
    seismic: null,
    damage: null,
  });

  // Two independent fetches — each degrades its own layer (Req 8.4/8.5).
  useEffect(() => {
    let cancelled = false;
    fetchRegionalQuakes({ days: 30, limit: 60 })
      .then((data) => !cancelled && setSeismic({ status: "ready", data }))
      .catch(() => !cancelled && setSeismic({ status: "error" }));
    fetchDamageReports({ limit: 600 })
      .then((data) => !cancelled && setDamage({ status: "ready", data }))
      .catch(() => !cancelled && setDamage({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  const quakes = seismic.status === "ready" ? seismic.data : [];
  const reports = damage.status === "ready" ? damage.data : [];
  const tally = damage.status === "ready" ? tallyDamage(reports) : null;
  const isDamage = layer === "damage";

  function select(id: string) {
    setSelected((s) => ({ ...s, [layer]: id }));
  }

  return (
    <div className="console">
      {/* Live updates feed */}
      <div className="console__feed">
        <header className="console__feed-head">
          <span className="console__feed-title">
            <span className="live-dot" aria-hidden="true" />
            {isDamage ? t("damage.title") : t("seismic.title")}
          </span>
          <span className="console__feed-src">
            {isDamage ? t("damage.source") : t("seismic.source")}
          </span>
        </header>

        {/* Layer toggle (segmented control) */}
        <div className="console__layers" role="tablist" aria-label={t("console.layer.aria")}>
          <LayerTab active={!isDamage} onClick={() => setLayer("seismic")}>
            {t("console.layer.seismic")}
          </LayerTab>
          <LayerTab active={isDamage} onClick={() => setLayer("damage")}>
            {t("console.layer.damage")}
            {tally && <span className="console__layers-count">{tally.all}</span>}
          </LayerTab>
        </div>

        <div
          className="console__feed-body"
          role="list"
          aria-label={isDamage ? t("damage.title") : t("seismic.title")}
        >
          {isDamage ? (
            <DamageFeed
              state={damage}
              selectedId={selected.damage}
              onSelect={select}
              emptyMsg={t("damage.empty")}
              errorMsg={t("damage.unavailable")}
              loadingMsg={t("loading.label")}
            />
          ) : (
            <SeismicFeed
              state={seismic}
              selectedId={selected.seismic}
              onSelect={select}
              emptyMsg={t("seismic.empty")}
              errorMsg={t("seismic.unavailable")}
              loadingMsg={t("loading.label")}
            />
          )}
        </div>
      </div>

      {/* Map (shared element, layer-driven) */}
      <div className="console__map">
        <Suspense
          fallback={
            <div className="console__map-fallback">
              <span className="spinner" aria-hidden="true" />
            </div>
          }
        >
          {(isDamage ? reports.length > 0 : quakes.length > 0) ? (
            <SeismicMap
              layer={layer}
              quakes={quakes}
              reports={reports}
              selectedId={isDamage ? selected.damage : selected.seismic}
              onSelect={select}
            />
          ) : (
            <div className="console__map-fallback" aria-hidden="true">
              <span className="console__map-grid" />
            </div>
          )}
        </Suspense>

        <span className="console__map-tag">
          {isDamage ? t("damage.mapHint") : t("seismic.mapHint")}
        </span>

        {isDamage ? (
          <DamageLegend tally={tally} />
        ) : (
          <a
            className="console__map-link"
            href={DAMAGE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("nav.damageMap")} <ExternalIcon size={12} />
          </a>
        )}

        {/* Provenance line — always present on the damage layer so the unverified,
            third-party nature is unambiguous. */}
        {isDamage && (
          <a
            className="console__map-attrib"
            href={DAMAGE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("damage.attribution")} <ExternalIcon size={11} />
          </a>
        )}
      </div>
    </div>
  );
}

function LayerTab({
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

/* ── Seismic feed ─────────────────────────────────────────────────────────── */

function SeismicFeed({
  state,
  selectedId,
  onSelect,
  emptyMsg,
  errorMsg,
  loadingMsg,
}: {
  state: Loadable<Quake[]>;
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
  if (state.data.length === 0) return <div className="console__msg">{emptyMsg}</div>;
  return (
    <>
      {state.data.map((q) => (
        <QuakeRow key={q.id} q={q} selected={q.id === selectedId} onSelect={() => onSelect(q.id)} />
      ))}
    </>
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

/* ── Damage feed ──────────────────────────────────────────────────────────── */

function DamageFeed({
  state,
  selectedId,
  onSelect,
  emptyMsg,
  errorMsg,
  loadingMsg,
}: {
  state: Loadable<DamageReport[]>;
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
  if (state.data.length === 0) return <div className="console__msg">{emptyMsg}</div>;
  return (
    <>
      {state.data.map((r) => (
        <DamageRow key={r.id} r={r} selected={r.id === selectedId} onSelect={() => onSelect(r.id)} />
      ))}
    </>
  );
}

const LEVEL_KEY: Record<DamageLevel, "damage.level.total" | "damage.level.severo" | "damage.level.parcial"> = {
  total: "damage.level.total",
  severo: "damage.level.severo",
  parcial: "damage.level.parcial",
};

function DamageRow({ r, selected, onSelect }: { r: DamageReport; selected: boolean; onSelect: () => void }) {
  const { t } = useI18n();
  const where = [r.zone, r.city].filter(Boolean).join(", ");
  return (
    <button
      type="button"
      role="listitem"
      className={`quake-row dmg-row dmg-row--${r.level} ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className={`quake-row__dot dmg-dot--${r.level}`} aria-hidden="true" />
      <span className="quake-row__body">
        <span className="quake-row__place">{r.name}</span>
        <span className="quake-row__meta">{where || r.source || "—"}</span>
      </span>
      <span className={`dmg-row__badge dmg-badge--${r.level}`}>{t(LEVEL_KEY[r.level])}</span>
    </button>
  );
}

/* ── Damage legend ────────────────────────────────────────────────────────── */

function DamageLegend({ tally }: { tally: DamageTally | null }) {
  const { t } = useI18n();
  return (
    <div className="console__legend" aria-hidden="true">
      <LegendItem level="total" label={t("damage.level.total")} count={tally?.total} />
      <LegendItem level="severo" label={t("damage.level.severo")} count={tally?.severo} />
      <LegendItem level="parcial" label={t("damage.level.parcial")} count={tally?.parcial} />
    </div>
  );
}

function LegendItem({ level, label, count }: { level: DamageLevel; label: string; count?: number }) {
  return (
    <span className="console__legend-item">
      <span className={`console__legend-swatch dmg-dot--${level}`} />
      {label}
      {count != null && <span className="console__legend-count">{count}</span>}
    </span>
  );
}
