import { SessionCertificate } from "./secure-api";

let cachedKeyPair: CryptoKeyPair | null = null;
let cachedCert: SessionCertificate | null = null;
let registrationPromise: Promise<{
  keyPair: CryptoKeyPair | null;
  cert: SessionCertificate | null;
}> | null = null;

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getClientSessionCert(
  registerAction: (publicKeyHex: string) => Promise<SessionCertificate | null>,
  expectedUserId = "anonymous"
) {
  if (typeof window === "undefined") {
    return { keyPair: null, cert: null };
  }

  if (
    cachedKeyPair &&
    cachedCert &&
    cachedCert.userId === expectedUserId &&
    cachedCert.expiry > Math.floor(Date.now() / 1000) + 10
  ) {
    return { keyPair: cachedKeyPair, cert: cachedCert };
  }

  if (registrationPromise) {
    return registrationPromise;
  }

  registrationPromise = (async () => {
    try {
      const keyPair = (await window.crypto.subtle.generateKey(
        { name: "Ed25519" },
        true,
        ["sign", "verify"]
      )) as CryptoKeyPair;

      const exportedPublic = await window.crypto.subtle.exportKey(
        "raw",
        keyPair.publicKey
      );
      const cert = await registerAction(bufferToHex(exportedPublic));

      if (!cert) {
        throw new Error("Failed to register Hub Connect session key");
      }

      cachedKeyPair = keyPair;
      cachedCert = cert;
      return { keyPair, cert };
    } catch (error) {
      console.error("Hub Connect session key registration failed:", error);
      cachedKeyPair = null;
      cachedCert = null;
      return { keyPair: null, cert: null };
    } finally {
      registrationPromise = null;
    }
  })();

  return registrationPromise;
}

export async function signRequestClientSide({
  keyPair,
  userId,
  timestamp,
  requestId,
  method,
  path,
  body,
}: {
  keyPair: CryptoKeyPair;
  userId: string;
  timestamp: string;
  requestId: string;
  method: string;
  path: string;
  body: string;
}) {
  const bodyHash = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body)
  );
  const payload = `${userId}:${timestamp}:${requestId}:${method.toUpperCase()}:${path}:${bufferToHex(bodyHash)}`;
  const signature = await window.crypto.subtle.sign(
    { name: "Ed25519" },
    keyPair.privateKey,
    new TextEncoder().encode(payload)
  );

  return bufferToHex(signature);
}

export function clearClientSessionCache() {
  cachedKeyPair = null;
  cachedCert = null;
  registrationPromise = null;
}
