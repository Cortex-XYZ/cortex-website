"use client";

import { ChevronDown } from "lucide-react";
import { HashLink } from "@/components/hash-link";
import type { CortexEvent } from "@/lib/content/events";
import { cn } from "@/lib/utils";

type HeaderUpcomingEventLinkProps = {
  event: CortexEvent;
  href: string;
  className?: string;
  onNavigate?: () => void;
  variant?: "bar" | "panel";
};

export function HeaderUpcomingEventLink({
  event,
  href,
  className,
  onNavigate,
  variant = "bar",
}: HeaderUpcomingEventLinkProps) {
  const content = (
    <span className="header-upcoming-event-content">
      <span className="header-upcoming-event-pill">{event.label}</span>
      <span className="header-upcoming-event-copy">
        <time className="header-upcoming-event-date" dateTime={event.date}>
          {event.dateLabel}
        </time>
        <span className="header-upcoming-event-title">{event.title}</span>
      </span>
      <ChevronDown
        className="header-upcoming-event-icon"
        aria-hidden="true"
      />
    </span>
  );

  const classNames = cn(
    "header-upcoming-event",
    variant === "panel" && "header-upcoming-event-panel",
    className,
  );

  return (
    <HashLink
      href={href}
      className={classNames}
      aria-label={`Scroll to ${event.title} in upcoming events`}
      onClick={onNavigate}
    >
      {content}
    </HashLink>
  );
}
