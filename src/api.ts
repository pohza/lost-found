/**
 * Returns headers with Authorization Bearer token when user is logged in.
 * Use for all API calls that require authentication.
 */
export function authHeaders(extra: HeadersInit = {}): HeadersInit {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
