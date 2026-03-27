import { api } from "../lib/api";

export const getMe = () => api("/me");

export const updateMe = (data: any) =>
  api("/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getMyItems = () =>
  api("/me/items");