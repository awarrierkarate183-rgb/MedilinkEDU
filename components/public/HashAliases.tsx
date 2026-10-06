"use client";

import { useEffect } from "react";

const ALIASES: Record<string, string> = {
  innovation: "normal",
  policy: "normal",
  research: "normal",
  nationals: "ladder",
  "the-meridian-hearing": "the-atlas-docket",
  "the-rural-lifeline-case": "the-covenant-table",
  "project-onconova": "black-box-protocol",
  "the-valuecare-arbitration": "the-last-mile-accord",
  "operation-containment": "nightfall-command",
};

export function HashAliases() {
  useEffect(() => {
    const raw = window.location.hash.replace("#", "");
    const next = ALIASES[raw];
    if (!next) return;
    const target = document.getElementById(next);
    if (target) target.scrollIntoView({ block: "start" });
  }, []);
  return null;
}
