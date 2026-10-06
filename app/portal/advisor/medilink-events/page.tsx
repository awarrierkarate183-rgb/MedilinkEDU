import { requireRole } from "@/lib/auth/session";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";

export default async function AdvisorMediLinkEventsPage() {
  await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  return <MediLinkEventsBoard />;
}
