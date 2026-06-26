import type { D1Database } from "@cloudflare/workers-types";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminEnv = {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
};

export function formatSqlDate(date: Date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}

export function createAdminSessionCookie(token: string) {
  return [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${ADMIN_SESSION_MAX_AGE}`,
  ].join("; ");
}

export function clearAdminSessionCookie() {
  return [
    `${ADMIN_SESSION_COOKIE}=`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export async function isValidAdminSession(db: D1Database, token: string | null) {
  if (!token) return false;

  const session = await db
    .prepare(
      `SELECT id
      FROM admin_sessions
      WHERE token = ? AND expires_at > datetime('now')
      LIMIT 1`
    )
    .bind(token)
    .first<{ id: string }>();

  return Boolean(session);
}

export async function deleteAdminSession(db: D1Database, token: string | null) {
  if (!token) return;

  await db
    .prepare("DELETE FROM admin_sessions WHERE token = ?")
    .bind(token)
    .run();
}

export async function requireAdminSession(request: Request, db: D1Database) {
  const token = getCookieValue(request.headers.get("cookie"), ADMIN_SESSION_COOKIE);
  const isLoggedIn = await isValidAdminSession(db, token);

  if (!isLoggedIn) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
