import { NextResponse } from "next/server";

export type ApiError = {
  code: string;
  message: string;
};

export type ApiBody<T> = {
  data: T | null;
  error: ApiError | null;
};

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null } satisfies ApiBody<T>, { status });
}

export function apiError(code: string, message: string, status: number) {
  return NextResponse.json(
    { data: null, error: { code, message } } satisfies ApiBody<null>,
    { status },
  );
}

export const errors = {
  notConfigured: () =>
    apiError("NOT_CONFIGURED", "The portal is not connected to account data yet.", 503),
  unauthenticated: () => apiError("UNAUTHENTICATED", "Sign in to continue.", 401),
  forbidden: () => apiError("FORBIDDEN", "You are not allowed to do that.", 403),
  notFound: (message = "That record was not found.") => apiError("NOT_FOUND", message, 404),
  conflict: (message: string) => apiError("CONFLICT", message, 409),
  validation: (message: string) => apiError("VALIDATION_ERROR", message, 400),
  internal: () =>
    apiError("INTERNAL", "MediLink is having trouble connecting to your account data. Please try again.", 500),
};
