import type { ComponentProps, ReactElement } from "react";
import type { ExternalLinkChannel } from "@/lib/content/links";

// Social glyphs — exact Figma-exported paths redrawn in currentColor so the
// consuming link wrapper can own border, hover, and focus states.
export type GlyphProps = ComponentProps<"svg">;

function XGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 42 42" fill="none" aria-hidden {...props}>
      <path
        d="M13.039 12.9902L19.2171 21.2759L13 28.0106H14.4L19.8415 22.1126L24.239 28.0106H29L22.4756 19.2602L28.261 12.9902H26.8634L21.8512 18.4211L17.8024 12.9902H13.039ZM15.0976 14.0226H17.2854L26.9439 26.9758H24.7561L15.0976 14.0226Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GitHubGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 42 42" fill="none" aria-hidden {...props}>
      <path
        d="M18 31V27C17.93 26.38 17.98 25.75 18.15 25.15C18.32 24.55 18.61 23.99 19 23.5C16 23.5 13 21.5 13 18C12.9185 16.7528 13.2719 15.5159 14 14.5C13.7 13.35 13.7 12.15 14 11C14 11 15 11 17 12.5C19.64 12 22.36 12 25 12.5C27 11 28 11 28 11C28.28 12.15 28.28 13.35 28 14.5C28.73 15.52 29.08 16.75 29 18C29 21.5 26 23.5 23 23.5C23.78 24.4901 24.1392 25.7473 24 27V31M18 27C13.49 29 13 25 11 25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 42 42" fill="none" aria-hidden {...props}>
      <path
        d="M26.5 15.5H26.51M16 11H26C28.7614 11 31 13.2386 31 16V26C31 28.7614 28.7614 31 26 31H16C13.2386 31 11 28.7614 11 26V16C11 13.2386 13.2386 11 16 11ZM25 20.3701C25.1234 21.2023 24.9812 22.0523 24.5937 22.7991C24.2062 23.5459 23.5931 24.1515 22.8416 24.5297C22.0901 24.908 21.2384 25.0397 20.4077 24.906C19.5771 24.7723 18.8097 24.3801 18.2148 23.7852C17.6199 23.1903 17.2277 22.4229 17.094 21.5923C16.9604 20.7616 17.092 19.91 17.4703 19.1584C17.8485 18.4069 18.4541 17.7938 19.2009 17.4063C19.9477 17.0188 20.7977 16.8766 21.63 17.0001C22.4789 17.1259 23.2648 17.5215 23.8716 18.1284C24.4785 18.7352 24.8741 19.5211 25 20.3701Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TikTokGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 42 42" fill="none" aria-hidden {...props}>
      <path
        d="M25.2272 11H21.8566V24.6232C21.8566 26.2464 20.5602 27.5797 18.947 27.5797C17.3337 27.5797 16.0373 26.2464 16.0373 24.6232C16.0373 23.029 17.3049 21.7246 18.8606 21.6667V18.2464C15.4323 18.3043 12.6667 21.1159 12.6667 24.6232C12.6667 28.1594 15.49 31 18.9758 31C22.4616 31 25.2848 28.1304 25.2848 24.6232V17.6377C26.5524 18.5652 28.108 19.1159 29.7501 19.1449V15.7246C27.215 15.6377 25.2272 13.5507 25.2272 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 42 42" fill="none" aria-hidden {...props}>
      <path
        d="M25 17C26.5913 17 28.1174 17.6321 29.2426 18.7574C30.3679 19.8826 31 21.4087 31 23V30H27V23C27 22.4696 26.7893 21.9609 26.4142 21.5858C26.0391 21.2107 25.5304 21 25 21C24.4696 21 23.9609 21.2107 23.5858 21.5858C23.2107 21.9609 23 22.4696 23 23V30H19V23C19 21.4087 19.6321 19.8826 20.7574 18.7574C21.8826 17.6321 23.4087 17 25 17Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 18H11V30H15V18Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 15C14.1046 15 15 14.1046 15 13C15 11.8954 14.1046 11 13 11C11.8954 11 11 11.8954 11 13C11 14.1046 11.8954 15 13 15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 42 42" fill="none" aria-hidden {...props}>
      <path
        d="M11.5 26C10.8014 22.7033 10.8014 19.2967 11.5 16C11.5918 15.6652 11.7691 15.3601 12.0146 15.1146C12.2601 14.8691 12.5652 14.6918 12.9 14.6C18.2635 13.7115 23.7366 13.7115 29.1 14.6C29.4348 14.6918 29.7399 14.8691 29.9854 15.1146C30.2309 15.3601 30.4082 15.6652 30.5 16C31.1986 19.2967 31.1986 22.7033 30.5 26C30.4082 26.3348 30.2309 26.6399 29.9854 26.8854C29.7399 27.1309 29.4348 27.3082 29.1 27.4C23.7366 28.2887 18.2634 28.2887 12.9 27.4C12.5652 27.3082 12.2601 27.1309 12.0146 26.8854C11.7691 26.6399 11.5918 26.3348 11.5 26Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 24L24 21L19 18V24Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const SOCIAL_GLYPHS: Partial<
  Record<ExternalLinkChannel, (props: GlyphProps) => ReactElement>
> = {
  x: XGlyph,
  github: GitHubGlyph,
  instagram: InstagramGlyph,
  tiktok: TikTokGlyph,
  linkedin: LinkedInGlyph,
  youtube: YouTubeGlyph,
};
