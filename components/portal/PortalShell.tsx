"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/public/BrandMark";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };

export function PortalShell({
  title,
  subtitle,
  nav,
  mobileNav,
  children,
}: {
  title: string;
  subtitle?: string;
  nav: Item[];
  mobileNav: Item[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-surface text-navy">
      <div className="mx-auto grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="hidden bg-navy text-white lg:flex lg:flex-col">
          <div className="px-5 py-6">
            <BrandMark href="/portal" light size="sm" />
            <p className="mt-1 text-xs text-white/60">Portal</p>
          </div>
          <nav className="flex-1 space-y-1 px-3" aria-label="Portal">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href as never}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium [font-synthesis:none]",
                    active ? "bg-gold text-navy" : "text-white/80 hover:bg-white/10",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action={signOutAction} className="p-4">
            <button className="text-sm font-semibold text-white/70 hover:text-white" type="submit">
              Log out
            </button>
          </form>
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between border-b border-border bg-white px-4 py-4 lg:px-8">
            <div>
              <h1 className="text-xl font-medium [font-synthesis:none]">{title}</h1>
              {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
            </div>
            <Link href="/" className="text-sm font-semibold text-navy">
              Public site
            </Link>
          </header>
          <div className="flex-1 px-4 py-6 lg:px-8">{children}</div>
          <nav
            className="sticky bottom-0 grid grid-cols-5 border-t border-border bg-white lg:hidden"
            aria-label="Mobile portal"
          >
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href as never}
                className={cn(
                  "px-1 py-3 text-center text-[11px] font-semibold",
                  pathname === item.href ? "text-navy" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
