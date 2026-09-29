import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/env";

const advisorPrefix = "/portal/advisor";
const studentPrefix = "/portal/student";
const adminPrefix = "/portal/admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith(advisorPrefix) ||
    pathname.startsWith(studentPrefix) ||
    pathname.startsWith(adminPrefix);

  if (!isProtected) {
    if (isSupabaseConfigured()) {
      const { response } = await updateSession(request);
      return response;
    }
    return NextResponse.next();
  }

  if (!isSupabaseConfigured()) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    url.searchParams.set("setup", "1");
    return NextResponse.redirect(url);
  }

  const { response, user, role } = await updateSession(request);
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(adminPrefix) && !["SUPER_ADMIN", "STATE_ADMIN"].includes(role || "")) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }
  if (
    pathname.startsWith(advisorPrefix) &&
    !["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"].includes(role || "")
  ) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }
  if (
    pathname.startsWith(studentPrefix) &&
    !["STUDENT", "CHAPTER_OFFICER", "CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"].includes(
      role || "",
    )
  ) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*"],
};
