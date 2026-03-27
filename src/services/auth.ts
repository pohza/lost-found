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

export const register = async (email: string, password: string) => {
  const data = await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // ✅ SAVE SESSION
  localStorage.setItem("token", data.token);

  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};