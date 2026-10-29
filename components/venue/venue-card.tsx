import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Sun, Wallet } from "lucide-react";
import type { Venue } from "@/lib/data";
import { Badge, Rating } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function VenueCard({
  venue,
  className,
  compact = false,
}: {
  venue: Venue;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/venue/${venue.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-4xl border border-ink-200/70 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-ink-300 hover:shadow-soft",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          compact ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {venue.isFree ? (
            <Badge tone="lime">Бесплатно</Badge>
          ) : (
            <Badge tone="dark">Платно</Badge>
          )}
          {venue.hasLighting && (
            <Badge tone="outline" className="backdrop-blur">
              <Sun className="size-3" /> Свет
            </Badge>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {venue.sports.slice(0, 2).map((sport) => (
              <span
                key={sport}
                className="rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur"
              >
                {sport}
              </span>
            ))}
          </div>
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-cream transition-transform duration-300 group-hover:rotate-45",
              venue.isOpen ? "bg-lime text-ink" : "bg-ink/80",
            )}
            aria-label={venue.isOpen ? "Открыто" : "Закрыто"}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none">
              <path
                d="M7 17 17 7M9 7h8v8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className={cn("flex flex-1 flex-col p-5", compact && "p-4")}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-lime-600">
            {venue.name}
          </h3>
          <Rating value={venue.rating} className="shrink-0 pt-0.5" />
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-400">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {venue.address} · {venue.distance}
          </span>
        </p>

        {!compact && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {venue.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3 pt-4 text-[11px] font-semibold text-ink-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {venue.hours}
          </span>
          <span className="inline-flex items-center gap-1">
            <Wallet className="size-3.5" /> {venue.surface}
          </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <span
              className={cn(
                "size-1.5 rounded-full",
                venue.isOpen ? "bg-lime-500" : "bg-ink-300",
              )}
            />
            {venue.isOpen ? "Открыто" : "Закрыто"}
          </span>
        </div>
      </div>
    </Link>
  );
}
