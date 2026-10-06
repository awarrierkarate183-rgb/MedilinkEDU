"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";
import {
  opportunityKinds,
  opportunityRegions,
  regionName,
} from "@/lib/content/medilink-events";
import type { MediLinkListing } from "@/lib/data/medilink-listings";

function ListingCard({
  item,
  canUnpublish,
}: {
  item: MediLinkListing;
  canUnpublish: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function unpublish() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/medilink-events/unpublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: item.id }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      router.refresh();
    } catch {
      setError("That listing could not be taken down.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className="rounded-md border border-border p-4">
      <p className="kicker">{item.scope === "ORGANIZATION" ? "All chapters" : "This chapter"}</p>
      <strong className="mt-1 block">{item.title}</strong>
      <p className="mt-1 text-sm text-muted">
        {regionName(item.region)}
        {item.event_date ? ` · ${new Date(`${item.event_date}T00:00:00`).toLocaleDateString()}` : ""}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm">{item.body}</p>
      {item.href && (/^https?:\/\//i.test(item.href) || item.href.startsWith("/")) ? (
        <p className="mt-2 text-sm">
          <a href={item.href} className="font-semibold" target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            Open details
          </a>
        </p>
      ) : null}
      {error ? (
        <div className="mt-3">
          <Alert title="Not updated" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {canUnpublish ? (
        <div className="mt-3">
          <Button type="button" size="sm" variant="outline" loading={loading} onClick={unpublish}>
            Take down
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export function MediLinkEventsBoard({
  listings,
  viewer,
  showIntro = true,
}: {
  listings: MediLinkListing[];
  viewer: "public" | "student" | "advisor" | "admin";
  showIntro?: boolean;
}) {
  const volunteer = listings.filter((item) => item.kind === "volunteer");
  return (
    <div className="space-y-8">
      {showIntro ? (
        <section className="rounded-[var(--radius)] bg-white p-5">
          <h1 className="text-xl font-semibold">MediLink Events</h1>
          <p className="mt-2 text-sm text-muted">
            {viewer === "public"
              ? "Volunteer openings by region, MediLink-hosted events, internships, and research seats MediLink publishes for every chapter."
              : "Listings MediLink publishes reach every chapter. Listings your advisor adds stay in this chapter only."}
          </p>
        </section>
      ) : null}

      <section className="rounded-[var(--radius)] bg-white p-5">
        <p className="kicker">Volunteer</p>
        <h2 className="text-lg font-semibold">Volunteer by region</h2>
        <p className="mt-2 text-sm text-muted">{opportunityKinds[0].lead}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {opportunityRegions.map((region) => {
            const rows = volunteer.filter((item) => item.region === region.id);
            return (
              <article key={region.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0 md:border-t-0 md:pt-0">
                <h3 className="font-semibold">{region.name}</h3>
                {rows.length ? (
                  <ul className="mt-2 space-y-3">
                    {rows.map((item) => (
                      <ListingCard
                        key={item.id}
                        item={item}
                        canUnpublish={
                          (viewer === "admin" && item.scope === "ORGANIZATION") ||
                          (viewer === "advisor" && item.scope === "CHAPTER")
                        }
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">No volunteer listing is open in {region.name} yet.</p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {opportunityKinds
        .filter((kind) => kind.id !== "volunteer")
        .map((kind) => {
          const rows = listings.filter((item) => item.kind === kind.id);
          return (
            <section key={kind.id} className="rounded-[var(--radius)] bg-white p-5">
              <p className="kicker">{kind.title}</p>
              <h2 className="text-lg font-semibold">{kind.title}</h2>
              <p className="mt-2 text-sm text-muted">{kind.lead}</p>
              {rows.length ? (
                <ul className="mt-4 space-y-3">
                  {rows.map((item) => (
                    <ListingCard
                      key={item.id}
                      item={item}
                      canUnpublish={
                        (viewer === "admin" && item.scope === "ORGANIZATION") ||
                        (viewer === "advisor" && item.scope === "CHAPTER")
                      }
                    />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">{kind.empty}</p>
              )}
            </section>
          );
        })}
    </div>
  );
}
