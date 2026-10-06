import { CurriculumDesk } from "@/components/portal/CurriculumDesk";
import { requireRole } from "@/lib/auth/session";

export default async function AdvisorCurriculumPage() {
  await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  return <CurriculumDesk audience="advisor" />;
}
