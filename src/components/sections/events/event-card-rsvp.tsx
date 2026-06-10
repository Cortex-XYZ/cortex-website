"use client";

import { CortexButton } from "@/components/cortex-button";
import type { CortexEvent } from "@/lib/content/events";

type EventCardRsvpProps = {
  event: CortexEvent;
  label: string;
};

export function EventCardRsvp({ event, label }: EventCardRsvpProps) {
  if (!event.url) {
    return null;
  }

  return (
    <div className="event-card-rsvp">
      <CortexButton
        asChild
        variant="primary"
        animated={false}
        className="event-card-rsvp-button"
      >
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`RSVP for ${event.title}`}
        >
          {event.rsvpLabel ?? label}
        </a>
      </CortexButton>
    </div>
  );
}
