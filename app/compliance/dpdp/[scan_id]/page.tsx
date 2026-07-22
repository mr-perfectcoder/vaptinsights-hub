import type { Metadata } from "next";
import { ScanPageClient } from "./scan-page-client";

export const metadata: Metadata = {
  title: "DPDP Compliance Audit Status | VAPT Insights",
  description: "Track and review website compliance metrics under the DPDP Act 2023.",
};

interface PageProps {
  params: Promise<{ scan_id: string }>;
}

export default async function DpdpScanPage({ params }: PageProps) {
  const { scan_id } = await params;
  return <ScanPageClient scanID={scan_id} />;
}
