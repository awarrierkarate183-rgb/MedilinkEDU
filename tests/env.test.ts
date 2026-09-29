import { afterEach, describe, expect, it } from "vitest";
import { hasServerSecret, isSupabaseConfigured, supabasePublishableKey, supabaseSecretKey } from "../lib/env";

const keys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

describe("environment aliases", () => {
  afterEach(() => {
    for (const key of keys) delete process.env[key];
  });

  it("accepts publishable or anon keys for the browser client", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pub";
    expect(isSupabaseConfigured()).toBe(true);
    expect(supabasePublishableKey()).toBe("pub");
  });

  it("keeps the secret key server-only", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    process.env.SUPABASE_SECRET_KEY = "secret";
    expect(hasServerSecret()).toBe(true);
    expect(supabaseSecretKey()).toBe("secret");
    expect(process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY).toBeUndefined();
  });
});
