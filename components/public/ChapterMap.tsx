"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { publicStatusLabel, type PublicChapter } from "@/lib/content/chapters";
import "leaflet/dist/leaflet.css";

export type MapPin = {
  chapter: PublicChapter;
  lat: number;
  lng: number;
};

const US_CENTER: [number, number] = [39.8, -98.6];

export function ChapterMap({
  pins,
  selectedId,
  focusNonce,
  onSelect,
}: {
  pins: MapPin[];
  selectedId: string | null;
  focusNonce: number;
  onSelect: (id: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;

    void import("leaflet").then((mod) => {
      if (cancelled || !rootRef.current || mapRef.current) return;
      const L = leafletApi(mod);
      const map = L.map(rootRef.current, {
        scrollWheelZoom: true,
        zoomControl: true,
        minZoom: 3,
        maxZoom: 18,
        worldCopyJump: true,
      }).setView(US_CENTER, 4);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 50);
      setReady(true);
    });

    return () => {
      cancelled = true;
      setReady(false);
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let cancelled = false;

    void import("leaflet").then((mod) => {
      if (cancelled || mapRef.current !== map) return;
      const L = leafletApi(mod);
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = pins.map((pin) => {
        const active = pin.chapter.id === selectedId;
        const marker = L.marker([pin.lat, pin.lng], {
          icon: L.divIcon({
            className: active ? "ml-pin ml-pin--active" : "ml-pin",
            html: '<span class="ml-pin__dot"></span>',
            iconSize: active ? [22, 22] : [16, 16],
            iconAnchor: active ? [11, 11] : [8, 8],
          }),
          title: pin.chapter.school,
        })
          .bindPopup(
            `<strong>${escapeHtml(pin.chapter.school)}</strong><br/>${escapeHtml(
              [pin.chapter.city, pin.chapter.state].filter(Boolean).join(", "),
            )}<br/>${escapeHtml(publicStatusLabel(pin.chapter.status))}`,
          )
          .on("click", () => onSelectRef.current(pin.chapter.id))
          .addTo(map);
        if (active) marker.openPopup();
        return marker;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [pins, selectedId, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const pin = pins.find((item) => item.chapter.id === selectedId);
    if (!ready || !map || !pin || focusNonce === 0) return;
    map.flyTo([pin.lat, pin.lng], Math.max(map.getZoom(), 12), { duration: 0.75 });
  }, [focusNonce, selectedId, pins, ready]);

  return (
    <div className="chapter-map">
      <div ref={rootRef} className="chapter-map__canvas" />
    </div>
  );
}

function leafletApi(mod: typeof import("leaflet") | { default: typeof import("leaflet") }) {
  return "default" in mod && mod.default ? mod.default : (mod as typeof import("leaflet"));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
