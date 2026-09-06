import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "planner_session";
export const SESSION_HOURS = 24 * 30; // 30 days

export function getUsers(): Record<string, string> {
  const jo = Netlify.env.get("PLANNER_PASSWORD_JO");
  const adam = Netlify.env.get("PLANNER_PASSWORD_ADAM");
  const users: Record<string, string> = {};
  if (jo) users["Jo"] = jo;
  if (adam) users["Adam"] = adam;
  return users;
}

export function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  }
  return out;
}

/** Returns the logged-in username for a request, or null if not authenticated. */
export function getSessionUser(req: Request): string | null {
  const secret = Netlify.env.get("AUTH_SECRET");
  if (!secret) return null;

  const cookies = parseCookies(req.headers.get("cookie"));
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const encoded = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  if (!encoded || !sig) return null;

  const expectedSig = sign(encoded, secret);
  if (!safeEqual(sig, expectedSig)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    if (typeof payload.u !== "string") return null;
    return payload.u;
  } catch {
    return null;
  }
}

export function buildSessionCookie(username: string, secret: string): string {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = JSON.stringify({ u: username, exp });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = sign(encoded, secret);
  const token = `${encoded}.${sig}`;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}`;
}

export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
