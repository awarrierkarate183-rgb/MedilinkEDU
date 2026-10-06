import { requireRole } from "@/lib/auth/session";
import { CompetitionResources } from "@/components/portal/CompetitionResources";

export default async function StudentResourcesPage() {
  await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  return <CompetitionResources />;
}
