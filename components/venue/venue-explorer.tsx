"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, ListFilter, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { cities, sports, surfaces, venues, type Sport, type Surface } from "@/lib/data";
import { VenueCard } from "@/components/venue/venue-card";
import { cn } from "@/lib/utils";

type Sort = "rating" | "distance";

const quickSports: (Sport | "Все")[] = ["Все", "Футбол", "Баскетбол", "Теннис", "Воркаут", "Волейбол"];

export function VenueExplorer() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Все города");
  const [sport, setSport] = useState<Sport | "Все">("Все");
  const [surface, setSurface] = useState<Surface | "Любое">("Любое");
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyLighting, setOnlyLighting] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("rating");
  const [showFilters, setShowFilters] = useState(false);

  const activeCount =
    (city !== "Все города" ? 1 : 0) +
    (sport !== "Все" ? 1 : 0) +
    (surface !== "Любое" ? 1 : 0) +
    (onlyFree ? 1 : 0) +
    (onlyLighting ? 1 : 0) +
    (onlyOpen ? 1 : 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return venues
      .filter((v) => {
        if (q && !`${v.name} ${v.address} ${v.city}`.toLowerCase().includes(q))
          return false;
        if (city !== "Все города" && v.city !== city) return false;
        if (sport !== "Все" && !v.sports.includes(sport)) return false;
        if (surface !== "Любое" && v.surface !== surface) return false;
        if (onlyFree && !v.isFree) return false;
        if (onlyLighting && !v.hasLighting) return false;
        if (onlyOpen && !v.isOpen) return false;
        return true;
      })
      .sort((a, b) =>
        sort === "rating"
          ? b.rating - a.rating
          : parseFloat(a.distance.replace(",", ".")) -
            parseFloat(b.distance.replace(",", ".")),
      );
  }, [query, city, sport, surface, onlyFree, onlyLighting, onlyOpen, sort]);

  const reset = () => {
    setQuery("");
    setCity("Все города");
    setSport("Все");
    setSurface("Любое");
    setOnlyFree(false);
    setOnlyLighting(false);
    setOnlyOpen(false);
  };

  return (
    <section id="venues" className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-600">
            <span className="size-1.5 rounded-full bg-lime-500" />
            Каталог
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Площадки, которые уже на карте
          </h2>
          <p className="mt-3 max-w-xl text-ink-500">
            Отфильтруйте по городу, виду спорта и покрытию — или найдите ближайшую
            к вам на карте.
          </p>
        </div>
        <Link
          href="/map"
          className="group inline-flex items-center gap-2 self-start rounded-full border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink transition-all hover:border-ink hover:shadow-card md:self-auto"
        >
          <MapPin className="size-4" />
          Открыть карту
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 rounded-4xl border border-ink-200/70 bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Название, адрес или город..."
              className="h-12 w-full rounded-2xl border border-ink-200 bg-cream/60 pl-11 pr-4 text-sm font-medium text-ink outline-none transition-all placeholder:text-ink-400 focus:border-ink focus:bg-white focus:ring-4 focus:ring-lime/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 appearance-none rounded-2xl border border-ink-200 bg-cream/60 pl-4 pr-9 text-sm font-semibold text-ink outline-none transition-colors hover:border-ink-300 focus:border-ink focus:ring-4 focus:ring-lime/30"
              >
                <option>Все города</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <Chevron />
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition-colors",
                showFilters || activeCount > 0
                  ? "border-ink bg-ink text-cream"
                  : "border-ink-200 bg-cream/60 text-ink hover:border-ink-300",
              )}
            >
              <SlidersHorizontal className="size-4" />
              Фильтры
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-lime text-[11px] font-bold text-ink">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-12 appearance-none rounded-2xl border border-ink-200 bg-cream/60 pl-4 pr-9 text-sm font-semibold text-ink outline-none transition-colors hover:border-ink-300 focus:border-ink focus:ring-4 focus:ring-lime/30"
              >
                <option value="rating">По рейтингу</option>
                <option value="distance">Ближе сначала</option>
              </select>
              <Chevron />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
          {quickSports.map((s) => (
            <button
              key={s}
              onClick={() => setSport(s as Sport | "Все")}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
                sport === s
                  ? "bg-lime text-ink shadow-lime"
                  : "bg-ink-50 text-ink-500 hover:bg-ink-100 hover:text-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="mt-4 grid animate-fade-up gap-6 rounded-3xl bg-cream/70 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Вид спорта"
              value={sport}
              onChange={(v) => setSport(v as Sport | "Все")}
              options={["Все", ...sports]}
            />
            <FilterSelect
              label="Покрытие"
              value={surface}
              onChange={(v) => setSurface(v as Surface | "Любое")}
              options={["Любое", ...surfaces]}
            />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Удобства
              </p>
              <Check label="Только бесплатные" checked={onlyFree} onChange={setOnlyFree} />
              <Check label="Есть освещение" checked={onlyLighting} onChange={setOnlyLighting} />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Доступность
              </p>
              <Check label="Сейчас открыто" checked={onlyOpen} onChange={setOnlyOpen} />
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 transition-colors hover:text-ink"
              >
                <X className="size-3.5" /> Сбросить всё
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-5 mt-8 flex items-center justify-between">
        <p className="text-sm text-ink-400">
          Найдено{" "}
          <span className="font-display font-semibold text-ink">{filtered.length}</span>{" "}
          {plural(filtered.length)}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400">
          <LayoutGrid className="size-3.5" /> Сетка
        </span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-ink-200 bg-white/50 px-6 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-ink-100 text-2xl">
            🔍
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold">Ничего не нашлось</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-400">
            Попробуйте изменить фильтры или добавьте свою площадку — вдруг её ещё
            нет на карте.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={reset}
              className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold hover:border-ink"
            >
              Сбросить фильтры
            </button>
            <Link
              href="/add"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-700"
            >
              Добавить площадку
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
      fill="none"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-ink-200 bg-white px-3 pr-9 text-sm font-semibold outline-none focus:border-ink focus:ring-4 focus:ring-lime/30"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Chevron />
      </div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-600">
      <span
        className={cn(
          "grid size-5 place-items-center rounded-md border transition-all",
          checked ? "border-ink bg-ink text-lime" : "border-ink-300 bg-white",
        )}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none">
            <path d="m5 12 5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function plural(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "площадка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "площадки";
  return "площадок";
}
