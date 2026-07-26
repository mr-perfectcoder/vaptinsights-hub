"use server";

import { createSessionCertificate, SessionCertificate } from "./secure-api";

export async function registerSessionKey(
  browserPublicKey: string,
  userId = "anonymous"
): Promise<SessionCertificate | null> {
  return createSessionCertificate(browserPublicKey, userId);
}
