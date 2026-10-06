import { requireRole } from "@/lib/auth/session";
import { CompetitionEventGuide } from "@/components/portal/CompetitionEventGuide";

export default async function AdvisorEventsPage() {
  await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  return <CompetitionEventGuide audience="advisor" />;
}
