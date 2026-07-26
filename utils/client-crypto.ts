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

function hexToBuffer(hex: string) {
  const match = hex.match(/.{1,2}/g);
  if (!match) return new Uint8Array(0).buffer;
  return new Uint8Array(match.map(byte => parseInt(byte, 16))).buffer;
}

export async function getClientSessionCert(
  registerAction: (publicKeyHex: string) => Promise<SessionCertificate | null>,
  expectedUserId = "anonymous"
) {
  if (typeof window === "undefined") {
    return { keyPair: null, cert: null };
  }

  // Check memory cache
  if (
    cachedKeyPair &&
    cachedCert &&
    cachedCert.userId === expectedUserId &&
    cachedCert.expiry > Math.floor(Date.now() / 1000) + 10
  ) {
    return { keyPair: cachedKeyPair, cert: cachedCert };
  }

  // Check localStorage cache
  try {
    const cachedStr = localStorage.getItem(`vapt_session_cert_${expectedUserId}`);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (cached.cert && cached.cert.expiry > Math.floor(Date.now() / 1000) + 10) {
        const privateKey = await window.crypto.subtle.importKey(
          "pkcs8",
          hexToBuffer(cached.privHex),
          { name: "Ed25519" },
          true,
          ["sign"]
        );
        const publicKey = await window.crypto.subtle.importKey(
          "spki",
          hexToBuffer(cached.pubHex),
          { name: "Ed25519" },
          true,
          ["verify"]
        );
        cachedKeyPair = { publicKey, privateKey };
        cachedCert = cached.cert;
        return { keyPair: cachedKeyPair, cert: cachedCert };
      }
    }
  } catch (e) {
    // Ignore cache load errors and fall through to generate new key
    console.warn("Failed to load cached session cert:", e);
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

      // Save to localStorage
      try {
        const privHex = bufferToHex(await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey));
        const pubHex = bufferToHex(await window.crypto.subtle.exportKey("spki", keyPair.publicKey));
        localStorage.setItem(`vapt_session_cert_${expectedUserId}`, JSON.stringify({
          cert,
          privHex,
          pubHex,
        }));
      } catch (e) {
        console.warn("Failed to cache session cert to localStorage:", e);
      }

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
