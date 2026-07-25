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
      <div className="border-b border-white/8 pb-5">
        <h2 className="text-xl font-bold text-white sm:text-2xl flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <DpdpIcon name="scan" className="size-4" />
          </span>
          Confirm Scan Audit Targets
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Review the discovered links for <span className="font-semibold text-slate-200">{scanRecord.domain}</span> and answer the technical questionnaire below to tailor the compliance check.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6">
        {/* URL Targets Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">1. Web Assets &amp; Documents</h3>
          
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

        {/* Business Questionnaire */}
        <div className="space-y-4 pt-4 border-t border-white/8">
          <h3 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">2. Platform Specifications</h3>

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
                <p className="text-xs text-slate-400 mt-0.5">Check if you collect details of users under 18 (requires parental consent safeguards under Sec. 8 DPDP).</p>
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
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">Processes Sensitive Data</span>
                <p className="text-xs text-slate-400 mt-0.5">Check if you store health, financial, biometric, or identity data that poses higher security risks.</p>
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
                <p className="text-xs text-slate-400 mt-0.5">Check if your portal allows user registration and login management.</p>
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

        {errorMessage && (
          <div className="p-3 text-sm font-medium rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300">
            {errorMessage}
          </div>
        )}

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
