"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { requestResetAction } from "@/lib/auth/actions";
import { homeForRole } from "@/lib/auth/roles";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

export function LoginForm({ configured }: { configured: boolean }) {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [resetOk, setResetOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onLogin(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      if (!email || !password) {
        setError("Enter your email and password.");
        return;
      }
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setError("The portal is not connected yet.");
        return;
      }
      const { data, error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError || !data.user) {
        setError(signError?.message || "Sign-in failed.");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      window.location.assign(homeForRole(profile?.role));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onReset(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await requestResetAction(formData);
    if (result?.error) setError(result.error);
    if (result && "ok" in result) setResetOk(true);
    setLoading(false);
  }

  return (
    <form action={onLogin} className="mt-8 space-y-4">
      {params.get("setup") === "1" || !configured ? (
        <Alert title="Portal database is not connected" tone="warning">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          (or NEXT_PUBLIC_SUPABASE_ANON_KEY) to .env.local, run the SQL in
          supabase/migrations, and restart the app.
          Login will not work until that is done. This is not a fake sign-in.
        </Alert>
      ) : null}
      {error ? (
        <Alert title="Could not sign in" tone="danger">
          {error}
        </Alert>
      ) : null}
      {resetOk ? (
        <Alert title="Check your email" tone="navy">
          If that address is on a MediLink account, a reset link is on the way.
        </Alert>
      ) : null}
      <label className="block text-sm font-semibold">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal"
        />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2 font-normal"
        />
      </label>
      <p className="text-sm text-muted">
        Use the full email address, including @gmail.com.
      </p>
      <Button type="submit" loading={loading} disabled={!configured} className="w-full">
        Sign in
      </Button>
      <div className="flex justify-between text-sm">
        <button
          type="submit"
          formAction={onReset}
          className="font-semibold text-navy"
          disabled={!configured}
        >
          Forgot password?
        </button>
        <a href="mailto:medi.link.edu@gmail.com?subject=Portal%20help">Need help?</a>
      </div>
    </form>
  );
}
