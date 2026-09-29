import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/portal/LoginForm";
import { isSupabaseConfigured } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portal login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const configured = isSupabaseConfigured();
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-[var(--radius)] border border-border bg-white p-8 shadow-[var(--shadow)]">
        <p className="text-2xl font-bold">
          Medi<span className="text-gold">Link</span>
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Portal login</h1>
        <p className="mt-2 text-sm text-muted">
          Advisors and students use the same sign-in. Your role decides which
          dashboard opens.
        </p>
        <Suspense>
          <LoginForm configured={configured} />
        </Suspense>
        <p className="mt-6 text-sm">
          <a href="/" className="font-semibold">
            Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
