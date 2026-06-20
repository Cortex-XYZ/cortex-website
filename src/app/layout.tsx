import type { Metadata } from "next";
import { Mona_Sans, Open_Sans } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { HashScrollSync } from "@/components/hash-scroll-sync";
import { RouteLoadingShell } from "@/components/layout/route-loading-shell";
import { ScrollToTopButton } from "@/components/layout/scroll-to-top-button";
import { SiteHeader } from "@/components/layout/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SITE_HEADER_SCROLL_BOOTSTRAP_SCRIPT,
  SITE_HEADER_SCROLL_CRITICAL_CSS,
} from "@/lib/layout/site-header-scroll";
import {
  OG_IMAGE,
  OG_PAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_HANDLE,
} from "@/lib/site";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

// `optional` avoids the late font-swap repaint that made the hero subtitle's
// LCP land at font-arrival time; the preloaded font still wins on fast loads.
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "optional",
});

const openGraphTitle = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: OG_PAGE_URL,
    siteName: SITE_NAME,
    title: openGraphTitle,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${TWITTER_HANDLE}`,
    title: openGraphTitle,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

// HeaderUpcomingEvent filters by UTC date at render; hourly ISR keeps the promo fresh.
// Must be a literal — see EVENTS_DATE_REVALIDATE_SECONDS in @/lib/events/upcoming.
export const revalidate = 3600;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-header-scrolled="false"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${monaSans.variable} ${openSans.variable} dark h-full antialiased`}
    >
      <head>
        <style
          id="site-header-scroll-critical"
          dangerouslySetInnerHTML={{ __html: SITE_HEADER_SCROLL_CRITICAL_CSS }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: SITE_HEADER_SCROLL_BOOTSTRAP_SCRIPT,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <HashScrollSync />
          <SiteHeader />
          <ScrollToTopButton />
          <Suspense fallback={<RouteLoadingShell />}>{children}</Suspense>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
