import { MapPin } from "lucide-react";
import { CortexMark } from "@/components/logos/cortex-mark";
import { cn } from "@/lib/utils";
import type {
  CortexEvent,
  CortexEventCategory,
} from "@/lib/content/events";

const CATEGORY_BADGE_CLASSES: Record<CortexEventCategory, string> = {
  onboarding: "border-neutral-silver-gray text-neutral-silver-gray",
  blitz: "border-brand-monad-purple text-brand-monad-purple",
  product: "border-brand-cortex-orange text-brand-cortex-orange",
  global: "border-vibrant-signal-magenta text-vibrant-signal-magenta",
};

function CategoryBadge({
  category,
  label,
}: {
  category: CortexEventCategory;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 font-mona text-[11px] font-bold uppercase tracking-[0.08em]",
        CATEGORY_BADGE_CLASSES[category],
      )}
    >
      {label}
    </span>
  );
}

function CortexHubChip({ hub }: { hub: CortexEvent["hub"] }) {
  return (
    <span className="inline-flex items-center gap-2 font-mona text-text-muted">
      <CortexMark className="h-4 w-auto" />
      <span className="flex flex-col text-[10px] font-bold uppercase leading-[1.15] tracking-[0.04em]">
        <span>Cortex</span>
        <span>{hub}</span>
      </span>
    </span>
  );
}

function EventCardContent({ event }: { event: CortexEvent }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <CategoryBadge category={event.category} label={event.categoryLabel} />
        <CortexHubChip hub={event.hub} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2 lg:items-start lg:gap-12">
        <h3 className="font-mona text-event-heading text-text-primary transition-colors group-hover:text-action-primary">
          {event.title}
        </h3>
        <p className="font-open text-body-sm text-text-secondary lg:text-body">
          {event.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 font-mona text-body-xs text-text-secondary lg:text-body-sm">
        <time dateTime={event.date} className="font-semibold">
          {event.dateLabel}
        </time>
        <span className="inline-flex items-center gap-1.5 text-text-muted">
          <MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />
          {event.location}
        </span>
      </div>
    </>
  );
}

export function EventCard({ event }: { event: CortexEvent }) {
  const cardClass =
    "group flex flex-col gap-5 py-9 lg:gap-7 lg:py-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action-primary";

  if (event.url) {
    return (
      <li>
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${event.title} — opens Luma event page in a new tab`}
          className={cardClass}
        >
          <EventCardContent event={event} />
        </a>
      </li>
    );
  }

  return (
    <li className={cardClass}>
      <EventCardContent event={event} />
    </li>
  );
}
