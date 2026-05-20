import { CortexButton } from "@/components/cortex-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-canvas py-10 text-text-primary sm:py-14 lg:py-20">
      <section className="site-container flex flex-col items-start gap-6">
        <h1 className="font-mona text-hero text-text-primary sm:text-display">
          Local Service. <br /> Global Impact.
        </h1>
        <p className="max-w-2xl font-open text-body text-text-secondary">
          A global network of local hubs, education, events, services, and real
          projects around emerging technology.
        </p>
        <CortexButton variant="primary" size="default">
          Stake to Support
        </CortexButton>
      </section>
    </main>
  );
}
