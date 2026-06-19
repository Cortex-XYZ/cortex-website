import { ChevronDown } from "lucide-react";
import { HashLink } from "@/components/hash-link";
import { CortexButton } from "@/components/cortex-button";
import { HeaderUpcomingEvent } from "@/components/layout/header/header-upcoming-event";
import { HeroTitleMotion } from "@/components/sections/hero/hero-title-motion";
import { HeroWebglBackground } from "@/components/webgl/hero-webgl-background";
import { heroSection } from "@/lib/content/hero";
import { siteLinks } from "@/lib/content/links";

export function HeroSection() {
  const titleLines = heroSection.title.split("\n");

  return (
    <section id={heroSection.id} className="hero-section">
      <HeroWebglBackground />

      <div className="hero-container">
        {/* Title + subtitle + CTAs */}
        <div className="flex w-full flex-1 flex-col items-center gap-5 text-center sm:max-w-xl sm:flex-initial sm:items-start sm:gap-6 sm:text-left md:gap-16 md:py-24 lg:max-w-3xl lg:gap-10">
          <div className="flex flex-1 flex-col gap-4 sm:flex-initial sm:gap-4 md:gap-10 lg:gap-6">
            <HeaderUpcomingEvent className="-mt-4 mb-8 inline-flex self-center sm:hidden" />

            <HeroTitleMotion>
              <h1 className="hero-title" data-hero-title>
                {titleLines.map((line, i) => (
                  <span key={i} className="hero-title-line">
                    {line}
                    {i < titleLines.length - 1 ? " " : null}
                  </span>
                ))}
              </h1>
            </HeroTitleMotion>
            {/* Mobile subtitle */}
            <div className="hero-subtitle sm:hidden">
              <p className="hero-subtitle-lead">
                {heroSection.mobileParagraphs[0].emphasis && (
                  <>
                    <strong className="hero-subtitle-emphasis">
                      {heroSection.mobileParagraphs[0].emphasis}
                    </strong>{" "}
                  </>
                )}
                {heroSection.mobileParagraphs[0].text}
              </p>
              {heroSection.paragraphs.slice(1).map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? "hero-paragraph-lead" : "hero-paragraph-rest"}
                >
                  {p.text}
                </p>
              ))}
            </div>

            {/* sm+ subtitle */}
            <div className="hero-subtitle hidden sm:block">
              <p className="hero-subtitle-lead">
                {heroSection.paragraphs[0].emphasis && (
                  <>
                    <strong className="hero-subtitle-emphasis">
                      {heroSection.paragraphs[0].emphasis}
                    </strong>{" "}
                  </>
                )}
                {heroSection.paragraphs[0].text}
                {heroSection.paragraphs[0].tabletLine ? (
                  <>
                    <br className="hidden md:block lg:hidden" aria-hidden="true" />
                    {heroSection.paragraphs[0].tabletLine}
                  </>
                ) : null}
              </p>
              {heroSection.paragraphs.slice(1).map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? "hero-paragraph-lead" : "hero-paragraph-rest"}
                >
                  {p.text}
                </p>
              ))}
            </div>
          </div>

          {/* CTAs — full-width stack on mobile, inline row on sm+ */}
          <div className="hero-cta-group">
            <CortexButton
              variant="primary"
              size="lg"
              animated={false}
              className="hero-cta-button"
              asChild
            >
              <HashLink href={heroSection.primaryCta.href}>
                {heroSection.primaryCta.label}
              </HashLink>
            </CortexButton>
            <CortexButton
              variant="subtleOutline"
              size="lg"
              animated={false}
              className="hero-cta-button"
              asChild
            >
              <HashLink href={heroSection.secondaryCta.href}>
                {heroSection.secondaryCta.label}
              </HashLink>
            </CortexButton>
          </div>
        </div>
      </div>

      <HashLink
        href={siteLinks.mission.href}
        className="hero-scroll-cue"
        data-hero-scroll-cue
        aria-label={`Scroll to ${siteLinks.mission.label}`}
      >
        <ChevronDown
          aria-hidden="true"
          className="hero-scroll-cue-icon"
          strokeWidth={2.25}
        />
      </HashLink>
    </section>
  );
}
