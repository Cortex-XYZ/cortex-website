import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
} from "@/lib/site";
import { missionSection } from "@/lib/content/mission";
import { servicesSection } from "@/lib/content/services";
import { teamSection } from "@/lib/content/team";
import { eventsSection } from "@/lib/content/events";
import { historySection } from "@/lib/content/history";
import { externalLinks } from "@/lib/content/links";
import { getUpcomingEvents } from "@/lib/events/upcoming";

function lines(...parts: string[]): string {
  return parts.join("\n");
}

function section(title: string, body: string): string {
  return `## ${title}\n\n${body}`;
}

function buildLlmsTxt(): string {
  const missionBody = missionSection.paragraphs
    .map((p) => (p.emphasis ? `${p.emphasis} ${p.text}` : p.text))
    .join("\n\n");

  const missionCards = missionSection.cards
    .map((c) => `- **${c.title}** ${c.body}`)
    .join("\n");

  const services = servicesSection.cards
    .map((s) => `- **${s.title}**: ${s.description}`)
    .join("\n");

  const team = teamSection.members
    .map((m) => `- **${m.name}** — ${m.role}. ${m.bio}`)
    .join("\n");

  const upcomingEvents = getUpcomingEvents(eventsSection.events);
  const eventsList =
    upcomingEvents.length > 0
      ? upcomingEvents
          .map(
            (e) =>
              `- **${e.title}** — ${e.dateLabel}, ${e.location.city}. ${e.description}${e.url ? ` [RSVP](${e.url})` : ""}`,
          )
          .join("\n")
      : "No upcoming events scheduled. Check back soon.";

  const milestones = historySection.milestones
    .map((m) => `- **${m.dateLabel}** — ${m.title}`)
    .join("\n");

  const socials = [
    `- [X](${externalLinks.cortexX.href})`,
    `- [GitHub](${externalLinks.cortexGitHub.href})`,
    `- [YouTube](${externalLinks.cortexYouTube.href})`,
    `- [Instagram](${externalLinks.cortexInstagram.href})`,
    `- [LinkedIn](${externalLinks.cortexLinkedIn.href})`,
    `- [TikTok](${externalLinks.cortexTikTok.href})`,
  ].join("\n");

  return lines(
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE}`,
    "",
    SITE_DESCRIPTION,
    "",
    `- Website: ${SITE_URL}`,
    `- Privacy policy: ${SITE_URL}/privacy`,
    `- Terms of use: ${SITE_URL}/terms`,
    "",
    section("Mission", `${missionBody}\n\n${missionCards}`),
    "",
    section("Services", services),
    "",
    section("Team", team),
    "",
    section("Upcoming Events", eventsList),
    "",
    section("History", `${historySection.scrollCallout}\n\n${milestones}`),
    "",
    section("Connect", socials),
    "",
  );
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
