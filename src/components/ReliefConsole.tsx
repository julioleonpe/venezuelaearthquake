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
import type { MessageId } from "../i18n/catalog";
import { useMediaQuery } from "../lib/useMediaQuery";
import { fetchReliefPoints, tallyRelief, type ReliefPoint, type ReliefTally } from "../lib/acopios";
import { NEED_CATEGORIES, type NeedCategory } from "../lib/reliefNeeds";
import { ExternalIcon } from "./icons";
import type { ReliefFilter } from "./ReliefMap";

/** Mobile splits the console into a Map/List toggle so each gets full height. */
type MobileView = "map" | "list";

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
  const { t } = useI18n();
  const mobile = useMediaQuery("(max-width: 720px)");
  const [filter, setFilter] = useState<ReliefFilter>("all");
  const [needs, setNeeds] = useState<ReadonlySet<NeedCategory>>(() => new Set());
  const [mobileView, setMobileView] = useState<MobileView>("map");
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

  // Need chips only make sense where acopios are on screen (they carry needs).
  const showNeedChips = filter !== "refugio" && (tally?.acopio ?? 0) > 0;
  const toggleNeed = (cat: NeedCategory) =>
    setNeeds((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  // A point is highlighted when no chips are active (everything bright) or when it
  // collects at least one selected need (OR semantics — "show me food OR water").
  const highlights = (p: ReliefPoint): boolean =>
    needs.size === 0 || p.needsCategories.some((c) => needs.has(c));

  // Tapping a list row on mobile jumps to the map so its popup is visible.
  const selectFromList = (id: string) => {
    setSelectedId(id);
    if (mobile) setMobileView("map");
  };

  // Shared controls — the type filter + need chips are identical in both layouts.
  const controls = (
    <>
      <div className="console__layers" role="tablist" aria-label={t("relief.filter.aria")}>
        {FILTERS.map((f) => (
          <FilterTab key={f} active={filter === f} onClick={() => setFilter(f)}>
            {t(FILTER_KEY[f])}
            {tally && <span className="console__layers-count">{countFor(f, tally)}</span>}
          </FilterTab>
        ))}
      </div>
      {showNeedChips && tally && (
        <NeedChips tally={tally} active={needs} onToggle={toggleNeed} onClear={() => setNeeds(new Set())} />
      )}
    </>
  );

  const feedBody = (
    <div className="console__feed-body" role="list" aria-label={t("relief.title")}>
      <ReliefFeed
        state={state}
        shown={shown}
        selectedId={selectedId}
        onSelect={selectFromList}
        highlights={highlights}
        dimmed={needs.size > 0}
        emptyMsg={t("relief.empty")}
        errorMsg={t("relief.unavailable")}
        loadingMsg={t("loading.label")}
      />
    </div>
  );

  const mapBody = (
    <>
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
            activeNeeds={needs}
          />
        ) : (
          <div className="console__map-fallback" aria-hidden="true">
            <span className="console__map-grid" />
          </div>
        )}
      </Suspense>
      <span className="console__map-tag">{t("relief.mapHint")}</span>
      <ReliefLegend tally={tally} />
    </>
  );

  // ── Mobile: Map | List segmented toggle; one panel at a time, full height. ──
  if (mobile) {
    return (
      <div className="console console--mobile">
        <div className="console__mobile-bar">
          <div className="console__viewseg" role="tablist" aria-label={t("relief.view.aria")}>
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === "map"}
              className={`console__viewseg-tab ${mobileView === "map" ? "is-active" : ""}`}
              onClick={() => setMobileView("map")}
            >
              {t("relief.view.map")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === "list"}
              className={`console__viewseg-tab ${mobileView === "list" ? "is-active" : ""}`}
              onClick={() => setMobileView("list")}
            >
              {t("relief.view.list")}
              {tally && <span className="console__layers-count">{tally.all}</span>}
            </button>
          </div>
        </div>
        {controls}
        {mobileView === "list" ? (
          <div className="console__feed console__feed--mobile">{feedBody}</div>
        ) : (
          <div className="console__map console__map--mobile">
            {mapBody}
            <a
              className="console__map-attrib"
              href={ACOPIOS_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("relief.attribution")} <ExternalIcon size={11} />
            </a>
          </div>
        )}
      </div>
    );
  }

  // ── Desktop: feed + map side by side (unchanged). ──
  return (
    <div className="console">
      {/* Live points feed */}
      <div className="console__feed">
        <header className="console__feed-head">
          <span className="console__feed-title">
            <span className="live-dot" aria-hidden="true" />
            {t("relief.title")}
          </span>
          <a
            className="console__feed-src console__feed-src--link"
            href={ACOPIOS_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("relief.source")} <ExternalIcon size={10} />
          </a>
        </header>

        {controls}
        {feedBody}
      </div>

      {/* Map */}
      <div className="console__map">
        {mapBody}

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
  highlights,
  dimmed,
  emptyMsg,
  errorMsg,
  loadingMsg,
}: {
  state: Loadable<ReliefPoint[]>;
  shown: ReliefPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  highlights: (p: ReliefPoint) => boolean;
  dimmed: boolean;
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
  // With chips active, matches sort to the top so the highlighted set reads first.
  const ordered = dimmed
    ? [...shown].sort((a, b) => Number(highlights(b)) - Number(highlights(a)))
    : shown;
  return (
    <>
      {ordered.map((p) => (
        <ReliefRow
          key={p.id}
          p={p}
          selected={p.id === selectedId}
          onSelect={() => onSelect(p.id)}
          dim={dimmed && !highlights(p)}
        />
      ))}
    </>
  );
}

