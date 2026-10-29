"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(
  () => import("@/components/map/map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-4.5rem)] items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 animate-spin rounded-full border-2 border-ink-200 border-t-ink" />
          <p className="text-sm text-ink-400">Загружаем карту…</p>
        </div>
      </div>
    ),
  },
);

export function MapLoader() {
  return <MapView />;
}
