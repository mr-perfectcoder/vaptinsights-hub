import type { Metadata } from "next";
import { DpdpHomepage } from "./components/homepage/dpdp-homepage";

export const metadata: Metadata = {
  title: "DPDP Technical Readiness Scanner | VAPT Insights",
  description:
    "Evaluate your website's technical safeguards, understand DPDP requirements, and improve your security posture with our free DPDP compliance scanner.",
  keywords: [
    "DPDP compliance",
    "DPDP technical readiness",
    "India data protection",
    "website security scanner",
    "cookie consent checker",
    "privacy policy scanner",
    "VAPT Insights",
  ],
  openGraph: {
    type: "website",
    title: "DPDP Technical Readiness Scanner | VAPT Insights",
    description:
      "Evaluate your website's technical safeguards, understand DPDP requirements, and improve your security posture with our free DPDP compliance scanner.",
    siteName: "VAPT Insights",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DPDP Technical Readiness Scanner by VAPT Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DPDP Technical Readiness Scanner | VAPT Insights",
    description:
      "Evaluate your website's technical safeguards, understand DPDP requirements, and improve your security posture.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DpdpCompliancePage() {
  return <DpdpHomepage />;
}
