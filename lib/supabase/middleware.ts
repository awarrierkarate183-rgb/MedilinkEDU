import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  if (!isSupabaseConfigured()) {
    return { response, user: null, role: null as string | null, status: null, advisorStatus: null };
  }

  try {
    const supabase = createServerClient(supabaseUrl(), supabasePublishableKey(), {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let role: string | null = null;
    let status: string | null = null;
    let advisorStatus: string | null = null;
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("role, status, advisor_status")
        .eq("id", user.id)
        .maybeSingle();
      role = data?.role ?? null;
      status = data?.status ?? null;
      advisorStatus = data?.advisor_status ?? null;
    }

    return { response, user, role, status, advisorStatus };
  } catch {
    return { response, user: null, role: null as string | null, status: null, advisorStatus: null };
  }
}
