import { Accordion } from "@/components/ui/Accordion";
import { catalogEvents, type EventTier } from "@/lib/content/competition-system";
import { getEventHandbook } from "@/lib/content/event-handbook";
import {
  legacyDelegationRules,
  legacyIdentity,
  legacyPurpose,
} from "@/lib/content/legacy-event-handbook";

function EventDescriptions({
  tier,
  title,
  lead,
}: {
  tier: EventTier;
  title: string;
  lead: string;
}) {
  const events = catalogEvents.filter((event) => event.tier === tier);
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted">{lead}</p>
      </div>
      <Accordion
        items={events.map((event) => {
          const handbook = getEventHandbook(event.id);
          const legacy = handbook && "whyLegacy" in handbook;
          return {
            id: event.id,
            title: `${event.number}. ${event.name}`,
            subtitle: `${event.tier === "NORMAL" ? "Normal Event" : "Legacy Event"} · ${handbook?.formatLabel || event.formatLabel}`,
            prestige: event.tier === "LEGACY" ? 2 : 1,
            children: (
              <div className="space-y-3">
                <p>{handbook?.overview || event.description}</p>
                {handbook ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <p>
                      <strong>Role.</strong> {handbook.role}
                    </p>
                    <p>
                      <strong>Action.</strong> {handbook.action}
                    </p>
                    <p>
                      <strong>Signature mechanic.</strong> {handbook.mechanic}
                    </p>
                    <p>
                      <strong>Class.</strong> {handbook.releaseLabel}
                    </p>
                  </div>
                ) : null}
                {legacy ? <p>{handbook.whyLegacy}</p> : null}
                {handbook ? (
                  <p>
                    <strong>Required work product.</strong> {handbook.workProduct}
                  </p>
                ) : (
                  <p className="text-muted">{event.formatLabel}. High-school members. In person.</p>
                )}
              </div>
            ),
          };
        })}
      />
    </section>
  );
}

export function CompetitionEventGuide({ audience }: { audience: "advisor" | "student" }) {
  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Competition Events</h1>
        <p className="mt-2 text-sm text-muted">
          This page explains the catalog. It does not enter students. Rubrics and point systems live on
          Resources. {audience === "advisor"
            ? "Student choices, the Legacy team, and regular event submissions live on Competitions."
            : "Use Choose Event to tell your advisor what you want. Assigned events and results live on Competitions."}
        </p>
      </section>

      <EventDescriptions
        tier="NORMAL"
        title="Normal Events"
        lead="Twenty events. A student may enter up to six in a season. Most allow a solo competitor or a team of up to five. Regional is required. Everyone who competes at Regional advances to State."
      />

      <section className="rounded-[var(--radius)] bg-white p-5">
        <p className="kicker">Legacy Events</p>
        <h2 className="text-xl font-semibold">What Legacy is for</h2>
        <p className="mt-3 text-sm">{legacyPurpose}</p>
        <p className="mt-3 text-sm">{legacyIdentity}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
          {legacyDelegationRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <EventDescriptions
        tier="LEGACY"
        title="The Legacy Triad"
        lead="One school, four delegates, three arenas. A chapter may enter one, two, or all three events. Qualification is separate for each event."
      />
    </div>
  );
}
