"use client";

import React from "react";

interface DpdpReportOverviewProps {
  summary: any;
  content: any;
  StatusBadge: React.ComponentType<{ status?: string; size?: "sm" | "md" | "lg" }>;
}

export const DpdpReportOverview = React.memo(function DpdpReportOverview({
  summary,
  content,
  StatusBadge,
}: DpdpReportOverviewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Audit Status */}
        <div className="relative rounded-2xl border border-white/6 bg-gradient-to-br from-[#0c2236]/80 to-[#071b2c]/80 p-6 overflow-hidden shadow-2xl">
          <div className="absolute -top-8 -right-8 size-32 bg-cyan-500/6 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">Overall Audit Status</p>
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">Critical Violations</p>
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
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-500">
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
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-rose-500">
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
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500">Third-Party Trackers</p>
              <div className="flex flex-wrap gap-1.5">
                {content.cookie_consent.trackers.map((t: string) => (
                  <span key={t} className="text-xs font-mono bg-amber-500/5 border border-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
