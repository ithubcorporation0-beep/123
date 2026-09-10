export const ADMIN_SESSION_COOKIE = "admin_session_token";
export const ADMIN_USER_ID = "admin_master_system";
export const ADMIN_EMAIL = "admin@system.local";
export const ADMIN_NAME = "System Administrator";

const SECRET_KEY =
  process.env.CLERK_SECRET_KEY ||
  process.env.ADMIN_SESSION_SECRET ||
  "izba-admin-session-secure-key-446655";

export function getExpectedAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "446655";
}

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  const expected = getExpectedAdminPassword().trim();
  const provided = password.trim();
  return expected === provided;
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return bufferToHex(signature);
}

export async function createAdminToken(): Promise<string> {
  const payload = JSON.stringify({
    role: "admin",
    userId: ADMIN_USER_ID,
    email: ADMIN_EMAIL,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const payloadBase64 = Buffer.from(payload).toString("base64url");
  const signature = await hmacSha256(payloadBase64, SECRET_KEY);
  return `${payloadBase64}.${signature}`;
}

export async function verifyAdminToken(token?: string | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadBase64, providedSignature] = parts;
  const expectedSignature = await hmacSha256(payloadBase64, SECRET_KEY);

  if (providedSignature !== expectedSignature) {
    return false;
  }

  try {
    const payloadStr = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const data = JSON.parse(payloadStr);

    if (data.role !== "admin") return false;
    if (data.exp && Date.now() > data.exp) return false;

    return true;
  } catch {
    return false;
  }
}
