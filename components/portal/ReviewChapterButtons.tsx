"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ReviewChapterButtons({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"approve" | "deny" | null>(null);

  async function review(decision: "approve" | "deny") {
    setError(null);
    setLoading(decision);
    try {
      const response = await fetch("/api/admin/review-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, decision }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      router.refresh();
    } catch {
      setError("The request could not be reviewed. Try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Button type="button" size="sm" loading={loading === "approve"} onClick={() => review("approve")}>
        Accept chapter
      </Button>
      <Button
        type="button"
        size="sm"
        variant="danger"
        loading={loading === "deny"}
        onClick={() => review("deny")}
      >
        Deny
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
