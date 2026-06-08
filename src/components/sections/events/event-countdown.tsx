"use client";

import { useState } from "react";
import { useOnMount } from "@/hooks/use-on-mount";
import { getEventCountdownState } from "@/lib/events/countdown";
import { cn } from "@/lib/utils";

type EventCountdownProps = {
  className?: string;
  date: string;
};

export function EventCountdown({ className, date }: EventCountdownProps) {
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

  const countdown = getEventCountdownState(date, now);

  if (!countdown) {
    return null;
  }

  return (
    <p
      className={cn("event-countdown", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="event-countdown-label">{countdown.label}</span>
      <span className="event-countdown-separator" aria-hidden="true">
        ·
      </span>
      <time
        className="event-countdown-clock"
        dateTime={`P${countdown.days}DT${countdown.hours}H${countdown.minutes}M${countdown.seconds}S`}
      >
        {countdown.clock}
      </time>
    </p>
  );
}
