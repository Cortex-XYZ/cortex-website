import type { ComponentProps } from "react";
import Link from "next/link";
import { CortexButton } from "@/components/cortex-button";
import { CortexMark } from "@/components/logos/cortex-mark";
import { CortexWordmark } from "@/components/logos/cortex-wordmark";
import type { ExternalLinkChannel } from "@/lib/content/links";
import { footerContent } from "@/lib/content/footer";

// --- Social glyphs -----------------------------------------------------------
// Single-path Simple Icons marks on a 24x24 grid, drawn in currentColor so the
// surrounding link controls tint and hover state. Declared at module scope so
// they are never recreated during render.
type GlyphProps = ComponentProps<"svg">;

function glyph(props: GlyphProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
    ...props,
  };
}

function XGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function InstagramGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function LinkedInGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SOCIAL_GLYPHS: Partial<
  Record<ExternalLinkChannel, (props: GlyphProps) => React.ReactElement>
> = {
  x: XGlyph,
  instagram: InstagramGlyph,
  tiktok: TikTokGlyph,
  linkedin: LinkedInGlyph,
  youtube: YouTubeGlyph,
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
    .map((sentence) =>
      sentence.endsWith(".")
        ? { text: sentence.slice(0, -1), period: true }
        : { text: sentence, period: false },
    );
}

export function SiteFooter() {
  const quoteLines = getQuoteLines(footerContent.title);

  return (
    <footer
      id={footerContent.id}
      className="bg-bg-canvas text-text-primary"
      aria-labelledby="site-footer-heading"
    >
      <div className="site-container flex flex-col gap-16 py-16 sm:gap-20 sm:py-20 lg:gap-24 lg:py-24">
        {/* CTA quote block + newsletter (UI only) */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2
              id="site-footer-heading"
              className="font-mona text-hero-mobile font-light leading-none text-text-primary sm:text-hero lg:text-display"
            >
              {quoteLines.map((line, i) => (
                <span key={i} className="block">
                  {line.text}
                  {line.period && (
                    <span
                      className={PERIOD_ACCENTS[i % PERIOD_ACCENTS.length]}
                      aria-hidden
                    >
                      .
                    </span>
                  )}
                </span>
              ))}
            </h2>
            {footerContent.description && (
              <p className="max-w-xl font-open text-body-sm text-text-muted sm:text-body">
                {footerContent.description}
              </p>
            )}
          </div>

          {/* Newsletter — input UI only, no submit behavior */}
          <div className="flex lg:justify-end">
            <div className="flex w-full max-w-md flex-col gap-6">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={footerContent.email.label}
                className="w-full border-0 border-b border-action-primary bg-transparent pb-3 font-open text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:border-action-primary-hover sm:text-body"
              />
              <CortexButton type="button" variant="primary" size="lg" className="w-fit">
                {footerContent.newsletterCta.label}
              </CortexButton>
            </div>
          </div>
        </div>

        {/* Brand lockup + tagline + link columns */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label="Cortex Global home"
              className="flex w-fit items-center gap-3"
            >
              <CortexMark className="h-10 w-auto text-brand-cortex-orange" />
              <CortexWordmark className="h-9 w-auto text-text-secondary" />
            </Link>
            <p className="max-w-xs font-open text-body-sm text-text-secondary sm:text-body">
              {footerContent.tagline}
            </p>
          </div>

          {/* About / Programs / Legal — single column on mobile, row from sm up */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12 lg:justify-end"
          >
            {footerContent.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-5">
                <h3 className="font-mona text-body-sm font-semibold text-brand-cortex-orange sm:text-body">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="font-open text-body-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Social links + contact + copyright */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-6">
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {footerContent.socialLinks.map((social) => {
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
                    className="flex size-10 items-center justify-center rounded-full border border-border-strong/40 text-text-secondary transition-colors hover:border-action-primary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
                  >
                    <Glyph className="size-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:gap-6 lg:text-right">
            <a
              href={footerContent.email.href}
              className="font-open text-caption text-text-secondary transition-colors hover:text-text-primary"
            >
              {footerContent.email.label}
            </a>
            <p className="font-open text-caption text-text-muted">
              {footerContent.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
