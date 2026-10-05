"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/States";

const field = "mt-1 w-full rounded-md border border-border px-3 py-2 font-normal";

export function AiSettingsForm({ connected }: { connected?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groqKey: String(data.get("groqKey") || "") }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error.message);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("The AI desk key could not be saved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] bg-white p-5">
      <h2 className="font-semibold">Administration desk AI</h2>
      <p className="mt-2 text-sm text-muted">
        Optional. The Guides page can already publish the handbook and attach
        files. A Groq key lets you type a request such as publish missing
        rubrics and have the desk do it.
      </p>
      {connected ? (
        <div className="mt-3">
          <Alert title="Connected" tone="navy">
            An AI key is saved. It is not shown here again.
          </Alert>
        </div>
      ) : null}
      {error ? (
        <div className="mt-3">
          <Alert title="Not saved" tone="danger">
            {error}
          </Alert>
        </div>
      ) : null}
      {saved ? (
        <div className="mt-3">
          <Alert title="Saved" tone="navy">
            The administration desk can use this key.
          </Alert>
        </div>
      ) : null}
      <label className="mt-4 block text-sm font-semibold">
        Groq API key
        <input name="groqKey" type="password" required className={field} autoComplete="off" />
      </label>
      <div className="mt-4">
        <Button type="submit" size="sm" loading={loading}>
          Save AI key
        </Button>
      </div>
    </form>
  );
}
