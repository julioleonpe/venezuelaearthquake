/**
 * ReliefMap — a Leaflet light map of community relief points, filtered by type:
 *
 *  - "acopio":  donation collection centers (amber square markers).
 *  - "refugio": shelters (teal round markers).
 *  - "all":     both types together, each keeping its own glyph + color.
 *
 * Unverified points ("sin verificar" acopios) render hollow/dashed so their
 * unvetted status is visible on the map itself, never presented as confirmed.
 * The feed list beside the map is the accessible source of truth and mirrors the
 * same selection (`selectedId`). The map is keyboard-skippable.
 */

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MAP_VIEW } from "../config";
import { useI18n } from "../i18n/I18nProvider";
import type { ReliefPoint, ReliefPointType } from "../lib/acopios";
import { translateNeedsToEnglish, type NeedCategory } from "../lib/reliefNeeds";

/** Type filter driving which points render. "all" shows both types. */
export type ReliefFilter = "all" | ReliefPointType;

// Distinct color per type: acopio = instrument amber (the action accent), refugio
// = a cool teal, so a collection center is never misread as a shelter.
const TYPE_COLOR: Record<ReliefPointType, string> = {
  acopio: "#c4720f",
  refugio: "#1f8a76",
};

export function ReliefMap({
  filter,
  points,
  selectedId,
  onSelect,
  activeNeeds,
}: {
  filter: ReliefFilter;
  points: ReliefPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Selected need categories; empty = no highlight (all markers bright). */
  activeNeeds: ReadonlySet<NeedCategory>;
}) {
  const { lang, t } = useI18n();
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Init once.
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, {
      center: MAP_VIEW.center,
      zoom: MAP_VIEW.zoom,
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false, // avoid hijacking page scroll
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      },
    ).addTo(map);
    mapRef.current = map;

    // Enable wheel zoom only while the map is focused.
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Sync markers whenever the filter, data, need-highlight, or language changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const receivingLabel = t("relief.needs.receiving");
    const capacityLabel = t("relief.capacity");
    const shown = filter === "all" ? points : points.filter((p) => p.type === filter);
    shown.forEach((p) => {
      // Dim a marker when need-chips are active and this point matches none of them.
      const dim = activeNeeds.size > 0 && !p.needsCategories.some((c) => activeNeeds.has(c));
      const marker = L.marker([p.latitude, p.longitude], {
        icon: reliefIcon(p, dim),
        keyboard: false,
        opacity: dim ? 0.4 : 1,
        zIndexOffset: dim ? 0 : 400,
      });
      const where = [p.state, p.address].filter(Boolean).join(" · ");
      // Acopio needs render in English under the EN toggle (curated dictionary);
      // capacity stays as authored. Labels come from the catalog, not hardcoded ES.
      const needsText = p.needs && lang === "en" ? translateNeedsToEnglish(p.needs) : p.needs;
      const detail =
        p.type === "acopio"
          ? needsText &&
            `<br><span class="relief-popup__row"><b>${escapeHtml(receivingLabel)}:</b> ${escapeHtml(needsText)}</span>`
          : p.capacity &&
            `<br><span class="relief-popup__row"><b>${escapeHtml(capacityLabel)}:</b> ${escapeHtml(p.capacity)}</span>`;
      marker.bindPopup(
        `<strong>${TYPE_GLYPH[p.type]} ${escapeHtml(p.name)}</strong>` +
          (p.verified
            ? ""
            : `<span class="relief-popup__badge">${escapeHtml(t("relief.unverified"))}</span>`) +
          (where ? `<br>${escapeHtml(where)}` : "") +
          (detail || "") +
          (p.contact ? `<br><span class="relief-popup__src">${escapeHtml(p.contact)}</span>` : ""),
        { className: "quake-popup relief-popup" },
      );
      marker.on("click", () => onSelect(p.id));
      marker.addTo(map);
      markersRef.current.set(p.id, marker);
    });
  }, [filter, points, onSelect, activeNeeds, lang, t]);

  // Open the popup + pan when the feed selection changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker) {
      map.panTo(marker.getLatLng(), { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  const label =
    filter === "acopio"
      ? "Map of community collection centers"
      : filter === "refugio"
        ? "Map of community shelters"
        : "Map of community collection centers and shelters";
  return <div ref={elRef} className="seismic-map" role="img" aria-label={label} />;
}

const TYPE_GLYPH: Record<ReliefPointType, string> = {
  acopio: "📦",
  refugio: "🏠",
};

/**
 * A small colored divIcon per point: a square for acopios, a circle for refugios,
 * hollow/dashed when unverified so the "sin verificar" state reads on the map.
 */
function reliefIcon(p: ReliefPoint, dim = false): L.DivIcon {
  const color = TYPE_COLOR[p.type];
  const cls = `relief-marker relief-marker--${p.type}${p.verified ? "" : " relief-marker--unverified"}${dim ? " relief-marker--dim" : ""}`;
  const style = p.verified
    ? `background:${color};border-color:rgba(255,255,255,0.9)`
    : `background:transparent;border-color:${color}`;
  return L.divIcon({
    className: "",
    html: `<span class="${cls}" style="${style}"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7],
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
