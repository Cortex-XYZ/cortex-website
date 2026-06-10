import Image from "next/image";
import { MapPin } from "lucide-react";
import { EventCardLink } from "@/components/sections/events/event-card-link";
import { EventCardRsvp } from "@/components/sections/events/event-card-rsvp";
import { EventCountdown } from "@/components/sections/events/event-countdown";
import { CortexMark } from "@/components/logos/cortex-mark";
import { eventsSection, type CortexEvent } from "@/lib/content/events";
import { getUtcDateKey } from "@/lib/events/countdown";
import { splitTrailingAccent } from "@/lib/split-trailing-accent";


function getUpcomingEvents(
  events: readonly CortexEvent[],
  today = getUtcDateKey(new Date()),
) {
  return events.filter((event) => event.date >= today);
}

function EventLockup({ region }: { region?: string }) {
  return (
    <div className="event-lockup" aria-label={`Cortex ${region ?? "Global"}`}>
      <CortexMark className="event-lockup-mark" />
      <span className="event-lockup-text" aria-hidden="true">
        <span>CORTEX</span>
        <span>{region ?? "GLOBAL"}</span>
      </span>
    </div>
  );
}

function EventMetaDetails({
  className,
  event,
}: {
  className?: string;
  event: CortexEvent;
}) {
  return (
    <div
      className={`event-meta-details${className ? ` ${className}` : ""}`}
    >
      <time dateTime={event.date}>{event.dateLabel}</time>
      <span className="event-location">
        <MapPin className="event-location-icon" aria-hidden="true" />
        <span>{event.location.city}</span>
      </span>
    </div>
  );
}

function EventMeta({ event }: { event: CortexEvent }) {
  return (
    <div className="event-meta">
      <EventMetaDetails className="event-meta-details-inline" event={event} />
      <EventCountdown className="event-countdown-slot" date={event.date} />
    </div>
  );
}

function EventPoster({ event }: { event: CortexEvent }) {
  if (!event.image) {
    return null;
  }

  return (
    <div className="event-card-poster">
      <Image
        src={event.image.src}
        alt={event.image.alt}
        fill
        className="event-card-poster-image"
        sizes="(min-width: 768px) and (max-width: 1279px) 14rem, calc(100vw - 4.5rem)"
      />
    </div>
  );
}

function EventCardContent({ event }: { event: CortexEvent }) {
  return (
    <div className="event-card-layout">
      <div className="event-card-main">
        <EventCardLink event={event}>
          <>
            <div className="event-card-primary">
              <div className="event-tags" aria-label="Event category and region">
                <span className="event-pill">{event.label}</span>
                <EventLockup region={event.location.region} />
              </div>

              <h3 className="event-title">{event.title}</h3>
              <EventMetaDetails
                className="event-meta-details-mobile"
                event={event}
              />
            </div>

            <EventPoster event={event} />

            <div className="event-card-copy">
              <p className="event-description">{event.description}</p>
              <EventMeta event={event} />
            </div>
          </>
        </EventCardLink>

        <EventCardRsvp event={event} label={eventsSection.rsvpLabel} />
      </div>
    </div>
  );
}

function EventCard({ event }: { event: CortexEvent }) {
  return (
    <article className="event-card">
      <EventCardContent event={event} />
    </article>
  );
}

export function EventsSection() {
  const upcomingEvents = getUpcomingEvents(eventsSection.events);
  const hasUpcomingEvents = upcomingEvents.length > 0;
  const lastLineIndex = eventsSection.titleLines.length - 1;
  const { text: lastLineText, accent: lastLineAccent } = splitTrailingAccent(
    eventsSection.titleLines[lastLineIndex] ?? "",
  );

  return (
    <section
      id={eventsSection.id}
      className="events-section"
      aria-labelledby="events-heading"
      data-events-section
    >
      <div className="site-container">
        <div className="events-top-rule" aria-hidden="true" />
      </div>

      <div className="site-container section-intro" data-events-header>
        <h2 id="events-heading" className="section-title events-title">
          {eventsSection.titleLines.map((line, index) => {
            const isLastLine = index === lastLineIndex;
            const lineText = isLastLine ? lastLineText : line;

            return (
              <span key={line} className="events-title-line">
                {lineText}
                {isLastLine && lastLineAccent ? (
                  <span className="text-action-primary">{lastLineAccent}</span>
                ) : null}
              </span>
            );
          })}
        </h2>
      </div>

      {hasUpcomingEvents ? (
        <div className="site-container events-list-wrap">
          <ul className="events-list" aria-label="Upcoming events">
            {upcomingEvents.map((event) => (
              <li key={event.id} className="events-list-item">
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        className={`site-container events-follow-up-wrap${hasUpcomingEvents ? "" : " events-follow-up-wrap-empty"}`}
      >
        <div className="events-follow-up">
          <p className="events-follow-up-kicker">Next on the network</p>
          <h3 className="events-follow-up-title">
            {eventsSection.followUp.title}
          </h3>
          <p className="events-follow-up-description">
            {eventsSection.followUp.description}
          </p>
        </div>
      </div>
    </section>
  );
}