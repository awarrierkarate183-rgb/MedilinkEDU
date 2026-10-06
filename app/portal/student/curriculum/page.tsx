import { CurriculumDesk } from "@/components/portal/CurriculumDesk";
import { requireRole } from "@/lib/auth/session";

export default async function StudentCurriculumPage() {
  await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  return <CurriculumDesk audience="student" />;
}
