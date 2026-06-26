import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionCookie,
  formatSqlDate,
  type AdminEnv,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const { DB, ADMIN_PASSWORD } = env as AdminEnv;
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!ADMIN_PASSWORD) {
    return Response.json({ error: "Admin password is not configured." }, { status: 500 });
  }

  if (password !== ADMIN_PASSWORD) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = crypto.randomUUID();
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_MAX_AGE * 1000);

  await DB
    .prepare("INSERT INTO admin_sessions (id, token, expires_at) VALUES (?, ?, ?)")
    .bind(id, token, formatSqlDate(expiresAt))
    .run();

  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": createAdminSessionCookie(token),
      },
    }
  );
}
