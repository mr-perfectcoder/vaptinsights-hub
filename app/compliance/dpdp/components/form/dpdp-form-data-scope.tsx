"use client";

import React from "react";
import { SectionCard } from "../common/dpdp-section-card";
import { FieldGroup } from "../common/dpdp-field-group";
import { Toggle } from "../common/dpdp-toggle";
import { UrlField } from "./dpdp-url-field";
import { InfoButton, FieldHelpContent } from "../common/dpdp-info-modal";
import { DPDP_FIELD_HELP } from "../../constants/dpdp-field-help";

const selectCls = "h-9 w-full px-3 text-sm rounded-xl border border-white/8 bg-[#050f1a] text-slate-200 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 transition appearance-none cursor-pointer";

interface DpdpFormDataScopeProps {
  formik: any;
  handleOpenHelp: (content: FieldHelpContent) => void;
  urlFieldProps: (field: any, discovered: string, helpContent?: any) => any;
  setNotAvailableUrls: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const DpdpFormDataScope = React.memo(function DpdpFormDataScope({
  formik,
  handleOpenHelp,
  urlFieldProps,
  setNotAvailableUrls,
}: DpdpFormDataScopeProps) {
  const fv = formik.values;
  const fe = formik.errors;
  const ft = formik.touched;

  return (
    <SectionCard step="02" title="Data Scope & Platform" badge="Sec. 8 & 9">
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Application Type" htmlFor="app_type" required helpContent={DPDP_FIELD_HELP.appType} onOpenHelp={handleOpenHelp}>
          <div className="flex flex-col gap-1.5">
            <select
              id="app_type_select"
              value={["SaaS", "Web App", "Mobile App", "E-commerce"].includes(fv.app_type) ? fv.app_type : "Other"}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "Other") {
                  formik.setFieldValue("app_type", "");
                } else {
                  formik.setFieldValue("app_type", val);
                }
              }}
              className={`${selectCls} ${ft.app_type && fe.app_type ? "border-rose-500/40 ring-1 ring-rose-500/15" : ""}`}
            >
              <option value="SaaS">SaaS Application</option>
              <option value="Web App">Web Application</option>
              <option value="Mobile App">Mobile Application</option>
              <option value="E-commerce">E-Commerce Store</option>
              <option value="Other">Other (Custom Type)...</option>
            </select>

            {!["SaaS", "Web App", "Mobile App", "E-commerce"].includes(fv.app_type) && (
              <input
                id="app_type"
                name="app_type"
                type="text"
                value={fv.app_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter custom application type..."
                className={`h-9 w-full px-3 text-sm rounded-xl border bg-[#050f1a] text-slate-200 outline-none transition placeholder:text-slate-700 ${
                  ft.app_type && fe.app_type
                    ? "border-rose-500/40 ring-1 ring-rose-500/15 bg-rose-500/5"
                    : "border-white/8 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10"
                }`}
              />
            )}

            {ft.app_type && fe.app_type && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <span>⚠</span> {String(fe.app_type)}
              </p>
            )}
          </div>
        </FieldGroup>
        <FieldGroup label="Data Retention" htmlFor="data_retention_period" required helpContent={DPDP_FIELD_HELP.dataRetention} onOpenHelp={handleOpenHelp}>
          <select id="data_retention_period" name="data_retention_period" value={fv.data_retention_period} onChange={formik.handleChange} onBlur={formik.handleBlur} className={selectCls}>
            <option value="1 Month">1 Month</option>
            <option value="2 Months">2 Months</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="12 Months (1 Year)">12 Months</option>
            <option value="2 Years">2 Years</option>
            <option value="5 Years">5 Years</option>
            <option value="Indefinite">Indefinite</option>
          </select>
        </FieldGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <label htmlFor="app_description" className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Application Description <span className="text-rose-400 font-bold">*</span>
            </label>
            <InfoButton content={DPDP_FIELD_HELP.appDescription} onClick={handleOpenHelp} />
          </div>
          <span className={`text-xs font-mono ${(fv.app_description?.length || 0) > 900 ? "text-rose-400 font-bold" : "text-slate-600"}`}>
            {fv.app_description?.length || 0}/1000
          </span>
        </div>
        <textarea
          id="app_description"
          name="app_description"
          rows={3}
          maxLength={1000}
          value={fv.app_description || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Describe what your application does, its key features, user workflow, or data processing purpose..."
          className={`w-full p-3 text-xs rounded-xl border bg-[#050f1a] text-slate-200 outline-none transition resize-none placeholder:text-slate-700 font-sans leading-relaxed ${
            ft.app_description && fe.app_description
              ? "border-rose-500/40 ring-1 ring-rose-500/15 bg-rose-500/5"
              : "border-white/8 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10"
          }`}
        />
        {ft.app_description && fe.app_description && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <span>⚠</span> {String(fe.app_description)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Toggle
          name="processes_children_data"
          checked={Boolean(fv.processes_children_data)}
          onChange={formik.handleChange}
          label="Processes Children's Data"
          badge="Sec. 9"
          helpContent={DPDP_FIELD_HELP.processesChildrenData}
          onOpenHelp={handleOpenHelp}
          description="Collects data from users under 18 — requires verifiable parental consent."
        />
        <Toggle
          name="processes_sensitive_data"
          checked={Boolean(fv.processes_sensitive_data)}
          onChange={formik.handleChange}
          label="Processes Sensitive Personal Data"
          helpContent={DPDP_FIELD_HELP.processesSensitiveData}
          onOpenHelp={handleOpenHelp}
          description="Stores health, financial, biometric, or identity data."
        />
        <Toggle
          name="has_login_or_user_management"
          checked={Boolean(fv.has_login_or_user_management)}
          onChange={(e) => {
            formik.handleChange(e);
            if (e.target.checked) {
              setNotAvailableUrls((prev) => {
                const next = new Set(prev);
                next.delete("confirmed_login_url");
                next.delete("confirmed_register_url");
                return next;
              });
            }
          }}
          label="Has User Accounts / Login System"
          helpContent={DPDP_FIELD_HELP.hasLoginOrUserManagement}
          onOpenHelp={handleOpenHelp}
          description="Platform supports user registration and authentication."
        />
      </div>

      {fv.has_login_or_user_management && (
        <div className="grid grid-cols-1 gap-3 pt-1 border-t border-white/6">
          <UrlField
            id="confirmed_login_url"
            name="confirmed_login_url"
            label="Login URL"
            placeholder="https://app.example.com/login"
            {...urlFieldProps("confirmed_login_url", "", DPDP_FIELD_HELP.loginUrl)}
          />
          <UrlField
            id="confirmed_register_url"
            name="confirmed_register_url"
            label="Registration URL"
            placeholder="https://app.example.com/register"
            {...urlFieldProps("confirmed_register_url", "", DPDP_FIELD_HELP.registrationUrl)}
          />
        </div>
      )}
    </SectionCard>
  );
});
