import { SplitText } from "gsap/SplitText";

import { gsap } from "@/lib/gsap-setup";

// Registered here (not in gsap-setup) so SplitText only ships in this
// dynamically imported desktop-only chunk.
gsap.registerPlugin(SplitText);

const HERO_TITLE_SELECTOR = "[data-hero-title]";

const HERO_TITLE_ENTER_DURATION = 0.52;
const HERO_TITLE_WORD_STAGGER = 0.03;
const HERO_TITLE_REVEAL_Y_PERCENT = 96;
const HERO_TITLE_ENTER_EASE = "power3.out";

export function setupHeroTitleEnter(scope: HTMLElement): () => void {
  const title = scope.querySelector<HTMLElement>(HERO_TITLE_SELECTOR);
  if (!title) return () => {};

  const split = SplitText.create(title, {
    type: "words",
    mask: "words",
    wordsClass: "hero-title-word++",
    onSplit(self) {
      const timeline = gsap.timeline({
        defaults: {
          duration: HERO_TITLE_ENTER_DURATION,
          ease: HERO_TITLE_ENTER_EASE,
        },
      });

      timeline.from(self.words, {
        autoAlpha: 0,
        yPercent: HERO_TITLE_REVEAL_Y_PERCENT,
        stagger: {
          each: HERO_TITLE_WORD_STAGGER,
          from: "start",
        },
      });

      return timeline;
    },
  });

  return () => {
    split.revert();
  };
}
