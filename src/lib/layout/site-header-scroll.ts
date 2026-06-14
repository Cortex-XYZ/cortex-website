export const SITE_HEADER_SCROLL_THRESHOLD = 20;

/** Read `--site-header-height` for ScrollTrigger pin offsets below the fixed header. */
export function getSiteHeaderHeightPx(): number {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue("--site-header-height").trim();

  if (raw.endsWith("rem")) {
    const rem = parseFloat(raw);
    const rootFontSize = parseFloat(getComputedStyle(root).fontSize);
    return rem * rootFontSize;
  }

  if (raw.endsWith("px")) {
    return parseFloat(raw);
  }

  return 90;
}

// html[data-header-scrolled] is the sole source of truth for scrolled header styling
// (critical CSS, bootstrap script, and post-hydration scroll sync all target it).
export const SITE_HEADER_SCROLL_CRITICAL_CSS = `html[data-header-scrolled="true"] .site-header-shell{border-bottom-color:rgba(255,255,255,0.03);background-color:#111111}`;

export function syncSiteHeaderScrollState(): boolean {
  const scrolled = window.scrollY > SITE_HEADER_SCROLL_THRESHOLD;
  const value = String(scrolled);

  document.documentElement.dataset.headerScrolled = value;

  return scrolled;
}

export function enableSiteHeaderScrollMotion(header: HTMLElement | null): void {
  if (header) {
    header.dataset.scrollMotionReady = "true";
  }
}

// Runs before paint and again after scroll restoration / bfcache restore.
export const SITE_HEADER_SCROLL_BOOTSTRAP_SCRIPT = `(function(){var t=${SITE_HEADER_SCROLL_THRESHOLD};function a(){document.documentElement.dataset.headerScrolled=String(window.scrollY>t);}a();document.addEventListener("DOMContentLoaded",a);window.addEventListener("pageshow",a);})();`;
