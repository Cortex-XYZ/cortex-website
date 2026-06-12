"use client";

import { usePathname } from "next/navigation";
import { useOnMount } from "@/hooks/use-on-mount";
import { scrollToHashFromLocation } from "@/lib/hash-navigation";

function HashScrollOnNavigate() {
  useOnMount(() => {
    requestAnimationFrame(() => scrollToHashFromLocation());
  });

  return null;
}

export function HashScrollSync() {
  const pathname = usePathname();

  useOnMount(() => {
    const onHashChange = () => scrollToHashFromLocation();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });

  return <HashScrollOnNavigate key={pathname} />;
}
