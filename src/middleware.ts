import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = req.cookies.get("affiliated_user");

  // পাবলিক পেজ
  const publicPaths = ["/login", "/", "/articles", "/api"];

  // লগইন না থাকলে redirect
  if (!publicPaths.includes(pathname) && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // লগইন করা ইউজারকে /login থেকে dashboard-এ পাঠাও
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/publish/:path*", "/login"],
};
