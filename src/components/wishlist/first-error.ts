type ApiError = { error?: string; fieldErrors?: Record<string, string[] | undefined> };

/** Picks the most specific message from an API error response. */
export function firstError(data: ApiError): string {
  const field = data.fieldErrors ? Object.values(data.fieldErrors).flat()[0] : undefined;
  return field ?? data.error ?? "Something went wrong.";
}