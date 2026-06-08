import { EventCard } from "@/components/sections/events/event-card";
import { eventsSection } from "@/lib/content/events";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function EventsSection() {
  const today = todayIsoDate();
  const upcomingEvents = eventsSection.events.filter(
    (event) => event.date >= today,
  );

  return (
    <section
      id={eventsSection.id}
      className="bg-bg-canvas py-16 md:py-20 lg:py-24"
    >
      <div className="site-container">
        <h2 className="max-w-md font-mona text-section-heading font-extrabold text-text-secondary">
          <span className="block">Upcoming</span>
          <span className="block">
            Events<span className="text-action-primary">.</span>
          </span>
        </h2>

        {upcomingEvents.length === 0 ? (
          <p className="mt-12 border-y border-border-default py-12 font-open text-body-sm text-text-muted lg:mt-16 lg:text-body">
            {eventsSection.emptyState}
          </p>
        ) : (
          <ul className="mt-12 divide-y divide-border-default border-y border-border-default lg:mt-16">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
