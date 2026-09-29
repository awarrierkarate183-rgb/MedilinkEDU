import { EmptyState } from "@/components/ui/States";

export function PortalEmpty({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return <EmptyState title={title} body={body} />;
}
