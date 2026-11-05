import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAllowed, adminEnabled } from "@/lib/admin-auth";

// Only /admin/ passes through here. Everything else on the site is untouched.
export function proxy(request: NextRequest) {
  if (!adminEnabled()) return new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
  if (!adminAllowed(request.headers.get("authorization"))) {
    return new NextResponse("Sign in to see this page.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="MotionPlay Labs admin", charset="UTF-8"', "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
    });
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
