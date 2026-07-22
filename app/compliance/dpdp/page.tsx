import type { Metadata } from "next";
import { DpdpHomepage } from "./components/dpdp-homepage";

export const metadata: Metadata = {
  title: "Free DPDP Technical Readiness Center | VAPT Insights",
  description:
    "Evaluate your website's technical safeguards and improve your DPDP readiness with free security tools and practical guides.",
};

export default function DpdpCompliancePage() {
  return <DpdpHomepage />;
}
