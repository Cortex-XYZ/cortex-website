import dynamic from "next/dynamic";
import { MONAD_INTERACTIVE_CARDS } from "@/components/sections/monad/get-monad-interactive-cards";
import { MonadTopicCards } from "@/components/sections/monad/monad-topic-cards";
import { MonadSocialLinks } from "@/components/sections/monad/monad-social-links";
import { SectionDivider } from "@/components/section-divider";
import { monadSection } from "@/lib/content/monad";

const MonadScrollMotion = dynamic(() =>
  import("@/components/sections/monad/monad-scroll-motion").then(
    (mod) => mod.MonadScrollMotion,
  ),
);

export function MonadSection() {
  return (
    <section
      id={monadSection.id}
      className="monad-section"
      aria-labelledby="monad-heading"
      data-monad-section
      data-monad-enter-pending
    >
      <MonadScrollMotion>
        <div className="site-container">
          <div data-monad-divider>
            <SectionDivider variant="purple" />
          </div>
        </div>

        <div className="site-container section-intro">
          <h2
            id="monad-heading"
            className="section-title monad-title"
            data-monad-title
          >
            {monadSection.title}
          </h2>
          <p className="monad-description" data-monad-description>
            {monadSection.description}
          </p>
        </div>

        <div className="monad-band">
          <div className="site-container monad-band-container">
            <div className="monad-band-meta">
              <p className="monad-eyebrow" data-monad-eyebrow>
                {monadSection.eyebrow}
              </p>
              <MonadSocialLinks />
            </div>
            <MonadTopicCards cards={MONAD_INTERACTIVE_CARDS} />
          </div>
        </div>
      </MonadScrollMotion>
    </section>
  );
}
