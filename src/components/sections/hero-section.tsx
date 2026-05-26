import { ChevronDown } from "lucide-react";
import { CortexButton } from "@/components/cortex-button";
import { HeroWebglBackground } from "@/components/webgl/hero-webgl-background";

function HeroSection() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-bg-canvas">
      <HeroWebglBackground />

      <div className="site-container relative z-10 flex min-h-svh items-center pt-(--site-header-height)">
        <div className="flex max-w-3xl flex-col items-start gap-8 py-24">
          <div className="flex flex-col gap-6">
            <h1 className="font-mona text-hero-mobile text-text-primary sm:text-hero lg:text-display">
              Local Service. <br /> Global Impact.
            </h1>
            <div className="flex max-w-3xl flex-col gap-6 font-open text-body-sm text-text-secondary sm:text-body lg:text-body-lg">
              <p>
                <strong className="font-mona font-semibold text-text-primary">
                  Cortex
                </strong>{" "}
                serves all individual, business, and community needs from our
                local hubs - local citizens providing expertise, guidance, and
                connection to the top industry professionals in all verticals -
                around the world.
              </p>
              <p>Everything for Everyone. Everywhere.</p>
            </div>
          </div>

          <div className="flex w-full flex-nowrap gap-2 sm:w-auto sm:gap-4">
            <CortexButton
              variant="primary"
              size="lg"
              animated={false}
              className="px-4 sm:px-(--button-padding-inline)"
            >
              I am new here
            </CortexButton>
            <CortexButton
              variant="subtleOutline"
              size="lg"
              animated={false}
              className="px-4 sm:px-(--button-padding-inline)"
            >
              I am in community
            </CortexButton>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-8 z-20 flex cursor-pointer justify-center sm:bottom-10"
        data-hero-scroll-cue
      >
        <ChevronDown
          aria-hidden="true"
          className="size-7 text-text-secondary motion-safe:animate-arrow-move-down sm:size-8"
          strokeWidth={2.25}
        />
      </div>
    </section>
  );
}

export { HeroSection };
