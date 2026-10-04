import { supabaseSecretKey, supabaseUrl } from "@/lib/env";

async function authPost(path: string, body: Record<string, unknown>) {
  const url = supabaseUrl();
  const key = supabaseSecretKey();
  if (!url || !key) return { ok: false, status: 0, id: "", detail: "missing auth" };
  const response = await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const detail = await response.text();
  let id = "";
  try {
    const parsed = JSON.parse(detail) as { id?: string };
    id = parsed.id || "";
  } catch {
    id = "";
  }
  if (!response.ok) {
    console.error("[email:supabase]", path, response.status, detail.slice(0, 300));
  }
  return { ok: response.ok, status: response.status, id, detail };
}

export async function sendInviteWithSupabaseMail(opts: {
  email: string;
  firstName: string;
  lastName: string;
  inviteUrl: string;
}) {
  const redirectTo = opts.inviteUrl;
  const invite = await authPost("/auth/v1/invite", {
    email: opts.email,
    redirect_to: redirectTo,
    data: {
      first_name: opts.firstName,
      last_name: opts.lastName,
      full_name: `${opts.firstName} ${opts.lastName}`.trim(),
      invite_url: opts.inviteUrl,
    },
  });
  if (invite.ok) {
    return { sent: true, userId: invite.id || undefined };
  }

  const recover = await authPost("/auth/v1/recover", {
    email: opts.email,
    redirect_to: redirectTo,
  });
  if (recover.ok) {
    return { sent: true, userId: invite.id || undefined };
  }

  return { sent: false, userId: invite.id || undefined };
}
