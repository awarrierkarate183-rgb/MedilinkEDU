import { EmailSettingsForm } from "@/components/portal/EmailSettingsForm";
import { AiSettingsForm } from "@/components/portal/AiSettingsForm";
import { emailSettingsPublic } from "@/lib/email/config";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSettingsPage() {
  const email = await emailSettingsPublic();
  const admin = createAdminClient();
  const { data } = admin
    ? await admin.from("platform_settings").select("key").eq("key", "ai.groq_key").maybeSingle()
    : { data: null };
  return (
    <div className="space-y-8">
      <EmailSettingsForm connected={email.connected} user={email.user} />
      <AiSettingsForm connected={Boolean(data)} />
    </div>
  );
}
