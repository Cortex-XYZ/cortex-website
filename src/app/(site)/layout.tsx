import { SiteFooter } from "@/components/layout/site-footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
