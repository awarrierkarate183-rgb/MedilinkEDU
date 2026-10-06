import { requireRole } from "@/lib/auth/session";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";

export default async function AdminMediLinkEventsPage() {
  await requireRole(["SUPER_ADMIN", "STATE_ADMIN"]);
  return <MediLinkEventsBoard />;
}
