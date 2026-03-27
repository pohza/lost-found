import { api } from "../lib/api";

export const getThreads = () =>
  api("/me/messages");

export const getMessages = (threadId: number) =>
  api(`/me/messages/${threadId}`);

export const sendMessage = (threadId: number, text: string) =>
  api(`/me/messages/${threadId}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });