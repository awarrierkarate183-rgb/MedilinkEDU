import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/portal/LoginForm";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Portal login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const configured = isSupabaseConfigured();
  const { role } = await searchParams;
  const portal = role === "advisor" ? "advisor" : role === "student" ? "student" : "";
  const title =
    portal === "advisor" ? "Advisor portal" : portal === "student" ? "Student portal" : "Portal login";
  const body =
    portal === "advisor"
      ? "Chapter advisor accounts only open the advisor portal."
      : portal === "student"
        ? "Student accounts only open the student portal."
        : "Use the login that matches your account. Student and advisor portals stay separate.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-[var(--radius)] border border-border bg-white p-8 shadow-[var(--shadow)]">
        <p className="text-2xl font-bold">
          Medi<span className="text-gold">Link</span>
        </p>
        <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted">{body}</p>
        <Suspense>
          <LoginForm configured={configured} portal={portal} />
        </Suspense>
        <p className="mt-6 flex justify-between text-sm">
          <a href="/portal" className="font-semibold">
            Choose a different portal
          </a>
          <a href="/">Back to website</a>
        </p>
      </div>
    </div>
  );
}
