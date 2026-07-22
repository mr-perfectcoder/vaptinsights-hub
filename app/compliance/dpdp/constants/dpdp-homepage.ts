import type {
  DpdpArticle,
  DpdpFooterLink,
  DpdpTool,
} from "../types/dpdp-homepage";

export const dpdpCopy = {
  vaptInsightsUrl: "/",
  appName: "VAPT Insights × DPDP",
  appBrand: "VAPT Insights",
  appProduct: "DPDP",
  appDescription: "Technical Readiness Center",
  backToVaptInsights: "Back to VAPT Insights",
  searchAction: "Search",
  runSecurityScanAction: "Run Security Scan",
  navigation: [
    { label: "Scanner", href: "#tools" },
    { label: "Checklists", href: "#checklists" },
    { label: "Industry Guides", href: "#guides" },
    { label: "Resources", href: "#resources" },
    { label: "Blog", href: "#articles" },
    { label: "FAQ", href: "#faq" },
  ],
  hero: {
    eyebrow: "FREE TECHNICAL READINESS ASSESSMENT",
    title: "India's Free DPDP Technical Readiness Center",
    description:
      "Evaluate your website's technical safeguards, understand DPDP requirements, and improve your security posture.",
    fieldLabel: "Website URL",
    fieldPlaceholder: "https://example.com",
    scanAction: "Scan Website",
    proofPoints: ["No Login Required", "Free Forever", "Technical Assessment Only"],
  },
  tools: {
    eyebrow: "FREE TOOLS",
    title: "Start with the technical signals that matter.",
    description:
      "Fast, practical checks for the most visible parts of your website security and transparency.",
    action: "Try free",
  },
  guides: {
    eyebrow: "INDUSTRY GUIDES",
    title: "DPDP readiness for your kind of business.",
    description:
      "Find the practical security questions and common website risks that apply to your sector.",
    action: "Explore guide",
  },
  checklist: {
    eyebrow: "THE DPDP TECHNICAL CHECKLIST",
    title: "Turn regulation into a clear engineering checklist.",
    description:
      "Use a structured starting point to discuss public-facing safeguards, third-party scripts, cookies, and security evidence with your team.",
    action: "View DPDP checklist",
    items: [
      "Public privacy and cookie notices are discoverable",
      "Security headers provide a baseline of browser protection",
      "Third-party services are visible and reviewed",
      "Technical findings have an owner and follow-up process",
    ],
  },
  resources: {
    eyebrow: "RESOURCE CENTER",
    title: "Everything your team needs to get started.",
    description:
      "Clear, technical resources for better security conversations and faster DPDP readiness.",
    items: ["DPDP Checklist", "Security Controls", "Templates", "Downloads", "FAQs"],
  },
  articles: {
    eyebrow: "LATEST ARTICLES",
    title: "Learn the technical side of DPDP.",
    viewAllAction: "View all articles",
    readAction: "Read article",
  },
  platformCta: {
    eyebrow: "NEXT STEP",
    title: "Ready for a complete security assessment?",
    description:
      "Move from a public technical readiness check to continuous application security testing with VAPT Insights.",
    action: "Open VAPT Insights Security Scanner",
  },
  footer: {
    disclaimer:
      "© 2026 VAPT Insights. DPDP Technical Readiness Center provides technical education and is not legal advice.",
  },
} as const;

export const dpdpFooterLinks: DpdpFooterLink[] = [
  { label: "Features", href: "/#features", isExternal: true },
  { label: "SBOM", href: "/#sbom", isExternal: true },
  { label: "Blog", href: "/blog", isExternal: true },
  { label: "Docs", href: "/docs", isExternal: true, target: "_blank" },
  { label: "Privacy", href: "/privacy", isExternal: true },
  { label: "Terms", href: "/terms", isExternal: true },
];

export const dpdpTools: DpdpTool[] = [
  {
    title: "DPDP Technical Readiness Scanner",
    description:
      "Get a quick view of the technical safeguards visible on your website.",
    icon: "scan",
    accentClassName: "bg-cyan-400",
  },
  {
    title: "Privacy Policy Checker",
    description:
      "Review whether your privacy policy is easy to find and technically accessible.",
    icon: "document",
    accentClassName: "bg-violet-400",
  },
  {
    title: "Cookie Security Checker",
    description:
      "Check cookie flags and browser-level controls that protect visitor sessions.",
    icon: "cookie",
    accentClassName: "bg-amber-400",
  },
  {
    title: "Website Transparency Checker",
    description:
      "Identify common public signals that help users understand your data practices.",
    icon: "eye",
    accentClassName: "bg-emerald-400",
  },
  {
    title: "Third-party Script Detector",
    description:
      "Discover external scripts loading on your site and their security implications.",
    icon: "code",
    accentClassName: "bg-rose-400",
  },
];

export const dpdpIndustries = [
  "Startups",
  "FinTech",
  "SaaS",
  "Healthcare",
  "E-commerce",
  "EdTech",
] as const;

export const dpdpArticles: DpdpArticle[] = [
  {
    category: "STARTUPS",
    title: "DPDP for Startups: a practical technical starting point",
    readTime: "6 min read",
  },
  {
    category: "FINTECH",
    title: "Technical safeguards that matter for FinTech teams",
    readTime: "8 min read",
  },
  {
    category: "SECURITY",
    title: "DPDP technical safeguards, explained for engineering",
    readTime: "7 min read",
  },
  {
    category: "GUIDE",
    title: "DPDP vs GDPR: what your application security team should know",
    readTime: "9 min read",
  },
];
