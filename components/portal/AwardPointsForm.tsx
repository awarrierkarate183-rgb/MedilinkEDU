"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { POINT_REASON_AMOUNTS } from "@/lib/points/award";

export function AwardPointsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<number | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOk(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/award-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reasonCode: String(form.get("reasonCode") || "") }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk(json.data?.amount ?? null);
      router.refresh();
    } catch {
      setError("MediLink is having trouble connecting to your account data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Record points</h2>
      <p className="mt-1 text-sm text-muted">
        Amounts are fixed by MediLink point rules. You choose the reason. You cannot type a total.
      </p>
      {error ? (
        <div className="mt-3">
          <Alert title="Points not recorded" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {ok != null ? (
        <div className="mt-3">
          <Alert title="Points recorded">{ok} points were added from the transaction ledger.</Alert>
        </div>
      ) : null}
      <label className="mt-4 block text-sm font-semibold">
        Reason
        <select name="reasonCode" required className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal">
          {Object.entries(POINT_REASON_AMOUNTS).map(([code, amount]) => (
            <option key={code} value={code}>
              {code.replaceAll("_", " ")} ({amount})
            </option>
          ))}
        </select>
      </label>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Add transaction
        </Button>
      </div>
    </form>
  );
}