function ReliefRow({
  p,
  selected,
  onSelect,
  dim,
}: {
  p: ReliefPoint;
  selected: boolean;
  onSelect: () => void;
  dim: boolean;
}) {
  const { t } = useI18n();
  // Row meta stays compact: state (and country for international points, which the
  // source already encodes in `estado`, e.g. "Madrid, España"). The full street
  // address lives in the map popup on click, not the list.
  const where = p.state;
  // Acopios: needs text is summarized by the category tags below and shown in full
  // in the map popup on click, so the row meta stays compact (location only).
  // Refugios: keep capacity, which has no tag equivalent.
  const detail = p.type === "refugio" ? p.capacity : null;
  return (
    <button
      type="button"
      role="listitem"
      className={`quake-row relief-row relief-row--${p.type} ${selected ? "is-selected" : ""} ${dim ? "is-dimmed" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className={`quake-row__dot relief-dot--${p.type}`} aria-hidden="true" />
      <span className="quake-row__body">
        <span className="quake-row__place">{p.name}</span>
        <span className="quake-row__meta">{[where, detail].filter(Boolean).join(" · ") || "—"}</span>
        {p.needsCategories.length > 0 && (
          <span className="relief-row__cats" aria-hidden="true">
            {p.needsCategories.map((c) => (
              <span key={c} className={`relief-cat-tag relief-cat-tag--${c}`}>
                {t(CAT_LABEL[c])}
              </span>
            ))}
          </span>
        )}
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

/** Category key → catalog message id, so chips/tags are bilingual by construction. */
const CAT_LABEL: Record<NeedCategory, MessageId> = {
  food: "relief.cat.food",
  water: "relief.cat.water",
  medical: "relief.cat.medical",
  hygiene: "relief.cat.hygiene",
  clothing: "relief.cat.clothing",
  bedding: "relief.cat.bedding",
  power: "relief.cat.power",
  pets: "relief.cat.pets",
  tools: "relief.cat.tools",
};

/* ── Need-category chips ──────────────────────────────────────────────────── */

function NeedChips({
  tally,
  active,
  onToggle,
  onClear,
}: {
  tally: ReliefTally;
  active: ReadonlySet<NeedCategory>;
  onToggle: (cat: NeedCategory) => void;
  onClear: () => void;
}) {
  const { t } = useI18n();
  // Only offer categories that actually occur in the current data.
  const present = NEED_CATEGORIES.filter((c) => tally.categories[c] > 0);
  if (present.length === 0) return null;
  return (
    <div className="relief-needs" role="group" aria-label={t("relief.needs.aria")}>
      <span className="relief-needs__label">{t("relief.needs.label")}</span>
      <div className="relief-needs__chips">
        {present.map((c) => (
          <button
            key={c}
            type="button"
            className={`relief-chip relief-chip--${c} ${active.has(c) ? "is-active" : ""}`}
            aria-pressed={active.has(c)}
            onClick={() => onToggle(c)}
          >
            {t(CAT_LABEL[c])}
            <span className="relief-chip__count">{tally.categories[c]}</span>
          </button>
        ))}
        {active.size > 0 && (
          <button type="button" className="relief-chip relief-chip--clear" onClick={onClear}>
            {t("relief.needs.clear")}
          </button>
        )}
      </div>
    </div>
  );
}

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
