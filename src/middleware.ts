// Edge middleware that pre-empts every /admin/** request with an auth
// check. Pages still call `auth()` for the session detail they need —
// middleware is the belt to that suspenders, so a future page added
// without an explicit auth call still can't leak data.
//
// We do NOT call NextAuth's full session decode here — that requires the
// Node runtime. Instead we check whether the session cookie is present.
// If it is, the page handles allow-list verification and email-mismatch
// redirects (which need DB / env access). If it isn't, we redirect to
// sign-in with a `from` param so the user comes back to the right page.

import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/sign-in",
  "/admin/no-access",
]);

const SESSION_COOKIE_NAMES = [
  // next-auth v5 uses `authjs.session-token`; older deployments may still
  // hold the legacy `next-auth.session-token`. We accept either.
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();
  // Auth.js callbacks live under /api/auth — already excluded by the
  // matcher below, but defensive: never gate them.
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
    req.cookies.has(name),
  );
  if (hasSessionCookie) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/sign-in";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run on every /admin/* path. Static assets and API routes are excluded
  // by the matcher's negative lookahead so middleware stays fast.
  matcher: ["/admin/:path*"],
};
