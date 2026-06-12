"use client";

import { usePathname } from "next/navigation";
import { useOnMount } from "@/hooks/use-on-mount";
import {
  enableHashScrollSpy,
  scrollToHashFromLocation,
} from "@/lib/hash-navigation";

function runHashScrollAfterScrollTriggersReady(): void {
  // Match deferGsapSetup (2 rAF) so enter timelines exist before we scroll.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToHashFromLocation();
    });
  });
}

function HashScrollOnNavigate() {
  useOnMount(() => {
    runHashScrollAfterScrollTriggersReady();
  });

  return null;
}

export function HashScrollSync() {
  const pathname = usePathname();

  useOnMount(() => {
    const onHashChange = () => scrollToHashFromLocation();
    window.addEventListener("hashchange", onHashChange);
    const disableHashScrollSpy = enableHashScrollSpy();

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      disableHashScrollSpy();
    };
  });

  return <HashScrollOnNavigate key={pathname} />;
}
