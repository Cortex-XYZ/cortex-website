import { eventsSection } from "@/lib/content/events";
import { getNextUpcomingEvent } from "@/lib/events/upcoming";
import { HeaderUpcomingEventLink } from "@/components/layout/header/header-upcoming-event-link";

type HeaderUpcomingEventProps = {
  className?: string;
  variant?: "bar" | "panel";
  onNavigate?: () => void;
};

export function HeaderUpcomingEvent({
  className,
  variant = "bar",
  onNavigate,
}: HeaderUpcomingEventProps) {
  // Date-aware at render; root layout ISR (EVENTS_DATE_REVALIDATE_SECONDS) refreshes this.
  const event = getNextUpcomingEvent(eventsSection.events);
  if (!event) return null;

  return (
    <HeaderUpcomingEventLink
      event={event}
      href={`/#${eventsSection.id}`}
      variant={variant}
      onNavigate={onNavigate}
      className={className}
    />
  );
}
