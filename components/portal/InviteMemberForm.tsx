"use client";

import { revokeInvitationAction } from "@/lib/auth/invitations";
import { Button } from "@/components/ui/Button";

export function RevokeButton({ id }: { id: string }) {
  return (
    <form
      action={async (formData) => {
        await revokeInvitationAction(formData);
        return;
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" size="sm" variant="danger">
        Revoke
      </Button>
    </form>
  );
}
