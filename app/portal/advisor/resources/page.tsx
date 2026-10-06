import { requireRole } from "@/lib/auth/session";
import { CompetitionResources } from "@/components/portal/CompetitionResources";

export default async function AdvisorResourcesPage() {
  await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  return <CompetitionResources />;
}
