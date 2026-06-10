import type { Metadata } from "next";
import { Mona_Sans, Open_Sans } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cortex Global",
  description:
    "A global network of local hubs, education, events, services, and real projects around emerging technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${monaSans.variable} ${openSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <SiteHeader />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
