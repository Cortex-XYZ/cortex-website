import { HeroSection } from "@/components/sections/hero-section";
import { HistorySection } from "@/components/sections/history-section";
import { MissionSection } from "@/components/sections/mission/mission-section";

export default function Home() {
  return (
    <main className="bg-bg-canvas text-text-primary">
      <HeroSection />
      <MissionSection />
      <HistorySection />
    </main>
  );
}
