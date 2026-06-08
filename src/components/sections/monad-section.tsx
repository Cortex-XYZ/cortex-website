import dynamic from "next/dynamic";
import { MonadCardsStatic } from "@/components/sections/monad/monad-cards-static";
import { MONAD_INTERACTIVE_CARDS } from "@/components/sections/monad/get-monad-interactive-cards";
import { MonadSocialLinks } from "@/components/sections/monad/monad-social-links";
import { SectionDivider } from "@/components/section-divider";
import { monadSection } from "@/lib/content/monad";

const MonadCardsClient = dynamic(
  () =>
    import("@/components/sections/monad/monad-cards-client").then(
      (mod) => mod.MonadCardsClient,
    ),
  {
    loading: () => <MonadCardsStatic cards={MONAD_INTERACTIVE_CARDS} />,
  },
);

export function MonadSection() {
  return (
    <section
      id={monadSection.id}
      className="monad-section"
      aria-labelledby="monad-heading"
      data-monad-section
    >
      <div className="site-container">
        <SectionDivider variant="purple" />
      </div>
      <div className="site-container section-intro">
        <h2 id="monad-heading" className="section-title monad-title">
          {monadSection.title}
        </h2>
        <p className="monad-description">{monadSection.description}</p>
      </div>

      <div className="monad-band">
        <div className="site-container monad-band-container">
          <div className="monad-band-meta">
            <p className="monad-eyebrow">{monadSection.eyebrow}</p>
            <MonadSocialLinks />
          </div>
          <MonadCardsClient cards={MONAD_INTERACTIVE_CARDS} />
        </div>
      </div>
    </section>
  );
}
