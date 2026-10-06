"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { publicNav } from "@/lib/content/public-nav";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [openTab, setOpenTab] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenTab(null);
    setMobileTab(null);
  }, [pathname]);

  const activeTab = publicNav.find((tab) => openTab === tab.href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        solid || mobileOpen || openTab ? "bg-navy shadow-lg" : "bg-navy/90 backdrop-blur-sm",
      )}
      onMouseLeave={() => setOpenTab(null)}
    >
      <div className="container-ml flex h-[var(--header-h)] items-center justify-between gap-4">
        <Wordmark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {publicNav.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            const isOpen = openTab === tab.href;
            return (
              <div
                key={tab.href}
                className="relative flex items-center"
                onMouseEnter={() => setOpenTab(tab.href)}
              >
                <Link
                  href={tab.href as never}
                  className={cn(
                    "public-nav inline-flex items-center border-b-2 px-3 py-2 text-lg transition-colors",
                    active || isOpen ? "border-gold text-gold" : "border-transparent text-white/85 hover:text-white",
                  )}
                >
                  {tab.label}
                </Link>
                <button
                  type="button"
                  className={cn("pb-0.5 text-xs", active || isOpen ? "text-gold" : "text-white/70")}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-label={`${tab.label} menu`}
                  onClick={() => setOpenTab(isOpen ? null : tab.href)}
                >
                  ▾
                </button>
              </div>
            );
          })}
          <Link
            href="/start-a-chapter"
            className="ml-3 rounded-md border border-white/35 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
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
          <Link href="/portal" className="rounded-md bg-gold px-3.5 py-2.5 text-sm font-semibold text-navy">
            Portal
          </Link>
          <button
            type="button"
            className="rounded-md border border-white/20 px-3.5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {activeTab ? (
        <div className="hidden border-t border-white/10 bg-navy-deep lg:block">
          <div className="container-ml grid gap-8 py-8 lg:grid-cols-[0.9fr_1.4fr]">
            <div>
              <p className="kicker">{activeTab.kicker}</p>
              <p className="tab-heading text-3xl text-white">{activeTab.label}</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/70">{activeTab.blurb}</p>
              <Link href={activeTab.href as never} className="mt-5 inline-block text-sm font-semibold text-gold">
                Open the {activeTab.label} overview
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeTab.items.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href as never}
                  className="rounded-xl border border-white/10 bg-navy/40 p-4 transition hover:border-gold/60 hover:bg-navy"
                >
                  <p className="kicker text-gold">0{index + 1}</p>
                  <p className="tab-heading text-lg text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-white/65">{item.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <nav id="mobile-nav" className="border-t border-white/10 bg-navy px-4 pb-5 lg:hidden" aria-label="Mobile">
          {publicNav.map((tab) => (
            <div key={tab.href} className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <Link href={tab.href as never} className="public-nav py-3.5 text-lg text-white">
                  {tab.label}
                </Link>
                <button
                  type="button"
                  className="px-2 text-sm font-semibold text-gold"
                  onClick={() => setMobileTab((value) => (value === tab.href ? null : tab.href))}
                >
                  {mobileTab === tab.href ? "Close" : "Open"}
                </button>
              </div>
              {mobileTab === tab.href ? (
                <div className="space-y-2 pb-4">
                  {tab.items.map((item) => (
                    <Link key={item.href} href={item.href as never} className="block pl-3 text-sm text-white/75">
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <Link href="/start-a-chapter" className="block py-3.5 text-base font-semibold text-gold">
            Start a Chapter
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
