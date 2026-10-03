import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = resolve(process.cwd(), ".env.local");
const envText = readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const secret = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or secret key in .env.local");
  process.exit(1);
}

const userId = "c517a28e-4747-46e8-8bf3-18709f845849";
let password = process.argv[2] || "";
if (!password) {
  const rl = createInterface({ input, output });
  password = await rl.question("New portal password (will not be saved to git): ");
  rl.close();
}

if (!password || password.length < 8) {
  console.error("Use a password with at least 8 characters on the same line as the command.");
  console.error('Example: node scripts/set-admin-password.mjs "YourPasswordHere"');
  process.exit(1);
}

try {
  const health = await fetch(`${url}/auth/v1/health`);
  if (!health.ok) {
    console.error(`Supabase responded ${health.status}. Check that the project is not paused.`);
    process.exit(1);
  }
} catch (error) {
  console.error("This computer could not reach Supabase.");
  console.error("Open this URL in your browser and confirm the project is running:");
  console.error(url);
  console.error(error.cause?.message || error.message);
  process.exit(1);
}

const admin = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await admin.auth.admin.updateUserById(userId, {
  password,
  email_confirm: true,
});

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log("Password updated. Sign in at https://medilink-edu.vercel.app/portal/login");
