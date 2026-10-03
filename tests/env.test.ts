import { afterEach, describe, expect, it } from "vitest";
import {
  hasServerSecret,
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseSecretKey,
  supabaseUrl,
} from "../lib/env";

function jwtWithRef(ref: string) {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ ref, role: "anon" })).toString("base64url");
  return `${header}.${payload}.x`;
}

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

  it("corrects a mistyped project URL using the anon JWT ref", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dtfjanrfihwpxgarlmdq.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = jwtWithRef("dtfjarvfihwpxgarlmdq");
    expect(supabaseUrl()).toBe("https://dtfjarvfihwpxgarlmdq.supabase.co");
  });
});
