import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  ADMIN_SESSION_COOKIE,
  clearAdminSessionCookie,
  deleteAdminSession,
  getCookieValue,
  isValidAdminSession,
  type AdminEnv,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { env } = await getCloudflareContext({ async: true });
  const { DB } = env as AdminEnv;
  const token = getCookieValue(request.headers.get("cookie"), ADMIN_SESSION_COOKIE);

  if (await isValidAdminSession(DB, token)) {
    await deleteAdminSession(DB, token);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/admin/login", request.url).toString(),
      "Set-Cookie": clearAdminSessionCookie(),
    },
  });
}
