"use server";

import { createSessionCertificate, SessionCertificate } from "./secure-api";

export async function registerSessionKey(
  browserPublicKey: string,
  userId = "anonymous",
  turnstileToken?: string
): Promise<SessionCertificate | null> {
  if (userId === "anonymous" && process.env.NODE_ENV !== "development") {
    if (!turnstileToken) {
      throw new Error("Turnstile validation failed: missing token.");
    }
    const formData = new URLSearchParams();
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
    formData.append("response", turnstileToken);

    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: formData,
      method: "POST",
    });
    const outcome = await result.json();
    if (!outcome.success) {
      throw new Error("Turnstile validation failed: invalid token.");
    }
  }

  return createSessionCertificate(browserPublicKey, userId);
}
