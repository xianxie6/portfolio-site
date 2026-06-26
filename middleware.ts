import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSession,
  type AdminEnv,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  const { env } = await getCloudflareContext({ async: true });
  const { DB } = env as AdminEnv;
  const isLoggedIn = await isValidAdminSession(DB, sessionToken);

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
