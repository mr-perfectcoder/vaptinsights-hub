"use client";

import React from "react";

interface DpdpReportRemediationProps {
  report: any;
  priorityMeta: (priority: string) => {
    bg: string;
    text: string;
    border: string;
    bar: string;
    icon: string;
  };
  FormattedText: React.ComponentType<{ text: string }>;
}

export const DpdpReportRemediation = React.memo(function DpdpReportRemediation({
  report,
  priorityMeta,
  FormattedText,
}: DpdpReportRemediationProps) {
  return (
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
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 leading-relaxed flex-1">
                    {item.category}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${pm.bg} ${pm.text} ${pm.border} mt-0.5`}>
                    <span className="whitespace-nowrap leading-none">{item.priority}</span>
                  </span>
                </div>

                {/* issue */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 mb-1">Issue</p>
                  <p className="text-sm font-semibold text-white leading-relaxed"><FormattedText text={item.issue} /></p>
                </div>

                {/* legal */}
                {item.legal_requirement && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 mb-1">Legal Requirement</p>
                    <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-600 pl-2.5"><FormattedText text={item.legal_requirement} /></p>
                  </div>
                )}

                {/* action */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 mb-1">Recommended Action</p>
                  <p className="text-sm text-slate-300 leading-relaxed"><FormattedText text={item.recommended_action} /></p>
                </div>

                {/* outcome */}
                {item.expected_outcome && (
                  <div className="pt-2 border-t border-white/5 flex items-start gap-2">
                    <svg className="size-3.5 shrink-0 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <p className="text-xs text-emerald-400/90 leading-relaxed"><FormattedText text={item.expected_outcome} /></p>
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
  );
});
