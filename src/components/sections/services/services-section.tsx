import type { ComponentProps } from "react";
import Link from "next/link";
import { servicesSection } from "@/lib/content/services";

function CtaArrowGlyph(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 84 83" fill="none" aria-hidden {...props}>
      <path
        d="M83.5 82.1581V0.5H0.5M83.5 0.5L0.5 82.1581"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServicesSection() {
  return (
    <section id={servicesSection.id} className="services-section">
      <div className="site-container">
        <header className="services-header">
          <h2 className="services-title">
            Services are
            <br />
            the main
            <br />
            utility layer<span className="services-period">.</span>
          </h2>
          <p className="services-description">{servicesSection.description}</p>
        </header>

        <ul className="services-grid">
          {servicesSection.cards.map((card) => (
            <li key={card.id} className="services-grid-item">
              <Link
                href={card.href}
                className={`services-card services-card--gradient services-card--${card.visualVariant}`}
              >
                <p className="services-card-description">{card.description}</p>
                <h3 className="services-card-title">{card.title}</h3>
              </Link>
            </li>
          ))}
          <li className="services-grid-item hidden lg:flex">
            <Link
              href={servicesSection.cta.href}
              className="services-card services-card--cta"
            >
              <CtaArrowGlyph className="services-cta-arrow" />
              <h3 className="services-cta-title">
                {servicesSection.cta.label}
              </h3>
            </Link>
          </li>
        </ul>
        <hr className="services-divider" />
      </div>
    </section>
  );
}
