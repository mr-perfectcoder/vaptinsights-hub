"use client";

import React from "react";
import { SectionCard } from "../common/dpdp-section-card";
import { UrlField } from "./dpdp-url-field";
import { CustomUrlsSection } from "./dpdp-custom-urls-section";
import { DPDP_FIELD_HELP } from "../../constants/dpdp-field-help";
import { CustomUrl } from "../../types/dpdp-form.types";

interface DpdpFormWebAssetsProps {
  urlFieldProps: (field: any, discovered: string, helpContent?: any) => any;
  discoveredPrivacy: string;
  discoveredTerms: string;
  discoveredSitemap: string;
  discoveredTrust: string;
  discoveredDisclaimer: string;
  customUrls: CustomUrl[];
  setCustomUrls: React.Dispatch<React.SetStateAction<CustomUrl[]>>;
}

export const DpdpFormWebAssets = React.memo(function DpdpFormWebAssets({
  urlFieldProps,
  discoveredPrivacy,
  discoveredTerms,
  discoveredSitemap,
  discoveredTrust,
  discoveredDisclaimer,
  customUrls,
  setCustomUrls,
}: DpdpFormWebAssetsProps) {
  return (
    <SectionCard step="01" title="Web Assets & Public Documents" badge="Sec. 5 & 6">
      <div className="grid grid-cols-1 gap-4">
        <UrlField
          id="confirmed_privacy_policy_url"
          name="confirmed_privacy_policy_url"
          label="Privacy Policy URL"
          placeholder="https://example.com/privacy"
          {...urlFieldProps("confirmed_privacy_policy_url", discoveredPrivacy, DPDP_FIELD_HELP.privacyPolicy)}
        />
        <UrlField
          id="confirmed_terms_url"
          name="confirmed_terms_url"
          label="Terms of Service URL"
          placeholder="https://example.com/terms"
          {...urlFieldProps("confirmed_terms_url", discoveredTerms, DPDP_FIELD_HELP.termsOfService)}
        />
        <UrlField
          id="confirmed_sitemap_url"
          name="confirmed_sitemap_url"
          label="Sitemap URL (optional)"
          placeholder="https://example.com/sitemap.xml"
          {...urlFieldProps("confirmed_sitemap_url", discoveredSitemap, DPDP_FIELD_HELP.sitemap)}
        />
        <UrlField
          id="confirmed_trust_security_url"
          name="confirmed_trust_security_url"
          label="Security / Trust Center URL (optional)"
          placeholder="https://example.com/security"
          {...urlFieldProps("confirmed_trust_security_url", discoveredTrust, DPDP_FIELD_HELP.trustSecurity)}
        />
        <UrlField
          id="confirmed_disclaimer_url"
          name="confirmed_disclaimer_url"
          label="Disclaimer URL (optional)"
          placeholder="https://example.com/disclaimer"
          {...urlFieldProps("confirmed_disclaimer_url", discoveredDisclaimer, DPDP_FIELD_HELP.disclaimer)}
        />
      </div>

      <div className="pt-4 border-t border-white/6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Custom Legal Pages</span>
            <span className="px-1.5 rounded text-xs font-mono font-bold bg-slate-700/50 text-slate-500 border border-white/6">optional</span>
          </div>
          {customUrls.length > 0 && <span className="text-xs text-slate-600">{customUrls.length} added</span>}
        </div>
        <CustomUrlsSection items={customUrls} onChange={setCustomUrls} />
      </div>
    </SectionCard>
  );
});
