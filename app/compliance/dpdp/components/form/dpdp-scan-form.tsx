"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useFormik } from "formik";
import { useDPDPStartScan } from "@/hooks/query-hooks/dpdp.query";
import { confirmationScanSchema, normalizeScanUrl } from "@/lib/validation/dpdp-scan.schema";
import { DpdpIcon } from "../common/dpdp-icon";
import { InfoModal, FieldHelpContent } from "../common/dpdp-info-modal";
import { DpdpScanFormProps, CustomUrl } from "../../types/dpdp-form.types";
import { DpdpFormWebAssets } from "./dpdp-form-web-assets";
import { DpdpFormDataScope } from "./dpdp-form-data-scope";
import { DpdpFormGovernance } from "./dpdp-form-governance";

const getUniqueId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 9);

export function DpdpScanForm({ scanRecord }: DpdpScanFormProps) {
  const startScanMutation = useDPDPStartScan();
  const [errorMessage, setErrorMessage] = useState("");
  const [activeHelp, setActiveHelp] = useState<FieldHelpContent | null>(null);

  const handleOpenHelp = useCallback((content: FieldHelpContent) => {
    setActiveHelp(content);
  }, []);

  const [customUrls, setCustomUrls] = useState<CustomUrl[]>(() => {
    const existing = (scanRecord as unknown as Record<string, unknown>).custom;
    if (Array.isArray(existing) && existing.length > 0) {
      return existing.map((e: Record<string, string>) => ({
        id: getUniqueId(),
        field_name: e.field_name || "",
        value: e.value || "",
      }));
    }
    return [];
  });

  const rec = scanRecord as unknown as Record<string, unknown>;

  const {
    discoveredPrivacy,
    discoveredTerms,
    discoveredSitemap,
    discoveredTrust,
    discoveredDisclaimer,
  } = useMemo(() => {
    const content = scanRecord.content as Record<string, string> | undefined;
    return {
      discoveredPrivacy: scanRecord.discovered_privacy_policy_url || content?.discovered_privacy_policy_url || "",
      discoveredTerms: scanRecord.discovered_terms_url || content?.discovered_terms_url || "",
      discoveredSitemap: scanRecord.discovered_sitemap_url || content?.discovered_sitemap_url || "",
      discoveredTrust: scanRecord.discovered_trust_security_url || content?.discovered_trust_security_url || "",
      discoveredDisclaimer: (scanRecord as unknown as Record<string, string>).discovered_disclaimer_url || content?.discovered_disclaimer_url || "",
    };
  }, [scanRecord]);

  const [confirmedUrls, setConfirmedUrls] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (scanRecord.confirmed_privacy_policy_url)  s.add("confirmed_privacy_policy_url");
    if (scanRecord.confirmed_terms_url)            s.add("confirmed_terms_url");
    if (scanRecord.confirmed_sitemap_url)          s.add("confirmed_sitemap_url");
    if (scanRecord.confirmed_trust_security_url)   s.add("confirmed_trust_security_url");
    if ((scanRecord as unknown as Record<string, string>).confirmed_disclaimer_url) s.add("confirmed_disclaimer_url");
    if (scanRecord.confirmed_login_url)            s.add("confirmed_login_url");
    if (scanRecord.confirmed_register_url)         s.add("confirmed_register_url");
    return s;
  });

  const [notAvailableUrls, setNotAvailableUrls] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (!scanRecord.confirmed_privacy_policy_url && !discoveredPrivacy) s.add("confirmed_privacy_policy_url");
    if (!scanRecord.confirmed_terms_url && !discoveredTerms) s.add("confirmed_terms_url");
    if (!scanRecord.confirmed_sitemap_url && !discoveredSitemap) s.add("confirmed_sitemap_url");
    if (!scanRecord.confirmed_trust_security_url && !discoveredTrust) s.add("confirmed_trust_security_url");
    if (!((scanRecord as unknown as Record<string, string>).confirmed_disclaimer_url) && !discoveredDisclaimer) s.add("confirmed_disclaimer_url");
    return s;
  });

  const toggleConfirmed = useCallback((field: string) => {
    setConfirmedUrls((prev) => {
      const n = new Set(prev);
      n.add(field);
      return n;
    });
  }, []);

  const toggleNotAvailable = useCallback((field: string) => {
    setNotAvailableUrls((prev) => {
      const n = new Set(prev);
      if (n.has(field)) n.delete(field);
      else n.add(field);
      return n;
    });
  }, []);

  const initialPrivacy     = scanRecord.confirmed_privacy_policy_url  || discoveredPrivacy    || "";
  const initialTerms       = scanRecord.confirmed_terms_url            || discoveredTerms      || "";
  const initialSitemap     = scanRecord.confirmed_sitemap_url          || discoveredSitemap    || "";
  const initialTrust       = scanRecord.confirmed_trust_security_url   || discoveredTrust      || "";
  const initialDisclaimer  = (scanRecord as unknown as Record<string, string>).confirmed_disclaimer_url || discoveredDisclaimer || "";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      confirmed_privacy_policy_url: initialPrivacy,
      confirmed_terms_url:          initialTerms,
      confirmed_sitemap_url:        initialSitemap,
      confirmed_trust_security_url: initialTrust,
      confirmed_disclaimer_url:     initialDisclaimer,
      confirmed_login_url:          scanRecord.confirmed_login_url    || "",
      confirmed_register_url:       scanRecord.confirmed_register_url || "",
      app_type:                     scanRecord.app_type               || "SaaS",
      app_description:              scanRecord.app_description        || "",
      data_retention_period:        scanRecord.data_retention_period  || "12 Months (1 Year)",
      processes_children_data:      Boolean(scanRecord.processes_children_data),
      processes_sensitive_data:     Boolean(scanRecord.processes_sensitive_data),
      has_login_or_user_management: Boolean(scanRecord.has_login_or_user_management),
      has_grievance_officer:        Boolean(rec.has_grievance_officer),
      grievance_officer_contact:    String(rec.grievance_officer_contact || ""),
      has_dpa_with_processors:      Boolean(rec.has_dpa_with_processors),
      has_incident_response_plan:   Boolean(rec.has_incident_response_plan),
      dpia_status:                  String(rec.dpia_status || "NOT_CONDUCTED"),
      consent_manager_type:         String(rec.consent_manager_type || "NONE"),
    },
    validationSchema: confirmationScanSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values, { setSubmitting }) => {
      setErrorMessage("");
      const na = notAvailableUrls;

      const unconfirmedFields: string[] = [];
      if (discoveredPrivacy && values.confirmed_privacy_policy_url === discoveredPrivacy && !confirmedUrls.has("confirmed_privacy_policy_url") && !na.has("confirmed_privacy_policy_url")) {
        unconfirmedFields.push("Privacy Policy URL");
      }
      if (discoveredTerms && values.confirmed_terms_url === discoveredTerms && !confirmedUrls.has("confirmed_terms_url") && !na.has("confirmed_terms_url")) {
        unconfirmedFields.push("Terms of Service URL");
      }
      if (discoveredSitemap && values.confirmed_sitemap_url === discoveredSitemap && !confirmedUrls.has("confirmed_sitemap_url") && !na.has("confirmed_sitemap_url")) {
        unconfirmedFields.push("Sitemap URL");
      }
      if (discoveredTrust && values.confirmed_trust_security_url === discoveredTrust && !confirmedUrls.has("confirmed_trust_security_url") && !na.has("confirmed_trust_security_url")) {
        unconfirmedFields.push("Security / Trust Center URL");
      }
      if (discoveredDisclaimer && values.confirmed_disclaimer_url === discoveredDisclaimer && !confirmedUrls.has("confirmed_disclaimer_url") && !na.has("confirmed_disclaimer_url")) {
        unconfirmedFields.push("Disclaimer URL");
      }

      if (unconfirmedFields.length > 0) {
        setSubmitting(false);
        setErrorMessage(`Please review and click "✓ Confirm" on auto-discovered URLs before submitting: ${unconfirmedFields.join(", ")}`);
        return;
      }

      startScanMutation.mutate(
        {
          scan_id:    scanRecord.scan_id,
          target_url: scanRecord.target_url || scanRecord.domain,
          confirmed_privacy_policy_url:  !na.has("confirmed_privacy_policy_url")  && values.confirmed_privacy_policy_url  ? normalizeScanUrl(values.confirmed_privacy_policy_url,  "full") : "",
          confirmed_terms_url:           !na.has("confirmed_terms_url")            && values.confirmed_terms_url            ? normalizeScanUrl(values.confirmed_terms_url,            "full") : "",
          confirmed_sitemap_url:         !na.has("confirmed_sitemap_url")          && values.confirmed_sitemap_url          ? normalizeScanUrl(values.confirmed_sitemap_url,          "full") : "",
          confirmed_trust_security_url:  !na.has("confirmed_trust_security_url")   && values.confirmed_trust_security_url   ? normalizeScanUrl(values.confirmed_trust_security_url,   "full") : "",
          confirmed_disclaimer_url:       !na.has("confirmed_disclaimer_url")        && values.confirmed_disclaimer_url        ? normalizeScanUrl(values.confirmed_disclaimer_url,        "full") : "",
          confirmed_login_url:           !na.has("confirmed_login_url")            && values.confirmed_login_url            ? normalizeScanUrl(values.confirmed_login_url,            "full") : "",
          confirmed_register_url:        !na.has("confirmed_register_url")         && values.confirmed_register_url         ? normalizeScanUrl(values.confirmed_register_url,         "full") : "",
          app_type:                      values.app_type,
          app_description:               values.app_description || "",
          data_retention_period:         values.data_retention_period,
          processes_children_data:       Boolean(values.processes_children_data),
          processes_sensitive_data:      Boolean(values.processes_sensitive_data),
          has_login_or_user_management:  Boolean(values.has_login_or_user_management),
          has_grievance_officer:         Boolean(values.has_grievance_officer),
          grievance_officer_contact:     values.grievance_officer_contact || "",
          has_dpa_with_processors:       Boolean(values.has_dpa_with_processors),
          has_incident_response_plan:    Boolean(values.has_incident_response_plan),
          dpia_status:                   values.dpia_status || "NOT_CONDUCTED",
          consent_manager_type:          values.consent_manager_type || "NONE",
          custom: customUrls
            .filter((u) => u.field_name.trim() && u.value.trim())
            .map((u) => ({ field_name: u.field_name.trim(), value: u.value.trim() })),
        },
        { onError: (err) => { setSubmitting(false); setErrorMessage(err.message || "Failed to trigger compliance scan."); } }
      );
    },
  });

  const isProcessing = formik.isSubmitting || startScanMutation.isPending;
  const fv = formik.values;
  const fe = formik.errors;
  const ft = formik.touched;

  const handleConfirm = useCallback((field: string) => {
    toggleConfirmed(field);
  }, [toggleConfirmed]);

  const handleToggleNotAvailable = useCallback((field: string) => {
    toggleNotAvailable(field);
  }, [toggleNotAvailable]);

  const setFieldValue = formik.setFieldValue;
  const handleChange = formik.handleChange;
  const handleBlur = formik.handleBlur;

  const handleClearValue = useCallback((field: string) => {
    setFieldValue(field, "");
  }, [setFieldValue]);

  const urlFieldProps = useCallback((field: keyof typeof fv, discovered: string, helpContent?: FieldHelpContent) => ({
    discoveredValue:      discovered,
    isConfirmed:          confirmedUrls.has(field as string),
    onConfirm:            () => handleConfirm(field as string),
    isNotAvailable:       notAvailableUrls.has(field as string),
    onToggleNotAvailable: () => handleToggleNotAvailable(field as string),
    onClearValue:         () => handleClearValue(field as string),
    value:                (fv[field] as string) ?? "",
    onChange:             handleChange,
    onBlur:               handleBlur,
    error:                String(fe[field] || ""),
    touched:              Boolean(ft[field]),
    helpContent,
    onOpenHelp:           handleOpenHelp,
  }), [confirmedUrls, notAvailableUrls, fv, fe, ft, handleConfirm, handleToggleNotAvailable, handleClearValue, handleChange, handleBlur, handleOpenHelp]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5">
        <span className="text-amber-400 shrink-0 text-sm">⚠</span>
        <p className="text-xs text-slate-400 leading-relaxed">
          External assets (notices, cookies, CSP) are crawled automatically.{" "}
          <span className="text-amber-300 font-medium">DPIA, DPA contracts & Grievance Redressal</span>
          {" "}require your input below for a complete DPDPA 2023 report.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <DpdpFormWebAssets
            urlFieldProps={urlFieldProps}
            discoveredPrivacy={discoveredPrivacy}
            discoveredTerms={discoveredTerms}
            discoveredSitemap={discoveredSitemap}
            discoveredTrust={discoveredTrust}
            discoveredDisclaimer={discoveredDisclaimer}
            customUrls={customUrls}
            setCustomUrls={setCustomUrls}
          />
          <DpdpFormDataScope
            formik={formik}
            handleOpenHelp={handleOpenHelp}
            urlFieldProps={urlFieldProps}
            setNotAvailableUrls={setNotAvailableUrls}
          />
        </div>

        <DpdpFormGovernance
          formik={formik}
          handleOpenHelp={handleOpenHelp}
          urlFieldProps={urlFieldProps}
        />

        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/8 text-rose-300 text-sm">
            <span className="text-rose-400 mt-0.5 shrink-0">✕</span>
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isProcessing}
            className="h-11 px-8 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-sm font-bold text-[#061420]
              hover:from-cyan-300 hover:to-teal-300 active:scale-[0.98] transition-all
              flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed
              shadow-lg shadow-cyan-500/20 w-full sm:w-auto justify-center cursor-pointer"
          >
            {isProcessing ? (
              <><div className="size-4 rounded-full border-2 border-[#061420]/50 border-t-[#061420] animate-spin" />Starting Audit…</>
            ) : (
              <><DpdpIcon name="scan" className="size-4" />Initiate DPDP Compliance Scan</>
            )}
          </button>
        </div>
      </form>

      <InfoModal
        isOpen={Boolean(activeHelp)}
        onClose={() => setActiveHelp(null)}
        content={activeHelp}
      />
    </div>
  );
}
