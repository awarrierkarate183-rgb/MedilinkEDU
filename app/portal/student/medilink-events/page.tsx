import { requireRole } from "@/lib/auth/session";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";

export default async function StudentMediLinkEventsPage() {
  await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  return <MediLinkEventsBoard />;
}
