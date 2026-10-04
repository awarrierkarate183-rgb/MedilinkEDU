import { supabaseSecretKey, supabaseUrl } from "@/lib/env";

export async function sendInviteWithSupabaseMail(opts: {
  email: string;
  firstName: string;
  lastName: string;
  inviteUrl: string;
}) {
  const url = supabaseUrl();
  const key = supabaseSecretKey();
  if (!url || !key) return { sent: false, userId: undefined as string | undefined };

  const response = await fetch(`${url}/auth/v1/invite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: opts.email,
      redirect_to: opts.inviteUrl,
      data: {
        first_name: opts.firstName,
        last_name: opts.lastName,
        full_name: `${opts.firstName} ${opts.lastName}`.trim(),
        invite_url: opts.inviteUrl,
      },
    }),
  });
  const detail = await response.text();
  let userId = "";
  try {
    userId = (JSON.parse(detail) as { id?: string }).id || "";
  } catch {
    userId = "";
  }
  if (!response.ok) {
    console.error("[email:supabase]", response.status, detail.slice(0, 300));
    return { sent: false, userId: userId || undefined };
  }
  return { sent: true, userId: userId || undefined };
}
