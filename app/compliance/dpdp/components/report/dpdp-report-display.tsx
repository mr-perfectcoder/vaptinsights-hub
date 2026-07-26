"use client";

import React, { useState } from "react";
import { ScanStatusResponse } from "@/hooks/query-hooks/dpdp.query";
import dynamic from "next/dynamic";

const DpdpReportOverview = dynamic(
  () => import("./dpdp-report-overview").then((m) => m.DpdpReportOverview),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-6 rounded-2xl bg-[#08192a]/50 border border-white/5">
        <div className="h-6 w-1/3 bg-slate-700/50 rounded" />
        <div className="h-24 bg-slate-800/40 rounded-xl" />
      </div>
    ),
  }
);

const DpdpReportCompliance = dynamic(
  () => import("./dpdp-report-compliance").then((m) => m.DpdpReportCompliance),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-6 rounded-2xl bg-[#08192a]/50 border border-white/5">
        <div className="h-6 w-1/4 bg-slate-700/50 rounded" />
        <div className="h-40 bg-slate-800/40 rounded-xl" />
      </div>
    ),
  }
);

const DpdpReportRemediation = dynamic(
  () => import("./dpdp-report-remediation").then((m) => m.DpdpReportRemediation),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-6 rounded-2xl bg-[#08192a]/50 border border-white/5">
        <div className="h-6 w-1/3 bg-slate-700/50 rounded" />
        <div className="h-32 bg-slate-800/40 rounded-xl" />
      </div>
    ),
  }
);

const DpdpReportArtifacts = dynamic(
  () => import("./dpdp-report-artifacts").then((m) => m.DpdpReportArtifacts),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-6 rounded-2xl bg-[#08192a]/50 border border-white/5">
        <div className="h-6 w-1/3 bg-slate-700/50 rounded" />
        <div className="h-48 bg-slate-800/40 rounded-xl" />
      </div>
    ),
  }
);

interface DpdpReportDisplayProps {
  scanRecord: ScanStatusResponse;
}

/* ─────────────────────────── helpers ─────────────────────────── */

