"use client";

import { useState } from "react";
import { useOnMount } from "@/hooks/use-on-mount";
import { getEventTimingState } from "@/lib/events/countdown";
import { cn } from "@/lib/utils";

type EventCountdownProps = {
  className?: string;
  startsAt: string;
  endsAt: string;
};

export function EventCountdown({
  className,
  startsAt,
  endsAt,
}: EventCountdownProps) {
  const [now, setNow] = useState<number | null>(null);

  useOnMount(() => {
    function updateNow() {
      setNow(Date.now());
    }

    updateNow();
    const intervalId = window.setInterval(updateNow, 1000);

    return () => window.clearInterval(intervalId);
  });

  if (now === null) {
    return (
      <p
        className={cn("event-countdown event-countdown-skeleton", className)}
        aria-hidden="true"
      >
        <span className="event-countdown-skeleton-label" />
        <span className="event-countdown-skeleton-clock" />
      </p>
    );
  }

  const timing = getEventTimingState(startsAt, endsAt, now);

  if (!timing) {
    return null;
  }

  if (timing.status !== "countdown") {
    return (
      <p
        className={cn("event-countdown", className)}
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="event-countdown-label">{timing.label}</span>
      </p>
    );
  }

  return (
    <p
      className={cn("event-countdown", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="event-countdown-label">{timing.label}</span>
      <span className="event-countdown-separator" aria-hidden="true">
        ·
      </span>
      <time
        className="event-countdown-clock"
        dateTime={`P${timing.days}DT${timing.hours}H${timing.minutes}M${timing.seconds}S`}
      >
        {timing.clock}
      </time>
    </p>
  );
}
