import type { SectionContent } from "./types";

export type MissionPattern =
  | "pulse-field"
  | "dot-orbits"
  | "stepped-lattice"
  | "radiating-segments"
  | "node-mesh";

export type MissionCardId =
  | "pulse"
  | "disciplines"
  | "collections"
  | "ideas"
  | "culture";

export type MissionParagraph = {
  emphasis?: string;
  text: string;
};

export type MissionCard = {
  id: MissionCardId;
  eyebrow: string;
  title: string;
  body: string;
  pattern: MissionPattern;
};

export const missionSection = {
  id: "mission",
  eyebrow: "Mission Statement",
  paragraphs: [
    {
      emphasis: "Cortex",
      text: "is a global network of professionals accelerating the growth, adoption, and integration of blockchain technology into all facets of community life.",
    },
    {
      text: "We support every region and the unique needs and personas through expert education for every audience, and a full-slate of services including technical, security, research, advocacy, and incubation offerings integral to drive open innovation.",
    },
    {
      text: "Our mission is to lower the barriers to entry, cultivate a self-sustaining workforce, and to do so in a human-centric manner that further galvanizes both local and global communities.",
    },
  ] satisfies readonly MissionParagraph[],
  cards: [
    {
      id: "pulse",
      eyebrow: "01 / Pulse",
      title: "An open innovation hub for emerging technology.",
      body: "Cortex brings people together to explore how blockchain, AI, quantum systems, and other frontier tools can improve local and global communities.",
      pattern: "pulse-field",
    },
    {
      id: "disciplines",
      eyebrow: "02 / Disciplines",
      title: "Open to curious people and serious builders.",
      body: "We serve newcomers, students, teachers, economists, designers, developers, researchers, entrepreneurs, architects, founders, and anyone curious about what comes next.",
      pattern: "dot-orbits",
    },
    {
      id: "collections",
      eyebrow: "03 / Collections",
      title: "A structured path from onboarding to incubation.",
      body: "Cortex creates that path through education, events, networking, technical mentorship, professional services, and future physical spaces for hands-on collaboration.",
      pattern: "stepped-lattice",
    },
    {
      id: "ideas",
      eyebrow: "04 / Ideas",
      title: "Real projects that can become real businesses.",
      body: "The goal is a pipeline of market-ready products and resilient teams connected to Nitro and other Monad programs.",
      pattern: "radiating-segments",
    },
    {
      id: "culture",
      eyebrow: "05 / Culture",
      title: "A community-owned workforce with shared language.",
      body: "Members become the network. Cities become hubs. Events become the connections that turn curiosity into culture, adoption, and useful digital infrastructure.",
      pattern: "node-mesh",
    },
  ] satisfies readonly MissionCard[],
} as const satisfies {
  id: SectionContent["id"];
  eyebrow: SectionContent["eyebrow"];
  paragraphs: readonly MissionParagraph[];
  cards: readonly MissionCard[];
};
