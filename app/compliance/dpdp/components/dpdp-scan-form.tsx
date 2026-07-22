"use client";

import React, { useState } from "react";
import { useDPDPStartScan, ScanStatusResponse } from "@/hooks/query-hooks/dpdp.query";
import { DpdpIcon } from "./dpdp-icon";

interface DpdpScanFormProps {
  scanRecord: ScanStatusResponse;
}

export function DpdpScanForm({ scanRecord }: DpdpScanFormProps) {
  const startScanMutation = useDPDPStartScan();

  const [privacyPolicy, setPrivacyPolicy] = useState(
    scanRecord.confirmed_privacy_policy_url || 
    scanRecord.discovered_privacy_policy_url || 
    scanRecord.content?.documents?.confirmed_privacy_policy_url || 
    scanRecord.content?.discovered_privacy_policy_url || ""
  );
  const [termsUrl, setTermsUrl] = useState(
    scanRecord.confirmed_terms_url || 
    scanRecord.discovered_terms_url || 
    scanRecord.content?.documents?.confirmed_terms_url || 
    scanRecord.content?.discovered_terms_url || ""
  );
  const [sitemapUrl, setSitemapUrl] = useState(
    scanRecord.confirmed_sitemap_url || 
    scanRecord.discovered_sitemap_url || 
    scanRecord.content?.documents?.confirmed_sitemap_url || 
    scanRecord.content?.discovered_sitemap_url || ""
  );
  const [trustSecurityUrl, setTrustSecurityUrl] = useState(
    scanRecord.confirmed_trust_security_url || 
    scanRecord.discovered_trust_security_url || 
    scanRecord.content?.documents?.confirmed_trust_security_url || 
    scanRecord.content?.discovered_trust_security_url || ""
  );
  
  const [appType, setAppType] = useState(scanRecord.app_type || "SaaS");
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState(scanRecord.data_retention_period || "12 Months (1 Year)");
  const [processesChildrenData, setProcessesChildrenData] = useState(scanRecord.processes_children_data || false);
  const [processesSensitiveData, setProcessesSensitiveData] = useState(scanRecord.processes_sensitive_data || false);
  const [hasLoginOrUserManagement, setHasLoginOrUserManagement] = useState(scanRecord.has_login_or_user_management || false);
  const [loginUrl, setLoginUrl] = useState(scanRecord.confirmed_login_url || "");
  const [registerUrl, setRegisterUrl] = useState(scanRecord.confirmed_register_url || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    startScanMutation.mutate({
      scan_id: scanRecord.scan_id,
      target_url: scanRecord.target_url || scanRecord.domain,
      confirmed_privacy_policy_url: privacyPolicy,
      confirmed_terms_url: termsUrl,
      confirmed_sitemap_url: sitemapUrl,
      confirmed_trust_security_url: trustSecurityUrl,
      confirmed_login_url: loginUrl,
      confirmed_register_url: registerUrl,
      app_type: appType,
      data_retention_period: dataRetentionPeriod,
      processes_children_data: processesChildrenData,
      processes_sensitive_data: processesSensitiveData,
      has_login_or_user_management: hasLoginOrUserManagement,
    }, {
      onError: (err) => {
        setErrorMessage(err.message || "Failed to trigger compliance scan.");
      }
    });
  };

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

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* URL Targets Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">1. Web Assets & Documents</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Privacy Policy URL</label>
              <input
                type="text"
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                placeholder="https://..."
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Terms of Service URL</label>
              <input
                type="text"
                value={termsUrl}
                onChange={(e) => setTermsUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Sitemap URL (Optional)</label>
              <input
                type="text"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Security / Trust Center URL (Optional)</label>
              <input
                type="text"
                value={trustSecurityUrl}
                onChange={(e) => setTrustSecurityUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Business Questionnaire */}
        <div className="space-y-4 pt-4 border-t border-white/8">
          <h3 className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">2. Platform Specifications</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Application Type</label>
              <select
                value={appType}
                onChange={(e) => setAppType(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
              >
                <option value="SaaS">SaaS Application</option>
                <option value="Web App">Web Application</option>
                <option value="Mobile App">Mobile Application</option>
                <option value="E-commerce">E-Commerce Store</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Data Retention Policy</label>
              <select
                value={dataRetentionPeriod}
                onChange={(e) => setDataRetentionPeriod(e.target.value)}
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
                type="checkbox"
                checked={processesChildrenData}
                onChange={(e) => setProcessesChildrenData(e.target.checked)}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {processesChildrenData && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">Processes Children's Personal Data</span>
                <p className="text-xs text-slate-400 mt-0.5">Check if you collect details of users under 18 (requires parental consent safeguards under Sec. 8 DPDP).</p>
              </div>
            </label>

            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={processesSensitiveData}
                onChange={(e) => setProcessesSensitiveData(e.target.checked)}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {processesSensitiveData && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">Processes Sensitive Data</span>
                <p className="text-xs text-slate-400 mt-0.5">Check if you store health, financial, biometric, or identity data that poses higher security risks.</p>
              </div>
            </label>

            <label className="relative flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasLoginOrUserManagement}
                onChange={(e) => setHasLoginOrUserManagement(e.target.checked)}
                className="peer sr-only"
              />
              <span className="size-5 shrink-0 rounded border border-white/20 bg-[#061420] flex items-center justify-center text-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition">
                {hasLoginOrUserManagement && "✓"}
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">Has User Accounts or Login System</span>
                <p className="text-xs text-slate-400 mt-0.5">Check if your portal allows user registration and login management.</p>
              </div>
            </label>
          </div>

          {hasLoginOrUserManagement && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Login URL</label>
                <input
                  type="text"
                  value={loginUrl}
                  onChange={(e) => setLoginUrl(e.target.value)}
                  placeholder="https://.../login"
                  className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Registration URL</label>
                <input
                  type="text"
                  value={registerUrl}
                  onChange={(e) => setRegisterUrl(e.target.value)}
                  placeholder="https://.../register"
                  className="w-full h-11 px-3 text-sm rounded-lg border border-white/10 bg-[#061420] text-slate-200 outline-none focus:border-cyan-500 transition"
                />
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
            disabled={startScanMutation.isPending}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-cyan-400 text-sm font-bold text-[#061420] hover:bg-cyan-300 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <DpdpIcon name="scan" className="size-4" />
            {startScanMutation.isPending ? "Starting Audit..." : "Initiate DPDP Compliance Scan"}
          </button>
        </div>
      </form>
    </div>
  );
}
