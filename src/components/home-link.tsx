"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { navigateToHome } from "@/lib/hash-navigation";

type HomeLinkProps = ComponentProps<typeof Link>;

export function HomeLink({ href = "/", onClick, ...props }: HomeLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (pathname !== "/") return;

    event.preventDefault();
    navigateToHome();
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
