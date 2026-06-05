import { Fragment, type CSSProperties } from "react";

import { cn } from "@/lib/utils";
import {
  historySection,
  type HistoryMilestone,
} from "@/lib/content/history";

// 1-based row index in the desktop grid where the scroll callout aligns.
// Anchored to the "regional activation" row and bottom-aligned with a
// negative margin equal to the row gap (-6rem), so the callout's last line
// lands exactly at the Q3 2026 row's top — i.e. on the Q3 2026 label line.
const CALLOUT_ROW =
  historySection.milestones.findIndex(
    (milestone) => milestone.id === "regional-activation",
  ) + 1;

// Cortex/Label/Black — shared figma label style (13 px Mona Sans 900 with
// 0.41em letter-spacing). Apply `leading-none` for single-line labels and
// `leading-tight` for titles that may wrap to two lines.
const LABEL_CLASSES =
  "font-mona text-label font-black uppercase tracking-[0.41em]";

// Mobile body type per figma: Open Sans 400 14 / 20, #7C7C7C.
const MOBILE_BODY_CLASSES =
  "font-open text-body-xs leading-5 text-text-muted";

function MilestoneBody({ milestone }: { milestone: HistoryMilestone }) {
  if (milestone.entries) {
    return (
      <div className={`space-y-3 ${MOBILE_BODY_CLASSES}`}>
        {milestone.entries.map((entry) => (
          <p key={entry.label}>
            <span className="font-semibold text-brand-cortex-orange">
              {entry.label} /
            </span>{" "}
            {entry.text}
          </p>
        ))}
      </div>
    );
  }
  if (milestone.body) {
    return <p className={MOBILE_BODY_CLASSES}>{milestone.body}</p>;
  }
  return null;
}

/**
 * Mobile callout — renders the scroll callout paragraph with the literal
 * "Cortex" mention highlighted in cortex-orange, per the figma mobile spec.
 */
function MobileCalloutText() {
  const parts = historySection.scrollCallout.split("Cortex");
  return (
    <p className="font-mona text-body-lg leading-[1.4] text-text-muted">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="font-semibold text-brand-cortex-orange">
              Cortex
            </span>
          )}
        </Fragment>
      ))}
    </p>
  );
}

