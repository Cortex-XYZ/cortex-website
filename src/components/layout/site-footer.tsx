import type { ComponentProps } from "react";
import Link from "next/link";
import { CortexButton } from "@/components/cortex-button";
import { CortexMark } from "@/components/logos/cortex-mark";
import { CortexWordmark } from "@/components/logos/cortex-wordmark";
import type { ExternalLinkChannel } from "@/lib/content/links";
import { footerContent } from "@/lib/content/footer";
import { cn } from "@/lib/utils";

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

function XGlyph({ className, ...props }: GlyphProps) {
  // Exported from Figma at the full 42×42 button viewBox (padding baked in).
  // size-full takes priority over any size-N passed by the parent so the path
  // lands at its native figma coordinates.
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden
      className={cn(className, "size-full")}
      {...props}
    >
      <path
        d="M13.039 12.9902L19.2171 21.2759L13 28.0106H14.4L19.8415 22.1126L24.239 28.0106H29L22.4756 19.2602L28.261 12.9902H26.8634L21.8512 18.4211L17.8024 12.9902H13.039ZM15.0976 14.0226H17.2854L26.9439 26.9758H24.7561L15.0976 14.0226Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)} fill="none">
      <path
        d="M17.5 6.5H17.51M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM16 11.3701C16.1234 12.2023 15.9812 13.0523 15.5937 13.7991C15.2062 14.5459 14.5931 15.1515 13.8416 15.5297C13.0901 15.908 12.2384 16.0397 11.4077 15.906C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09402 12.5923C7.96035 11.7616 8.09202 10.91 8.47028 10.1584C8.84854 9.40691 9.45414 8.7938 10.2009 8.4063C10.9477 8.0188 11.7977 7.87665 12.63 8.00006C13.4789 8.12594 14.2648 8.52152 14.8716 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TikTokGlyph(props: GlyphProps) {
  // Figma export is 18×20; viewBox padded to "-1 0 20 20" so the path centers
  // horizontally and the existing size-N (square) className renders correctly.
  return (
    <svg {...glyph(props)} viewBox="-1 0 20 20" fill="none">
      <path
        d="M12.5604 0H9.18984V13.6232C9.18984 15.2464 7.89349 16.5797 6.28022 16.5797C4.66695 16.5797 3.37057 15.2464 3.37057 13.6232C3.37057 12.029 4.63814 10.7246 6.19381 10.6667V7.24639C2.7656 7.30433 0 10.1159 0 13.6232C0 17.1594 2.82321 20 6.30904 20C9.79481 20 12.618 17.1304 12.618 13.6232V6.63767C13.8856 7.56522 15.4412 8.11594 17.0833 8.14494V4.72464C14.5482 4.63768 12.5604 2.55072 12.5604 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)} fill="none">
      <path
        d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9H2V21H6V9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)} fill="none">
      <path
        d="M2.50001 17C1.80143 13.7033 1.80143 10.2967 2.50001 7C2.5918 6.66521 2.76914 6.36007 3.01461 6.11461C3.26008 5.86914 3.56522 5.69179 3.90001 5.6C9.26346 4.71146 14.7366 4.71146 20.1 5.6C20.4348 5.69179 20.7399 5.86914 20.9854 6.11461C21.2309 6.36007 21.4082 6.66521 21.5 7C22.1986 10.2967 22.1986 13.7033 21.5 17C21.4082 17.3348 21.2309 17.6399 20.9854 17.8854C20.7399 18.1309 20.4348 18.3082 20.1 18.4C14.7366 19.2887 9.26344 19.2887 3.90001 18.4C3.56522 18.3082 3.26008 18.1309 3.01461 17.8854C2.76914 17.6399 2.5918 17.3348 2.50001 17Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 15L15 12L10 9V15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubGlyph(props: GlyphProps) {
  // Stroke-based outline (figma export). `fill="none"` overrides the helper's
  // default fill, and `stroke="currentColor"` keeps the parent link's hover
  // tint working in place of figma's hardcoded #D9D9D9.
  return (
    <svg {...glyph(props)} fill="none">
      <path
        d="M9.00004 22V18C8.93004 17.38 8.98004 16.75 9.15004 16.15C9.32004 15.55 9.61004 14.99 10 14.5C7.00004 14.5 4.00004 12.5 4.00004 9C3.91851 7.75279 4.27191 6.51588 5.00004 5.5C4.70004 4.35 4.70004 3.15 5.00004 2C5.00004 2 6.00004 2 8.00004 3.5C10.64 3 13.36 3 16 3.5C18 2 19 2 19 2C19.28 3.15 19.28 4.35 19 5.5C19.73 6.52 20.08 7.75 20 9C20 12.5 17 14.5 14 14.5C14.78 15.4901 15.1392 16.7473 15 18V22M9.00004 18C4.49004 20 4 16 2 16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)} fill="none">
      <path
        d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RedditGlyph(props: GlyphProps) {
  return (
    <svg {...glyph(props)} fill="none">
      <path
        d="M14.4412 5.65922C14.6493 6.54141 15.4415 7.19859 16.3874 7.19859C17.4918 7.19859 18.3871 6.30328 18.3871 5.19891C18.3871 4.09453 17.4918 3.19922 16.3874 3.19922C15.4218 3.19922 14.6165 3.88359 14.429 4.79391C12.8118 4.96734 11.549 6.33891 11.549 8.00109C11.549 8.00484 11.549 8.00766 11.549 8.01141C9.79023 8.08547 8.18429 8.58609 6.90929 9.37641C6.43585 9.00984 5.84147 8.79141 5.19647 8.79141C3.64866 8.79141 2.39429 10.0458 2.39429 11.5936C2.39429 12.7167 3.05429 13.6842 4.00772 14.1314C4.10054 17.3845 7.64523 20.0011 12.0055 20.0011C16.3659 20.0011 19.9152 17.3817 20.0033 14.1258C20.9493 13.6758 21.6037 12.7111 21.6037 11.5945C21.6037 10.0467 20.3493 8.79234 18.8015 8.79234C18.1593 8.79234 17.5677 9.00891 17.0952 9.37266C15.809 8.57672 14.1852 8.07609 12.4087 8.00953C12.4087 8.00672 12.4087 8.00484 12.4087 8.00203C12.4087 6.81141 13.2937 5.82328 14.4412 5.66109V5.65922ZM6.79679 13.372C6.84366 12.3558 7.51866 11.5758 8.30335 11.5758C9.08804 11.5758 9.68804 12.3998 9.64116 13.4161C9.59429 14.4323 9.00835 14.8017 8.22272 14.8017C7.4371 14.8017 6.74991 14.3883 6.79679 13.372ZM15.7087 11.5758C16.4943 11.5758 17.1693 12.3558 17.2152 13.372C17.2621 14.3883 16.574 14.8017 15.7893 14.8017C15.0046 14.8017 14.4177 14.4333 14.3708 13.4161C14.324 12.3998 14.923 11.5758 15.7087 11.5758ZM14.7749 15.7233C14.9221 15.7383 15.0158 15.8911 14.9587 16.028C14.4758 17.182 13.3358 17.993 12.0055 17.993C10.6752 17.993 9.53616 17.182 9.05241 16.028C8.99522 15.8911 9.08897 15.7383 9.23616 15.7233C10.0987 15.6361 11.0315 15.5883 12.0055 15.5883C12.9796 15.5883 13.9115 15.6361 14.7749 15.7233Z"
        fill="currentColor"
      />
    </svg>
  );
}

const SOCIAL_GLYPHS: Partial<
  Record<ExternalLinkChannel, (props: GlyphProps) => React.ReactElement>
> = {
  x: XGlyph,
  github: GitHubGlyph,
  youtube: YouTubeGlyph,
  instagram: InstagramGlyph,
  linkedin: LinkedInGlyph,
  facebook: FacebookGlyph,
  reddit: RedditGlyph,
  tiktok: TikTokGlyph,
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
      className="flex min-h-[80svh] flex-col bg-bg-canvas text-text-primary"
      aria-labelledby="site-footer-heading"
    >
      <div className="site-container flex flex-1 flex-col justify-between gap-16 py-16 sm:gap-20 sm:py-20 lg:gap-10 lg:pt-14 lg:pb-8">
        {/*
          DOM order = mobile order (matches the approved mobile figma):
            1. headline + newsletter
            2. brand lockup + link columns
            3. bottom bar (social + copyright)
          Desktop swaps 1 and 2 via Tailwind `order-N`, so the brand band
          renders above the headline band on lg, per the desktop figma.
        */}

        {/* Headline + newsletter — mobile: top, desktop: middle */}
        <div className="order-1 grid gap-12 lg:order-2 lg:grid-cols-2 lg:gap-16 lg:items-end">
          <div className="flex flex-col gap-6">
            <h2
              id="site-footer-heading"
              className="font-mona text-hero-mobile font-light leading-none text-text-primary sm:text-hero lg:max-w-[37rem] lg:text-section-heading lg:font-extralight"
            >
              {quoteLines.map((line, i) => (
                <span key={i} className="block">
                  {line.text}
                  {line.period && (
                    <span
                      className={cn(
                        "font-medium",
                        PERIOD_ACCENTS[i % PERIOD_ACCENTS.length],
                      )}
                      aria-hidden
                    >
                      .
                    </span>
                  )}
                </span>
              ))}
            </h2>
            {footerContent.description && (
              <p className="max-w-xl font-open text-body-sm text-text-muted sm:text-body lg:max-w-[34rem] lg:text-[11px] lg:font-semibold lg:leading-[1.3]">
                {footerContent.description}
              </p>
            )}
          </div>

          {/* Newsletter — input UI only, no submit behavior.
              Mobile: input above button. Desktop: input and button inline. */}
          <div className="flex lg:justify-end">
            <div className="flex w-full max-w-md flex-col gap-6 lg:flex-row lg:items-end lg:gap-4">
              <div className="flex flex-1 flex-col">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={footerContent.email.label}
                  // Password managers (1Password, LastPass, Bitwarden, etc.)
                  // inject inline `style`, `data-*`, and form-fill attributes
                  // into email inputs before React hydrates, causing a benign
                  // hydration mismatch. The attributes are added by the
                  // extension at runtime — there is nothing to reconcile on
                  // the server side, so we suppress the warning here.
                  suppressHydrationWarning
                  className="w-full border-0 border-b border-action-primary bg-transparent pb-3 font-open text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:border-action-primary-hover sm:text-body lg:font-mona lg:text-[25px] lg:font-normal lg:placeholder:text-text-muted/40"
                />
              </div>
              <CortexButton
                type="button"
                variant="primary"
                size="default"
                className="w-fit shrink-0 text-text-inverse"
              >
                {footerContent.newsletterCta.label}
              </CortexButton>
            </div>
          </div>
        </div>

        {/* Brand lockup + link columns — mobile: middle, desktop: top */}
        <div className="order-2 grid gap-12 lg:order-1 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label="Cortex Global home"
              className="flex w-fit items-center gap-3"
            >
              <CortexMark className="h-10 w-auto text-brand-cortex-orange" />
              <CortexWordmark className="h-9 w-auto text-text-secondary" />
            </Link>
            <p className="max-w-xs whitespace-pre-line font-open text-body-sm text-text-secondary sm:text-body lg:font-mona lg:text-[14px] lg:font-normal lg:leading-[1.2] lg:uppercase">
              {footerContent.tagline}
            </p>
          </div>

          {/* About / Programs / Legal — 3-up at every width (per figma) */}
          <nav aria-label="Footer" className="grid grid-cols-3 gap-6 sm:gap-12">
            {footerContent.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-5">
                <h3 className="font-mona text-body-sm font-semibold text-brand-cortex-orange sm:text-body lg:text-[15px] lg:font-medium lg:uppercase">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-4">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="font-mona text-body-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
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

        {/* Bottom bar — social + copyright.
            Mobile: social above copyright, both centered, no divider.
            Desktop: hairline above, copyright left, social right. */}
        <div className="order-3 flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-6 lg:border-t lg:border-border-default lg:pt-12">
          <ul className="order-1 flex items-center justify-center gap-2 sm:gap-3 lg:order-2 lg:gap-4">
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
                    className="flex size-8 items-center justify-center rounded-full border border-border-default text-text-secondary transition-colors hover:border-action-primary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary sm:size-9 lg:size-[42px]"
                  >
                    <Glyph className="size-5 lg:size-6" />
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="order-2 font-mona text-caption text-text-muted lg:order-1 lg:text-text-secondary lg:uppercase">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
