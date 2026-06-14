import Link from "next/link";
import { CortexButton } from "@/components/cortex-button";
import { siteLinks } from "@/lib/content/links";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-[90px]">
      <div className="flex flex-col items-center gap-12">
        <div className="flex items-center gap-6">
          <h1 className="border-r border-text-secondary pr-6 text-2xl font-semibold text-brand-cortex-orange">
            404
          </h1>
          <p className="text-sm text-text-secondary">
            This page could not be found.
          </p>
        </div>
        <CortexButton asChild animated={false}>
          <Link href={siteLinks.home.href}>Back home</Link>
        </CortexButton>
      </div>
    </div>
  );
}
