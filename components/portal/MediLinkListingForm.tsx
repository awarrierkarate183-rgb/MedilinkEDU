"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import { opportunityKinds, opportunityRegions } from "@/lib/content/medilink-events";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function MediLinkListingForm({ variant }: { variant: "admin" | "advisor" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOk(false);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/medilink-events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(form.get("title") || ""),
          body: String(form.get("body") || ""),
          kind: String(form.get("kind") || "event"),
          region: String(form.get("region") || "national"),
          href: String(form.get("href") || ""),
          eventDate: String(form.get("eventDate") || ""),
        }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setOk(true);
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setError("The listing could not be published. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">
        {variant === "admin" ? "Publish a MediLink listing" : "Add a chapter listing"}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {variant === "admin"
          ? "This goes to every chapter. Students and advisors in every chapter see it, and it also appears on the public MediLink Events page."
          : "This stays in your chapter. Students and advisors in other chapters will not see it."}
      </p>
      {error ? (
        <div className="mt-3">
          <Alert title="Not published" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {ok ? (
        <div className="mt-3">
          <Alert title="Published" tone="navy">
            {variant === "admin"
              ? "Every chapter can see this listing."
              : "Only your chapter can see this listing."}
          </Alert>
        </div>
      ) : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-semibold md:col-span-2">
          Title
          <input name="title" required maxLength={160} className={field} />
        </label>
        <label className="text-sm font-semibold">
          Type
          <select name="kind" className={field} defaultValue="event">
            {opportunityKinds.map((kind) => (
              <option key={kind.id} value={kind.id}>
                {kind.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Region
          <select name="region" className={field} defaultValue="national">
            {opportunityRegions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Date (optional)
          <input name="eventDate" type="date" className={field} />
        </label>
        <label className="text-sm font-semibold">
          Link (optional)
          <input name="href" maxLength={400} className={field} placeholder="https://" />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Details
          <textarea name="body" required rows={5} maxLength={8000} className={field} />
        </label>
      </div>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Publish
        </Button>
      </div>
    </form>
  );
}
