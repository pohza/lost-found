import { api } from "../lib/api";

export const login = async (email: string, password: string) => {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // ✅ SAVE SESSION
  localStorage.setItem("token", data.token);

  return data;
};

export const register = async (email: string, password: string, fullName?: string) => {
  const data = await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, fullName }),
  });

  // ✅ SAVE SESSION
  localStorage.setItem("token", data.token);

  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const forgotPassword = async (email: string) => {
  return api("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (token: string, password: string) => {
  return api("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
};