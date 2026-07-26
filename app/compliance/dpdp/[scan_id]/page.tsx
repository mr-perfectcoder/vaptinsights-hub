import type { Metadata } from "next";
import { Suspense } from "react";
import { ScanPageClient } from "./scan-page-client";

export const metadata: Metadata = {
  title: "DPDP Compliance Audit Status | VAPT Insights",
  description: "Track and review website compliance metrics under the DPDP Act 2023.",
};

interface PageProps {
  params: Promise<{ scan_id: string }>;
}

async function ScanContent({ params }: PageProps) {
  const { scan_id } = await params;
  return <ScanPageClient scanID={scan_id} />;
}

export default function DpdpScanPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050e18] flex items-center justify-center p-8">
          <div className="animate-pulse space-y-4 text-center">
            <div className="size-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-400">Loading audit status...</p>
          </div>
        </div>
      }
    >
      <ScanContent params={params} />
    </Suspense>
  );
}
