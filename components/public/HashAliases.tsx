"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PAGE_ALIASES: Record<string, string> = {
  aims: "/about/aims",
  mission: "/about/mission",
  lenses: "/about/lenses",
  leadership: "/about/leadership",
  innovation: "/competitions/normal",
  policy: "/competitions/normal",
  research: "/competitions/normal",
  normal: "/competitions/normal",
  legacy: "/competitions/legacy",
  nationals: "/competitions/advancement",
  ladder: "/competitions/advancement",
  rankings: "/competitions/rankings",
  apex: "/competitions/rankings",
  "road-to-apex": "/competitions/rankings",
  invitational: "/competitions/invitational",
  "the-meridian-hearing": "/competitions/legacy#the-janus-protocol",
  "the-rural-lifeline-case": "/competitions/legacy#the-sovereign-ledger",
  "project-onconova": "/competitions/legacy#the-janus-protocol",
  "the-valuecare-arbitration": "/competitions/legacy#the-sovereign-ledger",
  "operation-containment": "/competitions/legacy#nightfall-code-meridian",
  "the-atlas-docket": "/competitions/legacy#the-janus-protocol",
  "the-covenant-table": "/competitions/legacy#the-sovereign-ledger",
  "black-box-protocol": "/competitions/legacy#the-janus-protocol",
  "the-last-mile-accord": "/competitions/legacy",
  "nightfall-command": "/competitions/legacy#nightfall-code-meridian",
};

const EVENT_PAGES: Record<string, string> = {
  "the-sovereign-ledger": "/competitions/legacy",
  "nightfall-code-meridian": "/competitions/legacy",
  "the-janus-protocol": "/competitions/legacy",
};

export function HashAliases() {
  const router = useRouter();
  useEffect(() => {
    const raw = window.location.hash.replace("#", "");
    if (!raw) return;
    const page = PAGE_ALIASES[raw];
    if (page) {
      router.replace(page as never);
      return;
    }
    const eventPage = EVENT_PAGES[raw];
    if (eventPage && !window.location.pathname.startsWith(eventPage)) {
      router.replace(`${eventPage}#${raw}` as never);
      return;
    }
    const target = document.getElementById(raw);
    if (target) target.scrollIntoView({ block: "start" });
  }, [router]);
  return null;
}
