"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PUBLIC_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Wordmark() {
  return (
    <Link href="/" className="font-bold tracking-tight" aria-label="MediLink home">
      <span className="text-2xl md:text-[1.7rem]">
        <span className="text-white">Medi</span>
        <span className="text-gold">Link</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        solid || open ? "bg-navy shadow-lg" : "bg-navy/90 backdrop-blur-sm",
      )}
    >
      <div className="container-ml flex h-[var(--header-h)] items-center justify-between gap-4">
        <Wordmark />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {PUBLIC_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href as never}
                className={cn(
                  "public-nav text-lg transition-colors",
                  active ? "text-gold" : "text-white/85 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/start-a-chapter"
            className="rounded-md border border-white/35 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Start a Chapter
          </Link>
          <Link
            href="/portal"
            className="rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-navy hover:bg-gold-hover"
          >
            Portal Login
          </Link>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/portal"
            className="rounded-md bg-gold px-3.5 py-2.5 text-sm font-semibold text-navy"
          >
            Portal
          </Link>
          <button
            type="button"
            className="rounded-md border border-white/20 px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-white/10 bg-navy px-4 pb-5 lg:hidden"
          aria-label="Mobile"
        >
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="public-nav block border-b border-white/10 py-3.5 text-lg text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/start-a-chapter"
            className="block border-b border-white/10 py-3.5 text-base font-semibold text-gold"
          >
            Start a Chapter
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
