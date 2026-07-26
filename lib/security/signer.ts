import crypto from "crypto";

export interface SecureRequestHeaders {
  "X-Timestamp": string;
  "X-Request-ID": string;
  "X-Signature": string;
  "X-Delegation-Cert"?: string;
  "Content-Type"?: string;
  [key: string]: string | undefined;
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
    process.env.HUB_CONNECT_DELEGATION_ED25519_PRIVATE_KEY;

  if (!rawKey) {
    throw new Error(
      "HUB_CONNECT_DELEGATION_ED25519_PRIVATE_KEY is not configured on the server."
    );
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

export function generateSecureAPIHeaders(
  method: string,
  path: string,
  body = "",
  userId = "anonymous"
): SecureRequestHeaders {
  const { privateKey } = getPrivateKey();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const requestId = crypto.randomUUID();
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const payload = `${userId}:${timestamp}:${requestId}:${method.toUpperCase()}:${path}:${bodyHash}`;

  // 1. Ephemeral Browser Keypair simulation for Delegation Cert
  const { publicKey: ephPub, privateKey: ephPriv } = crypto.generateKeyPairSync("ed25519");
  const ephPubDer = ephPub.export({ format: "der", type: "spki" });
  const ephPubHex = ephPubDer.toString("hex").slice(-64);
  const expiry = Math.floor(Date.now() / 1000) + 3600;

  const certPayload = `${userId}:${ephPubHex}:${expiry}`;
  const certSig = crypto.sign(null, Buffer.from(certPayload), privateKey).toString("hex");

  const certObj = {
    userId,
    publicKey: ephPubHex,
    expiry,
    signature: certSig,
  };
  const delegationCertBase64 = Buffer.from(JSON.stringify(certObj)).toString("base64");

  // 2. Sign Request Payload with Ephemeral Key
  const signatureBuffer = crypto.sign(null, Buffer.from(payload), ephPriv);

  return {
    "X-Timestamp": timestamp,
    "X-Request-ID": requestId,
    "X-Signature": signatureBuffer.toString("hex"),
    "X-Delegation-Cert": delegationCertBase64,
  };
}
