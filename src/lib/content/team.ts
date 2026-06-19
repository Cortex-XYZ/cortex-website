import type { ContentImage, SectionContent } from "./types";

export type TeamMetric = {
  label: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: ContentImage;
  xHandle: string;
  metrics: readonly TeamMetric[];
};

export const teamSection = {
  id: "team",
  eyebrow: "Team",
  title: "The people behind the network.",
  members: [
    {
      id: "jeff-paul",
      name: "Jeff Paul",
      role: "Education and talent development",
      bio: "Edupreneur with over 35 years in education, program building, and talent development. Multi-time founder who has worked across technical, research, product, BD, and operations.",
      image: {
        src: "/images/team/jeff.png",
        alt: "Jeff Paul",
        width: 150,
        height: 150,
      },
      xHandle: "japarjam",
      metrics: [
        { label: "300+ careers launched" },
        { label: "Over $5m in Grants Raised" },
      ],
    },
    {
      id: "jason-lee",
      name: "Jason Lee",
      role: "Systems and ecosystem building",
      bio: "Helped scale ETHDenver to 95,000+ builders and now builds new systems for coordination, trust, and human commitments.",
      image: {
        src: "/images/team/jason.png",
        alt: "Jason Lee",
        width: 150,
        height: 150,
      },
      xHandle: "jasonlee",
      metrics: [
        { label: "95,000+ builders" },
        { label: "$650M follow-on capital" },
      ],
    },
    {
      id: "jessica-huhnke",
      name: "Jessica Huhnke",
      role: "Infrastructure",
      bio: "Builds staking systems and blockchain infrastructure for 100+ institutional clients and more than $1B in volume.",
      image: {
        src: "/images/team/jessica.png",
        alt: "Jessica Huhnke",
        width: 150,
        height: 150,
      },
      xHandle: "web3_analyst",
      metrics: [
        { label: "100+ institutional clients" },
        { label: "$1B+ volume" },
      ],
    },
    {
      id: "jenny-liu",
      name: "Jenny Liu",
      role: "Product and interface",
      bio: "Brings full-stack engineering together with award-winning design to build digital products that are clear, reliable, and usable.",
      image: {
        src: "/images/team/jenny.png",
        alt: "Jenny Liu",
        width: 150,
        height: 150,
      },
      xHandle: "jennyliu07",
      metrics: [
        { label: "Award-winning design" },
        { label: "Product to production" },
      ],
    },
  ] satisfies readonly TeamMember[],
} as const satisfies SectionContent & {
  members: readonly TeamMember[];
};
