import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/env";
import { isPendingAdvisor } from "@/lib/auth/roles";

const advisorPrefix = "/portal/advisor";
const studentPrefix = "/portal/student";
const adminPrefix = "/portal/admin";
const pendingPath = "/portal/pending";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith(advisorPrefix) ||
    pathname.startsWith(studentPrefix) ||
    pathname.startsWith(adminPrefix) ||
    pathname === pendingPath;

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

  const { response, user, role, status, advisorStatus } = await updateSession(request);
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const pending = isPendingAdvisor({ role, status, advisor_status: advisorStatus });
  if (pending && pathname !== pendingPath) {
    return NextResponse.redirect(new URL(pendingPath, request.url));
  }
  if (!pending && pathname === pendingPath && role === "CHAPTER_ADVISOR") {
    return NextResponse.redirect(new URL("/portal/advisor", request.url));
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
