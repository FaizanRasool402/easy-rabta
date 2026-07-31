import type { AppAuthUser } from "@/lib/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const AUTH_CACHE_TTL_MS = 8_000;
const PROPERTY_UPLOAD_TIMEOUT_MS = 5 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 45_000;

type AuthCache = {
  user: AppAuthUser | null;
  at: number;
};

let authCache: AuthCache | null = null;
let authInFlight: Promise<AppAuthUser | null> | null = null;

export function clearAuthCache() {
  authCache = null;
  authInFlight = null;
}

export function networkErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const lower = raw.toLowerCase();

  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("load failed") ||
    lower.includes("aborted") ||
    lower.includes("timeout") ||
    lower.includes("timed out")
  ) {
    return "Connection failed. Check your internet and try again. Tip: use fewer or smaller photos/videos on slow networks.";
  }

  return raw || "Something went wrong. Please try again.";
}

function mergeSignals(timeoutMs: number, external?: AbortSignal) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  external?.addEventListener("abort", onExternalAbort);

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timer);
      external?.removeEventListener("abort", onExternalAbort);
    },
  };
}

export async function apiFetch(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {}
) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal, ...rest } = init;
  const { signal: mergedSignal, cleanup } = mergeSignals(timeoutMs, signal ?? undefined);

  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      signal: mergedSignal,
    });
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError" &&
      !signal?.aborted
    ) {
      throw new Error("Request timed out. Please try again on a more stable connection.");
    }
    throw error;
  } finally {
    cleanup();
  }
}

/** One retry on pure network failures (not HTTP 4xx/5xx responses). */
export async function apiFetchWithRetry(
  path: string,
  init: RequestInit & { timeoutMs?: number; retries?: number } = {}
) {
  const retries = init.retries ?? 1;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await apiFetch(path, init);
    } catch (error) {
      lastError = error;
      if (attempt >= retries) break;
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
    }
  }

  throw lastError;
}

export async function propertyUploadFetch(
  path: string,
  body: FormData,
  method: "POST" | "PUT" = "POST"
) {
  return apiFetchWithRetry(path, {
    method,
    credentials: "include",
    body,
    timeoutMs: PROPERTY_UPLOAD_TIMEOUT_MS,
    retries: 1,
  });
}

export async function fetchCurrentUser(
  options: { signal?: AbortSignal; force?: boolean } = {}
): Promise<AppAuthUser | null> {
  const { signal, force = false } = options;

  if (
    !force &&
    authCache &&
    Date.now() - authCache.at < AUTH_CACHE_TTL_MS
  ) {
    return authCache.user;
  }

  if (!force && authInFlight) {
    return authInFlight;
  }

  authInFlight = (async () => {
    try {
      const response = await apiFetch("/api/auth/me", {
        credentials: "include",
        signal,
        timeoutMs: 20_000,
      });

      if (!response.ok) {
        authCache = { user: null, at: Date.now() };
        return null;
      }

      const data = (await response.json()) as { user?: AppAuthUser };
      const user = data.user ?? null;
      authCache = { user, at: Date.now() };
      return user;
    } catch (error) {
      if (signal?.aborted) throw error;
      authCache = { user: null, at: Date.now() };
      return null;
    } finally {
      authInFlight = null;
    }
  })();

  return authInFlight;
}
