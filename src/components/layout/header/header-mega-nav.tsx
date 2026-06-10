"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MegaNavColumn } from "@/lib/content/nav";
import { cn } from "@/lib/utils";

type HeaderMegaNavProps = {
  label: string;
  columns: MegaNavColumn[];
};

export function HeaderMegaNav({ label, columns }: HeaderMegaNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const onClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex cursor-pointer items-center gap-1 text-nav text-text-secondary transition-colors hover:text-text-primary"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "mega-nav-popover",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        role="menu"
      >
        <div className="mega-nav-indicator" />
        <div className="flex">
          {columns.map((column, columnIndex) => (
            <div
              key={column.heading}
              className={cn(
                "mega-nav-column",
                columnIndex > 0 && "mega-nav-column-attached",
              )}
            >
              <p className="mega-nav-heading">{column.heading}</p>
              <div className="flex flex-col">
                {column.links.map((link, linkIndex) => (
                  <div key={`${link.href}-${link.label}`}>
                    {linkIndex > 0 && <div className="mega-nav-separator" />}
                    <Link
                      href={link.href}
                      role="menuitem"
                      onClick={() => setIsOpen(false)}
                      className="mega-nav-link"
                    >
                      <span className="mega-nav-link-label">{link.label}</span>
                      <span className="mega-nav-link-description">
                        {link.description}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
