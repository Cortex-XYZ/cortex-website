import type { SVGProps } from "react";

const CTA_ARROW_PATH = "M83.5 82.1581V0.5H0.5M83.5 0.5L0.5 82.1581";

export function CtaArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="84"
      height="83"
      viewBox="0 0 84 83"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="cta-arrow-base"
        d={CTA_ARROW_PATH}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="cta-arrow-signal"
        d={CTA_ARROW_PATH}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