const statusMeta = (s: string = "") => {
  const u = s.toUpperCase();
  if (u === "COMPLIANT" || u === "PASS" || u === "YES")
    return { label: "Compliant", color: "emerald", dot: "bg-emerald-400", ring: "border-emerald-500/25", bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "shadow-[0_0_18px_rgba(16,185,129,0.18)]" };
  if (u.includes("OBSERVATION"))
    return { label: "Observations", color: "amber", dot: "bg-amber-400", ring: "border-amber-500/25", bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-[0_0_18px_rgba(245,158,11,0.18)]" };
  if (u.includes("APPLICABLE") || u === "NA" || u === "N/A")
    return { label: "N/A", color: "slate", dot: "bg-slate-400", ring: "border-slate-500/20", bg: "bg-slate-500/10", text: "text-slate-400", glow: "" };
  if (u.includes("MANUAL") || u.includes("REVIEW"))
    return { label: "Manual Review", color: "sky", dot: "bg-sky-400", ring: "border-sky-500/25", bg: "bg-sky-500/10", text: "text-sky-400", glow: "shadow-[0_0_18px_rgba(56,189,248,0.18)]" };
  return { label: u.includes("NON") || u.includes("FAIL") ? "Non-Compliant" : (s || "Unknown"), color: "rose", dot: "bg-rose-400 animate-pulse", ring: "border-rose-500/25", bg: "bg-rose-500/10", text: "text-rose-400", glow: "shadow-[0_0_18px_rgba(244,63,94,0.18)]" };
};

function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  const parts = text.split(/`([^`]+)`/g);
  if (parts.length === 1) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const formatted = part
            .replace(/_/g, " ")
            .replace(/\b[a-z]/g, (c) => c.toUpperCase());
          return (
            <code
              key={index}
              className="mx-1 px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-mono text-xs font-medium inline-block"
            >
              {formatted}
            </code>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export function DpdpReportDisplay({ scanRecord }: DpdpReportDisplayProps) {
  const content = scanRecord.content || {};
  let rawReport = scanRecord.report || {};
  if (typeof rawReport === "string") {
    try {
      rawReport = JSON.parse(rawReport);
    } catch {
      rawReport = {};
    }
  }
  const report: any = rawReport || {};
  const summary = report.audit_summary || {};

  const [activeMainTab, setActiveMainTab] = useState<string>("overview");
  const [activeSection, setActiveSection] = useState<string>("");

  const formatSectionTitle = (key: string) =>
    key.replace(/^section_\d+_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* ── Status badge ── */
  const StatusBadge = ({ status, size = "sm" }: { status?: string; size?: "sm" | "md" | "lg" }) => {
    const m = statusMeta(status);
    const px = size === "lg" ? "px-4 py-1.5 text-sm" : size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-xs";
    return (
      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${px} rounded-full font-extrabold uppercase tracking-widest border ${m.bg} ${m.text} ${m.ring} ${m.glow}`}>
        <span className={`size-1.5 shrink-0 rounded-full ${m.dot}`} />
        <span className="whitespace-nowrap">{m.label}</span>
      </span>
    );
  };

  /* ── Section status resolver ── */
  const resolveSectionStatus = (check: any) => {
    if (check.compliance_status) return check.compliance_status;
    if (check.sub_sections && Array.isArray(check.sub_sections)) {
      let hasNonCompliant = false, hasObservations = false;
      for (const sub of check.sub_sections) {
        const s = sub.compliance_status?.toUpperCase() || "";
        if (s.includes("NON") || s.includes("NOT") || s.includes("FAIL")) hasNonCompliant = true;
        else if (s.includes("OBSERVATION")) hasObservations = true;
      }
      if (hasNonCompliant) return "NON_COMPLIANT";
      if (hasObservations) return "OBSERVATION";
      return "COMPLIANT";
    }
    return "COMPLIANT";
  };

  const TabIcon = ({ id, active }: { id: string; active: boolean }) => {
    const cls = active ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300";
    const icons: Record<string, React.ReactNode> = {
      overview: (
        <svg className={`size-4 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      compliance: (
        <svg className={`size-4 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      remediation: (
        <svg className={`size-4 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l5.654-4.654" />
        </svg>
      ),
      artifacts: (
        <svg className={`size-4 ${cls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    };
    return icons[id] ?? null;
  };

  const mainTabs = [
    { id: "overview", label: "Executive Overview" },
    { id: "compliance", label: "Compliance Checks" },
    { id: "remediation", label: "Remediation Plan" },
    { id: "artifacts", label: "Generated Drafts" },
  ];

  const priorityMeta = (p: string = "") => {
    if (p === "HIGH") return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", bar: "bg-rose-500", icon: "🔴" };
    if (p === "MEDIUM") return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", bar: "bg-amber-500", icon: "🟠" };
    return { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", bar: "bg-slate-500", icon: "🔵" };
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* ── Main tab nav ── */}
      <div className="flex flex-nowrap bg-[#07192a]/60 border border-white/5 backdrop-blur-xl rounded-2xl p-1.5 gap-1 overflow-x-auto scrollbar-none shadow-2xl">
        {mainTabs.map((tab) => {
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`group relative flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-[#0e3250] to-[#0a2540] text-cyan-300 border border-cyan-400/15 shadow-[0_2px_20px_rgba(6,182,212,0.15)]"
                  : "text-slate-500 border border-transparent hover:text-slate-200 hover:bg-white/4"
              }`}
            >
              <TabIcon id={tab.id} active={isActive} />
              <span>{tab.label}</span>
              {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />}
            </button>
          );
        })}
      </div>

      {/* ── Tab content area ── */}
      <div className="min-h-[500px]">
        {activeMainTab === "overview" && (
          <DpdpReportOverview summary={summary} content={content} StatusBadge={StatusBadge} />
        )}

        {activeMainTab === "compliance" && (
          <DpdpReportCompliance
            report={report}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            resolveSectionStatus={resolveSectionStatus}
            statusMeta={statusMeta}
            formatSectionTitle={formatSectionTitle}
            StatusBadge={StatusBadge}
            FormattedText={FormattedText}
          />
        )}

        {activeMainTab === "remediation" && (
          <DpdpReportRemediation
            report={report}
            priorityMeta={priorityMeta}
            FormattedText={FormattedText}
          />
        )}

        {activeMainTab === "artifacts" && (
          <DpdpReportArtifacts
            report={report}
            StatusBadge={StatusBadge}
            FormattedText={FormattedText}
          />
        )}
      </div>
    </div>
  );
}
