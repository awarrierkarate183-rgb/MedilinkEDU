import { z } from "zod";
import { errors } from "@/lib/api/respond";

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function parsed<T>(schema: z.ZodType<T>, payload: unknown) {
  const result = schema.safeParse(payload ?? {});
  if (!result.success) {
    const message = result.error.issues[0]?.message || "That request is not valid.";
    return { error: errors.validation(message) as ReturnType<typeof errors.validation>, data: null };
  }
  return { error: null, data: result.data };
}
