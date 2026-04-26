import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/sign-in", "/admin/no-access"]);

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const email = request.auth?.user?.email;

  if (!email) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/sign-in";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (!isAdminEmail(email)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/no-access";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
