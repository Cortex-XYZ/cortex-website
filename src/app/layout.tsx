import type { Metadata } from "next";
import { Mona_Sans, Open_Sans } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { HashScrollSync } from "@/components/hash-scroll-sync";
import { RouteLoadingShell } from "@/components/layout/route-loading-shell";
import { ScrollToTopButton } from "@/components/layout/scroll-to-top-button";
import { SiteHeader } from "@/components/layout/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  PLAUSIBLE_PROXY_EVENT_PATH,
  PLAUSIBLE_PROXY_SCRIPT_PATH,
} from "@/lib/observability/plausible";
import {
  SITE_HEADER_SCROLL_BOOTSTRAP_SCRIPT,
  SITE_HEADER_SCROLL_CRITICAL_CSS,
} from "@/lib/layout/site-header-scroll";
import "./globals.css";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cortex Global",
  description:
    "A global network of local hubs, education, events, services, and real projects around emerging technology.",
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
        {plausibleDomain && (
          <Script
            defer
            data-api={PLAUSIBLE_PROXY_EVENT_PATH}
            data-domain={plausibleDomain}
            src={PLAUSIBLE_PROXY_SCRIPT_PATH}
            strategy="afterInteractive"
          />
        )}
        <TooltipProvider>
          <HashScrollSync />
          <SiteHeader />
          <ScrollToTopButton />
          <Suspense fallback={<RouteLoadingShell />}>{children}</Suspense>
        </TooltipProvider>
      </body>
    </html>
  );
}
