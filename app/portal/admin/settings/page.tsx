import { EmailSettingsForm } from "@/components/portal/EmailSettingsForm";
import { emailSettingsPublic } from "@/lib/email/config";

export default async function AdminSettingsPage() {
  const email = await emailSettingsPublic();
  return (
    <div className="space-y-8">
      <EmailSettingsForm connected={email.connected} user={email.user} />
    </div>
  );
}
