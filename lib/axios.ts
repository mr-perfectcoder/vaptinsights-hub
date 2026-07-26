"use client";

import axios from "axios";
import { getClientSessionCert, signRequestClientSide } from "@/utils/client-crypto";
import { registerSessionKey } from "@/utils/secure-api-actions";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

function encodeDelegationCert(cert: unknown) {
  return btoa(JSON.stringify(cert));
}

function requestBody(data: unknown) {
  if (data === undefined || data === null) {
    return "";
  }
  if (typeof data === "string") {
    return data;
  }
  return JSON.stringify(data);
}

axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window === "undefined" || !config.url) {
    return config;
  }

  const baseURL = config.baseURL || axiosInstance.defaults.baseURL || window.location.origin;
  const requestURL = new URL(config.url, baseURL);
  const backendPath = requestURL.pathname;

  const method = (config.method || "get").toUpperCase();
  const body = method === "GET" || method === "HEAD" ? "" : requestBody(config.data);
  const expectedUserId = "anonymous";

  const { keyPair, cert } = await getClientSessionCert(
    (browserPublicKey) => registerSessionKey(browserPublicKey, expectedUserId),
    expectedUserId
  );

  if (!keyPair || !cert) {
    throw new Error("Unable to prepare Hub Connect request signature.");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const requestId = crypto.randomUUID();
  const signature = await signRequestClientSide({
    keyPair,
    userId: cert.userId,
    timestamp,
    requestId,
    method,
    path: backendPath,
    body,
  });

  config.headers.set("X-Timestamp", timestamp);
  config.headers.set("X-Request-ID", requestId);
  config.headers.set("X-Signature", signature);
  config.headers.set("X-Delegation-Cert", encodeDelegationCert(cert));

  if (body) {
    config.data = body;
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});

export default axiosInstance;
