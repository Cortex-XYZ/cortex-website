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

const MILESTONE_BODY_CLASSES =
  "font-open text-body-sm leading-relaxed text-text-secondary";

function MilestoneBody({ milestone }: { milestone: HistoryMilestone }) {
  if (milestone.entries) {
    return (
      <div className={`space-y-3 ${MILESTONE_BODY_CLASSES}`}>
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
    return <p className={MILESTONE_BODY_CLASSES}>{milestone.body}</p>;
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

        <ol className="mt-8 flex flex-col gap-8">
          {historySection.milestones.map((milestone, i) => {
            const isLast = i === historySection.milestones.length - 1;
            return (
              <li
                key={milestone.id}
                className="relative isolate flex items-start gap-3"
              >
                {/*
                  Per-dot rail segment connecting this dot to the next dot.
                  top-4 starts at this dot's bottom (mt-2 + size-2 = 16 px);
                  -bottom-10 extends 40 px past this li's bottom = gap-8 (32)
                  + next dot's mt-2 (8) = next dot's top. Suppressed on the
                  last item so the line terminates at Q3 2026.
                */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-4 -bottom-10 left-1 -z-10 w-px bg-[linear-gradient(180deg,var(--gradient-history-connector-stops))]"
                  />
                )}
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 size-2 shrink-0 rounded-full",
                    isLast
                      ? "border border-text-muted bg-bg-canvas"
                      : "bg-action-primary",
                  )}
                />
                <div className="flex-1 space-y-3">
                  <p
                    className={`${LABEL_CLASSES} leading-none text-brand-cortex-orange`}
                  >
                    {milestone.dateLabel}
                  </p>
                  <h3
                    className={`${LABEL_CLASSES} leading-tight text-text-primary`}
                  >
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
            Vertical rail — single absolute-positioned 1 px line anchored to
            col 2's right edge (= 35 rem from the grid container's left).
            `-z-10` keeps it behind the dots; `lg:isolate` on the grid
            container contains the negative z-index.
          */}
          <div
            aria-hidden
            className="hidden bg-[linear-gradient(180deg,var(--gradient-history-connector-stops))] lg:absolute lg:top-0 lg:bottom-0 lg:left-[35rem] lg:-z-10 lg:block lg:w-px lg:-translate-x-1/2"
          />

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
