import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/app", "/content", "/admin", "/onboarding"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!isProtected) return NextResponse.next();

  const session = request.cookies.get("lingo_session")?.value;
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app",
    "/app/:path*",
    "/content",
    "/content/:path*",
    "/admin",
    "/admin/:path*",
    "/onboarding",
    "/onboarding/:path*",
  ],
};
