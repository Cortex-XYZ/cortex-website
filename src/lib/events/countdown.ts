type EventCountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
  clock: string;
};

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;
const SECOND_MS = 1_000;

function padTime(value: number): string {
  return String(value).padStart(2, "0");
}

/** Calendar date key (YYYY-MM-DD) in UTC for the given instant. */
export function getUtcDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** Midnight UTC on the event's calendar day. Event `date` fields are UTC calendar dates. */
function getEventTargetTime(date: string): number {
  return new Date(`${date}T00:00:00Z`).getTime();
}

export function getEventCountdownState(
  date: string,
  now: number,
): EventCountdownState | null {
  const diff = getEventTargetTime(date) - now;

  if (diff <= 0) {
    return null;
  }

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
    days,
    hours,
    minutes,
    seconds,
    label,
    clock: `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`,
  };
}
