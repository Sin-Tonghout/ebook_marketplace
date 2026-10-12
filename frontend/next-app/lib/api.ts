const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
  }
}

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; message?: string; code?: string };

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
}

// credentials: "include" makes the browser send the httpOnly session cookie.
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const hasBody = options.body !== undefined;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: options.method ?? "GET",
      credentials: "include",
      headers: hasBody ? { "Content-Type": "application/json" } : undefined,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(
      "NETWORK_ERROR",
      "Can't reach the server. Check your connection and try again.",
      0
    );
  }

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    /* response was not JSON */
  }

  if (!res.ok || !json || !json.success) {
    const err = json && !json.success ? json : null;
    throw new ApiError(
      err?.code ?? "UNKNOWN",
      err?.message ?? "Something went wrong. Please try again.",
      res.status
    );
  }

  return json.data;
}