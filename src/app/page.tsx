import { CortexButton } from "@/components/cortex-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-bg-canvas pt-[90px] text-text-primary">
      <section className="site-container grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)]">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-mona text-hero text-text-primary sm:text-display">
            Local Service. <br /> Global Impact.
          </h1>
          <p className="max-w-2xl font-open text-body text-text-secondary">
            A global network of local hubs, education, events, services, and
            real projects around emerging technology.
          </p>
          <CortexButton variant="primary" size="default" animated={false}>
            Stake to Support
          </CortexButton>
        </div>
      </section>
    </main>
  );
}
