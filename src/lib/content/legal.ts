export type LegalSection = {
  title: string;
  content?: string[];
  list?: { label?: string; text: string }[];
  subsections?: {
    title: string;
    items: { label?: string; text: string }[];
  }[];
};

export type LegalContent = {
  id: string;
  title: string;
  effectiveDate: string;
  lastUpdated?: string;
  intro: string;
  sections: LegalSection[];
  contactEmail: string;
};

export const privacyContent: LegalContent = {
  id: "privacy",
  title: "Privacy Policy",
  effectiveDate: "June 11, 2026",
  lastUpdated: "June 11, 2026",
  intro:
    'This Privacy Policy describes how our website (the "Site," "we," "us," or "our") collects, uses, and shares your personal information when you visit our Site, register for our educational programs, sign up for events, or utilize our tech services.',
  contactEmail: "cortexglobalservice@gmail.com",
  sections: [
    {
      title: "1. Information We May Collect",
      content: [
        "We may collect information to provide better services and educational experiences to our community. This includes:",
      ],
      subsections: [
        {
          title: "Information You Provide Voluntarily:",
          items: [
            {
              label: "Account & Registration Data",
              text: "Name, email address, username, and professional background when you register for courses, events, or workshops.",
            },
            {
              label: "Service Inquiries",
              text: "Technical details, project descriptions, or code snippets you submit when requesting free tech services or support.",
            },
            {
              label: "Communications",
              text: "Any information you provide when contacting us via email, support tickets, or contact forms.",
            },
          ],
        },
        {
          title: "Information Collected Automatically:",
          items: [
            {
              label: "Usage and Device Data",
              text: "IP addresses, browser types, operating systems, referring URLs, pages viewed, and the dates/times of your visits.",
            },
            {
              label: "Cookies and Tracking",
              text: "We use cookies and similar tracking technologies to analyze site traffic, remember your preferences, and improve your learning experience.",
            },
          ],
        },
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "We utilize the collected information for the following purposes:",
      ],
      list: [
        { text: "To deliver and manage our educational offerings." },
        {
          text: "To organize, coordinate, and host virtual or in-person events and workshops.",
        },
        {
          text: "To diagnose, troubleshoot, and fulfill requested technical services and consultations.",
        },
        {
          text: "To send you administrative updates, event reminders, and Cortex Updates.",
        },
        {
          text: "To monitor, secure, and improve the performance and functionality of our Site.",
        },
      ],
    },
    {
      title: "3. Sharing Your Information",
      content: [
        "We do not sell your personal information. We may only share your data under the following circumstances:",
      ],
      list: [
        {
          label: "Service Providers",
          text: "With trusted third-party vendors who assist us in operating our website, managing email delivery, hosting events, or processing data (e.g., cloud hosting, email platforms).",
        },
        {
          label: "Event Partners",
          text: "If an event or workshop is co-hosted with a third party, your registration data may be shared with that partner for event coordination purposes.",
        },
        {
          label: "Legal Compliance",
          text: "If required by law, subpoena, or government regulation, or to protect the rights, property, and safety of our platform and users.",
        },
      ],
    },
    {
      title: "4. Data Security",
      content: [
        "We implement industry-standard technical and organizational security measures to protect your data against unauthorized access, loss, or alteration. However, please note that no method of transmission over the internet is 100% secure.",
      ],
    },
    {
      title: "5. Your Rights and Choices",
      content: [
        "Depending on your location, you may have the following rights regarding your data:",
      ],
      list: [
        {
          text: "The right to access, update, or delete the personal information we hold about you.",
        },
        {
          text: "The right to object to or restrict certain types of data processing.",
        },
        {
          text: 'The right to opt out of promotional communications by clicking the "unsubscribe" link in our emails.',
        },
      ],
    },
    {
      title: "6. Changes to This Policy",
      content: [
        'We may update this Privacy Policy from time to time. We will notify you of any major changes by posting the new policy on this page with an updated "Effective Date."',
      ],
    },
  ],
};

export const termsContent: LegalContent = {
  id: "terms",
  title: "Terms of Use",
  effectiveDate: "June 11, 2026",
  intro:
    'Welcome to our website. By accessing or using our Site, educational materials, events, and technical services (collectively, the "Services"), you agree to be bound by these Terms of Use. If you do not agree, please do not use our Services.',
  contactEmail: "cortexglobalservice@gmail.com",
  sections: [
    {
      title: "1. Eligibility and Registration",
      list: [
        {
          text: "You must be at least 13 years old (or the minimum legal age in your jurisdiction) to use our Services.",
        },
        {
          text: "If you create an account, you agree to provide accurate, current, and complete information and to keep your account credentials secure. You are responsible for all activities that occur under your account.",
        },
      ],
    },
    {
      title: "2. Use of Educational and Tech Services",
      list: [
        {
          label: "License to Learn",
          text: 'We grant you a limited, non-exclusive, non-transferable, and revocable license to access our educational content, code repositories, resources, and event materials strictly for your personal, non-commercial learning and professional development.',
        },
        {
          label: "Tech Services Disclaimer",
          text: 'Any technical services, code reviews, architectural advice, or troubleshooting provided for free are offered "AS IS" without warranties of any kind. They are meant for informational and educational purposes and do not constitute formal enterprise binding agreements.',
        },
        {
          label: "Prohibited Conduct",
          text: "You agree not to misuse our Services, including but not limited to: disrupting our servers, scraping content, injecting malicious code, or using our technical advice/services for illegal activities.",
        },
      ],
    },
    {
      title: "3. Event Attendance and Conduct",
      list: [
        {
          text: "By registering for our events (virtual or in-person), you agree to interact respectfully with instructors, speakers, and fellow attendees.",
        },
        {
          text: "We reserve the right to deny entry or remove any participant from an event or workshop who exhibits disruptive, harassing, or inappropriate behavior.",
        },
        {
          text: "Events may be recorded. By participating, you acknowledge that your likeness, voice, or chat inputs might appear in post-event recordings used for educational archive purposes.",
        },
      ],
    },
    {
      title: "4. Intellectual Property",
      list: [
        {
          text: "All content on this Site, including text, graphics, logos, course materials, video lectures, and software, is the property of the website owners or its content creators and is protected by copyright and intellectual property laws.",
        },
        {
          text: "You may not reproduce, redistribute, sell, or exploit any portion of our materials without express written permission, unless the material is explicitly distributed under an open-source license (e.g., MIT, Creative Commons).",
        },
      ],
    },
    {
      title: "5. Limitation of Liability",
      list: [
        {
          text: "To the maximum extent permitted by law, we, our affiliates, and our contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or use, arising out of or in connection with your use of our educational materials, technical services, or event participation.",
        },
        {
          text: "Your utilization of any code, advice, or strategy provided by our tech services is entirely at your own risk.",
        },
      ],
    },
    {
      title: "6. Termination",
      content: [
        "We reserve the right to suspend or terminate your access to our Site, courses, or events at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to our community.",
      ],
    },
    {
      title: "7. Governing Law",
      content: [
        "These Terms of Use shall be governed by and construed in accordance with the laws of The United States without regard to its conflict of law principles.",
      ],
    },
  ],
};
