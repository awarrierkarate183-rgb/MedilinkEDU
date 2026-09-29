"use client";

import { useState } from "react";
import { redeemInvitationAction } from "@/lib/auth/redeem";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

export function RedeemInviteForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(formData: FormData) {
    formData.set("token", token);
    const result = await redeemInvitationAction(formData);
    if (result?.error) setError(result.error);
    if (result && "ok" in result) setOk(true);
  }

  if (ok) {
    return (
      <Alert title="Account created">
        Your advisor still needs to approve the roster. Then you can sign in.
      </Alert>
    );
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      {error ? (
        <Alert title="Invitation could not be used" tone="danger">
          {error}
        </Alert>
      ) : null}
      <label className="block text-sm font-semibold">
        Name
        <input name="name" required className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input name="password" type="password" required minLength={10} className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal" />
      </label>
      <p className="text-sm text-muted">
        By creating an account you agree to use MediLink for chapter work only.
        Do not submit medical records or extra personal data.
      </p>
      <Button type="submit">Create account</Button>
    </form>
  );
}
