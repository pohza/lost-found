import { api } from "../lib/api";

export const claimItem = (itemId: number, message: string) =>
  api(`/items/${itemId}/claim`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });

export const getClaims = (status?: string) =>
  api(`/claims${status ? `?status=${status}` : ""}`);