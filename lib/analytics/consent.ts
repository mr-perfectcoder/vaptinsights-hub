export const CONSENT_STORAGE_KEY = "vapt_cookie_consent";
export type ConsentPreference = "undecided" | "accepted" | "declined";
export type ConsentValue = "granted" | "denied";

type GtagArguments = [command: string, target: string, parameters?: Record<string, unknown>];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: GtagArguments) => void;
  }
}

export function ensureDataLayer(): unknown[] | null {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function queueGtag(...args: GtagArguments): boolean {
  const dataLayer = ensureDataLayer();
  if (!dataLayer) return false;
  if (window.gtag) {
    window.gtag(...args);
    return true;
  }
  dataLayer.push(args);
  return true;
}

const consentSignals = (value: ConsentValue) => ({
  analytics_storage: value,
  ad_storage: value,
  ad_user_data: value,
  ad_personalization: value,
});

export function applyConsentDefault(): void {
  queueGtag("consent", "default", { ...consentSignals("denied"), wait_for_update: 500 });
}

export function getConsentPreference(): ConsentPreference {
  if (typeof window === "undefined") return "undecided";
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : "undecided";
  } catch {
    return "undecided";
  }
}

export function setConsentPreference(preference: Exclude<ConsentPreference, "undecided">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, preference);
  } catch {
    // Storage may be blocked; consent remains denied in that case.
  }
  queueGtag("consent", "update", consentSignals(preference === "accepted" ? "granted" : "denied"));
  window.dispatchEvent(new CustomEvent("vapt:analytics-consent", { detail: preference }));
}

export function restoreConsentPreference(): ConsentPreference {
  const preference = getConsentPreference();
  if (preference !== "undecided") {
    queueGtag("consent", "update", consentSignals(preference === "accepted" ? "granted" : "denied"));
  }
  return preference;
}
