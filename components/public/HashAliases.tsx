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
  "the-meridian-hearing": "/competitions/legacy#the-atlas-docket",
  "the-rural-lifeline-case": "/competitions/legacy#the-covenant-table",
  "project-onconova": "/competitions/legacy#black-box-protocol",
  "the-valuecare-arbitration": "/competitions/legacy#the-last-mile-accord",
  "operation-containment": "/competitions/legacy#nightfall-command",
};

const EVENT_PAGES: Record<string, string> = {
  "the-atlas-docket": "/competitions/legacy",
  "the-covenant-table": "/competitions/legacy",
  "black-box-protocol": "/competitions/legacy",
  "the-last-mile-accord": "/competitions/legacy",
  "nightfall-command": "/competitions/legacy",
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
