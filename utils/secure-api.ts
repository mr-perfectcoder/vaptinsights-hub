import crypto from "crypto";

export interface SessionCertificate {
  userId: string;
  publicKey: string;
  expiry: number;
  signature: string;
}

let cachedPrivateKey: crypto.KeyObject | null = null;
let cachedPublicKeyHex = "";

function getPrivateKey(): { privateKey: crypto.KeyObject; publicKeyHex: string } {
  if (cachedPrivateKey) {
    return {
      privateKey: cachedPrivateKey,
      publicKeyHex: cachedPublicKeyHex,
    };
  }

  const rawKey =
    process.env.HUB_CONNECT_DELEGATION_ED25519_PRIVATE_KEY ||
    process.env.VT_CONNECT_DELEGATION_ED25519_PRIVATE_KEY;

  if (!rawKey) {
    throw new Error("HUB_CONNECT_DELEGATION_ED25519_PRIVATE_KEY is not configured.");
  }

  const cleanHex = rawKey.replace(/[^0-9a-fA-F]/g, "");
  let pkcs8Hex: string;

  if (cleanHex.length === 128) {
    const seedHex = cleanHex.substring(0, 64);
    pkcs8Hex = `302e020100300506032b657004220420${seedHex}`;
  } else if (cleanHex.length === 96) {
    pkcs8Hex = cleanHex;
  } else if (cleanHex.length === 64) {
    pkcs8Hex = `302e020100300506032b657004220420${cleanHex}`;
  } else {
    throw new Error(
      `HUB_CONNECT_DELEGATION_ED25519_PRIVATE_KEY has unexpected length: ${cleanHex.length} hex chars`
    );
  }

  const privateKey = crypto.createPrivateKey({
    key: Buffer.from(pkcs8Hex, "hex"),
    format: "der",
    type: "pkcs8",
  });
  const publicKey = crypto.createPublicKey(privateKey);
  const publicKeyDer = publicKey.export({ format: "der", type: "spki" });

  cachedPrivateKey = privateKey;
  cachedPublicKeyHex = publicKeyDer.toString("hex").slice(-64);

  return {
    privateKey: cachedPrivateKey,
    publicKeyHex: cachedPublicKeyHex,
  };
}

export async function createSessionCertificate(
  browserPublicKey: string,
  userId = "anonymous"
): Promise<SessionCertificate | null> {
  try {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const certPayload = `${userId}:${browserPublicKey}:${expiry}`;
    const { privateKey } = getPrivateKey();
    const signature = crypto
      .sign(null, Buffer.from(certPayload), privateKey)
      .toString("hex");

    return {
      userId,
      publicKey: browserPublicKey,
      expiry,
      signature,
    };
  } catch (error) {
    console.error("Failed to register Hub Connect session key:", error);
    return null;
  }
}
