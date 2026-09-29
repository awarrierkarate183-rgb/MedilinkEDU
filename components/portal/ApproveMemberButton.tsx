"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ApproveMemberButton({ membershipId }: { membershipId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onApprove() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/members/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      router.refresh();
    } catch {
      setError("MediLink is having trouble connecting to your account data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-right">
      <Button type="button" size="sm" onClick={onApprove} loading={loading}>
        Approve
      </Button>
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
