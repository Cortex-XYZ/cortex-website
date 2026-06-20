import { HashLink } from "@/components/hash-link";
import { HomeLink } from "@/components/home-link";
import { CortexMark } from "@/components/logos/cortex-mark";
import { CortexWordmark } from "@/components/logos/cortex-wordmark";
import { SOCIAL_GLYPHS } from "@/components/icons/social-glyphs";
import NewsletterForm from "@/components/layout/newsletter-form";
import { footerContent } from "@/lib/content/footer";
import type { ExternalLinkChannel } from "@/lib/content/links";
import { splitTrailingAccent } from "@/lib/split-trailing-accent";

// --- Social ordering ---------------------------------------------------------
// Display order of the social links in the footer bottom bar.
const SOCIAL_CHANNEL_ORDER: Partial<Record<ExternalLinkChannel, number>> = {
  x: 0,
  github: 1,
  youtube: 2,
  instagram: 3,
  linkedin: 4,
  tiktok: 5,
};

// --- Headline accents --------------------------------------------------------
// Each sentence in the CTA quote ends in an accent-colored period, cycling
// through the Cortex orange / Monad purple / Cortex amber brand marks.
const PERIOD_ACCENTS = [
  "text-brand-cortex-orange",
  "text-brand-monad-purple",
  "text-brand-cortex-amber",
] as const;

function getQuoteLines(title: string) {
  return title
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => {
      const { text, accent } = splitTrailingAccent(sentence);
      return { text, period: accent !== null };
    });
}

function getTaglineLines(tagline: string) {
  return tagline
    .split(/(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const QUOTE_LINES = getQuoteLines(footerContent.title);
const TAGLINE_LINES = getTaglineLines(footerContent.tagline);
const SOCIAL_LINKS = [...footerContent.socialLinks].sort(
  (a, b) =>
    (a.channel ? (SOCIAL_CHANNEL_ORDER[a.channel] ?? 99) : 99) -
    (b.channel ? (SOCIAL_CHANNEL_ORDER[b.channel] ?? 99) : 99),
);

export function SiteFooter() {
  return (
    <footer
      id={footerContent.id}
      className="site-footer"
      aria-labelledby="site-footer-heading"
    >
      <div className="site-container site-footer-container">
        {/* Headline + newsletter — mobile: top, desktop: middle */}
        <div className="site-footer-cta">
          <div className="site-footer-copy">
            <h2 id="site-footer-heading" className="site-footer-heading">
              {QUOTE_LINES.map((line, i) => (
                <span key={i} className="block">
                  {line.text}
                  {line.period && (
                    <span
                      className={`site-footer-period ${PERIOD_ACCENTS[i % PERIOD_ACCENTS.length]}`}
                      aria-hidden
                    >
                      .
                    </span>
                  )}
                </span>
              ))}
            </h2>
            {footerContent.description && (
              <p className="site-footer-description">
                {footerContent.description}
              </p>
            )}
          </div>

          <div className="site-footer-newsletter-region">
            <NewsletterForm
              emailInputId={footerContent.emailInputId}
              placeholder={footerContent.email.label}
              submitLabel={footerContent.newsletterCta.label}
            />
          </div>
        </div>

        <div className="site-footer-body">
          {/* Brand lockup + link columns — mobile: middle, desktop: top */}
          <div className="site-footer-brand-nav">
            <div className="site-footer-brand">
              <HomeLink
                href="/"
                aria-label="Cortex Global home"
                className="site-footer-home-link"
              >
                <CortexMark className="site-footer-mark" />
                <CortexWordmark className="site-footer-wordmark" />
              </HomeLink>
              <p className="site-footer-tagline">
                {TAGLINE_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            {/* About / Services / Legal — 2-up on mobile, 3-up from sm*/}
            <nav aria-label="Footer" className="site-footer-nav">
              {footerContent.columns.map((column) => (
                <div key={column.title} className="site-footer-column">
                  <h3 className="site-footer-column-title">{column.title}</h3>
                  <ul className="site-footer-link-list">
                    {column.links.map((link) => (
                      <li key={`${column.title}-${link.href}-${link.label}`}>
                        <HashLink href={link.href} className="site-footer-nav-link">
                          {link.label}
                        </HashLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom bar — social + copyright.
              Mobile: social above copyright, both centered, no divider.
              Desktop: hairline above, copyright left, social right. */}
          <div className="site-footer-bottom">
            <ul className="site-footer-social-list">
              {SOCIAL_LINKS.map((social) => {
                const channel = social.channel;
                if (!channel) return null;
                const Glyph = SOCIAL_GLYPHS[channel];
                if (!Glyph) return null;
                return (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="site-footer-social-link"
                    >
                      <Glyph className="size-full" />
                    </a>
                  </li>
                );
              })}
            </ul>

            <p className="site-footer-copyright">{footerContent.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
