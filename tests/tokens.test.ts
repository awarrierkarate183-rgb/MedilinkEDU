import { describe, expect, it } from "vitest";
import { createInviteToken, hashToken, invitationIsUsable } from "../lib/auth/tokens";

describe("invitation tokens", () => {
  it("hashes tokens instead of storing plaintext", () => {
    const token = createInviteToken();
    expect(token.length).toBeGreaterThan(16);
    expect(hashToken(token)).not.toBe(token);
    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken("other")).not.toBe(hashToken(token));
  });

  it("rejects revoked, used, and expired invitations", () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    expect(invitationIsUsable({ expires_at: future }).ok).toBe(true);
    expect(invitationIsUsable({ expires_at: future, revoked_at: future }).reason).toBe("revoked");
    expect(invitationIsUsable({ expires_at: future, used_at: future }).reason).toBe("used");
    expect(invitationIsUsable({ expires_at: new Date(Date.now() - 1000).toISOString() }).reason).toBe("expired");
  });
});
