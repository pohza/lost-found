import { api } from "../lib/api";

export const getNotifications = () =>
  api("/notifications");

export const approveClaim = (id: number) =>
  api(`/notifications/${id}/approve`, { method: "POST" });

export const cancelClaim = (id: number) =>
  api(`/notifications/${id}/cancel`, { method: "POST" });