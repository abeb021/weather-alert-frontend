import createClient, { type Client } from "openapi-fetch";
import type { paths } from "./api/schema";

// ── Token storage ─────────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── API client factory ────────────────────────────────────────────────────────

let _client: Client<paths> | null = null;

export function getClient(): Client<paths> {
  if (_client) return _client;

  _client = createClient<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost",
  });

  _client.use({
    onRequest({ request }) {
      const token = getAccessToken();
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
      return request;
    },
  });

  return _client;
}

// ── Auth-aware fetch with auto-refresh ────────────────────────────────────────

export async function authFetch<T>(fn: (client: Client<paths>) => Promise<T>): Promise<T> {
  const client = getClient();

  try {
    const result = await fn(client);
    return result;
  } catch (err: unknown) {
    const isUnauthorized =
      err instanceof Response
        ? err.status === 401
        : typeof err === "object" && err !== null && "status" in err && (err as { status: unknown }).status === 401;

    if (!isUnauthorized) throw err;
  }

  // Attempt token refresh
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("session_expired");
  }

  const { data, error } = await getClient().POST("/api/auth/refresh", {
    body: { refresh_token: refreshToken },
  });

  if (error || !data?.access_token || !data?.refresh_token) {
    clearTokens();
    throw new Error("session_expired");
  }

  setTokens(data.access_token, data.refresh_token);
  return fn(getClient());
}

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<void> {
  const { data, error } = await getClient().POST("/api/auth/login", {
    body: { email, password },
  });

  if (error) {
    const detail = (error as { detail?: string }).detail;
    throw new Error(detail ?? "Login failed");
  }

  if (data?.access_token && data?.refresh_token) {
    setTokens(data.access_token, data.refresh_token);
  }
}

export async function register(email: string, password: string): Promise<void> {
  const { data, error } = await getClient().POST("/api/auth/register", {
    body: { email, password },
  });

  if (error) {
    const detail = (error as { detail?: string }).detail;
    throw new Error(detail ?? "Registration failed");
  }

  if (data?.access_token && data?.refresh_token) {
    setTokens(data.access_token, data.refresh_token);
  }
}

export function logout(): void {
  clearTokens();
}
