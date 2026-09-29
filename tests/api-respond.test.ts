import { describe, expect, it } from "vitest";
import { apiError, apiSuccess } from "../lib/api/respond";

describe("api envelope", () => {
  it("returns data with a null error on success", async () => {
    const response = apiSuccess({ ok: true });
    const body = await response.json();
    expect(body).toEqual({ data: { ok: true }, error: null });
  });

  it("returns a code and message without a stack", async () => {
    const response = apiError("FORBIDDEN", "You are not allowed to do that.", 403);
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error.code).toBe("FORBIDDEN");
    expect(JSON.stringify(body)).not.toMatch(/stack/i);
  });
});
