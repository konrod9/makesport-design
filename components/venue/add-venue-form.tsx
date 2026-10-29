"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  Clock,
  ImagePlus,
  Info,
  MapPin,
  Sparkles,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import { cities, sports, surfaces, type Sport, type Surface } from "@/lib/data";
import { cn } from "@/lib/utils";

const LocationPicker = dynamic(
  () => import("@/components/map/location-picker").then((m) => m.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[300px] place-items-center rounded-3xl border border-ink-200 bg-cream">
        <span className="size-7 animate-spin rounded-full border-2 border-ink-200 border-t-ink" />
      </div>
    ),
  },
);

const steps = ["Основное", "Локация", "Характеристики", "Фото"];

export function AddVenueForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState(cities[0]);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [surface, setSurface] = useState<Surface | "">("");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [lighting, setLighting] = useState(false);
  const [free, setFree] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleSport = (s: Sport) =>
    setSelectedSports((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const togglePhoto = (src: string) =>
    setPhotos((prev) =>
      prev.includes(src) ? prev.filter((p) => p !== src) : [...prev, src],
    );

  const canNext =
    step === 0
      ? name.trim().length > 2
      : step === 1
        ? address.trim().length > 2 && !!coords
        : step === 2
          ? selectedSports.length > 0 && !!surface
          : true;

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-lime">
          <Check className="size-9 text-ink" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold">Площадка отправлена</h1>
        <p className="mt-3 text-ink-500">
          Спасибо! Модератор проверит данные в течение суток — и площадка появится
          на карте.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/map"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-ink-700"
          >
            На карту
          </Link>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setName("");
              setDescription("");
              setAddress("");
              setCoords(null);
              setSelectedSports([]);
              setSurface("");
              setPhotos([]);
            }}
            className="rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-semibold hover:border-ink"
          >
            Добавить ещё
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-400 transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Назад к площадкам
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-600">
            <span className="size-1.5 rounded-full bg-lime-500" />
            Новая точка на карте
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Добавить площадку
          </h1>
          <p className="mt-3 max-w-lg text-ink-500">
            Поделитесь местом, где можно тренироваться. Чем точнее данные — тем
            быстрее пройдёт модерация.
          </p>

          <div className="mt-8 flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                    i === step
                      ? "text-ink"
                      : i < step
                        ? "text-lime-600"
                        : "text-ink-300",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full border text-[10px]",
                      i === step
                        ? "border-ink bg-ink text-cream"
                        : i < step
                          ? "border-lime-500 bg-lime text-ink"
                          : "border-ink-200",
                    )}
                  >
                    {i < step ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1",
                      i < step ? "bg-lime-500" : "bg-ink-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-4xl border border-ink-200/70 bg-white p-6 shadow-card sm:p-8">
            {step === 0 && (
              <div className="animate-fade-up space-y-6">
                <SectionTitle
                  icon={<Info className="size-4" />}
                  title="Основная информация"
                  subtitle="Как называется площадка и что здесь можно делать"
                />
                <Field label="Название площадки" required>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например, Воркаут-зона в Парке Горького"
                    className={inputCls}
                  />
                </Field>
                <Field label="Описание" hint="Необязательно, но помогает другим">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Расскажите, что есть на площадке: покрытие, инвентарь, особенности..."
                    className={cn(inputCls, "h-auto resize-none py-3")}
                  />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-up space-y-6">
                <SectionTitle
                  icon={<MapPin className="size-4" />}
                  title="Местоположение"
                  subtitle="Поставьте метку на карте и уточните адрес"
                />
                <LocationPicker value={coords} onChange={setCoords} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Город" required>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputCls}
                    >
                      {cities.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Адрес" required>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Улица, дом"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-up space-y-6">
                <SectionTitle
                  icon={<Sparkles className="size-4" />}
                  title="Характеристики"
                  subtitle="Вид спорта, покрытие и условия"
                />
                <Field label="Виды спорта" required>
                  <div className="flex flex-wrap gap-2">
                    {sports.map((s) => {
                      const on = selectedSports.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSport(s)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all",
                            on
                              ? "border-ink bg-ink text-cream"
                              : "border-ink-200 bg-white text-ink-500 hover:border-ink-300",
                          )}
                        >
                          {on && <Check className="size-3.5 text-lime" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Покрытие" required>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {surfaces.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSurface(s)}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-[13px] font-semibold transition-all",
                          surface === s
                            ? "border-ink bg-ink text-cream"
                            : "border-ink-200 bg-white text-ink-500 hover:border-ink-300",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Открытие">
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="time"
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className={cn(inputCls, "pl-10")}
                      />
                    </div>
                  </Field>
                  <Field label="Закрытие">
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
                      <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className={cn(inputCls, "pl-10")}
                      />
                    </div>
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Toggle
                    icon={<Sun className="size-4" />}
                    label="Есть освещение"
                    hint="Можно заниматься вечером"
                    checked={lighting}
                    onChange={setLighting}
                  />
                  <Toggle
                    icon={<Wallet className="size-4" />}
                    label="Бесплатная площадка"
                    hint="Без оплаты и абонемента"
                    checked={free}
                    onChange={setFree}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-up space-y-6">
                <SectionTitle
                  icon={<Camera className="size-4" />}
                  title="Фотографии"
                  subtitle="До 5 фото — они появятся в карточке площадки"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photoPool.map((src) => {
                    const on = photos.includes(src);
                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => togglePhoto(src)}
                        className={cn(
                          "group relative aspect-[4/3] overflow-hidden rounded-2xl border-2 transition-all",
                          on ? "border-lime-500" : "border-transparent",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className={cn(
                            "size-full object-cover transition-all",
                            on ? "opacity-100" : "opacity-70 group-hover:opacity-100",
                          )}
                        />
                        <span
                          className={cn(
                            "absolute right-2 top-2 grid size-6 place-items-center rounded-full text-ink transition-all",
                            on ? "bg-lime" : "bg-white/80 opacity-0 group-hover:opacity-100",
                          )}
                        >
                          {on ? <Check className="size-3.5" /> : <ImagePlus className="size-3.5" />}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-200 text-ink-400 transition-colors hover:border-ink hover:text-ink"
                  >
                    <ImagePlus className="size-6" />
                    <span className="text-[11px] font-semibold">Загрузить</span>
                  </button>
                </div>
                <div className="flex items-start gap-2 rounded-2xl bg-cream p-4 text-xs leading-relaxed text-ink-500">
                  <Info className="mt-0.5 size-4 shrink-0" />
                  Выбрано {photos.length} из 5. Загружайте только свои фото или
                  изображения со свободной лицензией.
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-100 pt-6">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-ink-400 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft className="size-4" /> Назад
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={() => canNext && setStep((s) => s + 1)}
                  disabled={!canNext}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-all hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Далее
                  <svg viewBox="0 0 24 24" className="size-4" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink transition-all hover:shadow-lime"
                >
                  <Check className="size-4" /> Отправить на модерацию
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-4xl border border-ink-200/70 bg-white p-6">
            <h3 className="font-display text-base font-semibold">Предпросмотр</h3>
            <div className="mt-4 overflow-hidden rounded-3xl border border-ink-100 bg-cream">
              <div className="relative aspect-[4/3] bg-ink-100">
                {photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photos[0]} alt="" className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-ink-300">
                    <Camera className="size-8" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold text-ink">
                    {free ? "Бесплатно" : "Платно"}
                  </span>
                  {lighting && (
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-ink">
                      Свет
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="line-clamp-1 text-sm font-semibold text-ink">
                  {name || "Название площадки"}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-ink-400">
                  {address ? `${city}, ${address}` : "Адрес не указан"}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(selectedSports.length ? selectedSports : ["Вид спорта"]).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-ink-50 px-2 py-0.5 text-[10px] font-semibold text-ink-500"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-ink-400">
                  <Clock className="size-3" /> {openTime} — {closeTime}
                  {surface && (
                    <>
                      <span>·</span>
                      {surface}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl bg-clay p-6">
            <h3 className="text-sm font-semibold text-ink">Что проверяет модератор</h3>
            <ul className="mt-3 space-y-2.5">
              {[
                "Метка совпадает с адресом",
                "Площадка существует и доступна",
                "Фото не нарушают правила",
                "Данные о покрытии и спорте верны",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-xs leading-relaxed text-ink-500">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-lime-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white py-3 text-xs font-semibold text-ink-400 transition-colors hover:text-ink"
          >
            <X className="size-3.5" /> Отменить добавление
          </button>
        </aside>
      </div>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-2xl border border-ink-200 bg-cream/50 px-4 text-sm font-medium text-ink outline-none transition-all placeholder:text-ink-400 focus:border-ink focus:bg-white focus:ring-4 focus:ring-lime/30";

const photoPool = [
  "https://images.unsplash.com/photo-1529903384028-929ae5dccdf1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=600&q=80",
];

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-lime text-ink">
        {icon}
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-0.5 text-sm text-ink-400">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
        {label}
        {required && <span className="text-lime-600">*</span>}
        {hint && (
          <span className="ml-auto normal-case tracking-normal text-ink-300">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  icon,
  label,
  hint,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
        checked
          ? "border-lime-500 bg-lime/15"
          : "border-ink-200 bg-white hover:border-ink-300",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl",
          checked ? "bg-lime text-ink" : "bg-ink-50 text-ink-400",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[13px] font-semibold text-ink">{label}</span>
        <span className="block text-[11px] text-ink-400">{hint}</span>
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-ink" : "bg-ink-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
