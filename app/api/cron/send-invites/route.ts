import { apiSuccess, errors } from "@/lib/api/respond";
import { flushInviteOutbox } from "@/lib/email/deliver";

export async function GET(request: Request) {
  const cron = request.headers.get("x-vercel-cron") === "1";
  const secret = process.env.CRON_SECRET?.trim();
  const authorized =
    cron ||
    (secret && request.headers.get("authorization") === `Bearer ${secret}`) ||
    process.env.NODE_ENV !== "production";
  if (!authorized) return errors.forbidden();
  const result = await flushInviteOutbox();
  return apiSuccess(result);
}
