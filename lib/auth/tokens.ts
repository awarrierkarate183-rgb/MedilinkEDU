import { createHash, randomBytes } from "crypto";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createInviteToken() {
  return randomBytes(24).toString("base64url");
}

export function invitationIsUsable(invite: {
  revoked_at?: string | null;
  used_at?: string | null;
  expires_at: string;
  max_uses?: number | null;
  use_count?: number | null;
}) {
  if (invite.revoked_at) return { ok: false as const, reason: "revoked" };
  const maxUses = invite.max_uses ?? 1;
  const useCount = invite.use_count ?? 0;
  if (invite.used_at || useCount >= maxUses) return { ok: false as const, reason: "used" };
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return { ok: false as const, reason: "expired" };
  }
  return { ok: true as const };
}
