"use client";

import React from "react";

interface DpdpReportComplianceProps {
  report: any;
  activeSection: string;
  setActiveSection: (key: string) => void;
  resolveSectionStatus: (check: any) => string;
  statusMeta: (status?: string) => any;
  formatSectionTitle: (key: string) => string;
  StatusBadge: React.ComponentType<{ status?: string; size?: "sm" | "md" | "lg" }>;
  FormattedText: React.ComponentType<{ text: string }>;
}

export const DpdpReportCompliance = React.memo(function DpdpReportCompliance({
  report,
  activeSection,
  setActiveSection,
  resolveSectionStatus,
  statusMeta,
  formatSectionTitle,
  StatusBadge,
  FormattedText,
}: DpdpReportComplianceProps) {
  return (
    <div className="space-y-3 animate-fadeIn max-w-4xl mx-auto">
      {report.compliance_checks &&
        Object.keys(report.compliance_checks).map((sectionKey, si) => {
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
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`hidden sm:flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${sm.bg} ${sm.text} border ${sm.ring}`}>
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
                                <span key={ref} className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-500/5 border border-cyan-400/10 px-2.5 py-0.5 rounded-md tracking-wider">
                                  {ref}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* evidence */}
                          {sub.evidence?.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Evidence & Observations</p>
                              <ul className="space-y-1.5 text-slate-300">
                                {sub.evidence.map((item: string, i: number) => (
                                  <li key={i} className="flex gap-2.5 items-start text-sm">
                                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400/60" />
                                    <span className="leading-6"><FormattedText text={item} /></span>
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
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400 mb-2.5 flex items-center gap-1.5">
                                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                  </svg>
                                  Required Actions
                                </p>
                                <ol className="space-y-1.5 text-slate-300">
                                  {sub.required_actions.map((item: string, i: number) => (
                                    <li key={i} className="flex gap-2 items-start text-sm leading-6">
                                      <span className="text-cyan-400 font-mono font-bold shrink-0 mt-0.5">{i + 1}.</span>
                                      <span><FormattedText text={item} /></span>
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
                            <span key={ref} className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-500/5 border border-cyan-400/10 px-2.5 py-0.5 rounded-md tracking-wider">{ref}</span>
                          ))}
                        </div>
                      )}
                      {check.evidence?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Evidence & Observations</p>
                          <ul className="space-y-1.5 text-slate-300">
                            {check.evidence.map((item: string, i: number) => (
                              <li key={i} className="flex gap-2.5 items-start text-sm leading-6">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan-400/60" />
                                <span><FormattedText text={item} /></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {check.required_actions?.length > 0 && (
                        <div className="relative rounded-xl border border-cyan-500/10 bg-[#041220]/60 overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-cyan-400/80 to-cyan-400/10" />
                          <div className="px-4 py-3.5 pl-5">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400 mb-2.5">Required Actions</p>
                            <ol className="space-y-1.5 text-slate-300">
                              {check.required_actions.map((item: string, i: number) => (
                                <li key={i} className="flex gap-2 items-start text-sm leading-6">
                                  <span className="text-cyan-400 font-mono font-bold shrink-0">{i + 1}.</span>
                                  <span><FormattedText text={item} /></span>
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
  );
});
