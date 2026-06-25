/**
 * SeismicMap — a Leaflet dark-matter map of regional epicenters.
 *
 * Renders one circle marker per quake, sized + colored by magnitude band, with a
 * pulsing ring on the strongest recent event. Clicking a marker (or selecting a
 * feed row, via `selectedId`) opens a popup; the map is decorative-but-informative
 * and fully keyboard-skippable (the feed list is the accessible source of truth).
 */

import { useEffect, useRef } from "react";
import L from "leaflet";
import { USGS_REGION } from "../config";
import { magnitudeBand, type Quake } from "../lib/usgs";

const BAND_COLOR: Record<string, string> = {
  minor: "#5b6b54",
  light: "#caa53d",
  moderate: "#e0902a",
  strong: "#d9622a",
  major: "#e23b3b",
};

function radiusFor(mag: number): number {
  // Perceptual scale: minor quakes stay small, majors dominate.
  return Math.max(4, (mag - 2) * 4.2);
}

export function SeismicMap({
  quakes,
  selectedId,
  onSelect,
}: {
  quakes: Quake[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

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

  // Sync markers whenever the quake set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

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
  }, [quakes, onSelect]);

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

  return <div ref={elRef} className="seismic-map" role="img" aria-label="Map of regional earthquake epicenters" />;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
