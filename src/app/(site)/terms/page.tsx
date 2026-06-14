import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { termsContent } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: termsContent.title,
  description: `Read the ${termsContent.title} for Cortex Global`,
};

export default function TermsOfUsePage() {
  return (
    <main className="legal-page">
      <div className="site-container">
        <div className="legal-page-inner">
          <div className="legal-page-header">
            <Link href="/" className="legal-page-back-link">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>

            <h1 className="legal-page-title">{termsContent.title}</h1>

            <div className="legal-page-meta">
              <div className="legal-page-meta-item">
                <span className="legal-page-meta-label">Effective Date</span>
                <span className="legal-page-meta-value">
                  {termsContent.effectiveDate}
                </span>
              </div>
              {termsContent.lastUpdated && (
                <div className="legal-page-meta-item">
                  <span className="legal-page-meta-label">Last Updated</span>
                  <span className="legal-page-meta-value">
                    {termsContent.lastUpdated}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="legal-page-body">
            <p>{termsContent.intro}</p>

            {termsContent.sections.map((section, index) => (
              <section key={index} className="legal-page-section">
                <h2 className="legal-page-section-title">{section.title}</h2>

                {section.content?.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}

                {section.list && (
                  <ul className="legal-page-list">
                    {section.list.map((item, iIndex) => (
                      <li key={iIndex}>
                        {item.label && <strong>{item.label}: </strong>}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections?.map((sub, sIndex) => (
                  <div key={sIndex} className="legal-page-subsection">
                    <h3 className="legal-page-subsection-title">{sub.title}</h3>
                    <ul className="legal-page-list">
                      {sub.items.map((item, iIndex) => (
                        <li key={iIndex}>
                          {item.label && <strong>{item.label}: </strong>}
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}

            <section className="legal-page-section">
              <h2 className="legal-page-section-title">
                {termsContent.sections.length + 1}. Contact Us
              </h2>
              <p>
                For questions regarding these {termsContent.title}, please reach
                out to:{" "}
                <a
                  href={`mailto:${termsContent.contactEmail}`}
                  className="legal-page-link"
                >
                  {termsContent.contactEmail}
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
