import { FieldHelpContent } from "../components/common/dpdp-info-modal";

export const DPDP_FIELD_HELP: Record<string, FieldHelpContent> = {
  privacyPolicy: {
    title: "Privacy Policy URL",
    section: "Section 01 — Web Assets",
    whyNeeded: "The DPDPA 2023 mandates clear, accessible notice detailing personal data collected, processing purposes, user rights, and contact details of the Data Protection Officer or Grievance Officer.",
    dpdpReference: "Sec. 5(1) & Sec. 6 — Notice & Consent requirements",
    example: "https://example.com/privacy-policy",
    impactIfMissing: "High Risk — Missing a public Privacy Policy Notice triggers immediate non-compliance penalties under Section 5 of DPDPA 2023."
  },
  termsOfService: {
    title: "Terms of Service URL",
    section: "Section 01 — Web Assets",
    whyNeeded: "Establishes legal contracts between the Data Fiduciary and users, governing service usage, acceptable use, liability, and dispute mechanisms required for enforceable consent.",
    dpdpReference: "Sec. 6(1) — Legitimate Basis & Terms of Contract",
    example: "https://example.com/terms-of-service",
    impactIfMissing: "Medium Risk — Absence of clear Terms weakens legal enforceability of consent and user obligation boundaries."
  },
  sitemap: {
    title: "Sitemap URL",
    section: "Section 01 — Web Assets",
    whyNeeded: "Allows automated compliance crawlers to discover all public landing pages, subdomains, and data intake forms across your web application.",
    dpdpReference: "Sec. 8 — Technical Auditing & Asset Discovery",
    example: "https://example.com/sitemap.xml",
    impactIfMissing: "Low Risk — Without a sitemap, deep web crawling may miss unlinked data collection pages."
  },
  trustSecurity: {
    title: "Security / Trust Center URL",
    section: "Section 01 — Web Assets",
    whyNeeded: "Demonstrates reasonable security safeguards implemented to protect personal data in your custody, including encryption, access controls, and SOC2/ISO certifications.",
    dpdpReference: "Sec. 8(5) — Mandatory Security Safeguards",
    example: "https://example.com/security",
    impactIfMissing: "Moderate Risk — Required for Significant Data Fiduciaries (SDF) to substantiate technical security compliance."
  },
  disclaimer: {
    title: "Disclaimer URL",
    section: "Section 01 — Web Assets",
    whyNeeded: "Defines limitation of liability, accuracy of informational content, and statutory warnings for platform end-users.",
    dpdpReference: "Sec. 6 — Notice Transparency & Legal Disclosures",
    example: "https://example.com/disclaimer",
    impactIfMissing: "Low Risk — Protects against user claims regarding platform reliance and automated advisory outputs."
  },
  appType: {
    title: "Application Type",
    section: "Section 02 — Data Scope",
    whyNeeded: "Categorizes your digital application (SaaS, Mobile, E-Commerce, etc.) to tailor compliance audit rules, cookie policies, and data flow assessments.",
    dpdpReference: "Sec. 8 — Technical Safeguards Scoping",
    example: "SaaS Application, Mobile App (iOS/Android)",
    impactIfMissing: "Scoping Gap — Incorrect app type can trigger irrelevant compliance checks or miss platform-specific rules (e.g. mobile permissions)."
  },
  dataRetention: {
    title: "Data Retention Period",
    section: "Section 02 — Data Scope",
    whyNeeded: "DPDPA 2023 imposes a strict data erasure duty once the specified purpose for data collection is satisfied or consent is withdrawn.",
    dpdpReference: "Sec. 8(7) & Sec. 8(8) — Purpose Completion & Data Erasure Duty",
    example: "12 Months (1 Year), 6 Months",
    impactIfMissing: "High Risk — Retaining personal data beyond purpose fulfillment violates statutory erasure mandates."
  },
  appDescription: {
    title: "Application Description",
    section: "Section 02 — Data Scope",
    whyNeeded: "Provides contextual background on your platform's core workflow, enabling AI auditors to evaluate whether personal data requested aligns with 'specified purpose'.",
    dpdpReference: "Sec. 4 & Sec. 5(1)(a) — Purpose Specification & Data Minimization",
    example: "B2B SaaS platform offering compliance management and security audit workflows for legal teams.",
    impactIfMissing: "Audit Accuracy — Without a workflow description, AI models cannot evaluate data necessity or minimization compliance."
  },
  processesChildrenData: {
    title: "Processes Children's Data",
    section: "Section 02 — Data Scope",
    whyNeeded: "Strict safeguards apply when processing data of individuals under 18, requiring verifiable parental consent and prohibiting tracking or targeted advertising.",
    dpdpReference: "Sec. 9(1), 9(2) & 9(3) — Obligations on Processing Children's Data",
    example: "Enabled (Checked) if platform allows registration of minors",
    impactIfMissing: "Critical Penalty — Non-compliance with Section 9 carries maximum statutory fines under DPDPA 2023 Schedule 1."
  },
  processesSensitiveData: {
    title: "Processes Sensitive Personal Data",
    section: "Section 02 — Data Scope",
    whyNeeded: "Health, financial, biometric, or government ID data require heightened encryption, stricter access controls, and mandatory DPIA evaluation.",
    dpdpReference: "Sec. 8(5) & Sec. 10 — Security Safeguards & DPIA Thresholds",
    example: "Enabled if storing Aadhaar, credit cards, or health records",
    impactIfMissing: "High Risk — Triggers mandatory DPIA audit if sensitive data categories are processed."
  },
  hasLoginOrUserManagement: {
    title: "Has User Accounts / Login System",
    section: "Section 02 — Data Scope",
    whyNeeded: "Authentication systems store user credentials and profile data, requiring consent logs, password hashing, and user rights management portals.",
    dpdpReference: "Sec. 6(3) & Sec. 11 — Rights of Data Principal & Consent Log Management",
    example: "Enabled for web apps with sign-in / registration functionality",
    impactIfMissing: "Audit Defect — Login & Registration pages must be scanned for consent checkboxes and notice links."
  },
  loginUrl: {
    title: "Login URL",
    section: "Section 02 — Data Scope",
    whyNeeded: "Allows automated audit crawlers to verify whether login forms present data privacy notices, remember-me cookies, and secure HTTPS login endpoints.",
    dpdpReference: "Sec. 5 & Sec. 8(5) — Authentication Security & Notice Availability",
    example: "https://app.example.com/login",
    impactIfMissing: "Crawler Bypass — Login page privacy notice compliance cannot be verified."
  },
  registrationUrl: {
    title: "Registration URL",
    section: "Section 02 — Data Scope",
    whyNeeded: "The sign-up page is the primary point of first-time consent capture. Crawlers verify un-checked consent boxes, privacy policy links, and age validation.",
    dpdpReference: "Sec. 6(1) — Valid & Informed First-Time Consent",
    example: "https://app.example.com/register",
    impactIfMissing: "High Audit Defect — Registration consent capture mechanism cannot be validated without the URL."
  },
  dpiaStatus: {
    title: "DPIA Assessment Status",
    section: "Section 03 — Governance",
    whyNeeded: "A Data Protection Impact Assessment (DPIA) evaluates potential privacy risks, data breach exposure, and risk mitigation safeguards associated with high-volume or sensitive data processing.",
    dpdpReference: "Sec. 10(1)(a) — Mandatory DPIA for Significant Data Fiduciaries",
    example: "Conducted & Documented",
    impactIfMissing: "High Compliance Finding — Significant Data Fiduciaries (SDFs) and high-risk applications must maintain active DPIA documentation.",
    optionsBreakdown: [
      {
        label: "Conducted & Documented",
        whenToChoose: "Completed DPIA Audit",
        details: "Choose this if your organization has formally completed a DPIA, identified privacy risks, documented mitigation controls, and maintains a signed assessment report."
      },
      {
        label: "Currently In Progress",
        whenToChoose: "Active Audit / Draft Phase",
        details: "Choose this if a DPIA risk assessment is currently underway, being reviewed by legal/security teams, or in the process of final documentation."
      },
      {
        label: "Not Conducted",
        whenToChoose: "No DPIA Performed Yet",
        details: "Choose this if you process personal data but have not yet performed a formal privacy impact risk assessment. This helps identify baseline DPIA compliance gaps."
      },
      {
        label: "Not Applicable",
        whenToChoose: "Low-Risk / Static Sites",
        details: "Choose this only if your application does not collect personal data, processes zero sensitive records, or is completely exempt from Significant Data Fiduciary (SDF) provisions."
      }
    ]
  },
  consentManagerType: {
    title: "Consent Manager Setup",
    section: "Section 03 — Governance",
    whyNeeded: "DPDPA 2023 recognizes registered Consent Managers to enable Data Principals to give, manage, review, or withdraw consent through an accessible, interoperable framework.",
    dpdpReference: "Sec. 6(7), 6(8) & 6(9) — Registered Consent Managers & Consent Withdrawal",
    example: "Custom CMP, Registered DPDP Consent Manager",
    impactIfMissing: "Moderate Risk — Lack of an accessible consent review or withdrawal mechanism violates Section 6(4).",
    optionsBreakdown: [
      {
        label: "No Consent Manager / Standard Banner",
        whenToChoose: "Basic Cookie / Notice Banner",
        details: "Choose this if your application uses a simple pop-up cookie banner or inline consent checkbox without a dedicated portal for users to view or withdraw past consent."
      },
      {
        label: "Custom Consent Platform (CMP)",
        whenToChoose: "In-House / Third-Party Preference Center",
        details: "Choose this if you built a custom user settings page or use a commercial CMP (e.g. OneTrust, Cookiebot) allowing users to manage cookie preferences and data consent."
      },
      {
        label: "Registered DPDP Consent Manager",
        whenToChoose: "Official DPDPA Registered Manager",
        details: "Choose this if your system integrates with an officially registered Consent Manager entity licensed under Section 6(7) of the DPDPA 2023."
      }
    ]
  },
  dpaContracts: {
    title: "DPA Contracts Executed",
    section: "Section 03 — Governance",
    whyNeeded: "Data Fiduciaries must engage Data Processors only under a valid legal contract containing data protection obligations.",
    dpdpReference: "Sec. 8(2) — Processing under Valid Legal Contract",
    example: "Enabled if cloud providers (AWS, GCP) and vendors sign DPAs",
    impactIfMissing: "High Legal Exposure — Fiduciaries remain liable for data processor breaches if no DPA exists."
  },
  incidentResponsePlan: {
    title: "Breach Incident Response Plan",
    section: "Section 03 — Governance",
    whyNeeded: "In the event of a personal data breach, Data Fiduciaries are statutorily required to notify the Data Protection Board and affected users without delay.",
    dpdpReference: "Sec. 8(6) — Mandatory Data Breach Notification",
    example: "Enabled if documented breach notification SOP is active",
    impactIfMissing: "Critical Penalty — Failure to report personal data breaches carries heavy statutory fines under DPDPA Schedule 1."
  },
  grievanceOfficer: {
    title: "Grievance Redressal Officer",
    section: "Section 03 — Governance",
    whyNeeded: "Every Data Fiduciary must publish contact details of a Grievance Officer to address Data Principal complaints within mandated timelines.",
    dpdpReference: "Sec. 8(9) & Sec. 13 — Grievance Redressal Mechanism",
    example: "Enabled with published contact (e.g. dpo@example.com)",
    impactIfMissing: "Statutory Violation — Non-publication of Grievance Officer details directly breaches Section 13."
  }
};