export function HistorySection() {
  return (
    <section
      id={historySection.id}
      aria-labelledby="history-heading"
      className="bg-bg-canvas text-text-primary"
    >
      <h2 id="history-heading" className="sr-only">
        {historySection.title}
      </h2>

      {/*
        ========== MOBILE LAYOUT (< lg) ==========
        Single column with dots on the left and a continuous greyish rail
        threading through them. Each milestone groups date + title + body in
        one column to the right of its dot. The Q3 2026 milestone (last item)
        renders as a hollow ring to mark it as the upcoming, not-yet-active
        node. Scroll callout sits below the timeline at full width with
        "Cortex" highlighted in cortex-orange. Padding 48 / 20 px, gap 32 px.
      */}
      <div className="site-container py-12 lg:hidden">
        <p
          aria-hidden
          className={`${LABEL_CLASSES} leading-none text-brand-cortex-orange`}
        >
          {historySection.title.toUpperCase()}
        </p>

        {/*
          Each row carries its own line inside the timeline-line column
          (dot + flex-1 line) and ends at its content's body. The `gap-8`
          between rows is empty space — no line through it — so the line
          terminates at each row's body bottom and the next dot appears
          after a 32 px clear gap, matching the figma mobile reference.
          Last row omits the line so the rail ends at the Q3 2026 dot.
        */}
        <ol className="mt-8 flex flex-col gap-8">
          {historySection.milestones.map((milestone, i) => {
            const isLast = i === historySection.milestones.length - 1;
            return (
              <li
                key={milestone.id}
                className="flex items-start gap-4 self-stretch"
              >
                {/*
                  Timeline-line column — 10 px wide, dot on top, gradient
                  line below filling the remaining row height (`flex-1`).
                  `self-stretch` lets the column take the row's full height
                  so the line's bottom hugs the content column's bottom edge
                  (which already includes the 40 px figma pb on the content
                  side). The last row's line is suppressed.
                */}
                <div className="flex w-2.5 flex-col items-center self-stretch">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2.5 shrink-0 rounded-full",
                      isLast
                        ? "border-[1.5px] border-text-muted bg-transparent"
                        : "bg-action-primary",
                    )}
                  />
                  {!isLast && (
                    /*
                      Inline SVG would inherit its viewBox's 1:1353 aspect
                      ratio as a min-content size in flexbox, blowing the
                      line height past the body into empty space. Using a
                      CSS gradient span instead — same `carbon → white at
                      5 %` stops via `--gradient-history-connector-stops`,
                      but no intrinsic-size trap, so `flex-1` shrinks to
                      exactly the row's remaining height.
                    */
                    <span
                      aria-hidden
                      className="w-0.5 flex-1 bg-[linear-gradient(180deg,var(--gradient-history-connector-stops))]"
                    />
                  )}
                </div>
                {/*
                  Content column — date / title / body stacked with 6 px gap
                  and no bottom padding. The line ends at the body's bottom;
                  the 32 px gap between this row and the next sits outside
                  the column so it's clear of the line.
                */}
                <div className="flex flex-1 flex-col gap-1.5">
                  <p className="font-mona text-[11px] font-semibold uppercase leading-4 tracking-[2px] text-brand-cortex-orange">
                    {milestone.dateLabel}
                  </p>
                  <h3 className="font-mona text-body-xs font-bold uppercase leading-5 tracking-[1px] text-text-secondary">
                    {milestone.title}
                  </h3>
                  <MilestoneBody milestone={milestone} />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8">
          <MobileCalloutText />
        </div>
      </div>

      {/* ========== DESKTOP LAYOUT (lg+) ========== */}
      <div className="hidden site-container lg:block lg:py-32">
        <div className="lg:relative lg:isolate lg:grid lg:grid-cols-[22rem_10rem_minmax(0,32rem)] lg:items-start lg:justify-center lg:gap-x-12 lg:gap-y-20">
          {/*
            Display heading — bold orange "HIST" / "ORY" stacked, vertically
            centered in row 1 to match figma placement.
          */}
          <p
            aria-hidden
            className={`${LABEL_CLASSES} leading-none text-brand-cortex-orange lg:col-start-1 lg:row-start-1 lg:self-center`}
          >
            <span className="block">
              {historySection.title.slice(0, 4).toUpperCase()}
            </span>
            <span className="block">
              {historySection.title.slice(4).toUpperCase()}
            </span>
          </p>

          {/*
            Vertical rail — inline SVG mirroring the figma export (path +
            linearGradient). `preserveAspectRatio="none"` lets the 1353-unit
            viewBox stretch to the actual grid container height at runtime
            while keeping the 1 px horizontal stroke crisp. Anchored to col
            2's right edge (= 35 rem from the grid container's left); `-z-10`
            keeps it behind the dots (contained by the grid's `lg:isolate`).
          */}
          <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1 1353"
            preserveAspectRatio="none"
            fill="none"
            className="hidden lg:absolute lg:top-0 lg:bottom-0 lg:left-[35rem] lg:-z-10 lg:block lg:h-full lg:w-px lg:-translate-x-1/2"
          >
            <path
              d="M0.5 0V1353"
              stroke="url(#history-rail-gradient)"
            />
            <defs>
              <linearGradient
                id="history-rail-gradient"
                x1="1"
                y1="0"
                x2="1"
                y2="1308.18"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--brand-cortex-carbon)" />
                <stop
                  offset="0.956731"
                  stopColor="white"
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Milestones */}
          {historySection.milestones.map((milestone, i) => (
            <Fragment key={milestone.id}>
              <div
                className="hidden lg:flex lg:col-start-2 lg:items-center lg:justify-end lg:gap-3 lg:[grid-row-start:var(--row)]"
                style={{ "--row": String(i + 1) } as CSSProperties}
              >
                <p
                  className={`${LABEL_CLASSES} whitespace-nowrap leading-none text-brand-cortex-orange`}
                >
                  {milestone.dateLabel}
                </p>
                {/*
                  Milestone dot — 22 px disc filled with the history dot
                  gradient and ringed by a 5 px carbon stroke. The -mr offset
                  centers the 22 px dot on the 1 px rail at col-2's right.
                */}
                <span
                  aria-hidden
                  className="size-5.5 shrink-0 rounded-full border-[5px] border-brand-cortex-carbon bg-[linear-gradient(180deg,var(--gradient-history-dot-stops))] lg:-mr-[10.5px]"
                />
              </div>

              <div
                className="hidden lg:block lg:col-start-3 lg:[grid-row-start:var(--row)]"
                style={{ "--row": String(i + 1) } as CSSProperties}
              >
                <h3
                  className={`${LABEL_CLASSES} leading-tight text-text-primary`}
                >
                  {milestone.title}
                </h3>
                <div className="mt-5 space-y-3 font-open text-body-sm leading-relaxed text-text-secondary">
                  {milestone.entries
                    ? milestone.entries.map((entry) => (
                        <p key={entry.label}>
                          <span className="font-semibold text-brand-cortex-orange">
                            {entry.label} /
                          </span>{" "}
                          {entry.text}
                        </p>
                      ))
                    : milestone.body && <p>{milestone.body}</p>}
                </div>
              </div>
            </Fragment>
          ))}

          {/*
            Scroll callout — col 1 on desktop, anchored to regional-activation
            row but bottom-aligned with `-mb-24` extending into the gap-y-20
            below, so the last paragraph line lands near the Q3 2026 line.
            Layout is a vertical stack: orange dot on top, paragraph below.
          */}
          <aside
            className="hidden lg:flex lg:flex-col lg:items-start lg:gap-7 lg:col-start-1 lg:-mb-24 lg:self-end lg:[grid-row-start:var(--row)]"
            style={{ "--row": String(CALLOUT_ROW) } as CSSProperties}
          >
            <span
              aria-hidden
              className="size-5.5 shrink-0 rounded-full border-[5px] border-brand-cortex-carbon bg-[linear-gradient(180deg,var(--gradient-history-dot-stops))]"
            />
            <p className="font-mona text-body-lg leading-[1.4] text-text-muted">
              {historySection.scrollCallout}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
