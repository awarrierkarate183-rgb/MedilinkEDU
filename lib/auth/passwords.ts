import { randomBytes, randomInt } from "crypto";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function generatePortalPassword(length = 14) {
  const chars = Array.from({ length }, () => alphabet[randomInt(alphabet.length)]);
  chars[randomInt(length)] = "23456789"[randomInt(8)];
  chars[randomInt(length)] = "ABCDEFGHJKLMNPQRSTUVWXYZ"[randomInt(24)];
  return chars.join("");
}

export function generatePublicCode(prefix: string) {
  return `${prefix}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function slugFromName(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "chapter";
}
