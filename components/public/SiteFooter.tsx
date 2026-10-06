import Link from "next/link";
import { CONTACT_EMAIL, MISSION } from "@/lib/constants";
import { publicNav } from "@/lib/content/public-nav";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-ml grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-2xl font-bold tracking-tight">
            <span>Medi</span>
            <span className="text-gold">Link</span>
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">{MISSION}</p>
        </div>
        <div>
          <p className="kicker">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link className="text-white/80 hover:text-white" href={item.href as never}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker">For chapters</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/start-a-chapter">Start a chapter</Link>
            </li>
            <li>
              <Link href="/chapter-support">Chapter resources</Link>
            </li>
            <li>
              <Link href="/portal">Portal login</Link>
            </li>
            <li>
              <Link href="/get-involved">Get involved</Link>
            </li>
            <li>
              <Link href="/news">News</Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-ml flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/55">
          <p>High school only. Student-founded. Based in Charlotte, North Carolina.</p>
          <p className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/contact">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
