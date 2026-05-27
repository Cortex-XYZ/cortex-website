import Link from "next/link";
import { CortexMark } from "@/components/logos/cortex-mark";
import { CortexWordmark } from "@/components/logos/cortex-wordmark";
import { socialIcons } from "@/components/icons/social";
import { FooterNewsletter } from "@/components/sections/footer-newsletter";
import { footerContent } from "@/lib/content/footer";

// Each headline sentence ends in an accent-colored period, cycling through the
// Cortex orange / Monad purple / Cortex amber brand marks as shown in Figma.
const PERIOD_ACCENTS = [
  "text-brand-cortex-orange",
  "text-brand-monad-purple",
  "text-brand-cortex-amber",
] as const;

function getTitleLines(title: string) {
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

export function FooterSection() {
  const titleLines = getTitleLines(footerContent.title);

  return (
    <footer
      id={footerContent.id}
      className="bg-bg-canvas text-text-primary"
      aria-labelledby="footer-heading"
    >
      <div className="site-container flex flex-col gap-16 py-16 sm:gap-20 sm:py-20 lg:gap-24 lg:py-24">
        {/* Top — headline + newsletter */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2
              id="footer-heading"
              className="font-mona text-hero-mobile font-light leading-none text-text-primary sm:text-hero lg:text-display"
            >
              {titleLines.map((line, i) => (
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

          <div className="flex lg:justify-end">
            <div className="w-full max-w-md">
              <FooterNewsletter />
            </div>
          </div>
        </div>

        {/* Middle — brand lockup + link columns */}
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

          <nav
            aria-label="Footer"
            className="grid grid-cols-3 gap-8 sm:gap-12 lg:justify-end"
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

        {/* Bottom — social icons + copyright */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-6">
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {footerContent.socialLinks.map((social) => {
              const channel = social.channel;
              if (!channel) return null;
              const Icon = socialIcons[channel];
              return (
                <li key={social.key}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="flex size-10 items-center justify-center rounded-full border border-border-strong/40 text-text-secondary transition-colors hover:border-action-primary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="font-open text-caption text-text-muted">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
