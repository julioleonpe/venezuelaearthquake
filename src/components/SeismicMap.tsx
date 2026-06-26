/**
 * SeismicMap — a Leaflet dark-matter map with two switchable layers:
 *
 *  - "seismic": USGS epicenters as circle markers, sized + colored by magnitude.
 *  - "damage":  community-reported damaged buildings as square markers, colored by
 *               damage level (a deliberately DIFFERENT glyph + scale so a building's
 *               damage is never misread as an earthquake magnitude).
 *
 * One layer renders at a time (driven by `layer`) to keep the dense damage set
 * readable; the feed list beside it is the accessible source of truth and mirrors
 * the same selection (`selectedId`). The map is keyboard-skippable.
 */

import { useEffect, useRef } from "react";
import L from "leaflet";
import { USGS_REGION } from "../config";
import { magnitudeBand, type Quake } from "../lib/usgs";
import type { DamageLevel, DamageReport } from "../lib/damage";

const BAND_COLOR: Record<string, string> = {
  minor: "#5b6b54",
  light: "#caa53d",
  moderate: "#e0902a",
  strong: "#d9622a",
  major: "#e23b3b",
};

// Damage uses a cooler, distinct ramp (blue→violet→magenta) so it never reads as
// the amber→red seismic magnitude scale.
const DAMAGE_COLOR: Record<DamageLevel, string> = {
  parcial: "#3f87c4",
  severo: "#8a5cd1",
  total: "#d6347f",
};

function radiusFor(mag: number): number {
  // Perceptual scale: minor quakes stay small, majors dominate.
  return Math.max(4, (mag - 2) * 4.2);
}

export type MapLayer = "seismic" | "damage";

export function SeismicMap({
  layer,
  quakes,
  reports,
  selectedId,
  onSelect,
}: {
  layer: MapLayer;
  quakes: Quake[];
  reports: DamageReport[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker | L.Marker>>(new Map());

  // Init once.
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, {
      center: USGS_REGION.center,
      zoom: USGS_REGION.zoom,
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

    // Make focus/scroll interplay nicer: enable wheel zoom only while focused.
    map.on("focus", () => map.scrollWheelZoom.enable());
    map.on("blur", () => map.scrollWheelZoom.disable());

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Sync markers whenever the active layer or its data changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    if (layer === "seismic") {
      const strongest = quakes.reduce<Quake | null>(
        (acc, q) => (!acc || q.magnitude > acc.magnitude ? q : acc),
        null,
      );
      quakes.forEach((q) => {
        const band = magnitudeBand(q.magnitude);
        const color = BAND_COLOR[band];
        const marker = L.circleMarker([q.latitude, q.longitude], {
          radius: radiusFor(q.magnitude),
          color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.35,
          className: q.id === strongest?.id ? "quake-marker quake-marker--pulse" : "quake-marker",
        });
        marker.bindPopup(
          `<strong>M ${q.magnitude.toFixed(1)}</strong><br>${escapeHtml(q.place)}<br>${q.depthKm.toFixed(0)} km deep`,
          { className: "quake-popup" },
        );
        marker.on("click", () => onSelect(q.id));
        marker.addTo(map);
        markersRef.current.set(q.id, marker);
      });
    } else {
      reports.forEach((r) => {
        const color = DAMAGE_COLOR[r.level];
        const marker = L.marker([r.latitude, r.longitude], {
          icon: damageIcon(r.level, color),
          keyboard: false,
        });
        const where = [r.zone, r.city].filter(Boolean).join(", ");
        marker.bindPopup(
          `<strong>${escapeHtml(r.name)}</strong><br>` +
            `<span class="dmg-popup__lvl dmg-popup__lvl--${r.level}">${LEVEL_LABEL[r.level]}</span>` +
            (where ? `<br>${escapeHtml(where)}` : "") +
            (r.source ? `<br><span class="dmg-popup__src">${escapeHtml(r.source)}</span>` : ""),
          { className: "quake-popup dmg-popup" },
        );
        marker.on("click", () => onSelect(r.id));
        marker.addTo(map);
        markersRef.current.set(r.id, marker);
      });
    }
  }, [layer, quakes, reports, onSelect]);

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
    layer === "seismic"
      ? "Map of regional earthquake epicenters"
      : "Map of community-reported damaged buildings";
  return <div ref={elRef} className="seismic-map" role="img" aria-label={label} />;
}

const LEVEL_LABEL: Record<DamageLevel, string> = {
  parcial: "Daño parcial",
  severo: "Daño severo",
  total: "Daño total",
};

/** A small colored square divIcon — visually distinct from the seismic circles. */
function damageIcon(level: DamageLevel, color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span class="dmg-marker dmg-marker--${level}" style="background:${color}"></span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
