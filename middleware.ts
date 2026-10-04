import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/env";
import {
  canAccessAdvisorPortal,
  canAccessStudentPortal,
  homeForRole,
  isPendingAdvisor,
} from "@/lib/auth/roles";

const advisorPrefix = "/portal/advisor";
const studentPrefix = "/portal/student";
const adminPrefix = "/portal/admin";
const pendingPath = "/portal/pending";
const completeInvitePath = "/portal/complete-invite";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith(advisorPrefix) ||
    pathname.startsWith(studentPrefix) ||
    pathname.startsWith(adminPrefix) ||
    pathname === pendingPath ||
    pathname === completeInvitePath;

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
  if (role === "STUDENT" && status === "PENDING" && pathname !== completeInvitePath) {
    return NextResponse.redirect(new URL(completeInvitePath, request.url));
  }
  if (pathname === completeInvitePath && !(role === "STUDENT" && status === "PENDING")) {
    return NextResponse.redirect(new URL(homeForRole(role, { status, advisor_status: advisorStatus }), request.url));
  }

  const home = homeForRole(role, { status, advisor_status: advisorStatus });
  if (pathname.startsWith(adminPrefix) && !["SUPER_ADMIN", "STATE_ADMIN"].includes(role || "")) {
    return NextResponse.redirect(new URL(home, request.url));
  }
  if (pathname.startsWith(advisorPrefix) && !canAccessAdvisorPortal(role)) {
    return NextResponse.redirect(new URL(home, request.url));
  }
  if (pathname.startsWith(studentPrefix) && !canAccessStudentPortal(role)) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*"],
};
