"use client";

import { useState } from "react";
import { createInvitationAction, revokeInvitationAction } from "@/lib/auth/invitations";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

export function InviteMemberForm() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onCreate(formData: FormData) {
    setError(null);
    const result = await createInvitationAction(formData);
    if (result && "error" in result && result.error) setError(result.error);
    if (result && "token" in result && result.token) setToken(result.token);
  }

  return (
    <form action={onCreate} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Invite a student</h2>
      <p className="mt-1 text-sm text-muted">
        Codes are unique, expiring, and tied to this chapter. Show the code once.
        Do not put it in a QR. The chapter QR is a public join link, not this invitation.
      </p>
      {error ? (
        <div className="mt-3">
          <Alert title="Invitation not created" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {token ? (
        <div className="mt-3">
          <Alert title="Give this code to the student now">
            {token}. It will not be shown again.
          </Alert>
        </div>
      ) : null}
      <label className="mt-4 block text-sm font-semibold">
        Student email, if known
        <input name="email" type="email" className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
      </label>
      <div className="mt-4">
        <Button type="submit" size="sm">
          Generate invitation
        </Button>
      </div>
    </form>
  );
}

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
