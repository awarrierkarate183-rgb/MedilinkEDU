import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { CompetitionEventGuide } from "@/components/portal/CompetitionEventGuide";

export default async function StudentEventsPage() {
  await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  return (
    <div className="space-y-6">
      <CompetitionEventGuide audience="student" />
      <p className="text-sm">
        <Link href="/portal/student/competitions" className="font-semibold">
          Competitions
        </Link>
        <span className="text-muted"> to send your picks and see assigned events.</span>
      </p>
    </div>
  );
}
