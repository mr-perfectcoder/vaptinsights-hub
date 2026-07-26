"use client";

import React from "react";
import { SectionCard } from "../common/dpdp-section-card";
import { FieldGroup } from "../common/dpdp-field-group";
import { Toggle } from "../common/dpdp-toggle";
import { UrlField } from "./dpdp-url-field";
import { FieldHelpContent } from "../common/dpdp-info-modal";
import { DPDP_FIELD_HELP } from "../../constants/dpdp-field-help";

const selectCls = "h-9 w-full px-3 text-sm rounded-xl border border-white/8 bg-[#050f1a] text-slate-200 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 transition appearance-none cursor-pointer";

interface DpdpFormGovernanceProps {
  formik: any;
  handleOpenHelp: (content: FieldHelpContent) => void;
  urlFieldProps: (field: any, discovered: string, helpContent?: any) => any;
}

export const DpdpFormGovernance = React.memo(function DpdpFormGovernance({
  formik,
  handleOpenHelp,
  urlFieldProps,
}: DpdpFormGovernanceProps) {
  const fv = formik.values;

  return (
    <SectionCard step="03" title="Governance & Technical Safeguards" badge="Sec. 8(6) · 10 · 13">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FieldGroup label="DPIA Assessment Status" badge="Sec. 10(1)" htmlFor="dpia_status" required helpContent={DPDP_FIELD_HELP.dpiaStatus} onOpenHelp={handleOpenHelp}
          hint="Data Protection Impact Assessment for high-risk / Significant Data Fiduciaries.">
          <select id="dpia_status" name="dpia_status" value={fv.dpia_status ?? "NOT_CONDUCTED"} onChange={formik.handleChange} onBlur={formik.handleBlur} className={selectCls}>
            <option value="NOT_CONDUCTED">Not Conducted</option>
            <option value="CONDUCTED">Conducted & Documented</option>
            <option value="IN_PROGRESS">Currently In Progress</option>
            <option value="NOT_APPLICABLE">Not Applicable</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Consent Manager Setup" badge="Sec. 6(1)" htmlFor="consent_manager_type" required helpContent={DPDP_FIELD_HELP.consentManagerType} onOpenHelp={handleOpenHelp}
          hint="Interoperable consent management platform for user consent lifecycle.">
          <select id="consent_manager_type" name="consent_manager_type" value={fv.consent_manager_type ?? "NONE"} onChange={formik.handleChange} onBlur={formik.handleBlur} className={selectCls}>
            <option value="NONE">No Consent Manager / Standard Banner</option>
            <option value="CUSTOM_CMP">Custom Consent Platform (CMP)</option>
            <option value="REGISTERED_CONSENT_MANAGER">Registered DPDP Consent Manager</option>
          </select>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Toggle name="has_dpa_with_processors" checked={Boolean(fv.has_dpa_with_processors)} onChange={formik.handleChange}
          label="DPA Contracts Executed" badge="Sec. 8(2)" helpContent={DPDP_FIELD_HELP.dpaContracts} onOpenHelp={handleOpenHelp}
          description="Formal agreements with third-party vendors, cloud & analytics providers." />
        <Toggle name="has_incident_response_plan" checked={Boolean(fv.has_incident_response_plan)} onChange={formik.handleChange}
          label="Breach Incident Response Plan" badge="Sec. 8(6)" helpContent={DPDP_FIELD_HELP.incidentResponsePlan} onOpenHelp={handleOpenHelp}
          description="Written procedures to notify the Board and users upon data breach." />
        <Toggle name="has_grievance_officer" checked={Boolean(fv.has_grievance_officer)} onChange={formik.handleChange}
          label="Grievance Redressal Officer" badge="Sec. 13" helpContent={DPDP_FIELD_HELP.grievanceOfficer} onOpenHelp={handleOpenHelp}
          description="Published contact for users to exercise data rights and lodge grievances." />
      </div>

      {fv.has_grievance_officer && (
        <div className="pt-1 border-t border-white/6">
          <UrlField id="grievance_officer_contact" name="grievance_officer_contact"
            label="Grievance Officer Email / Contact URL (optional)"
            placeholder="dpo@example.com or https://example.com/grievance"
            {...urlFieldProps("grievance_officer_contact", "")}
          />
        </div>
      )}
    </SectionCard>
  );
});
