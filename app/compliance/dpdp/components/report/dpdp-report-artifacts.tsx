import React from "react";
import { ScanStatusResponse } from "@/hooks/query-hooks/dpdp.query";

interface DpdpReportArtifactsProps {
  report: NonNullable<ScanStatusResponse["report"]>;
  StatusBadge: React.FC<{ status?: string }>;
  FormattedText: React.FC<{ text: string }>;
}

const ARTIFACT_TITLES: Record<string, string> = {
  privacy_policy_updates: "Privacy Policy Updates",
  incident_response_playbook: "Incident Response Playbook",
  ui_implementation: "UI & Consent Implementation Guidance",
  consent_architecture: "Consent Architecture Specifications",
  data_breach_notification_template: "Data Breach Notification Template",
};

export const DpdpReportArtifacts: React.FC<DpdpReportArtifactsProps> = ({
  report,
  StatusBadge,
  FormattedText,
}) => {
  const artifacts = report.generated_artifacts;

  if (!artifacts || typeof artifacts !== "object" || Object.keys(artifacts).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500 space-y-2">
        <p className="text-sm">No generated draft artifacts available for this audit.</p>
      </div>
    );
  }

  const formatArtifactTitle = (key: string): string => {
    if (ARTIFACT_TITLES[key]) return ARTIFACT_TITLES[key];
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-6">
      {Object.entries(artifacts).map(([key, rawArtifact]) => {
        if (!rawArtifact || typeof rawArtifact !== "object") return null;
        const artifact = rawArtifact as Record<string, any>;

        const status = artifact.compliance_status || artifact.status;
        const lawRefs = Array.isArray(artifact.law_reference)
          ? artifact.law_reference
          : artifact.law_reference
          ? [artifact.law_reference]
          : [];
        const evidences = Array.isArray(artifact.evidence)
          ? artifact.evidence
          : artifact.evidence
          ? [artifact.evidence]
          : [];
        const actions = Array.isArray(artifact.required_actions)
          ? artifact.required_actions
          : artifact.required_actions
          ? [artifact.required_actions]
          : [];
        const strengths = Array.isArray(artifact.strength)
          ? artifact.strength
          : artifact.strength
          ? [artifact.strength]
          : [];

        return (
          <div
            key={key}
            className="rounded-2xl border border-white/10 bg-[#08192a]/80 backdrop-blur-xl p-6 shadow-xl space-y-5 transition-all hover:border-cyan-500/20"
          >
            {/* Header: Title & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/6 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white tracking-wide">
                  {formatArtifactTitle(key)}
                </h3>
                {lawRefs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {lawRefs.map((ref, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-cyan-950/60 text-cyan-400 border border-cyan-500/20"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 self-start sm:self-center">
                <StatusBadge status={status} />
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Evidence Section */}
              {evidences.length > 0 && (
                <div className="space-y-2 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-xs">
                    Key Audit Findings
                  </h4>
                  <ul className="space-y-1.5 text-slate-400">
                    {evidences.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span><FormattedText text={item} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Actions Section */}
              {actions.length > 0 && (
                <div className="space-y-2 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-xs">
                    Required Remediation Actions
                  </h4>
                  <ul className="space-y-1.5 text-slate-400">
                    {actions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-400 font-bold">-</span>
                        <span><FormattedText text={item} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Strengths Section (if available) */}
            {strengths.length > 0 && (
              <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/10 p-3.5 text-xs space-y-1.5">
                <h4 className="font-semibold text-emerald-400 uppercase tracking-wider text-xs">
                  Existing Compliance Strengths
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {strengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-900/30 text-emerald-300 border border-emerald-500/20"
                    >
                      <FormattedText text={str} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
