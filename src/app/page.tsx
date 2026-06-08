import { EventsSection } from "@/components/sections/events-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HistorySection } from "@/components/sections/history-section";
import { MissionSection } from "@/components/sections/mission/mission-section";
import { MonadSection } from "@/components/sections/monad-section";
import { TeamSection } from "@/components/sections/team-section";

// Hourly ISR lets EventsSection re-run getUpcomingEvents after dates pass without a
// rebuild. Event data is still static TypeScript, so this only refreshes visibility
// filtering—not content from an external source. Keep until events are dynamic.
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="bg-bg-canvas text-text-primary">
      <HeroSection />
      <MissionSection />
      <HistorySection />
      <TeamSection />
      <MonadSection />
      <EventsSection />
    </main>
  );
}
