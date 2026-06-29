"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TextAlignJustify } from "lucide-react";

const MobileNav = dynamic(
  () =>
    import("@/components/layout/mobile-nav").then((module) => ({
      default: module.MobileNav,
    })),
  { ssr: false },
);

let mobileNavPreload: Promise<unknown> | undefined;

function preloadMobileNav() {
  mobileNavPreload ??= import("@/components/layout/mobile-nav");
  void mobileNavPreload;
}

export function SiteHeaderMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  return (
    <>
      <button
        className="text-text-primary xl:hidden"
        onPointerEnter={preloadMobileNav}
        onFocus={preloadMobileNav}
        onPointerDown={preloadMobileNav}
        onClick={() => {
          setIsMounted(true);
          setIsOpen(true);
        }}
        aria-label="Open menu"
      >
        <TextAlignJustify className="-mt-1 size-7" />
      </button>

      {isMounted && (
        <MobileNav open={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
