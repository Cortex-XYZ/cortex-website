import type { CSSProperties } from "react";
import { HashLink } from "@/components/hash-link";
import { CtaArrow } from "@/components/icons/cta-arrow";
import { SectionDivider } from "@/components/section-divider";
import {
  servicesSection,
  type ServiceCard,
  type ServiceVisualVariant,
} from "@/lib/content/services";
import { splitTrailingAccent } from "@/lib/split-trailing-accent";

type BlobConfig = {
  color: string;
  x: number;
  y: number;
};

const SERVICE_BLOBS: Record<ServiceVisualVariant, [BlobConfig, BlobConfig]> = {
  education: [
    { color: "var(--shader-orange-amber-color-b)", x: 30, y: 68 },
    { color: "var(--shader-orange-amber-color-a)", x: 72, y: 88 },
  ],
  event: [
    { color: "var(--shader-orange-purple-color-a)", x: 28, y: 82 },
    { color: "var(--shader-orange-purple-color-b)", x: 72, y: 48 },
  ],
  services: [
    { color: "var(--shader-cyan-amber-color-b)", x: 25, y: 65 },
    { color: "var(--shader-cyan-amber-color-a)", x: 78, y: 72 },
  ],
  research: [
    { color: "var(--shader-orange-magenta-color-b)", x: 25, y: 62 },
    { color: "var(--shader-orange-magenta-color-a)", x: 80, y: 85 },
  ],
  staking: [
    { color: "var(--shader-orange-yellow-color-b)", x: 15, y: 82 },
    { color: "var(--shader-orange-yellow-color-a)", x: 65, y: 82 },
  ],
};

function ServiceCardItem({ card }: { card: ServiceCard }) {
  const blobs = SERVICE_BLOBS[card.visualVariant];

  return (
    <article className="service-card" data-services-card={card.id}>
      <div className="service-card-surface">
        {blobs.map((blob, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="service-card-blob"
            style={
              {
                backgroundColor: blob.color,
                "--blob-left": `${blob.x}%`,
                "--blob-top": `${blob.y}%`,
              } as CSSProperties
            }
          />
        ))}
        <h3 className="service-card-name">{card.title}</h3>
      </div>
      <p className="service-card-description">{card.description}</p>
    </article>
  );
}

export function ServicesSection() {
  const { text: servicesTitle, accent: servicesTitleAccent } =
    splitTrailingAccent(servicesSection.title);
  const servicesTitleLines = servicesTitle.split("\n");

  return (
    <section className="services-section" id="services" data-services-section>
      <div className="site-container section-intro" data-services-header>
        <h2 className="section-title services-title">
          {servicesTitleLines.map((line, index) => (
            <span key={line} className="services-title-line">
              {line}
              {index === servicesTitleLines.length - 1 &&
              servicesTitleAccent ? (
                <span className="text-action-primary">
                  {servicesTitleAccent}
                </span>
              ) : null}
            </span>
          ))}
        </h2>
        <p className="services-description">{servicesSection.description}</p>
      </div>

      <div className="site-container">
        <div className="services-grid" data-services-grid>
          {servicesSection.cards.map((card) => (
            <ServiceCardItem key={card.id} card={card} />
          ))}
          <HashLink
            href={servicesSection.cta.href}
            className="service-cta-card"
            data-services-cta
          >
            <span className="service-cta-title">
              {servicesSection.cta.label}
            </span>
            <CtaArrow className="service-cta-arrow" aria-hidden="true" />
          </HashLink>
        </div>
        <SectionDivider variant="orange-reverse" />
      </div>
    </section>
  );
}
