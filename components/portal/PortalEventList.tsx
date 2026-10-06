import { EventHandbook } from "@/components/competitions/EventHandbook";
import { Accordion } from "@/components/ui/Accordion";
import { catalogEvents, type EventTier } from "@/lib/content/competition-system";
import { getEventHandbook } from "@/lib/content/event-handbook";

function EventGroup({
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
          return {
            id: event.id,
            title: `${event.number}. ${event.name}`,
            subtitle: handbook
              ? `${event.tier === "NORMAL" ? "Normal Event" : "Legacy Event"} · ${handbook.formatLabel}`
              : `${event.tier === "NORMAL" ? "Normal Event" : "Legacy Event"} · ${event.formatLabel}`,
            prestige: event.tier === "LEGACY" ? 2 : 1,
            children: handbook ? (
              <EventHandbook event={handbook} />
            ) : (
              <div className="space-y-3">
                <p>{event.description}</p>
                <p className="text-muted">{event.formatLabel}. High-school members. In person.</p>
              </div>
            ),
          };
        })}
      />
    </section>
  );
}

export function PortalEventList({ audience }: { audience: "advisor" | "student" }) {
  return (
    <div className="space-y-8">
      <EventGroup
        tier="NORMAL"
        title="Normal Events"
        lead={
          audience === "advisor"
            ? "Twenty events. A student may be entered in up to six. Open a card for the official format, instructions, and rubric."
            : "Twenty events. You may compete in up to six. Open a card for the official format, instructions, and rubric. Use Choose Event to send your picks to your advisor."
        }
      />
      <EventGroup
        tier="LEGACY"
        title="Legacy Events"
        lead={
          audience === "advisor"
            ? "The Legacy Triad. One team of four. A chapter may enter one, two, or all three events."
            : "The Legacy Triad. One school team of four. You can ask for a seat. Your advisor puts the four-person roster in."
        }
      />
    </div>
  );
}
