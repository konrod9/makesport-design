"use client";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.divIcon({
  className: "bg-transparent",
  html: `<div class="marker-pin marker-pin--active"><span>📍</span></div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 36],
});

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({
  value,
  onChange,
}: {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200">
      <div className="relative h-[300px]">
        <MapContainer
          center={[55.7558, 37.6173]}
          zoom={12}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={(lat, lng) => onChange({ lat, lng })} />
          {value && <Marker position={[value.lat, value.lng]} icon={icon} />}
        </MapContainer>
        <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-semibold text-cream backdrop-blur">
          Кликните на карту, чтобы поставить метку
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-ink-200 bg-white px-4 py-3 text-[11px] font-medium text-ink-400">
        <span className="font-semibold text-ink">Координаты:</span>
        {value ? (
          <span>
            {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        ) : (
          <span>метка не выбрана</span>
        )}
      </div>
    </div>
  );
}
