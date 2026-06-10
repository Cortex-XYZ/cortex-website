import {
  historySection,
  type HistoryMilestoneBody,
} from "@/lib/content/history";

const SCROLL_CALLOUT_ACCENT = "Cortex";
const [scrollCalloutBefore, scrollCalloutAfter] =
  historySection.scrollCallout.split(SCROLL_CALLOUT_ACCENT);

function historyParagraphKey(paragraph: HistoryMilestoneBody): string {
  return typeof paragraph === "string"
    ? `text:${paragraph.slice(0, 48)}`
    : `accent:${paragraph.accent}`;
}

function HistorySummary() {
  return (
    <div className="history-summary" data-history-summary>
      <span className="history-summary-dot" aria-hidden="true" />
      <p>
        {scrollCalloutBefore}
        <strong>{SCROLL_CALLOUT_ACCENT}</strong>
        {scrollCalloutAfter}
      </p>
    </div>
  );
}

export function HistorySection() {
  return (
    <section
      id={historySection.id}
      className="history-section"
      aria-labelledby="history-heading"
      data-history-section
    >
      <div className="site-container history-container">
        <h2 id="history-heading" className="history-eyebrow">
          {historySection.title}
        </h2>

        <div className="history-timeline">
          <span
            className="history-timeline-line"
            aria-hidden="true"
            data-history-line
          />
          <ol
            className="history-timeline-list"
            aria-label="Cortex history timeline"
          >
            {historySection.milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="history-milestone"
                data-history-milestone
                data-history-milestone-id={milestone.id}
              >
                <span className="history-milestone-date">
                  {milestone.dateLabel}
                </span>
                <span className="history-milestone-axis" aria-hidden="true">
                  <span className="history-milestone-dot" data-history-dot />
                  <span className="history-milestone-stem" />
                </span>
                <div className="history-milestone-copy">
                  <h3 className="history-milestone-title">{milestone.title}</h3>
                  <div className="history-milestone-body">
                    {milestone.body.map((paragraph) => (
                      <p key={historyParagraphKey(paragraph)}>
                        {typeof paragraph === "string" ? (
                          paragraph
                        ) : (
                          <>
                            <strong>{paragraph.accent}</strong>
                            {paragraph.text}
                          </>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <HistorySummary />
      </div>
    </section>
  );
}
