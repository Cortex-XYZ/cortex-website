type EventCountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
  clock: string;
};

type EventLiveState = {
  label: "Happening now" | "Event ended";
};

export type EventTimingState =
  | (EventCountdownState & { status: "countdown" })
  | (EventLiveState & { status: "live" | "ended" });

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;
const SECOND_MS = 1_000;

function padTime(value: number): string {
  return String(value).padStart(2, "0");
}

export function getEventTimingState(
  startsAt: string,
  endsAt: string,
  now: number,
): EventTimingState | null {
  const startMs = new Date(startsAt).getTime();
  const endMs = new Date(endsAt).getTime();

  if (now >= endMs) {
    return { status: "ended", label: "Event ended" };
  }

  if (now >= startMs) {
    return { status: "live", label: "Happening now" };
  }

  const diff = startMs - now;

  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((diff % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((diff % MINUTE_MS) / SECOND_MS);

  let label: string;
  if (days === 0) {
    label = "Today";
  } else if (days === 1) {
    label = "1 day left";
  } else {
    label = `${days} days left`;
  }

  return {
    status: "countdown",
    days,
    hours,
    minutes,
    seconds,
    label,
    clock: `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`,
  };
}
