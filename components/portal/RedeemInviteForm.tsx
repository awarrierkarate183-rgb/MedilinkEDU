"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { redeemInvitationAction } from "@/lib/auth/redeem";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

export function RedeemInviteForm({
  token,
  email,
  firstName,
  lastName,
  intendedRole = "STUDENT",
}: {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  intendedRole?: string;
}) {
  const advisor = intendedRole === "CHAPTER_ADVISOR";
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(formData: FormData) {
    formData.set("token", token);
    const result = await redeemInvitationAction(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result && "ok" in result) {
      setOk(true);
      if ("signedIn" in result && result.signedIn && result.role === "STUDENT") {
        router.push("/portal/student");
        return;
      }
      if ("signedIn" in result && result.signedIn && result.role === "CHAPTER_ADVISOR") {
        router.push("/portal/advisor");
      }
    }
  }

  if (ok) {
    return (
      <Alert title={advisor ? "Advisor account ready" : "Student account ready"}>
        {advisor
          ? "Your login opens the advisor portal for this chapter."
          : "Your login only works in the student portal."}{" "}
        <a href={advisor ? "/portal/login?role=advisor" : "/portal/login?role=student"} className="font-semibold">
          Sign in
        </a>
      </Alert>
    );
  }

  return (
    <form action={onSubmit} className="mt-6 space-y-4">
      {error ? (
        <Alert title="Account could not be created" tone="danger">
          {error}
        </Alert>
      ) : null}
      <p className="rounded-md bg-surface px-3 py-2 text-sm">
        <strong>
          {firstName} {lastName}
        </strong>
        <span className="block text-muted">{email}</span>
      </p>
      <label className="block text-sm font-semibold">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal"
        />
      </label>
      <label className="block text-sm font-semibold">
        Confirm password
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal"
        />
      </label>
      <p className="text-sm text-muted">
        {advisor
          ? "This account opens the advisor portal for the same chapter as the student lead. By creating it you agree to use MediLink for chapter work only."
          : "This account only opens the student portal. By creating it you agree to use MediLink for chapter work only. Do not submit medical records or extra personal data."}
      </p>
      <Button type="submit">{advisor ? "Create advisor account" : "Create student account"}</Button>
    </form>
  );
}
