"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  defaultOpen,
}: {
  items: { id: string; title: string; subtitle?: string; prestige?: number; children: ReactNode }[];
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className="grid gap-4">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <article
            key={item.id}
            id={item.id}
            className={cn(
              "overflow-hidden rounded-[var(--radius)] border bg-white transition-shadow",
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
                <span className="block text-xl font-semibold tracking-tight">
                  {item.title}
                </span>
              </span>
              <span className="mt-1 text-sm font-semibold uppercase tracking-wider">
                {isOpen ? "Close" : "Open"}
              </span>
            </button>
            {isOpen ? (
              <div className="border-t border-white/10 px-6 py-5 text-sm leading-7">
                {item.children}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
