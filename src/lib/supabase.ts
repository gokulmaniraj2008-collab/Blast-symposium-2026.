// Minimal server-only Supabase REST (PostgREST) client.
// Uses plain fetch so no extra dependency is required.
// Only import this from files inside src/app/api/** (server code) —
// SUPABASE_SERVICE_ROLE_KEY must never reach the browser.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseConfigured() {
  return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
}

// TEMPORARY DIAGNOSTIC — remove once the env var issue is confirmed fixed.
// Reveals *which* variable is missing without ever exposing their values.
export function supabaseDiagnostic() {
  return {
    SUPABASE_URL: SUPABASE_URL ? `present (${SUPABASE_URL.length} chars)` : "MISSING",
    SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY ? `present (${SERVICE_ROLE_KEY.length} chars)` : "MISSING",
  };
}

export async function supabaseFetch(path: string, init: RequestInit = {}) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment."
    );
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
  });

  return res;
}

export class SupabaseError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function supabaseJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await supabaseFetch(path, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Supabase request failed (${res.status})`;
    throw new SupabaseError(message, res.status);
  }
  return data as T;
}
