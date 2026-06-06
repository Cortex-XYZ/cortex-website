import { HeroSection } from "@/components/sections/hero-section";
import { MissionSection } from "@/components/sections/mission/mission-section";
import { ServicesSection } from "@/components/sections/services/services-section";

export default function Home() {
  return (
    <main className="bg-bg-canvas text-text-primary">
      <HeroSection />
      <MissionSection />
      <ServicesSection />
    </main>
  );
}
