const API_URL = import.meta.env.VITE_API_URL;

export const api = async (
  path: string,
  options: RequestInit = {}
) => {
  // 🔐 Get token from localStorage
  const token = localStorage.getItem("token");

  // 🌐 Make request
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      // ✅ Add Authorization header ONLY if token exists
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      // keep any headers passed in options
      ...(options.headers || {}),
    },
  });

  // ❌ Handle errors
  if (!res.ok) {
    let errorMessage = "API error";
    try {
      const err = await res.json();
      errorMessage = err.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  // ✅ Return JSON response
  return res.json();
};