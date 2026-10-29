"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowUpRight, Crosshair, Locate, MapPin, Minus, Plus, Search, Star, X } from "lucide-react";
import { cities, sports, venues, type Sport } from "@/lib/data";
import { cn } from "@/lib/utils";

function pinIcon(active: boolean, emoji: string) {
  return L.divIcon({
    className: "bg-transparent",
    html: `<div class="marker-pin ${active ? "marker-pin--active" : ""}"><span>${emoji}</span></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 36],
    popupAnchor: [0, -34],
  });
}

const sportEmoji: Record<string, string> = {
  Футбол: "⚽",
  Баскетбол: "🏀",
  Теннис: "🎾",
  Воркаут: "🏋️",
  Волейбол: "🏐",
  Бег: "🏃",
  Велоспорт: "🚴",
  Скейтборд: "🛹",
};

const cityWhere: Record<string, string> = {
  Москва: "в Москве",
  "Санкт-Петербург": "в Санкт-Петербурге",
  Казань: "в Казани",
  Екатеринбург: "в Екатеринбурге",
};

function plural(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "площадка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "площадки";
  return "площадок";
}

function FlyTo({ lat, lng, zoom = 14 }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 0.9 });
  }, [lat, lng, zoom, map]);
  return null;
}

function FitVenues({
  points,
  ids,
}: {
  points: { lat: number; lng: number }[];
  ids: string;
}) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, map]);
  return null;
}

function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [map]);
  return null;
}

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute right-4 top-4 z-[500] flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
      <button
        onClick={() => map.zoomIn()}
        aria-label="Приблизить"
        className="grid size-10 place-items-center text-ink transition-colors hover:bg-cream"
      >
        <Plus className="size-4" />
      </button>
      <span className="h-px bg-ink-200" />
      <button
        onClick={() => map.zoomOut()}
        aria-label="Отдалить"
        className="grid size-10 place-items-center text-ink transition-colors hover:bg-cream"
      >
        <Minus className="size-4" />
      </button>
    </div>
  );
}

function LocateButton({ onLocate }: { onLocate: () => void }) {
  return (
    <button
      onClick={onLocate}
      className="absolute bottom-6 right-4 z-[500] inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-card transition-colors hover:bg-cream"
    >
      <Crosshair className="size-3.5" /> Я здесь
    </button>
  );
}

export function MapView() {
  const [city, setCity] = useState("Москва");
  const [sport, setSport] = useState<Sport | "Все">("Все");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);
  const [listOpen, setListOpen] = useState(false);

  const center = useMemo(() => {
    const cityVenues = venues.filter((v) => v.city === city);
    if (!cityVenues.length) return { lat: 55.7558, lng: 37.6173 };
    return {
      lat: cityVenues.reduce((s, v) => s + v.lat, 0) / cityVenues.length,
      lng: cityVenues.reduce((s, v) => s + v.lng, 0) / cityVenues.length,
    };
  }, [city]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return venues.filter((v) => {
      if (v.city !== city) return false;
      if (sport !== "Все" && !v.sports.includes(sport)) return false;
      if (q && !`${v.name} ${v.address}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [city, sport, query]);

  const active = filtered.find((v) => v.id === activeId) ?? null;

  const locate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setFocus({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setFocus(center),
    );
  };

  return (
    <div className="relative flex h-[calc(100vh-4.5rem)] min-h-[620px] w-full overflow-hidden">
      <div
        className={cn(
          "relative z-10 flex w-full shrink-0 flex-col border-r border-ink-200 bg-cream transition-all duration-300 sm:w-[380px] lg:w-[420px]",
          !listOpen && "hidden sm:flex",
        )}
      >
        <div className="border-b border-ink-200/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-ink">Карта площадок</h1>
              <p className="mt-1 text-xs text-ink-400">
                {filtered.length} {plural(filtered.length)} {cityWhere[city] ?? city}
              </p>
            </div>
            <button
              onClick={() => setListOpen(false)}
              className="grid size-9 place-items-center rounded-full border border-ink-200 text-ink-400 transition-colors hover:text-ink sm:hidden"
              aria-label="Скрыть список"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или адресу"
              className="h-11 w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-4 text-sm outline-none transition-all placeholder:text-ink-400 focus:border-ink focus:ring-4 focus:ring-lime/30"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setActiveId(null);
              }}
              className="h-10 flex-1 rounded-xl border border-ink-200 bg-white px-3 text-xs font-semibold outline-none focus:border-ink"
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value as Sport | "Все")}
              className="h-10 flex-1 rounded-xl border border-ink-200 bg-white px-3 text-xs font-semibold outline-none focus:border-ink"
            >
              <option>Все</option>
              {sports.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {["Все", "Футбол", "Баскетбол", "Воркаут", "Теннис", "Бег"].map((s) => (
              <button
                key={s}
                onClick={() => setSport(s as Sport | "Все")}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  sport === s
                    ? "bg-ink text-cream"
                    : "bg-ink-100 text-ink-500 hover:bg-ink-200",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
          {filtered.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-ink">Ничего не найдено</p>
              <p className="mt-1 text-xs text-ink-400">
                Измените фильтры или добавьте площадку.
              </p>
            </div>
          )}
          {filtered.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setActiveId(v.id);
                setFocus({ lat: v.lat, lng: v.lng });
              }}
              className={cn(
                "flex w-full gap-3 rounded-2xl border p-3 text-left transition-all",
                activeId === v.id
                  ? "border-ink bg-white shadow-card"
                  : "border-transparent bg-white/60 hover:border-ink-200 hover:bg-white",
              )}
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.image} alt={v.name} className="size-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 text-[13px] font-semibold text-ink">{v.name}</p>
                  <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-ink">
                    <Star className="size-3 fill-lime-500 text-lime-500" />
                    {v.rating}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-[11px] text-ink-400">{v.address}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {v.sports.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-ink-50 px-2 py-0.5 text-[10px] font-semibold text-ink-500"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] font-semibold text-ink-400">
                    {v.distance}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-ink-200/70 p-4">
          <Link
            href="/add"
            className="flex items-center justify-center gap-2 rounded-2xl bg-lime py-3 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            <MapPin className="size-4" /> Добавить площадку
          </Link>
        </div>
      </div>

      <div className="relative flex-1">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={12}
          zoomControl={false}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {focus && <FlyTo lat={focus.lat} lng={focus.lng} />}
          <FitVenues points={filtered} ids={filtered.map((v) => v.id).join(",")} />
          <AutoResize />
          <ZoomControls />
          {filtered.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={pinIcon(activeId === v.id, sportEmoji[v.sports[0]] ?? "📍")}
              eventHandlers={{ click: () => setActiveId(v.id) }}
            >
              <Popup>
                <div className="w-52">
                  <p className="font-semibold text-ink">{v.name}</p>
                  <p className="mt-1 text-xs text-ink-400">{v.address}</p>
                  <p className="mt-2 text-xs font-semibold text-ink">
                    ★ {v.rating} · {v.isFree ? "бесплатно" : "платно"}
                  </p>
                  <a
                    href={`/venue/${v.id}`}
                    className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-cream"
                  >
                    Подробнее <ArrowUpRight className="size-3" />
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <LocateButton onLocate={locate} />

        {!listOpen && (
          <button
            onClick={() => setListOpen(true)}
            className="absolute left-4 top-4 z-[500] inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-card sm:hidden"
          >
            <Locate className="size-3.5" /> Список
          </button>
        )}

        {active && (
          <div className="absolute bottom-6 left-1/2 z-[500] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-fade-up rounded-3xl border border-ink-200 bg-white p-4 shadow-soft sm:left-6 sm:translate-x-0">
            <button
              onClick={() => setActiveId(null)}
              className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-ink-50 text-ink-400 hover:text-ink"
              aria-label="Закрыть"
            >
              <X className="size-3.5" />
            </button>
            <div className="flex gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active.image} alt={active.name} className="size-full object-cover" />
              </div>
              <div className="min-w-0 pr-6">
                <p className="text-sm font-semibold text-ink">{active.name}</p>
                <p className="mt-1 text-xs text-ink-400">
                  {active.address} · {active.distance}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={`/venue/${active.id}`}
                className="flex-1 rounded-xl bg-ink py-2.5 text-center text-xs font-semibold text-cream"
              >
                Подробнее
              </Link>
              <span className="rounded-xl bg-lime px-3 py-2.5 text-xs font-bold text-ink">
                ★ {active.rating}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
