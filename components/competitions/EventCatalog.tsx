import { Accordion } from "@/components/ui/Accordion";
import { EventHandbook } from "@/components/competitions/EventHandbook";
import { getEventHandbook } from "@/lib/content/event-handbook";
import { catalogEvents, type CatalogEvent } from "@/lib/content/competition-system";

export function EventCatalog({
  events,
  prestige,
}: {
  events: CatalogEvent[];
  prestige: number;
}) {
  return (
    <Accordion
      items={events.map((event) => {
        const handbook = getEventHandbook(event.id);
        return {
          id: event.id,
          title: `${event.number}. ${event.name}`,
          subtitle: handbook ? `${handbook.formatLabel} · ${handbook.releaseLabel}` : event.formatLabel,
          prestige,
          children: handbook ? (
            <EventHandbook event={handbook} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="kicker">What it is</p>
                <p className="text-muted">{event.description}</p>
              </div>
              <div>
                <p className="kicker">Format</p>
                <p className="text-muted">{event.formatLabel}. High-school members. In person.</p>
              </div>
            </div>
          ),
        };
      })}
    />
  );
}

export function eventsByTier(tier: "NORMAL" | "LEGACY") {
  return catalogEvents.filter((event) => event.tier === tier);
}
