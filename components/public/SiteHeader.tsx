"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/public/BrandMark";
import { NavIcon } from "@/components/public/NavIcon";
import { navGroups, publicNav } from "@/lib/content/public-nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openTab, setOpenTab] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenTab(null);
    setMobileTab(null);
  }, [pathname]);

  const activeTab = publicNav.find((tab) => openTab === tab.href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-beige",
        openTab || mobileOpen ? "border-border shadow-sm" : "border-transparent shadow-sm",
      )}
      onMouseLeave={() => setOpenTab(null)}
    >
      <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[1680px] items-center px-6 lg:px-12">
        <div className="shrink-0">
          <BrandMark />
        </div>
        <nav className="ml-8 hidden h-full items-stretch gap-6 lg:flex" aria-label="Primary">
          {publicNav.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            const isOpen = openTab === tab.href;
            return (
              <div
                key={tab.href}
                className="relative flex items-stretch"
                onMouseEnter={() => setOpenTab(tab.href)}
              >
                <Link
                  href={tab.href as never}
                  className={cn(
                    "inline-flex items-center gap-1.5 border-b-2 text-[0.95rem] font-semibold leading-none transition-colors",
                    active || isOpen ? "border-gold text-navy" : "border-transparent text-navy/75 hover:text-navy",
                  )}
                >
                  {tab.label}
                  <span aria-hidden="true" className="text-[0.6rem] text-gold">
                    {isOpen ? "▴" : "▾"}
                  </span>
                </Link>
                <button
                  type="button"
                  className="sr-only"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-label={`${tab.label} menu`}
                  onClick={() => setOpenTab(isOpen ? null : tab.href)}
                >
                  Open {tab.label} menu
                </button>
              </div>
            );
          })}
        </nav>
        <div className="ml-auto hidden items-center gap-6 lg:flex">
          <Link href="/start-a-chapter" className="text-sm font-semibold text-navy hover:text-gold">
            Start a Chapter
          </Link>
          <Link href="/portal" className="text-sm font-semibold text-navy hover:text-gold">
            Portal Login
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <Link href="/portal" className="text-sm font-semibold text-navy">
            Portal
          </Link>
          <button
            type="button"
            className="text-sm font-semibold text-navy"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {activeTab ? (
        <div className="hidden border-t border-border bg-cream lg:block">
          <div className="mx-auto grid w-full max-w-[1680px] gap-12 px-6 py-10 lg:grid-cols-[1.4fr_0.7fr] lg:px-12">
            <div className="space-y-8">
              {navGroups(activeTab).map((group) => (
                <div key={group.heading}>
                  <p className="text-sm font-semibold text-navy">{group.heading}</p>
                  <div className="mt-5 grid grid-cols-3 gap-x-8 gap-y-5">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href as never}
                        className="flex items-center gap-3 text-sm text-navy/80 transition-colors hover:text-navy"
                      >
                        <NavIcon name={item.icon} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <aside className="border-l border-border pl-10">
              <p className="text-sm font-semibold text-navy">Resources</p>
              <div className="mt-5 space-y-4">
                {activeTab.resources.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href as never}
                    className="flex items-center gap-3 border-b border-border pb-4 text-sm text-navy/80 transition-colors hover:text-navy"
                  >
                    <NavIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <nav id="mobile-nav" className="border-t border-border bg-cream px-4 pb-5 lg:hidden" aria-label="Mobile">
          {publicNav.map((tab) => (
            <div key={tab.href} className="border-b border-border">
              <div className="flex items-center justify-between">
                <Link href={tab.href as never} className="py-3.5 text-base font-semibold text-navy">
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
                    <Link key={item.href} href={item.href as never} className="block pl-3 text-sm text-navy/70">
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
