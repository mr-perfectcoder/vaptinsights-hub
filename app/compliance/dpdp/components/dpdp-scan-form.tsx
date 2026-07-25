"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useDPDPStartScan, ScanStatusResponse } from "@/hooks/query-hooks/dpdp.query";
import { confirmationScanSchema, normalizeScanUrl } from "@/lib/validation/dpdp-scan.schema";
import { DpdpIcon } from "./dpdp-icon";

interface DpdpScanFormProps {
  scanRecord: ScanStatusResponse;
}

export function DpdpScanForm({ scanRecord }: DpdpScanFormProps) {
  const startScanMutation = useDPDPStartScan();
  const [errorMessage, setErrorMessage] = useState("");

  const initialPrivacy = 
    scanRecord.confirmed_privacy_policy_url || 
    scanRecord.discovered_privacy_policy_url || 
    scanRecord.content?.documents?.confirmed_privacy_policy_url || 
    scanRecord.content?.discovered_privacy_policy_url || "";

  const initialTerms = 
    scanRecord.confirmed_terms_url || 
    scanRecord.discovered_terms_url || 
    scanRecord.content?.documents?.confirmed_terms_url || 
    scanRecord.content?.discovered_terms_url || "";

  const initialSitemap = 
    scanRecord.confirmed_sitemap_url || 
    scanRecord.discovered_sitemap_url || 
    scanRecord.content?.documents?.confirmed_sitemap_url || 
    scanRecord.content?.discovered_sitemap_url || "";

  const initialTrust = 
    scanRecord.confirmed_trust_security_url || 
    scanRecord.discovered_trust_security_url || 
    scanRecord.content?.documents?.confirmed_trust_security_url || 
    scanRecord.content?.discovered_trust_security_url || "";

  const formik = useFormik({
    initialValues: {
      confirmed_privacy_policy_url: initialPrivacy,
      confirmed_terms_url: initialTerms,
      confirmed_sitemap_url: initialSitemap,
      confirmed_trust_security_url: initialTrust,
      confirmed_login_url: scanRecord.confirmed_login_url || "",
      confirmed_register_url: scanRecord.confirmed_register_url || "",
      app_type: scanRecord.app_type || "SaaS",
      data_retention_period: scanRecord.data_retention_period || "12 Months (1 Year)",
      processes_children_data: scanRecord.processes_children_data || false,
      processes_sensitive_data: scanRecord.processes_sensitive_data || false,
      has_login_or_user_management: scanRecord.has_login_or_user_management || false,

      // Enhanced Governance & Safeguard Questionnaire Fields
      has_grievance_officer: (scanRecord as unknown as Record<string, unknown>).has_grievance_officer === true,
      grievance_officer_contact: ((scanRecord as unknown as Record<string, unknown>).grievance_officer_contact as string) || "",
      has_dpa_with_processors: (scanRecord as unknown as Record<string, unknown>).has_dpa_with_processors === true,
      has_incident_response_plan: (scanRecord as unknown as Record<string, unknown>).has_incident_response_plan === true,
      dpia_status: ((scanRecord as unknown as Record<string, unknown>).dpia_status as string) || "NOT_CONDUCTED",
      consent_manager_type: ((scanRecord as unknown as Record<string, unknown>).consent_manager_type as string) || "NONE",
    },
    validationSchema: confirmationScanSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values, { setSubmitting }) => {
      setErrorMessage("");

      startScanMutation.mutate(
        {
          scan_id: scanRecord.scan_id,
          target_url: scanRecord.target_url || scanRecord.domain,
          confirmed_privacy_policy_url: values.confirmed_privacy_policy_url
            ? normalizeScanUrl(values.confirmed_privacy_policy_url, "full")
            : "",
          confirmed_terms_url: values.confirmed_terms_url
            ? normalizeScanUrl(values.confirmed_terms_url, "full")
            : "",
          confirmed_sitemap_url: values.confirmed_sitemap_url
            ? normalizeScanUrl(values.confirmed_sitemap_url, "full")
            : "",
          confirmed_trust_security_url: values.confirmed_trust_security_url
            ? normalizeScanUrl(values.confirmed_trust_security_url, "full")
            : "",
          confirmed_login_url: values.confirmed_login_url
            ? normalizeScanUrl(values.confirmed_login_url, "full")
            : "",
          confirmed_register_url: values.confirmed_register_url
            ? normalizeScanUrl(values.confirmed_register_url, "full")
            : "",
          app_type: values.app_type,
          data_retention_period: values.data_retention_period,
          processes_children_data: values.processes_children_data,
          processes_sensitive_data: values.processes_sensitive_data,
          has_login_or_user_management: values.has_login_or_user_management,

          // Extended payload items
          has_grievance_officer: values.has_grievance_officer,
          grievance_officer_contact: values.grievance_officer_contact,
          has_dpa_with_processors: values.has_dpa_with_processors,
          has_incident_response_plan: values.has_incident_response_plan,
          dpia_status: values.dpia_status,
          consent_manager_type: values.consent_manager_type,
        },
        {
          onError: (err) => {
            setSubmitting(false);
            setErrorMessage(err.message || "Failed to trigger compliance scan.");
          },
        }
      );
    },
  });

  const isProcessing = formik.isSubmitting || startScanMutation.isPending;

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-white/12 bg-[#0b2130]/90 p-6 shadow-2xl shadow-black/35 sm:p-8">
      {/* Title Header */}
      <div className="border-b border-white/8 pb-5">
        <h2 className="text-xl font-bold text-white sm:text-2xl flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <DpdpIcon name="scan" className="size-4" />
          </span>
          Confirm Scan Audit Targets
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Review discovered assets for <span className="font-semibold text-slate-200">{scanRecord.domain}</span> and provide technical context below to generate a tailored DPDPA 2023 compliance report.
        </p>
      </div>

      {/* DPIA & Public Scanning Limitation Disclaimer */}
      <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-start gap-3.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-base">
            ⚠️
          </span>
          <div className="space-y-1">
            <h4 className="font-bold text-amber-200 uppercase tracking-wide text-xs">
              Public Scan Limits vs. Internal Compliance Context
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Automated crawlers inspect external public assets (Privacy Policy, Cookies, CSP Headers). Internal safeguards—such as <strong className="text-amber-200 font-semibold">Data Protection Impact Assessments (DPIA)</strong>, third-party <strong className="text-amber-200 font-semibold">Data Processing Agreements (DPA)</strong>, and <strong className="text-amber-200 font-semibold">Grievance Redressal</strong>—cannot be verified via external scanning alone.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Answering the technical questionnaire below allows our AI engine to perform an accurate, legal-grade compliance assessment.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6">

        {/* SECTION 1: Web Assets & Public Documents */}
        <div className="space-y-4 rounded-2xl border border-white/8 bg-[#061420]/60 p-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <h3 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
              1. Web Assets &amp; Public Documents
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
              DPDPA Sec. 5 &amp; 6
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="confirmed_privacy_policy_url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Privacy Policy URL
              </label>
              <input
                id="confirmed_privacy_policy_url"
                name="confirmed_privacy_policy_url"
                type="text"
                value={formik.values.confirmed_privacy_policy_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(formik.touched.confirmed_privacy_policy_url && formik.errors.confirmed_privacy_policy_url)}
                placeholder="https://example.com/privacy"
                className={`w-full h-11 px-3 text-sm rounded-lg border bg-[#061420] text-slate-200 outline-none transition ${
                  formik.touched.confirmed_privacy_policy_url && formik.errors.confirmed_privacy_policy_url
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-white/10 focus:border-cyan-500"
                }`}
              />
              {formik.touched.confirmed_privacy_policy_url && formik.errors.confirmed_privacy_policy_url && (
                <p className="mt-1 text-xs text-rose-400 font-medium">⚠️ {String(formik.errors.confirmed_privacy_policy_url)}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmed_terms_url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Terms of Service URL
              </label>
              <input
                id="confirmed_terms_url"
                name="confirmed_terms_url"
                type="text"
                value={formik.values.confirmed_terms_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(formik.touched.confirmed_terms_url && formik.errors.confirmed_terms_url)}
                placeholder="https://example.com/terms"
                className={`w-full h-11 px-3 text-sm rounded-lg border bg-[#061420] text-slate-200 outline-none transition ${
                  formik.touched.confirmed_terms_url && formik.errors.confirmed_terms_url
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-white/10 focus:border-cyan-500"
                }`}
              />
              {formik.touched.confirmed_terms_url && formik.errors.confirmed_terms_url && (
                <p className="mt-1 text-xs text-rose-400 font-medium">⚠️ {String(formik.errors.confirmed_terms_url)}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmed_sitemap_url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Sitemap URL (Optional)
              </label>
              <input
                id="confirmed_sitemap_url"
                name="confirmed_sitemap_url"
                type="text"
                value={formik.values.confirmed_sitemap_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(formik.touched.confirmed_sitemap_url && formik.errors.confirmed_sitemap_url)}
                placeholder="https://example.com/sitemap.xml"
                className={`w-full h-11 px-3 text-sm rounded-lg border bg-[#061420] text-slate-200 outline-none transition ${
                  formik.touched.confirmed_sitemap_url && formik.errors.confirmed_sitemap_url
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-white/10 focus:border-cyan-500"
                }`}
              />
              {formik.touched.confirmed_sitemap_url && formik.errors.confirmed_sitemap_url && (
                <p className="mt-1 text-xs text-rose-400 font-medium">⚠️ {String(formik.errors.confirmed_sitemap_url)}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmed_trust_security_url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Security / Trust Center URL (Optional)
              </label>
              <input
                id="confirmed_trust_security_url"
                name="confirmed_trust_security_url"
                type="text"
                value={formik.values.confirmed_trust_security_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(formik.touched.confirmed_trust_security_url && formik.errors.confirmed_trust_security_url)}
                placeholder="https://example.com/security"
                className={`w-full h-11 px-3 text-sm rounded-lg border bg-[#061420] text-slate-200 outline-none transition ${
                  formik.touched.confirmed_trust_security_url && formik.errors.confirmed_trust_security_url
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-white/10 focus:border-cyan-500"
                }`}
              />
              {formik.touched.confirmed_trust_security_url && formik.errors.confirmed_trust_security_url && (
                <p className="mt-1 text-xs text-rose-400 font-medium">⚠️ {String(formik.errors.confirmed_trust_security_url)}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Platform Specifications & Data Scope */}
        <div className="space-y-4 rounded-2xl border border-white/8 bg-[#061420]/60 p-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <h3 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
              2. Data Scope &amp; Platform Specifications
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
              DPDPA Sec. 8 &amp; 9
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="app_type" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Application Type
              </label>
              <select
                id="app_type"
                name="app_type"
                value={formik.values.app_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              >
                <option value="SaaS">SaaS Application</option>
                <option value="Web App">Web Application</option>
                <option value="Mobile App">Mobile Application</option>
                <option value="E-commerce">E-Commerce Store</option>
              </select>
            </div>

            <div>
              <label htmlFor="data_retention_period" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Data Retention Policy
              </label>
              <select
                id="data_retention_period"
                name="data_retention_period"
                value={formik.values.data_retention_period}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              >
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months (1 Year)">12 Months (1 Year)</option>
                <option value="2 Years">2 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="Indefinite">Indefinite</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                name="processes_children_data"
                type="checkbox"
                checked={formik.values.processes_children_data}
                onChange={formik.handleChange}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {formik.values.processes_children_data && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">Processes Children's Personal Data</span>
                <p className="text-xs text-slate-400 mt-0.5">Check if details of users under 18 are collected (requires verifiable parental consent under DPDPA Sec. 9).</p>
              </div>
            </label>

            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                name="processes_sensitive_data"
                type="checkbox"
                checked={formik.values.processes_sensitive_data}
                onChange={formik.handleChange}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {formik.values.processes_sensitive_data && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">Processes Sensitive Personal Data</span>
                <p className="text-xs text-slate-400 mt-0.5">Check if health, financial, biometric, or identity data is stored (requires heightened security controls).</p>
              </div>
            </label>

            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                name="has_login_or_user_management"
                type="checkbox"
                checked={formik.values.has_login_or_user_management}
                onChange={formik.handleChange}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {formik.values.has_login_or_user_management && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">Has User Accounts or Login System</span>
                <p className="text-xs text-slate-400 mt-0.5">Check if portal supports user registration and login account management.</p>
              </div>
            </label>
          </div>

          {formik.values.has_login_or_user_management && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2 animate-fadeIn">
              <div>
                <label htmlFor="confirmed_login_url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Login URL</label>
                <input
                  id="confirmed_login_url"
                  name="confirmed_login_url"
                  type="text"
                  value={formik.values.confirmed_login_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.confirmed_login_url && formik.errors.confirmed_login_url)}
                  placeholder="https://.../login"
                  className={`w-full h-11 px-3 text-sm rounded-lg border bg-[#061420] text-slate-200 outline-none transition ${
                    formik.touched.confirmed_login_url && formik.errors.confirmed_login_url
                      ? "border-rose-500/60 focus:border-rose-500"
                      : "border-white/10 focus:border-cyan-500"
                  }`}
                />
                {formik.touched.confirmed_login_url && formik.errors.confirmed_login_url && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">⚠️ {String(formik.errors.confirmed_login_url)}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmed_register_url" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Registration URL</label>
                <input
                  id="confirmed_register_url"
                  name="confirmed_register_url"
                  type="text"
                  value={formik.values.confirmed_register_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.confirmed_register_url && formik.errors.confirmed_register_url)}
                  placeholder="https://.../register"
                  className={`w-full h-11 px-3 text-sm rounded-lg border bg-[#061420] text-slate-200 outline-none transition ${
                    formik.touched.confirmed_register_url && formik.errors.confirmed_register_url
                      ? "border-rose-500/60 focus:border-rose-500"
                      : "border-white/10 focus:border-cyan-500"
                  }`}
                />
                {formik.touched.confirmed_register_url && formik.errors.confirmed_register_url && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">⚠️ {String(formik.errors.confirmed_register_url)}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Internal Governance & Technical Safeguards */}
        <div className="space-y-4 rounded-2xl border border-white/8 bg-[#061420]/60 p-5">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <h3 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
              3. Governance &amp; Safeguards Questionnaire
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
              DPDPA Sec. 8(6), 10 &amp; 13
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* DPIA Status */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label htmlFor="dpia_status" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                  DPIA Assessment Status
                </label>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/10 text-cyan-300">
                  Sec. 10(1)
                </span>
              </div>
              <select
                id="dpia_status"
                name="dpia_status"
                value={formik.values.dpia_status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              >
                <option value="NOT_CONDUCTED">Not Conducted</option>
                <option value="CONDUCTED">Conducted &amp; Documented</option>
                <option value="IN_PROGRESS">Currently In Progress</option>
                <option value="NOT_APPLICABLE">Not Applicable (Standard Data Fiduciary)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Data Protection Impact Assessment status for high-risk processing.</p>
            </div>

            {/* Consent Manager Type */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label htmlFor="consent_manager_type" className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Consent Manager Setup
                </label>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/10 text-cyan-300">
                  Sec. 6(1)
                </span>
              </div>
              <select
                id="consent_manager_type"
                name="consent_manager_type"
                value={formik.values.consent_manager_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              >
                <option value="NONE">No Consent Manager / Standard Banner</option>
                <option value="CUSTOM_CMP">Custom Consent Platform (CMP)</option>
                <option value="REGISTERED_CONSENT_MANAGER">Registered DPDP Consent Manager</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Interoperable consent management platform integration.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* Third-Party Data Processor Contracts (DPA) */}
            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                name="has_dpa_with_processors"
                type="checkbox"
                checked={formik.values.has_dpa_with_processors}
                onChange={formik.handleChange}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {formik.values.has_dpa_with_processors && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition flex items-center gap-2">
                  Data Processing Agreements (DPA) Executed
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/10 text-cyan-300">Sec. 8(2)</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Check if formal DPA contracts are executed with third-party vendors, cloud providers, and analytics tools.</p>
              </div>
            </label>

            {/* Data Breach Incident Response Plan */}
            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                name="has_incident_response_plan"
                type="checkbox"
                checked={formik.values.has_incident_response_plan}
                onChange={formik.handleChange}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {formik.values.has_incident_response_plan && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition flex items-center gap-2">
                  Documented Data Breach Incident Response Plan
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/10 text-cyan-300">Sec. 8(6)</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Check if procedures exist to notify the Data Protection Board and affected users upon a data breach.</p>
              </div>
            </label>

            {/* Grievance Redressal Officer */}
            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                name="has_grievance_officer"
                type="checkbox"
                checked={formik.values.has_grievance_officer}
                onChange={formik.handleChange}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {formik.values.has_grievance_officer && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition flex items-center gap-2">
                  Designated Grievance Redressal Officer
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-400/10 text-cyan-300">Sec. 13</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Check if a dedicated Grievance Officer contact mechanism is published for user data rights.</p>
              </div>
            </label>
          </div>

          {formik.values.has_grievance_officer && (
            <div className="pt-2 animate-fadeIn">
              <label htmlFor="grievance_officer_contact" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                Grievance Officer Email / Contact Link (Optional)
              </label>
              <input
                id="grievance_officer_contact"
                name="grievance_officer_contact"
                type="text"
                value={formik.values.grievance_officer_contact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="dpo@example.com or https://example.com/grievance"
                className={`w-full h-11 px-3 text-sm rounded-lg border bg-[#061420] text-slate-200 outline-none transition ${
                  formik.touched.grievance_officer_contact && formik.errors.grievance_officer_contact
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-white/10 focus:border-cyan-500"
                }`}
              />
              {formik.touched.grievance_officer_contact && formik.errors.grievance_officer_contact && (
                <p className="mt-1 text-xs text-rose-400 font-medium">⚠️ {String(formik.errors.grievance_officer_contact)}</p>
              )}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 text-sm font-medium rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-4 border-t border-white/8 flex justify-end">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-cyan-400 text-sm font-bold text-[#061420] hover:bg-cyan-300 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-cyan-400/20"
          >
            {isProcessing ? (
              <>
                <div className="size-4 rounded-full border-2 border-[#061420] border-t-transparent animate-spin" />
                <span>Starting Audit...</span>
              </>
            ) : (
              <>
                <DpdpIcon name="scan" className="size-4" />
                <span>Initiate DPDP Compliance Scan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
