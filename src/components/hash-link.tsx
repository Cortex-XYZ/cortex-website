"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import {
  navigateToHash,
  parseHashHref,
  prepareForRouteHashNavigation,
} from "@/lib/hash-navigation";

type HashLinkProps = ComponentProps<typeof Link>;

function hrefToString(href: HashLinkProps["href"]): string {
  if (typeof href === "string") return href;

  if (typeof href === "object" && href !== null) {
    const pathname = "pathname" in href ? (href.pathname ?? "") : "";
    const hash = "hash" in href ? (href.hash ?? "") : "";
    return `${pathname}${hash}`;
  }

  return "";
}

export function HashLink({ href, onClick, scroll, ...props }: HashLinkProps) {
  const pathname = usePathname();
  const parsedHref = parseHashHref(hrefToString(href));

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const parsed = parsedHref;
    if (!parsed) return;

    const targetPath = parsed.pathname || "/";
    if (targetPath !== pathname) {
      if (targetPath === "/") {
        prepareForRouteHashNavigation();
      }
      return;
    }

    event.preventDefault();
    navigateToHash(parsed.hash);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      scroll={parsedHref ? false : scroll}
      {...props}
    />
  );
}
