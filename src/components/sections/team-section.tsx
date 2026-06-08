import Image from "next/image";
import { SOCIAL_GLYPHS } from "@/components/icons/social-glyphs";
import { teamSection, type TeamMember } from "@/lib/content/team";
import { splitTrailingAccent } from "@/lib/split-trailing-accent";

function requireXGlyph() {
  const glyph = SOCIAL_GLYPHS.x;
  if (!glyph) {
    throw new Error("TeamSection requires SOCIAL_GLYPHS.x");
  }
  return glyph;
}

const XGlyph = requireXGlyph();

function getXHref(handle: string) {
  return `https://x.com/${handle}`;
}

function teamMetricKey(memberId: string, index: number): string {
  return `${memberId}-metric-${index}`;
}

function TeamSocialLink({ member }: { member: TeamMember }) {
  return (
    <a
      className="team-social-link"
      href={getXHref(member.xHandle)}
      aria-label={`${member.name} on X`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <XGlyph className="team-social-icon" />
    </a>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="team-member" data-team-member data-team-member-id={member.id}>
      <Image
        className="team-member-photo"
        src={member.image.src}
        alt={member.image.alt}
        width={member.image.width ?? 150}
        height={member.image.height ?? 150}
        sizes="120px"
      />

      <div className="team-member-copy">
        <div className="team-member-name-row">
          <h3 className="team-member-name">{member.name}</h3>
          <TeamSocialLink member={member} />
        </div>

        <p className="team-member-role">{member.role}</p>
        <p className="team-member-bio">{member.bio}</p>
      </div>

      <ul className="team-member-metrics" aria-label={`${member.name} metrics`}>
        {member.metrics.map((metric, index) => (
          <li key={teamMetricKey(member.id, index)} className="team-member-metric">
            {metric.label}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function TeamSection() {
  const { text: teamTitle, accent: teamTitleAccent } = splitTrailingAccent(
    teamSection.title,
  );

  return (
    <section
      id={teamSection.id}
      className="team-section"
      aria-labelledby="team-heading"
      data-team-section
    >
      <div className="site-container">
        <hr className="team-section-divider" aria-hidden="true" />
      </div>
      <div className="site-container team-container">
        <header className="team-header" data-team-header>
          <p className="team-eyebrow">{teamSection.eyebrow}</p>
          <h2 id="team-heading" className="team-title">
            {teamTitle}
            {teamTitleAccent ? (
              <span aria-hidden="true">{teamTitleAccent}</span>
            ) : null}
          </h2>
        </header>

        <ul className="team-list" data-team-list aria-label="Team members">
          {teamSection.members.map((member) => (
            <li key={member.id}>
              <TeamMemberCard member={member} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
