import dynamic from "next/dynamic";
import { missionSection } from "@/lib/content/mission";

const MissionDesktopStack = dynamic(() =>
  import("@/components/sections/mission/mission-cards-client").then(
    (mod) => mod.MissionDesktopStack,
  ),
);

const MissionMobileCards = dynamic(() =>
  import("@/components/sections/mission/mission-cards-client").then(
    (mod) => mod.MissionMobileCards,
  ),
);

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
    <section id={missionSection.id} className="mission-section">
      <div className="site-container flex flex-col gap-6 md:gap-8 xl:hidden">
        <MissionIntro />
      </div>

      <MissionDesktopStack
        cards={missionSection.cards}
        intro={<MissionIntro />}
      />

      <MissionMobileCards cards={missionSection.cards} />
    </section>
  );
}
