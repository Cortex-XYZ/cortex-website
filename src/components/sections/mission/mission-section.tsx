import {
  MissionDesktopCards,
  MissionMobileCards,
} from "@/components/sections/mission/mission-cards-client";
import { MISSION_CARD_HEIGHT_STYLE } from "@/components/sections/mission/mission-layout";
import { missionSection } from "@/lib/content/mission";

function missionParagraphKey(
  paragraph: (typeof missionSection.paragraphs)[number],
): string {
  return paragraph.emphasis
    ? `emphasis:${paragraph.emphasis}`
    : `text:${paragraph.text.slice(0, 48)}`;
}

function MissionIntro({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mission-eyebrow">{missionSection.eyebrow}</p>
      <div className="mt-5 flex flex-col gap-5 md:mt-6 md:gap-6">
        {missionSection.paragraphs.map((paragraph) => (
          <p
            key={missionParagraphKey(paragraph)}
            className="mission-intro-body"
          >
            {paragraph.emphasis ? (
              <>
                <strong className="font-semibold">
                  {paragraph.emphasis}
                </strong>{" "}
              </>
            ) : null}
            {paragraph.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function MissionSection() {
  return (
    <section className="mission-section">
      <div className="site-container flex flex-col gap-6 md:gap-8 xl:flex-row xl:items-start xl:gap-11">
        {/* Mobile + tablet - intro at top */}
        <MissionIntro className="xl:hidden" />

        {/* Desktop - intro bottom-aligned to card stack */}
        <div
          className="hidden w-[334px] shrink-0 flex-col xl:flex"
          style={MISSION_CARD_HEIGHT_STYLE}
        >
          <div className="flex-1" aria-hidden />
          <MissionIntro />
        </div>

        {/* Desktop - accordion card stack */}
        <MissionDesktopCards cards={missionSection.cards} />
      </div>

      {/* Mobile + tablet - horizontal card carousel (width differs at md+) */}
      <MissionMobileCards cards={missionSection.cards} />
    </section>
  );
}
