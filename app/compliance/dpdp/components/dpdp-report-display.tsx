"use client";

import React, { useState } from "react";
import { ScanStatusResponse } from "@/hooks/query-hooks/dpdp.query";

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

export function DpdpReportDisplay({ scanRecord }: DpdpReportDisplayProps) {
  const content = scanRecord.content || {};
  let rawReport = scanRecord.report || {};
  if (typeof rawReport === "string") {
    const repairAndParse = (input: string): object | null => {
      let s = input.trim();
      // Strip markdown fences
      if (s.startsWith("```")) {
        s = s.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      }

      // First try direct parse
      try { return JSON.parse(s); } catch { /* continue to repair */ }

      // Truncated JSON repair:
      // 1. Find the last complete key-value pair by looking for the last valid
      //    closing bracket/brace or quoted string that isn't mid-escape
      // 2. Strip any trailing broken string value
      // 3. Close all open brackets/braces

      // Remove any trailing partial string value (handles truncation mid-string with bad escapes)
      // Find last successfully closed structure: look backward for last `]` or `}` or `"` that completes a value
      let lastSafeIdx = s.length;
      
      // Track string/escape state from the start to find where truncation broke things
      let inStr = false;
      let safeEnd = 0;
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (inStr) {
          if (ch === '\\') { i++; continue; } // skip escaped char
          if (ch === '"') { inStr = false; safeEnd = i + 1; }
        } else {
          if (ch === '"') { inStr = true; }
          else if (ch === '{' || ch === '[' || ch === ':' || ch === ',') { safeEnd = i + 1; }
          else if (ch === '}' || ch === ']') { safeEnd = i + 1; }
        }
      }

      // If we ended inside a string, truncate back to before the opening quote of the broken value
      if (inStr) {
        // Find the opening quote of the broken string
        let depth = 0;
        for (let i = safeEnd - 1; i >= 0; i--) {
          if (s[i] === '"') {
            // Check this is the opening quote (not escaped)
            let backslashes = 0;
            let j = i - 1;
            while (j >= 0 && s[j] === '\\') { backslashes++; j--; }
            if (backslashes % 2 === 0) {
              // This is an unescaped quote — the start of the broken string
              lastSafeIdx = i;
              break;
            }
          }
        }
        s = s.substring(0, lastSafeIdx);
      }

      // Clean trailing punctuation
      s = s.replace(/[,:\s]+$/, "");

      // If last char is `"` and the preceding token is `:`, we have a dangling key — remove it
      if (s.endsWith('"')) {
        const colonMatch = s.match(/,\s*"[^"]*"\s*$/);
        if (colonMatch) {
          s = s.substring(0, s.length - colonMatch[0].length);
        }
      }
      s = s.replace(/[,:\s]+$/, "");

      // Close unclosed brackets/braces
      const stack: string[] = [];
      let inString = false;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (inString) {
          if (c === '\\') { i++; continue; }
          if (c === '"') inString = false;
        } else {
          if (c === '"') inString = true;
          else if (c === '{') stack.push('}');
          else if (c === '[') stack.push(']');
          else if (c === '}' || c === ']') { if (stack.length) stack.pop(); }
        }
      }

      // Close in reverse
      while (stack.length) s += stack.pop();

      try { return JSON.parse(s); } catch { /* final failure */ }
      return null;
    };

    const parsed = repairAndParse(rawReport as string);
    if (parsed) rawReport = parsed;
  }
  const report = (typeof rawReport === "object" && rawReport !== null) ? { ...rawReport } : {};

  // Auto-normalize if AI nested top-level keys inside compliance_checks
  if (report.compliance_checks && typeof report.compliance_checks === "object") {
    const cc = { ...report.compliance_checks };
    const rootKeys = ["generated_artifacts", "remediation_plan", "appendix", "disclaimer"];
    for (const k of rootKeys) {
      if (cc[k] && !report[k]) {
        report[k] = cc[k];
      }
      delete cc[k];
    }
    report.compliance_checks = cc;
  }

  const summary = report.audit_summary || {};

  const [activeMainTab, setActiveMainTab] = useState<string>("overview");
  const [activeSection, setActiveSection] = useState<string>("");
  const [activeArtifactTab, setActiveArtifactTab] = useState<string>("incident_response_playbook");

  const formatSectionTitle = (key: string) =>
    key.replace(/^section_\d+_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* ── Status badge ── */
  const StatusBadge = ({ status, size = "sm" }: { status?: string; size?: "sm" | "md" | "lg" }) => {
    const m = statusMeta(status);
    const px = size === "lg" ? "px-4 py-1.5 text-sm" : size === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-xs";
    return (
      <span className={`inline-flex items-center gap-1.5 ${px} rounded-full font-extrabold uppercase tracking-widest border ${m.bg} ${m.text} ${m.ring} ${m.glow}`}>
        <span className={`size-1.5 shrink-0 rounded-full ${m.dot}`} />
        {m.label}
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
      if (hasObservations) return "COMPLIANT_WITH_OBSERVATIONS";
      return "COMPLIANT";
    }
    return "UNKNOWN";
  };

  /* ── Tab icon ── */
  const TabIcon = ({ id, active }: { id: string; active: boolean }) => {
    const cls = `size-4 transition-colors ${active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`;
    const icons: Record<string, React.ReactElement> = {
      overview: (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      compliance: (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      remediation: (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2H9m3 9h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      artifacts: (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

  /* ── Priority badge ── */
  const priorityMeta = (p: string = "") => {
    if (p === "HIGH") return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", bar: "bg-rose-500", icon: "🔴" };
    if (p === "MEDIUM") return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", bar: "bg-amber-500", icon: "🟠" };
    return { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", bar: "bg-slate-500", icon: "🔵" };
  };

  /* ═══════════════════════════════════════════════════════════════ */
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

        {/* ════════ TAB 1 — Executive Overview ════════ */}
        {activeMainTab === "overview" && (
          <div className="space-y-6 animate-fadeIn">

            {/* KPI row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Audit Status */}
              <div className="relative rounded-2xl border border-white/6 bg-gradient-to-br from-[#0c2236]/80 to-[#071b2c]/80 p-6 overflow-hidden shadow-2xl">
                <div className="absolute -top-8 -right-8 size-32 bg-cyan-500/6 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">Overall Audit Status</p>
                <StatusBadge status={summary.compliance_status} size="lg" />
                <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Framework</span>
                  <span className="font-semibold text-slate-300">{summary.framework || "DPDPA 2023 & Rules 2025"}</span>
                </div>
              </div>

              {/* Critical violations */}
              <div className="relative rounded-2xl border border-white/6 bg-gradient-to-br from-[#1a0c0e]/80 to-[#0d0609]/80 p-6 overflow-hidden shadow-2xl">
                <div className="absolute -top-8 -right-8 size-32 bg-rose-500/6 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-400/15 to-transparent" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">Critical Violations</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white leading-none tracking-tighter">{summary.critical_violations ?? 0}</span>
                  <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Issues Flagged</span>
                </div>
                <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Manual Review Required</span>
                  <span className={`font-semibold ${summary.manual_review_required ? "text-amber-400" : "text-emerald-400"}`}>
                    {summary.manual_review_required ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical observables */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* HTTP Headers */}
              <div className="rounded-2xl border border-white/6 bg-[#08192a]/70 p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/6">
                  <div className="size-7 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center">
                    <svg className="size-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.175-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Secure HTTP Headers</h3>
                </div>

                {content.security_compliance?.headers_present && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">
                      Present ({content.security_compliance.headers_present.length})
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {content.security_compliance.headers_present.map((h: string) => (
                        <div key={h} className="flex items-center gap-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                          <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-xs font-mono text-slate-300 truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {content.security_compliance?.headers_missing && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-500">
                      Missing / At Risk ({content.security_compliance.headers_missing.length})
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {content.security_compliance.headers_missing.map((h: string) => (
                        <div key={h} className="flex items-center gap-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2">
                          <span className="size-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span className="text-xs font-mono text-slate-300 truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cookie Consent Banner */}
              <div className="rounded-2xl border border-white/6 bg-[#08192a]/70 p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/6">
                  <div className="size-7 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                    <svg className="size-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cookie Consent Banner</h3>
                </div>

                <div className="space-y-0 divide-y divide-white/5">
                  {[
                    { label: "Banner Found", val: content.cookie_consent?.cookieBannerFound },
                    { label: "Accept Option", val: content.cookie_consent?.acceptButtonFound },
                    { label: "Reject Option", val: content.cookie_consent?.rejectButtonFound },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between items-center py-2.5">
                      <span className="text-xs text-slate-400">{label}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${val ? "text-emerald-400" : "text-rose-400"}`}>
                        {val ? "Yes" : "No"}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-slate-400">Consent Provider</span>
                    <span className="text-xs font-semibold text-slate-200">{content.cookie_consent?.provider || "None"}</span>
                  </div>
                </div>

                {content.cookie_consent?.trackers && content.cookie_consent.trackers.length > 0 && (
                  <div className="pt-1 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500">Third-Party Trackers</p>
                    <div className="flex flex-wrap gap-1.5">
                      {content.cookie_consent.trackers.map((t: string) => (
                        <span key={t} className="text-[10px] font-mono bg-amber-500/5 border border-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════ TAB 2 — Compliance Checks ════════ */}
        {activeMainTab === "compliance" && (
          <div className="space-y-3 animate-fadeIn max-w-4xl mx-auto">
            {report.compliance_checks && Object.keys(report.compliance_checks).map((sectionKey, si) => {
              const check = report.compliance_checks[sectionKey];
              const isExpanded = activeSection === sectionKey;
              const sStatus = resolveSectionStatus(check);
              const sm = statusMeta(sStatus);

              return (
                <div
                  key={sectionKey}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "border-cyan-500/20 bg-gradient-to-b from-[#0d2638]/90 to-[#091e2e]/90 shadow-[0_4px_30px_rgba(6,182,212,0.07)]"
                      : "border-white/5 bg-[#08192a]/70 hover:border-white/10 hover:bg-[#0a1f30]/70"
                  }`}
                >
                  {/* accordion header */}
                  <button
                    onClick={() => setActiveSection(isExpanded ? "" : sectionKey)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`hidden sm:flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${sm.bg} ${sm.text} border ${sm.ring}`}>
                        {si + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-200 tracking-wide truncate">{formatSectionTitle(sectionKey)}</h4>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={sStatus} />
                      <svg
                        className={`size-4 text-slate-500 transition-transform duration-300 ${isExpanded ? "rotate-180 text-cyan-400" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* expanded body */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-1 border-t border-white/5 space-y-6 text-sm leading-6 animate-fadeIn">
                      {check.sub_sections && Array.isArray(check.sub_sections) ? (
                        <div className="space-y-6">
                          {check.sub_sections.map((sub: any, idx: number) => (
                            <div key={idx} className="pt-5 border-t border-white/5 first:border-0 first:pt-2 space-y-4">
                              {/* sub-section header */}
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <h5 className="text-sm font-bold text-white">{sub.title}</h5>
                                <StatusBadge status={sub.compliance_status} />
                              </div>

                              {/* law refs */}
                              {sub.law_reference?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {sub.law_reference.map((ref: string) => (
                                    <span key={ref} className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-500/5 border border-cyan-400/10 px-2.5 py-0.5 rounded-md tracking-wider">
                                      {ref}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* evidence */}
                              {sub.evidence?.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Evidence & Observations</p>
                                  <ul className="space-y-1.5 text-slate-300">
                                    {sub.evidence.map((item: string, i: number) => (
                                      <li key={i} className="flex gap-2.5 items-start text-sm">
                                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400/60" />
                                        <span className="leading-6">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* required actions */}
                              {sub.required_actions?.length > 0 && (
                                <div className="relative rounded-xl border border-cyan-500/10 bg-[#041220]/60 overflow-hidden">
                                  <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-cyan-400/80 to-cyan-400/10" />
                                  <div className="px-4 py-3.5 pl-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400 mb-2.5 flex items-center gap-1.5">
                                      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                      </svg>
                                      Required Actions
                                    </p>
                                    <ol className="space-y-1.5 text-slate-300">
                                      {sub.required_actions.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-2 items-start text-sm leading-6">
                                          <span className="text-cyan-400 font-mono font-bold shrink-0 mt-0.5">{i + 1}.</span>
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* flat section */
                        <div className="space-y-4">
                          {check.law_reference?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {check.law_reference.map((ref: string) => (
                                <span key={ref} className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-500/5 border border-cyan-400/10 px-2.5 py-0.5 rounded-md tracking-wider">{ref}</span>
                              ))}
                            </div>
                          )}
                          {check.evidence?.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Evidence & Observations</p>
                              <ul className="space-y-1.5 text-slate-300">
                                {check.evidence.map((item: string, i: number) => (
                                  <li key={i} className="flex gap-2.5 items-start text-sm leading-6">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400/60" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {check.required_actions?.length > 0 && (
                            <div className="relative rounded-xl border border-cyan-500/10 bg-[#041220]/60 overflow-hidden">
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-cyan-400/80 to-cyan-400/10" />
                              <div className="px-4 py-3.5 pl-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400 mb-2.5">Required Actions</p>
                                <ol className="space-y-1.5 text-slate-300">
                                  {check.required_actions.map((item: string, i: number) => (
                                    <li key={i} className="flex gap-2 items-start text-sm leading-6">
                                      <span className="text-cyan-400 font-mono font-bold shrink-0">{i + 1}.</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════════ TAB 3 — Remediation Plan ════════ */}
        {activeMainTab === "remediation" && (
          <div className="space-y-5 animate-fadeIn">
            {report.remediation_plan && report.remediation_plan.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {report.remediation_plan.map((item: any, idx: number) => {
                  const pm = priorityMeta(item.priority);
                  return (
                    <div
                      key={idx}
                      className={`group relative rounded-2xl border ${pm.border} bg-[#07192a]/80 p-5 space-y-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
                    >
                      {/* subtle top bar */}
                      <div className={`absolute top-0 left-0 right-0 h-0.5 ${pm.bar} opacity-40`} />
                      
                      {/* header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">{item.category}</span>
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${pm.bg} ${pm.text} ${pm.border}`}>
                          {pm.icon} {item.priority}
                        </span>
                      </div>

                      {/* issue */}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-1">Issue</p>
                        <p className="text-sm font-semibold text-white leading-relaxed">{item.issue}</p>
                      </div>

                      {/* legal */}
                      {item.legal_requirement && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-1">Legal Requirement</p>
                          <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-600 pl-2.5">{item.legal_requirement}</p>
                        </div>
                      )}

                      {/* action */}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-1">Recommended Action</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{item.recommended_action}</p>
                      </div>

                      {/* outcome */}
                      {item.expected_outcome && (
                        <div className="pt-2 border-t border-white/5 flex items-start gap-2">
                          <svg className="size-3.5 shrink-0 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <p className="text-xs text-emerald-400/90 leading-relaxed">{item.expected_outcome}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                <svg className="size-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2H9" />
                </svg>
                <p className="text-sm">No remediation actions found.</p>
              </div>
            )}
          </div>
        )}

        {/* ════════ TAB 4 — Generated Drafts ════════ */}
        {activeMainTab === "artifacts" && (
          <div className="animate-fadeIn max-w-4xl mx-auto space-y-4">
            {report.generated_artifacts ? (
              <>
                {/* nested artifact tab pills */}
                <div className="flex flex-wrap gap-2 p-1 rounded-xl bg-[#07192a]/60 border border-white/5">
                  {Object.keys(report.generated_artifacts).map((key) => {
                    const isActive = activeArtifactTab === key;
                    const title = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveArtifactTab(key)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                          isActive
                            ? "bg-cyan-400 text-[#061420] shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {title}
                      </button>
                    );
                  })}
                </div>

                {/* artifact content card */}
                {(() => {
                  const activeArtifact = report.generated_artifacts[activeArtifactTab];
                  if (!activeArtifact) return <p className="text-sm text-slate-500 p-4">Select an artifact to view content.</p>;

                  const draftText = activeArtifact.generated_playbook ||
                                   activeArtifact.generated_markdown ||
                                   activeArtifact.generated_html || "";
                  return (
                    <div className="rounded-2xl border border-white/5 bg-[#07192a]/70 p-5 space-y-5 shadow-xl animate-fadeIn">
                      {/* status + law refs */}
                      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Status:</span>
                          <StatusBadge status={activeArtifact.compliance_status} />
                        </div>
                        {activeArtifact.law_reference && (
                          <div className="flex flex-wrap gap-1.5">
                            {activeArtifact.law_reference.map((ref: string) => (
                              <span key={ref} className="text-[10px] font-mono font-semibold text-slate-400 bg-[#061420] border border-white/5 px-2 py-0.5 rounded">{ref}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* required steps */}
                      {activeArtifact.required_actions?.length > 0 && (
                        <div className="relative rounded-xl border border-cyan-500/10 bg-[#041220]/60 overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-cyan-400/80 to-cyan-400/10" />
                          <div className="px-4 py-3.5 pl-5">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400 mb-2.5">Required Steps</p>
                            <ul className="space-y-1.5 text-slate-300">
                              {activeArtifact.required_actions.map((act: string, i: number) => (
                                <li key={i} className="flex gap-2 items-start text-sm leading-6">
                                  <span className="text-cyan-400 font-mono font-bold shrink-0">{i + 1}.</span>
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* draft content */}
                      {draftText && draftText !== "GENERATION_REQUIRED_POST_AUDIT" && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Generated Draft Content</p>
                          <pre className="p-4 rounded-xl border border-white/5 bg-[#030e18] text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-[480px] whitespace-pre-wrap leading-relaxed scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                            {draftText}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
                <svg className="size-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No generated drafts or compliance playbooks available.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Legal Disclaimer ── */}
      {report.disclaimer && (
        <div className="relative rounded-2xl border border-white/5 bg-[#04101a]/80 px-6 py-5 max-w-4xl mx-auto overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-center mb-2">⚖ Legal Disclaimer</p>
          <p className="text-xs text-slate-500 leading-relaxed text-center">{report.disclaimer.text}</p>
        </div>
      )}
    </div>
  );
}
