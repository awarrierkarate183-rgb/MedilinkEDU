"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  title: string;
  subtitle?: string;
  prestige?: number;
  childIds?: string[];
  children: ReactNode;
};

export function Accordion({
  items,
  defaultOpen,
}: {
  items: AccordionItem[];
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      if (items.some((item) => item.id === hash)) {
        setOpen(hash);
        return;
      }
      const parent = items.find((item) => item.childIds?.includes(hash));
      if (parent) setOpen(parent.id);
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [items]);

  return (
    <div className="grid gap-4">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <article
            key={item.id}
            id={item.id}
            className={cn(
              "overflow-hidden rounded-[var(--radius)] border bg-white transition-shadow duration-300",
              item.prestige === 3
                ? "border-gold/50 bg-navy text-white"
                : item.prestige === 2
                  ? "border-navy/20"
                  : "border-border",
              isOpen ? "shadow-[var(--shadow)]" : "",
            )}
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              <span>
                {item.subtitle ? (
                  <span
                    className={cn(
                      "kicker block",
                      item.prestige === 3 ? "text-gold" : "",
                    )}
                  >
                    {item.subtitle}
                  </span>
                ) : null}
                <span className="tab-heading block text-2xl tracking-tight md:text-[1.7rem]">
                  {item.title}
                </span>
              </span>
              <span className="mt-1 text-sm font-semibold uppercase tracking-wider">
                {isOpen ? "Close" : "Open"}
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden" aria-hidden={!isOpen} inert={!isOpen || undefined}>
                <div className="border-t border-white/10 px-6 py-5 text-sm leading-7">
                  {item.children}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
