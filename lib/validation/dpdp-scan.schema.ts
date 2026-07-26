import * as Yup from "yup";

/**
 * Normalizes user-input URL strings.
 * @param input Raw user string input
 * @param mode 'origin' for landing page (strips path/query/hash), 'full' for confirmation form
 * @returns Clean, normalized URL string
 */
export function normalizeScanUrl(
  input: string,
  mode: "origin" | "full" = "origin"
): string {
  let trimmed = (input || "").trim();
  if (!trimmed) return "";

  // Prepend protocol if missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (mode === "origin") {
      return parsed.origin;
    }
    return parsed.href;
  } catch {
    return trimmed;
  }
}

/**
 * Checks if a hostname is localhost, a loopback, or a private IP address (RFC 1918).
 */
function isPrivateOrLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") {
    return true;
  }

  // 10.0.0.0/8
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;

  // 172.16.0.0/12
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;

  // 192.168.0.0/16
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;

  // 169.254.0.0/16 (Link-local)
  if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(host)) return true;

  return false;
}

/**
 * Schema for Homepage Scanner Input (`dpdp-homepage.tsx`).
 * Normalizes input to origin (e.g. https://example.com).
 */
export const homepageScanSchema = Yup.object().shape({
  url: Yup.string()
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .required("Please enter a valid website URL")
    .max(2048, "URL is too long (maximum 2048 characters)")
    .test(
      "is-valid-website-url",
      "Please enter a valid, reachable domain (e.g. example.com)",
      (value) => {
        if (!value) return false;
        let target = value.trim();

        // Reject script injections or non-HTTP protocols
        if (/^(javascript|data|vbscript|file|ftp):/i.test(target)) {
          return false;
        }

        if (!/^https?:\/\//i.test(target)) {
          target = `https://${target}`;
        }

        try {
          const parsed = new URL(target);
          if (!["http:", "https:"].includes(parsed.protocol)) {
            return false;
          }
          if (isPrivateOrLocalHost(parsed.hostname)) {
            return false;
          }
          // Must contain a valid TLD dot unless IP address
          if (!parsed.hostname.includes(".") && !/^\d+\.\d+\.\d+\.\d+$/.test(parsed.hostname)) {
            return false;
          }
          return true;
        } catch {
          return false;
        }
      }
    ),
});

/**
 * Helper validator for optional document URLs on confirmation form (`dpdp-scan-form.tsx`).
 */
function optionalUrlValidator(value: string | undefined | null): boolean {
  if (!value || !value.trim()) return true;
  let target = value.trim();

  if (/^(javascript|data|vbscript|file|ftp):/i.test(target)) {
    return false;
  }

  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  try {
    const parsed = new URL(target);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    if (isPrivateOrLocalHost(parsed.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Schema for Confirmation Form (`dpdp-scan-form.tsx`).
 * Preserves full URLs (paths, query strings, custom ports).
 */
export const confirmationScanSchema = Yup.object().shape({
  confirmed_privacy_policy_url: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .max(2048, "URL is too long")
    .test("is-valid-privacy-url", "Please enter a valid Privacy Policy URL", optionalUrlValidator),

  confirmed_terms_url: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .max(2048, "URL is too long")
    .test("is-valid-terms-url", "Please enter a valid Terms of Service URL", optionalUrlValidator),

  confirmed_sitemap_url: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .max(2048, "URL is too long")
    .test("is-valid-sitemap-url", "Please enter a valid Sitemap URL", optionalUrlValidator),

  confirmed_login_url: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .max(2048, "URL is too long")
    .test("is-valid-login-url", "Please enter a valid Login URL", optionalUrlValidator),

  confirmed_trust_security_url: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .max(2048, "URL is too long")
    .test("is-valid-trust-url", "Please enter a valid Trust & Security URL", optionalUrlValidator),

  confirmed_disclaimer_url: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .max(2048, "URL is too long")
    .test("is-valid-disclaimer-url", "Please enter a valid Disclaimer URL", optionalUrlValidator),

  app_type: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .required("Application type is required")
    .min(2, "Application type must be at least 2 characters")
    .max(100, "Application type is too long"),

  app_description: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .required("Application description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  has_grievance_officer: Yup.boolean(),
  grievance_officer_contact: Yup.string()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .max(2048, "Contact URL/email is too long"),
  has_dpa_with_processors: Yup.boolean(),
  has_incident_response_plan: Yup.boolean(),
  dpia_status: Yup.string().oneOf(
    ["CONDUCTED", "NOT_CONDUCTED", "IN_PROGRESS", "NOT_APPLICABLE"],
    "Please select a valid DPIA status"
  ),
  consent_manager_type: Yup.string().oneOf(
    ["NONE", "CUSTOM_CMP", "REGISTERED_CONSENT_MANAGER"],
    "Please select a valid Consent Manager type"
  ),
});
